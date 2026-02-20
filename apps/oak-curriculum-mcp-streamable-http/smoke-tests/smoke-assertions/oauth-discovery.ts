import assert from 'node:assert/strict';

import { fetchJson, ensureRecord, ensureString, ensureArray } from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

/**
 * Validated discovery chain result for downstream consumption (e.g. token
 * acquisition or Inspector CLI assertions).
 */
export interface DiscoveryChainResult {
  readonly prmUrl: string;
  readonly authorizationServer: string;
  readonly authorizationEndpoint: string;
  readonly tokenEndpoint: string;
  readonly registrationEndpoint: string;
}

/**
 * Validates the FULL MCP spec-compliant OAuth discovery chain (RFC 9728 +
 * MCP Authorization spec 2025-11-25).
 *
 * A standards-compliant MCP client MUST be able to:
 * 1. POST /mcp → receive 401 + WWW-Authenticate with resource_metadata URL
 * 2. GET resource_metadata → receive PRM with authorization_servers[]
 * 3. Fetch AS metadata directly from the authorization server
 *
 * This assertion walks the entire chain and validates every link.
 */
export async function assertOAuthDiscoveryChain(
  context: SmokeContext,
): Promise<DiscoveryChainResult> {
  const logger = createAssertionLogger(context, 'oauth-discovery');

  const prmUrl = await assertUnauthenticatedReturns401(context, logger);
  const firstServer = await assertPrmReturnsAuthServers(prmUrl, logger);
  const asMetadata = await assertAsMetadataFromAuthServer(firstServer, logger);

  logAssertionSuccess(logger, 'Full spec-compliant OAuth discovery chain validated');

  return { prmUrl, authorizationServer: firstServer, ...asMetadata };
}

async function assertUnauthenticatedReturns401(
  context: SmokeContext,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<string> {
  logger.debug('Step 1: Sending unauthenticated POST /mcp');
  const mcpResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: REQUIRED_ACCEPT,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'discovery-1', method: 'tools/list' }),
  });

  assert.equal(mcpResponse.res.status, 401, 'POST /mcp without auth must return 401');

  const wwwAuthenticate = mcpResponse.res.headers.get('www-authenticate');
  assert.ok(wwwAuthenticate, 'Response must include WWW-Authenticate header');
  assert.match(wwwAuthenticate, /^Bearer\s+/, 'WWW-Authenticate must start with "Bearer "');

  const prmUrl = extractResourceMetadataUrl(wwwAuthenticate);
  assert.ok(prmUrl, 'WWW-Authenticate must include resource_metadata parameter');
  logAssertionSuccess(logger, 'Step 1: 401 + resource_metadata URL extracted', { prmUrl });
  return prmUrl;
}

async function assertPrmReturnsAuthServers(
  prmUrl: string,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<string> {
  logger.debug('Step 2: Fetching Protected Resource Metadata', { prmUrl });
  const prmResponse = await fetchJson(new URL(prmUrl), { method: 'GET' });
  assert.equal(
    prmResponse.res.status,
    200,
    `PRM endpoint must return 200 (got ${String(prmResponse.res.status)})`,
  );

  const prmParsed: unknown = JSON.parse(prmResponse.text);
  const prm = ensureRecord(prmParsed, 'PRM response');
  const resource = ensureString(prm.resource, 'PRM resource');
  assert.ok(resource.length > 0, 'PRM resource must be a non-empty URL');

  const authServers = ensureArray(prm.authorization_servers, 'PRM authorization_servers');
  assert.ok(authServers.length > 0, 'PRM must list at least one authorization server');

  const firstServer = ensureString(authServers[0], 'PRM authorization_servers[0]');
  assert.match(firstServer, /^https:\/\//, 'Authorization server must be an HTTPS URL');
  logAssertionSuccess(logger, 'Step 2: PRM valid with authorization_servers', {
    resource,
    authorizationServer: firstServer,
  });
  return firstServer;
}

async function assertAsMetadataFromAuthServer(
  authorizationServer: string,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<AsMetadataFields> {
  logger.debug('Step 3: Fetching AS metadata from authorization server', {
    url: authorizationServer,
  });
  const asMetadata = await fetchAndValidateAsMetadata(authorizationServer, logger);
  logAssertionSuccess(logger, 'Step 3: AS metadata valid from Clerk', {
    authorizationEndpoint: asMetadata.authorizationEndpoint,
    tokenEndpoint: asMetadata.tokenEndpoint,
  });
  return asMetadata;
}

/**
 * Extracts the resource_metadata URL from a WWW-Authenticate header value.
 *
 * Per MCP spec: `Bearer resource_metadata="<url>"`
 */
function extractResourceMetadataUrl(header: string): string | undefined {
  const match = /resource_metadata="([^"]+)"/.exec(header);
  if (match?.[1]) {
    return match[1];
  }
  const unquotedMatch = /resource_metadata=(\S+)/.exec(header);
  return unquotedMatch?.[1];
}

interface AsMetadataFields {
  readonly authorizationEndpoint: string;
  readonly tokenEndpoint: string;
  readonly registrationEndpoint: string;
}

/**
 * Fetches and validates Authorization Server metadata.
 *
 * Tries `/.well-known/openid-configuration` first (standard OIDC discovery),
 * then `/.well-known/oauth-authorization-server` as fallback.
 */
async function fetchAndValidateAsMetadata(
  authorizationServer: string,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<AsMetadataFields> {
  const oidcUrl = `${authorizationServer}/.well-known/openid-configuration`;
  logger.debug('Trying OIDC discovery endpoint', { url: oidcUrl });
  const oidcResponse = await fetchJson(new URL(oidcUrl), {
    method: 'GET',
    signal: AbortSignal.timeout(10_000),
  });

  if (oidcResponse.res.status === 200) {
    return validateAsMetadataResponse(oidcResponse.text, 'OIDC discovery');
  }

  const oauthUrl = `${authorizationServer}/.well-known/oauth-authorization-server`;
  logger.debug('OIDC discovery not available, trying RFC 8414', { url: oauthUrl });
  const oauthResponse = await fetchJson(new URL(oauthUrl), {
    method: 'GET',
    signal: AbortSignal.timeout(10_000),
  });

  assert.equal(
    oauthResponse.res.status,
    200,
    `AS metadata must be available at either OIDC or RFC 8414 endpoint (OIDC=${String(oidcResponse.res.status)}, RFC8414=${String(oauthResponse.res.status)})`,
  );

  return validateAsMetadataResponse(oauthResponse.text, 'RFC 8414');
}

function validateAsMetadataResponse(body: string, source: string): AsMetadataFields {
  const parsed: unknown = JSON.parse(body);
  const metadata = ensureRecord(parsed, `${source} AS metadata`);
  const authorizationEndpoint = ensureString(
    metadata.authorization_endpoint,
    `${source} authorization_endpoint`,
  );
  const tokenEndpoint = ensureString(metadata.token_endpoint, `${source} token_endpoint`);

  assert.match(authorizationEndpoint, /^https:\/\//, 'authorization_endpoint must be HTTPS');
  assert.match(tokenEndpoint, /^https:\/\//, 'token_endpoint must be HTTPS');

  let registrationEndpoint = '';
  if ('registration_endpoint' in metadata && typeof metadata.registration_endpoint === 'string') {
    registrationEndpoint = metadata.registration_endpoint;
  }

  return { authorizationEndpoint, tokenEndpoint, registrationEndpoint };
}
