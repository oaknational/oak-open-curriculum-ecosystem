import assert from 'node:assert/strict';

import {
  extractFirstText,
  extractToolNames,
  fetchJson,
  ensureArray,
  ensureBoolean,
  ensureRecord,
  parseFirstSsePayload,
} from './common.js';
import { EXPECTED_TOOLS, REQUIRED_ACCEPT, type SmokeContext } from './types.js';

export async function assertToolsAndAliases(context: SmokeContext): Promise<void> {
  const canonicalNames = await fetchToolNames(context, '/mcp');
  for (const tool of EXPECTED_TOOLS) {
    assert.ok(canonicalNames.includes(tool), `tools/list should include ${tool}`);
  }

  const aliasNames = await fetchToolNames(context, '/openai_connector');
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
  const headers = {
    Authorization: `Bearer ${context.devToken}`,
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };

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
  assert.equal(response.res.status, 200, 'Successful tool call should return 200');
  const envelope = ensureRecord(parseFirstSsePayload(response.text), 'successful tool envelope');
  assert.ok(!envelope.error, 'Successful tool call should not return error');
  const result = ensureRecord(envelope.result, 'tool call result');
  const isError =
    result.isError === undefined ? false : ensureBoolean(result.isError, 'tool call isError');
  assert.equal(isError, false, 'Successful tool call must not be flagged as error');
  const content = ensureArray(result.content ?? [], 'tool call content array');
  const payloadText = extractFirstText(content, 'tool call content');
  const payload: unknown = JSON.parse(payloadText);
  assert.ok(Array.isArray(payload), 'Tool payload should be an array');
  assert.ok(payload.length > 0, 'Tool payload array should not be empty');
}

async function fetchToolNames(context: SmokeContext, path: string): Promise<readonly string[]> {
  const headers = {
    Authorization: `Bearer ${context.devToken}`,
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };
  const { res, text } = await fetchJson(new URL(path, context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: `list-${path}`, method: 'tools/list' }),
  });
  assert.equal(res.status, 200, `POST ${path} tools/list should return 200`);
  assert.match(text, /event: message/, `POST ${path} tools/list should be SSE formatted`);
  return extractToolNames(text);
}
