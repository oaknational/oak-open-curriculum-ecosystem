import assert from 'node:assert/strict';

import {
  ensureBoolean,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  createAuthHeaders,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

/**
 * Proves the server can complete an MCP initialize handshake.
 *
 * This is the most fundamental MCP assertion: can a client send
 * `initialize` and receive a valid capabilities response?
 *
 * In local modes all MCP assertions share the same server instance.
 * Per-request transport creates a fresh McpServer + transport per request.
 *
 * Validation edge cases (e.g. missing clientInfo) are proven in E2E
 * tests which create a fresh app instance per test.
 *
 * @see e2e-tests/server.e2e.test.ts — "rejects initialize without clientInfo"
 */
export async function assertInitialiseHandshake(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'initialise');
  const headers = {
    ...createAuthHeaders(context),
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };

  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'init-with-client',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'smoke-dev', version: '0.0.0-local' },
      },
    }),
  });
  logger.debug('Initialise response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote initialise failed', {
      status: response.res.status,
      body: response.text,
    });
    return;
  }
  assert.equal(response.res.status, 200, 'Initialise should return 200');

  const envelope = parseFirstSsePayload(response.text);
  const result = ensureRecord(envelope.result, 'initialise result');
  const capabilities = ensureRecord(result.capabilities, 'initialise capabilities');
  const tools = ensureRecord(capabilities.tools, 'initialise tool capabilities');
  assert.equal(
    ensureBoolean(tools.listChanged, 'initialise tools.listChanged'),
    true,
    'Initialise should advertise listChanged capability',
  );
  logAssertionSuccess(logger, 'Initialise handshake succeeded and advertised listChanged');
}
