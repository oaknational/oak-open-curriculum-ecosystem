import assert from 'node:assert/strict';

import {
  asOptionalRecord,
  ensureArray,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  extractFirstText,
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
  const mcpResponse = await postValidationRequest(
    context,
    headers,
    invalidArguments,
    '/mcp',
    logger,
  );
  if (!mcpResponse) {
    return;
  }
  const mcpEnvelope = parseValidationEnvelope(mcpResponse, logger, '/mcp');
  assertCanonicalValidationFailure(mcpEnvelope, logger);
  await recordSsePayload(context, 'get-key-stages-subject-lessons', mcpEnvelope);

  const aliasResponse = await postValidationRequest(
    context,
    headers,
    invalidArguments,
    '/openai_connector',
    logger,
  );
  if (!aliasResponse) {
    return;
  }
  const aliasEnvelope = parseValidationEnvelope(aliasResponse, logger, '/openai_connector');
  analyseAliasValidation(aliasEnvelope, logger);

  logger.info('Validation assertions completed', {
    tool: 'get-key-stages-subject-lessons',
    aliasError: Boolean(aliasEnvelope.error),
  });
}

function assertAliasValidationResult(envelope: JsonRpcEnvelope): void {
  const result = asOptionalRecord(envelope.result);
  if (!result) {
    throw new Error('Alias validation failure should include result content');
  }
  const contentEntries = ensureArray(result.content ?? [], 'alias validation content array');
  if (contentEntries.length === 0) {
    throw new Error('Alias validation failure should include error details');
  }
  const message = extractFirstText(contentEntries, 'alias validation content');
  assert.match(
    message.toLowerCase(),
    /error|invalid/,
    'Validation failure should describe the error',
  );
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
  path: '/mcp' | '/openai_connector',
  logger: Logger,
): Promise<JsonResponse | null> {
  const response = await fetchJson(new URL(path, context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  logger.debug(`Received validation response from ${path}`, {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn(`Remote validation call to ${path} failed`, {
      status: response.res.status,
      body: response.text,
    });
    return null;
  }
  assert.equal(response.res.status, 200, `Validation failure via ${path} should return 200`);
  if (path === '/openai_connector') {
    assert.match(
      response.text,
      /event: message/,
      'Alias validation failure should be SSE formatted',
    );
  }
  return response;
}

function parseValidationEnvelope(
  response: JsonResponse,
  logger: Logger,
  path: '/mcp' | '/openai_connector',
): JsonRpcEnvelope {
  const envelope = parseFirstSsePayload(response.text);
  logger.debug(`Parsed validation SSE envelope from ${path}`, { envelope });
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

function analyseAliasValidation(envelope: JsonRpcEnvelope, logger: Logger): void {
  if (!envelope.error) {
    logger.warn('Alias validation returned result instead of error', { envelope });
    assertAliasValidationResult(envelope);
    return;
  }

  const aliasError = ensureRecord(envelope.error, 'alias error');
  const aliasData = asOptionalRecord(aliasError.data);
  const aliasContent = aliasData?.content;
  if (Array.isArray(aliasContent) && aliasContent.length > 0) {
    const message = extractFirstText(aliasContent, 'alias validation content');
    assert.match(message, /error/i, 'Validation failure should describe the error');
  }
}
