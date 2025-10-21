import assert from 'node:assert/strict';

import {
  ensureArray,
  ensureBoolean,
  ensureOptionalString,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  extractFirstText,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';

export async function assertSynonymCanonicalisation(context: SmokeContext): Promise<void> {
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
      id: 'synonyms-success',
      method: 'tools/call',
      params: {
        name: 'get-key-stages-subject-lessons',
        arguments: {
          params: {
            path: {
              keyStage: 'Key Stage Four',
              subject: 'Fine Art',
            },
          },
        },
      },
    }),
  });
  assert.equal(response.res.status, 200, 'Synonym tool call should return 200');
  const envelope = parseFirstSsePayload(response.text);
  if (envelope.error !== undefined) {
    assertSynonymError(envelope.error);
    return;
  }

  const result = ensureRecord(envelope.result, 'synonym result');
  const isError =
    result.isError === undefined ? false : ensureBoolean(result.isError, 'synonym isError');
  assert.equal(isError, false, 'Synonym tool call should not be flagged as error');
  const content = ensureArray(result.content ?? [], 'synonym content array');
  parseSynonymPayload(extractFirstText(content, 'synonym content'));
}

function assertSynonymError(errorValue: unknown): void {
  const errorRecord = ensureRecord(errorValue, 'synonym error');
  const message = ensureOptionalString(errorRecord.message, 'synonym error message') ?? '';
  assert.ok(
    !message.toLowerCase().includes('unknown subject'),
    'Subject synonym should not be rejected',
  );
  assert.ok(
    !message.toLowerCase().includes('unknown key stage'),
    'Key stage synonym should not be rejected',
  );
}

function parseSynonymPayload(payloadText: string): void {
  try {
    const payload = ensureRecord(JSON.parse(payloadText), 'synonym payload');
    const subjectSlug = ensureOptionalString(payload.subjectSlug, 'subjectSlug');
    if (subjectSlug) {
      assert.equal(subjectSlug, 'art', 'Subject synonym should canonise to art');
    }
    const keyStageSlug = ensureOptionalString(payload.keyStageSlug, 'keyStageSlug');
    if (keyStageSlug) {
      assert.equal(keyStageSlug, 'ks4', 'Key stage synonym should canonise to ks4');
    }
  } catch (error) {
    console.warn('Unable to parse canonicalised payload:', error);
  }
}
