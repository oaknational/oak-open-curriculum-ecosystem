import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';

import { fetchJson, parseFirstSsePayload, ensureRecord, ensureArray } from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';
import { assertOAuthDiscoveryChain, type DiscoveryChainResult } from './oauth-discovery.js';
import { createClerkOAuthAccessToken } from '../auth/clerk-oauth-token.js';

/**
 * Validates the FULL spec-compliant OAuth path end-to-end:
 *
 * 1. Discovery chain (401 → PRM → AS metadata from proxy/self-origin)
 * 2. Programmatic token acquisition via Clerk Backend API
 * 3. Authenticated MCP tools/list call with Bearer token
 * 4. MCP Inspector CLI verification (optional, best-effort)
 *
 * This proves the server-side auth chain works for ANY spec-compliant
 * MCP client, independent of Cursor-specific behaviour.
 */
export async function assertSpecCompliantOAuthFlow(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'oauth-spec-e2e');

  // ── Phase 1: Validate discovery chain ────────────────────────────
  logger.info('Phase 1: Validating spec-compliant OAuth discovery chain');
  const discovery = await assertOAuthDiscoveryChain(context);

  // ── Phase 2: Acquire token programmatically ──────────────────────
  logger.info('Phase 2: Acquiring OAuth token via programmatic PKCE');
  const access = await createClerkOAuthAccessToken();

  try {
    // ── Phase 3: Authenticated MCP call ────────────────────────────
    logger.info('Phase 3: Making authenticated tools/list call');
    await assertAuthenticatedToolsList(context, access.accessToken, logger);

    // ── Phase 4: Inspector CLI verification ────────────────────────
    logger.info('Phase 4: MCP Inspector CLI verification (best-effort)');
    await assertInspectorCliToolsList(context, access.accessToken, discovery, logger);
  } finally {
    logger.debug('Cleaning up Clerk smoke resources');
    await access.cleanup();
  }

  logAssertionSuccess(logger, 'Spec-compliant OAuth flow validated end-to-end');
}

async function assertAuthenticatedToolsList(
  context: SmokeContext,
  accessToken: string,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<void> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: REQUIRED_ACCEPT,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'spec-tools-list',
      method: 'tools/list',
    }),
  });

  assert.equal(
    response.res.status,
    200,
    `Authenticated tools/list must return 200 (got ${String(response.res.status)}: ${response.text.slice(0, 200)})`,
  );

  const envelope = parseFirstSsePayload(response.text);
  assert.ok(!envelope.error, 'tools/list must not return an error envelope');

  const result = ensureRecord(envelope.result, 'tools/list result');
  const tools = ensureArray(result.tools, 'tools/list tools array');
  assert.ok(tools.length > 0, 'tools/list must return at least one tool');

  logAssertionSuccess(logger, 'Authenticated tools/list succeeded', {
    toolCount: tools.length,
  });
}

/**
 * Best-effort verification using the MCP Inspector CLI.
 *
 * The Inspector CLI may not be installed or may behave differently across
 * versions, so failures here are logged as warnings rather than assertion
 * failures.
 */
async function assertInspectorCliToolsList(
  context: SmokeContext,
  accessToken: string,
  discovery: DiscoveryChainResult,
  logger: ReturnType<typeof createAssertionLogger>,
): Promise<void> {
  try {
    const output = await runInspectorCli(context.baseUrl, accessToken);
    logger.debug('Inspector CLI output', { output: output.slice(0, 500) });

    logAssertionSuccess(logger, 'MCP Inspector CLI executed successfully', {
      outputLength: output.length,
      discoveryAuthServer: discovery.authorizationServer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('MCP Inspector CLI verification skipped (non-blocking)', { reason: message });
  }
}

function runInspectorCli(baseUrl: string, accessToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const serverUrl = `${baseUrl}/mcp`;
    const child = execFile(
      'npx',
      [
        '@modelcontextprotocol/inspector',
        '--cli',
        '--transport',
        'http',
        '--server-url',
        serverUrl,
        '--header',
        `Authorization: Bearer ${accessToken}`,
      ],
      { timeout: 30_000, encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Inspector CLI failed: ${error.message}\nstderr: ${stderr}`));
          return;
        }
        resolve(stdout);
      },
    );
    child.stdin?.end();
  });
}
