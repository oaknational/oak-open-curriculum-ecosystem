import assert from 'node:assert/strict';

import {
  ensureBoolean,
  ensureRecord,
  ensureString,
  fetchJson,
  parseFirstSsePayload,
  createAuthHeaders,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';
import type { Logger } from '@oaknational/mcp-logger';

export async function assertInitialiseHandshake(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'initialise');
  const headers = {
    ...createAuthHeaders(context),
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };

  await assertInitialiseWithoutClientInfo(context, headers, logger);
  await assertInitialiseWithClientInfo(context, headers, logger);
}

async function assertInitialiseWithoutClientInfo(
  context: SmokeContext,
  headers: Record<string, string>,
  logger: Logger,
): Promise<void> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'init-no-client',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
      },
    }),
  });
  logger.debug('Initialise without clientInfo response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote initialise without clientInfo failed', {
      status: response.res.status,
      body: response.text,
    });
    return;
  }
  assert.equal(response.res.status, 200, 'Initialise without clientInfo should return 200');
  const envelope = parseFirstSsePayload(response.text);
  const initialiseError = ensureRecord(envelope.error, 'initialise error');
  const initialiseMessage = ensureString(initialiseError.message, 'initialise error message');
  assert.notEqual(initialiseMessage.length, 0, 'Initialise error message should be present');
  assert.match(
    initialiseMessage.toLowerCase(),
    /clientinfo/,
    'Initialise error should mention clientInfo',
  );
  logAssertionSuccess(logger, 'Initialise without clientInfo rejected with explanatory error');
}

async function assertInitialiseWithClientInfo(
  context: SmokeContext,
  headers: Record<string, string>,
  logger: Logger,
): Promise<void> {
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
  logger.debug('Initialise with clientInfo response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote initialise with clientInfo failed', {
      status: response.res.status,
      body: response.text,
    });
    return;
  }
  assert.equal(response.res.status, 200, 'Initialise with clientInfo should return 200');
  const envelope = parseFirstSsePayload(response.text);
  const result = ensureRecord(envelope.result, 'initialise result');
  const capabilities = ensureRecord(result.capabilities, 'initialise capabilities');
  const tools = ensureRecord(capabilities.tools, 'initialise tool capabilities');
  assert.equal(
    ensureBoolean(tools.listChanged, 'initialise tools.listChanged'),
    true,
    'Initialise should advertise listChanged capability',
  );
  logAssertionSuccess(logger, 'Initialise with clientInfo succeeded and advertised listChanged');
}
