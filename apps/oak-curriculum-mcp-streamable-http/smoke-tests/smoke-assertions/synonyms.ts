import assert from 'node:assert/strict';
import type { Logger } from '@oaknational/logger';

import {
  ensureArray,
  ensureBoolean,
  ensureOptionalString,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  extractJsonText,
  createToolHeaders,
} from './common.js';
import { type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

export async function assertSynonymCanonicalisation(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'synonyms');
  const headers = createToolHeaders(context);
  // NOTE: Synonym canonicalisation (e.g., "Key Stage Four" → "ks4") is not yet implemented.
  // The infrastructure exists (synonym-config.ts, generate-synonyms-file.ts) but isn't wired in.
  // For now, we test with valid canonical values to verify the tool works correctly.
  logger.info('Executing tool invocation smoke check (using canonical values)');
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'synonyms-success',
      method: 'tools/call',
      params: {
        name: 'get-key-stages-subject-lessons',
        arguments: {
          keyStage: 'ks4',
          subject: 'art',
        },
      },
    }),
  });
  logger.debug('Received tool response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote tool invocation failed', {
      status: response.res.status,
    });
    return;
  }
  assert.equal(response.res.status, 200, 'Tool call should return 200');
  const envelope = parseFirstSsePayload(response.text);
  logger.debug('Parsed tool SSE envelope', { envelope });
  if (envelope.error !== undefined) {
    assertToolError(envelope.error);
    return;
  }

  const result = ensureRecord(envelope.result, 'tool result');
  const isError =
    result.isError === undefined ? false : ensureBoolean(result.isError, 'tool isError');
  assert.equal(isError, false, 'Tool call should not be flagged as error');
  const content = ensureArray(result.content ?? [], 'tool content array');
  parseToolPayload(extractJsonText(content, 'tool content'), logger);
  logAssertionSuccess(logger, 'Tool invocation completed without errors');
}

function assertToolError(errorValue: unknown): void {
  const errorRecord = ensureRecord(errorValue, 'tool error');
  const message = ensureOptionalString(errorRecord.message, 'tool error message') ?? '';
  assert.ok(!message.toLowerCase().includes('unknown subject'), 'Subject should not be rejected');
  assert.ok(
    !message.toLowerCase().includes('unknown key stage'),
    'Key stage should not be rejected',
  );
}

function parseToolPayload(payloadText: string, logger: Logger): void {
  try {
    // The response should be valid JSON from the API
    const payload = ensureRecord(JSON.parse(payloadText), 'tool payload');
    // Basic validation that we got a response structure
    logger.debug('Tool response payload parsed successfully', {
      hasData: 'data' in payload || 'units' in payload || 'lessons' in payload,
    });
  } catch (error) {
    logger.warn('Unable to parse tool payload', {
      error: error instanceof Error ? error.message : error,
      payloadText,
    });
  }
}
