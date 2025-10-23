import assert from 'node:assert/strict';

import {
  fetchJson,
  parseFirstSsePayload,
  type JsonObject,
  type JsonRpcEnvelope,
  type JsonResponse,
  createToolHeaders,
} from './common.js';
import { type SmokeContext } from './types.js';
import { createAssertionLogger, recordSsePayload } from './logging.js';
import type { Logger } from '@oaknational/mcp-logger';

export async function assertValidationFailures(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'validation');
  const headers = createToolHeaders(context);
  const invalidArguments = createInvalidArguments();

  logger.info('Asserting validation failure for get-key-stages-subject-lessons');
  const response = await postValidationRequest(context, headers, invalidArguments, logger);
  if (!response) {
    return;
  }
  const envelope = parseValidationEnvelope(response, logger);
  assertCanonicalValidationFailure(envelope, logger);
  await recordSsePayload(context, 'get-key-stages-subject-lessons', envelope);

  logger.info('Validation assertions completed', { tool: 'get-key-stages-subject-lessons' });
}

function createInvalidArguments(): JsonObject {
  return {
    jsonrpc: '2.0',
    id: 'invalid-args',
    method: 'tools/call',
    params: {
      name: 'get-key-stages-subject-lessons',
      arguments: { keyStage: 123, subject: true },
    },
  };
}

async function postValidationRequest(
  context: SmokeContext,
  headers: Record<string, string>,
  body: unknown,
  logger: Logger,
): Promise<JsonResponse | null> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  logger.debug('Received validation response from /mcp', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote validation call to /mcp failed', {
      status: response.res.status,
      body: response.text,
    });
    return null;
  }
  assert.equal(response.res.status, 200, 'Validation failure via /mcp should return 200');
  return response;
}

function parseValidationEnvelope(response: JsonResponse, logger: Logger): JsonRpcEnvelope {
  const envelope = parseFirstSsePayload(response.text);
  logger.debug('Parsed validation SSE envelope from /mcp', { envelope });
  return envelope;
}

function assertCanonicalValidationFailure(envelope: JsonRpcEnvelope, logger: Logger): void {
  if (!envelope.error) {
    logger.error('Canonical validation envelope did not include an error block', undefined, {
      envelope,
    });
  }
  assert.ok(envelope.error, 'Validation failure should produce an error envelope');
}
