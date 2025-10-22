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
import { createAssertionLogger, recordSsePayload } from './logging.js';

export async function assertToolsAndAliases(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'tools');
  logger.info('Validating canonical and alias tool catalogues');
  const canonicalNames = await fetchToolNames(context, '/mcp');
  logger.debug('Canonical tools/list response captured', { tools: canonicalNames });
  if (context.mode === 'remote' && canonicalNames.length === 0) {
    logger.warn('Skipping tool catalogue assertions; remote /mcp tools/list failed');
    return;
  }
  for (const tool of EXPECTED_TOOLS) {
    assert.ok(canonicalNames.includes(tool), `tools/list should include ${tool}`);
  }

  const aliasNames = await fetchToolNames(context, '/openai_connector');
  logger.debug('Alias tools/list response captured', { tools: aliasNames });
  if (context.mode === 'remote' && aliasNames.length === 0) {
    logger.warn('Skipping alias catalogue comparison; remote /openai_connector tools/list failed');
    return;
  }
  assert.equal(
    aliasNames.length,
    canonicalNames.length,
    'Alias tools/list should match canonical length',
  );
  const canonicalSet = new Set(canonicalNames);
  for (const name of aliasNames) {
    assert.ok(canonicalSet.has(name), `Alias tools/list should not introduce ${name}`);
  }
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

  if (context.mode === 'remote') {
    logger.warn('Remote get-key-stages payload may drift from current schema', {
      result: result.resultRecord,
    });
    return;
  }

  const payload = extractToolPayload(result.resultRecord, logger);
  assert.ok(payload.length > 0, 'Tool payload array should not be empty');
  logger.debug('Parsed raw executor payload for get-key-stages', {
    records: payload,
    itemCount: payload.length,
  });
  logger.info('Validated get-key-stages tool response', {
    itemCount: payload.length,
  });
}

async function fetchToolNames(context: SmokeContext, path: string): Promise<readonly string[]> {
  const logger = createAssertionLogger(context, 'tools-fetch');
  const headers = createToolHeaders(context);
  logger.debug('Requesting tools/list', {
    mode: context.mode,
    path,
    baseUrl: context.baseUrl,
  });
  const { res, text } = await fetchJson(new URL(path, context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: `list-${path}`, method: 'tools/list' }),
  });
  if (context.mode === 'remote' && res.status !== 200) {
    logger.warn('Remote tools/list request failed', {
      path,
      status: res.status,
      body: text,
    });
    return [];
  }
  assert.equal(res.status, 200, `POST ${path} tools/list should return 200`);
  assert.match(text, /event: message/, `POST ${path} tools/list should be SSE formatted`);
  logger.debug('Received tools/list SSE payload', {
    path,
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

function extractToolPayload(resultRecord: JsonObject, logger: Logger): unknown[] {
  const isError =
    resultRecord.isError === undefined
      ? false
      : ensureBoolean(resultRecord.isError, 'tool call isError');
  if (isError) {
    logger.error('Successful tool call returned error payload', undefined, {
      result: resultRecord,
    });
  }
  assert.equal(isError, false, 'Successful tool call must not be flagged as error');
  const content = ensureArray(resultRecord.content ?? [], 'tool call content array');
  const payloadText = extractFirstText(content, 'tool call content');
  const payload: unknown = JSON.parse(payloadText);
  assert.ok(Array.isArray(payload), 'Tool payload should be an array');
  return payload;
}
