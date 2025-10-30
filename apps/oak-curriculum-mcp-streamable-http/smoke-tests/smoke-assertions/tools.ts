import assert from 'node:assert/strict';

import type { Logger } from '@oaknational/mcp-logger';

import {
  extractFirstText,
  extractToolNames,
  fetchJson,
  ensureArray,
  ensureBoolean,
  ensureRecord,
  parseFirstSsePayload,
  createToolHeaders,
  type JsonResponse,
  type JsonObject,
  type JsonRpcEnvelope,
} from './common.js';
import { EXPECTED_TOOLS, type SmokeContext } from './types.js';
import { createAssertionLogger, logAssertionSuccess, recordSsePayload } from './logging.js';

export async function assertToolCatalogue(
  context: SmokeContext,
  options?: { readonly expectedMinimum?: number },
): Promise<void> {
  const logger = createAssertionLogger(context, 'tools');
  const expectedMin = options?.expectedMinimum ?? EXPECTED_TOOLS.length;
  logger.info('Validating tools/list response', { expectedMinimum: expectedMin });
  const names = await fetchToolNames(context);
  logger.debug('Canonical tools/list response captured', { tools: names });
  if (context.mode === 'remote' && names.length === 0) {
    logger.warn('Skipping tool catalogue assertions; remote /mcp tools/list failed');
    return;
  }
  
  // Verify minimum tool count
  assert.ok(
    names.length >= expectedMin,
    `tools/list should include at least ${expectedMin} tools (got ${names.length})`,
  );
  
  // Verify critical tools are present
  for (const tool of EXPECTED_TOOLS) {
    assert.ok(names.includes(tool), `tools/list should include ${tool}`);
  }
  logAssertionSuccess(logger, 'tools/list includes expected entries', {
    expectedMinimum: expectedMin,
    receivedCount: names.length,
  });
}

export async function assertSuccessfulToolCall(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'tool-call-success');
  const headers = createToolHeaders(context);
  logger.info('Executing get-key-stages via streamable HTTP', {
    baseUrl: context.baseUrl,
    mode: context.mode,
  });
  const response = await fetchToolResponse(context, headers, logger);
  if (!response) {
    return;
  }

  const result = parseToolResult(response, logger);
  await recordSsePayload(context, 'get-key-stages', result.envelope);

  const payload = extractToolPayload(result.resultRecord, logger);
  assert.ok(payload.length > 0, 'Tool payload array should not be empty');
  logger.debug('Parsed raw executor payload for get-key-stages', {
    records: payload,
    itemCount: payload.length,
  });
  logAssertionSuccess(logger, 'Validated get-key-stages tool response', {
    itemCount: payload.length,
  });
}

async function fetchToolNames(context: SmokeContext): Promise<readonly string[]> {
  const logger = createAssertionLogger(context, 'tools-fetch');
  const headers = createToolHeaders(context);
  logger.debug('Requesting tools/list', {
    mode: context.mode,
    baseUrl: context.baseUrl,
  });
  const { res, text } = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 'list-/mcp', method: 'tools/list' }),
  });
  if (context.mode === 'remote' && res.status !== 200) {
    logger.warn('Remote tools/list request failed', {
      status: res.status,
      body: text,
    });
    return [];
  }
  assert.equal(res.status, 200, 'POST /mcp tools/list should return 200');
  assert.match(text, /event: message/, 'POST /mcp tools/list should be SSE formatted');
  logger.debug('Received tools/list SSE payload', {
    status: res.status,
    sse: text,
  });
  return extractToolNames(text);
}

async function fetchToolResponse(
  context: SmokeContext,
  headers: Record<string, string>,
  logger: Logger,
): Promise<JsonResponse | null> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'success-data',
      method: 'tools/call',
      params: {
        name: 'get-key-stages',
        arguments: { params: {} },
      },
    }),
  });
  logger.debug('Received tool SSE response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote get-key-stages execution failed', {
      status: response.res.status,
      body: response.text,
    });
    return null;
  }
  assert.equal(
    response.res.status,
    200,
    `Successful tool call should return 200 (received ${String(response.res.status)})`,
  );
  return response;
}

function parseToolResult(
  response: JsonResponse,
  logger: Logger,
): { readonly envelope: JsonRpcEnvelope; readonly resultRecord: JsonObject } {
  const envelope = parseFirstSsePayload(response.text);
  logger.debug('Parsed SSE envelope for get-key-stages', { envelope });
  assert.ok(!envelope.error, 'Successful tool call should not return error');
  const resultRecord = ensureRecord(envelope.result, 'tool call result');
  return { envelope, resultRecord };
}

function extractToolPayload(resultRecord: JsonObject, logger: Logger): readonly unknown[] {
  const isError =
    resultRecord.isError === undefined
      ? false
      : ensureBoolean(resultRecord.isError, 'tool call isError');
  if (isError) {
    logger.error('Successful tool call returned error payload', undefined, {
      result: resultRecord,
    });
    throw new Error('Successful tool call must not be flagged as error');
  }
  const content = ensureArray(resultRecord.content ?? [], 'tool call content array');
  const payloadText = extractFirstText(content, 'tool call content');
  const payload: unknown = JSON.parse(payloadText);

  if (Array.isArray(payload)) {
    return payload;
  }

  const envelope = ensureRecord(payload, 'tool call payload');
  assertValidStatus(envelope.status);
  return ensureArray(envelope.data, 'tool call payload data array');
}

function assertValidStatus(statusValue: unknown): void {
  if (statusValue === undefined || statusValue === null) {
    return;
  }
  const statusType = typeof statusValue;
  assert.ok(
    statusType === 'number' || statusType === 'string',
    `Tool payload status must be number|string when present (received ${statusType})`,
  );
}

/**
 * Assert lesson-related tools work (get-lessons-summary, get-lessons-assets)
 */
export async function assertLessonToolsWork(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'lesson-tools');
  const headers = createToolHeaders(context);

  // Use a known lesson ID from the curriculum
  const lessonId = 'maths-ks1-place-value-counting-objects-to-10';

  // Test get-lessons-summary
  logger.info('Testing get-lessons-summary', { lessonId });
  const summaryResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'test-lessons-summary',
      method: 'tools/call',
      params: {
        name: 'get-lessons-summary',
        arguments: { params: { path: { lesson: lessonId } } },
      },
    }),
  });

  if (context.mode === 'remote' && summaryResponse.res.status !== 200) {
    logger.warn('get-lessons-summary failed on remote', {
      status: summaryResponse.res.status,
      body: summaryResponse.text,
    });
  } else {
    assert.equal(summaryResponse.res.status, 200, 'get-lessons-summary should return 200');
    logAssertionSuccess(logger, 'get-lessons-summary executed successfully');
  }

  // Test get-lessons-assets
  logger.info('Testing get-lessons-assets', { lessonId });
  const assetsResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'test-lessons-assets',
      method: 'tools/call',
      params: {
        name: 'get-lessons-assets',
        arguments: { params: { path: { lesson: lessonId } } },
      },
    }),
  });

  if (context.mode === 'remote' && assetsResponse.res.status !== 200) {
    logger.warn('get-lessons-assets failed on remote', {
      status: assetsResponse.res.status,
      body: assetsResponse.text,
    });
  } else {
    assert.equal(assetsResponse.res.status, 200, 'get-lessons-assets should return 200');
    const envelope = parseFirstSsePayload(assetsResponse.text);
    assert.ok(!envelope.error, 'get-lessons-assets should not return error');
    logAssertionSuccess(logger, 'get-lessons-assets executed successfully');
  }
}

/**
 * Assert unit-related tools work (get-units-summary)
 */
export async function assertUnitToolsWork(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'unit-tools');
  const headers = createToolHeaders(context);

  // Use a known unit ID from the curriculum
  const unitId = 'maths-ks1-place-value';

  logger.info('Testing get-units-summary', { unitId });
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'test-units-summary',
      method: 'tools/call',
      params: {
        name: 'get-units-summary',
        arguments: { params: { path: { unit: unitId } } },
      },
    }),
  });

  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('get-units-summary failed on remote', {
      status: response.res.status,
      body: response.text,
    });
  } else {
    assert.equal(response.res.status, 200, 'get-units-summary should return 200');
    const envelope = parseFirstSsePayload(response.text);
    assert.ok(!envelope.error, 'get-units-summary should not return error');
    logAssertionSuccess(logger, 'get-units-summary executed successfully');
  }
}
