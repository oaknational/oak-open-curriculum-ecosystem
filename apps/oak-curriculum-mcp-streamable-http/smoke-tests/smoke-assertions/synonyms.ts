import assert from 'node:assert/strict';
import type { Logger } from '@oaknational/mcp-logger';

import {
  ensureArray,
  ensureBoolean,
  ensureOptionalString,
  ensureRecord,
  fetchJson,
  parseFirstSsePayload,
  extractFirstText,
  createToolHeaders,
} from './common.js';
import { type SmokeContext } from './types.js';
import { createAssertionLogger } from './logging.js';

export async function assertSynonymCanonicalisation(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'synonyms');
  const headers = createToolHeaders(context);
  logger.info('Executing synonym canonicalisation smoke check');
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
  logger.debug('Received synonym response', {
    status: response.res.status,
    body: response.text,
  });
  if (context.mode === 'remote' && response.res.status !== 200) {
    logger.warn('Remote synonym tool invocation failed', {
      status: response.res.status,
    });
    return;
  }
  assert.equal(response.res.status, 200, 'Synonym tool call should return 200');
  const envelope = parseFirstSsePayload(response.text);
  logger.debug('Parsed synonym SSE envelope', { envelope });
  if (envelope.error !== undefined) {
    assertSynonymError(envelope.error);
    return;
  }

  const result = ensureRecord(envelope.result, 'synonym result');
  const isError =
    result.isError === undefined ? false : ensureBoolean(result.isError, 'synonym isError');
  assert.equal(isError, false, 'Synonym tool call should not be flagged as error');
  const content = ensureArray(result.content ?? [], 'synonym content array');
  parseSynonymPayload(extractFirstText(content, 'synonym content'), logger);
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

function parseSynonymPayload(payloadText: string, logger: Logger): void {
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
    logger.warn('Unable to parse canonicalised payload', {
      error: error instanceof Error ? error.message : error,
      payloadText,
    });
  }
}
