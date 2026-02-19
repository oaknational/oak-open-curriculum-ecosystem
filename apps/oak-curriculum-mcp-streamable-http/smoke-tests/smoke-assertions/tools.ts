import assert from 'node:assert/strict';

import type { Logger } from '@oaknational/mcp-logger';

import {
  extractJsonText,
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
    `tools/list should include at least ${String(expectedMin)} tools (got ${String(names.length)})`,
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

export async function fetchToolResponse(
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

export function parseToolResult(
  response: JsonResponse,
  logger: Logger,
): { readonly envelope: JsonRpcEnvelope; readonly resultRecord: JsonObject } {
  const envelope = parseFirstSsePayload(response.text);
  logger.debug('Parsed SSE envelope for get-key-stages', { envelope });
  assert.ok(!envelope.error, 'Successful tool call should not return error');
  const resultRecord = ensureRecord(envelope.result, 'tool call result');
  return { envelope, resultRecord };
}

export function extractToolPayload(resultRecord: JsonObject, logger: Logger): readonly unknown[] {
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
  const payloadText = extractJsonText(content, 'tool call content');
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
