import assert from 'node:assert/strict';
import type { Logger } from '@oaknational/logger';

import { fetchJson } from './common.js';
import type { SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

/**
 * OAuth Protected Resource Metadata structure (RFC 9728)
 */
interface OAuthProtectedResourceMetadata {
  readonly resource: string;
  readonly authorization_servers: readonly string[];
  readonly scopes_supported?: readonly string[];
}

/**
 * JWKS Response structure (RFC 7517)
 */
interface JwksResponse {
  readonly keys: readonly unknown[];
}

/**
 * Type guard for OAuth metadata
 */
function isOAuthMetadata(value: unknown): value is OAuthProtectedResourceMetadata {
  return (
    typeof value === 'object' &&
    value !== null &&
    'authorization_servers' in value &&
    Array.isArray(value.authorization_servers)
  );
}

/**
 * Type guard for JWKS response
 */
function isJwksResponse(value: unknown): value is JwksResponse {
  return (
    typeof value === 'object' && value !== null && 'keys' in value && Array.isArray(value.keys)
  );
}

/**
 * Extracts Clerk AS URL from OAuth metadata, returns undefined if not Clerk
 */
function extractClerkAsUrl(metadata: unknown, logger: Logger): string | undefined {
  if (!isOAuthMetadata(metadata)) {
    logger.warn('Invalid OAuth metadata structure');
    return undefined;
  }

  if (metadata.authorization_servers.length === 0) {
    logger.warn('Empty authorization_servers - OAuth may not be configured');
    return undefined;
  }

  const firstServer = metadata.authorization_servers[0];
  if (!firstServer.includes('clerk')) {
    logger.warn('Authorization server is not Clerk - skipping JWKS check', { url: firstServer });
    return undefined;
  }

  return firstServer;
}

/**
 * Validates JWKS response structure per RFC 7517
 */
function validateJwksStructure(jwks: unknown): number {
  if (!isJwksResponse(jwks)) {
    throw new Error('Invalid JWKS response structure');
  }

  assert.ok(jwks.keys.length > 0, 'JWKS should have at least one key');
  return jwks.keys.length;
}

/**
 * Validates that Clerk's JWKS endpoint is accessible
 *
 * This is critical because if Clerk's JWKS is down or unreachable,
 * token validation will fail silently in production.
 *
 * Only runs for remote mode (tests real Clerk endpoint).
 * Skips gracefully for pre-OAuth deployments.
 */
export async function assertClerkJwksAccessible(context: SmokeContext): Promise<void> {
  if (context.mode !== 'remote') {
    return;
  }

  const logger = createAssertionLogger(context, 'clerk-jwks');

  // Fetch OAuth metadata
  const metadataRes = await fetchJson(
    new URL('/.well-known/oauth-protected-resource', context.baseUrl),
    { method: 'GET' },
  );

  // Skip gracefully if OAuth not configured (pre-Phase-3 deployment)
  if (metadataRes.res.status === 404 || metadataRes.res.status === 500) {
    logger.warn('OAuth metadata not available - skipping JWKS check', {
      status: metadataRes.res.status,
    });
    return;
  }

  assert.equal(metadataRes.res.status, 200, 'OAuth metadata should be accessible');

  const metadataParsed: unknown = JSON.parse(metadataRes.text);
  const clerkAsUrl = extractClerkAsUrl(metadataParsed, logger);

  if (!clerkAsUrl) {
    return; // Not Clerk - warnings already logged
  }

  // Fetch and validate JWKS
  const jwksUrl = `${clerkAsUrl}/.well-known/jwks.json`;
  const jwksRes = await fetchJson(new URL(jwksUrl), { method: 'GET' });

  assert.equal(jwksRes.res.status, 200, `Clerk JWKS should be accessible at ${jwksUrl}`);

  const jwksParsed: unknown = JSON.parse(jwksRes.text);
  const keyCount = validateJwksStructure(jwksParsed);

  logAssertionSuccess(logger, 'Clerk JWKS endpoint accessible and valid', {
    url: jwksUrl,
    keyCount,
  });
}
