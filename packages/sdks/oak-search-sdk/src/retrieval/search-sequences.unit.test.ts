/**
 * Unit tests for searchSequences — verifies filter construction
 * and result mapping without hitting Elasticsearch.
 */

import { describe, it, expect } from 'vitest';
import type { SearchSequenceIndexDoc } from '@oaknational/sdk-codegen/search';
import type { EsSearchFn, EsSearchRequest, EsSearchResponse } from '../internal/types.js';
import { searchSequences } from './search-sequences.js';

function emptySequenceResponse(): EsSearchResponse<SearchSequenceIndexDoc> {
  return {
    hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
    took: 1,
    timed_out: false,
  };
}

function createMockSearch(response = emptySequenceResponse()) {
  const calls: EsSearchRequest[] = [];
  const search: EsSearchFn = <T>(body: EsSearchRequest) => {
    calls.push(body);
    return Promise.resolve(response as unknown as EsSearchResponse<T>);
  };
  return { search, calls };
}

function extractFilter(calls: EsSearchRequest[]) {
  const request = calls[0];
  const retrievers = request?.retriever?.rrf?.retrievers;
  if (!retrievers || retrievers.length === 0) {
    return undefined;
  }
  const first = retrievers[0] as { standard?: { filter?: unknown } } | undefined;
  return first?.standard?.filter;
}

const stubResolveIndex = () => 'oak_sequences_test';

describe('searchSequences', () => {
  describe('filter construction', () => {
    it('includes key_stages filter when keyStage is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'maths', keyStage: 'ks3' }, search, stubResolveIndex);

      expect(calls).toHaveLength(1);
      const filter = extractFilter(calls);
      expect(filter).toEqual({
        bool: {
          filter: expect.arrayContaining([{ term: { key_stages: 'ks3' } }]) as unknown,
        },
      });
    });

    it('includes subject_slug filter when subject is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra', subject: 'maths' }, search, stubResolveIndex);

      const filter = extractFilter(calls);
      expect(filter).toEqual({
        bool: {
          filter: expect.arrayContaining([{ term: { subject_slug: 'maths' } }]) as unknown,
        },
      });
    });

    it('combines subject, phaseSlug, and keyStage filters', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences(
        { query: 'science', subject: 'science', phaseSlug: 'secondary', keyStage: 'ks4' },
        search,
        stubResolveIndex,
      );

      const filter = extractFilter(calls);
      expect(filter).toEqual({
        bool: {
          filter: expect.arrayContaining([
            { term: { subject_slug: 'science' } },
            { term: { phase_slug: 'secondary' } },
            { term: { key_stages: 'ks4' } },
          ]) as unknown,
        },
      });
    });

    it('passes no filter when no filtering params provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'geography' }, search, stubResolveIndex);

      const filter = extractFilter(calls);
      expect(filter).toBeUndefined();
    });
  });

  describe('result mapping', () => {
    it('returns ok result with mapped sequence hits', async () => {
      const response: EsSearchResponse<SearchSequenceIndexDoc> = {
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: 0.05,
          hits: [
            {
              _index: 'oak_sequences_test',
              _id: 'seq-1',
              _score: 0.05,
              _source: {
                sequence_id: 'seq-1',
                sequence_slug: 'maths-primary',
                sequence_title: 'Maths Primary',
                subject_slug: 'maths',
                subject_title: 'Maths',
                phase_slug: 'primary',
                phase_title: 'Primary',
                key_stages: ['ks1', 'ks2'],
                years: ['1', '2', '3', '4', '5', '6'],
                unit_slugs: ['counting'],
                sequence_url: 'https://example.com/maths-primary',
              } as SearchSequenceIndexDoc,
            },
          ],
        },
        took: 5,
        timed_out: false,
      };
      const { search } = createMockSearch(response);

      const result = await searchSequences({ query: 'maths' }, search, stubResolveIndex);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scope).toBe('sequences');
        expect(result.value.results).toHaveLength(1);
        expect(result.value.results[0]?.id).toBe('seq-1');
        expect(result.value.results[0]?.rankScore).toBe(0.05);
      }
    });

    it('returns error when search throws', async () => {
      const failingSearch: EsSearchFn = () => Promise.reject(new Error('connection refused'));

      const result = await searchSequences({ query: 'maths' }, failingSearch, stubResolveIndex);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('connection refused');
      }
    });
  });
});
