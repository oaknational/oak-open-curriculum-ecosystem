import assert from 'node:assert/strict';

import {
  asOptionalRecord,
  ensureArray,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  extractFirstText,
  type JsonRpcEnvelope,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';

export async function assertValidationFailures(context: SmokeContext): Promise<void> {
  const headers = {
    Authorization: `Bearer ${context.devToken}`,
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };
  const invalidArguments = {
    jsonrpc: '2.0',
    id: 'invalid-args',
    method: 'tools/call',
    params: {
      name: 'get-key-stages-subject-lessons',
      arguments: { keyStage: 123, subject: true },
    },
  };

  const mcpResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(invalidArguments),
  });
  assert.equal(mcpResponse.res.status, 200, 'Validation failure should return 200');
  const mcpEnvelope = parseFirstSsePayload(mcpResponse.text);
  assert.ok(mcpEnvelope.error, 'Validation failure should produce an error envelope');

  const aliasResponse = await fetchJson(new URL('/openai_connector', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(invalidArguments),
  });
  assert.equal(aliasResponse.res.status, 200, 'Alias validation failure should return 200');
  assert.match(
    aliasResponse.text,
    /event: message/,
    'Alias validation failure should be SSE formatted',
  );
  const aliasEnvelope = parseFirstSsePayload(aliasResponse.text);
  if (!aliasEnvelope.error) {
    assertAliasValidationResult(aliasEnvelope);
    return;
  }

  const aliasError = ensureRecord(aliasEnvelope.error, 'alias error');
  const aliasData = asOptionalRecord(aliasError.data);
  const aliasContent = aliasData?.content;
  if (Array.isArray(aliasContent) && aliasContent.length > 0) {
    const message = extractFirstText(aliasContent, 'alias validation content');
    assert.match(message, /error/i, 'Validation failure should describe the error');
  }
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
