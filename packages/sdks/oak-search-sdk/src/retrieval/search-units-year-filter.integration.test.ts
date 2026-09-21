/**
 * Integration tests for the unit search year filter (MCP-755).
 *
 * A unit search narrowed by year must send a `years` terms filter to
 * Elasticsearch. The filter was declared on the tool but never reached the
 * query, so `keyStage` was the only age filter with any effect on units and a
 * Year 2 unit was invisible to a Year 3 request.
 *
 * Asserts on the request the retrieval service actually sends, so the proof
 * covers the served path rather than the filter builder alone. No network IO:
 * the client's `search` is spied, as in `create-search-sdk.integration.test.ts`.
 */

import { Client, type estypes } from '@elastic/elasticsearch';
import { describe, it, expect, vi } from 'vitest';
import { createRetrievalService } from './create-retrieval-service.js';
import type { SearchUnitsParams } from '../types/retrieval-params.js';

const EMPTY_SEARCH_RESPONSE = {
  took: 1,
  timed_out: false,
  _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
  hits: { total: { value: 0, relation: 'eq' as const }, max_score: null, hits: [] },
};

/** A real ES client whose `search` is spied, so no network IO occurs. */
function createSpiedClient(): Client {
  const client = new Client({ node: 'http://localhost:19200' });
  vi.spyOn(client, 'search').mockResolvedValue(EMPTY_SEARCH_RESPONSE);
  return client;
}

/** Serialises the request the SDK sent, so filter clauses can be asserted on. */
async function unitSearchRequestJson(params: SearchUnitsParams): Promise<string> {
  const client = createSpiedClient();
  const retrieval = createRetrievalService(client, { indexTarget: 'primary' });

  await retrieval.searchUnits(params);

  const calls = vi.mocked(client.search).mock.calls;
  const request: estypes.SearchRequest | undefined = calls.at(-1)?.[0];
  expect(request).toBeDefined();
  return JSON.stringify(request ?? {});
}

describe('unit search year filter', () => {
  it('sends a years terms filter when year is provided', async () => {
    const request = await unitSearchRequestJson({ query: 'prayer', year: '2' });

    expect(request).toContain('{"terms":{"years":["2"]}}');
  });

  it('sends both the key stage and the year when both are provided', async () => {
    const request = await unitSearchRequestJson({
      query: 'prayer',
      keyStage: 'ks2',
      year: '3',
    });

    expect(request).toContain('{"term":{"key_stage":"ks2"}}');
    expect(request).toContain('{"terms":{"years":["3"]}}');
  });

  it('sends no years filter when year is omitted', async () => {
    const request = await unitSearchRequestJson({ query: 'prayer', keyStage: 'ks2' });

    expect(request).toContain('{"term":{"key_stage":"ks2"}}');
    expect(request).not.toContain('years');
  });
});
