/**
 * Integration tests for searchSequences with injected search dependencies.
 *
 * Verifies filter construction and result mapping without network calls.
 */

import { describe, it, expect } from 'vitest';
import type { SearchSequenceIndexDoc } from '@oaknational/sdk-codegen/search';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';
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
  const search = (body: EsSearchRequest) => {
    calls.push(body);
    return Promise.resolve(response);
  };
  return { search, calls };
}

function getFirstRequest(calls: EsSearchRequest[]): EsSearchRequest {
  const request = calls[0];
  if (request === undefined) {
    throw new Error(`Expected exactly one search request, got ${calls.length}`);
  }
  return request;
}

function getSequenceStandardRetriever(calls: EsSearchRequest[]) {
  const request = getFirstRequest(calls);
  const retriever = request.retriever;
  if (!retriever || !('standard' in retriever) || !retriever.standard) {
    throw new Error('Expected standard retriever on search request');
  }
  return retriever.standard;
}

function getSequenceMultiMatch(calls: EsSearchRequest[]) {
  const standard = getSequenceStandardRetriever(calls);
  const multiMatch = standard.query?.multi_match;
  if (!multiMatch) {
    throw new Error('Expected multi_match query on sequence retriever');
  }
  return multiMatch;
}

function getFilterClause(calls: EsSearchRequest[]) {
  return getSequenceStandardRetriever(calls).filter;
}

const stubResolveIndex = () => 'oak_sequences_test';

describe('searchSequences', () => {
  describe('filter construction', () => {
    it('uses a plain lexical retriever for sequences', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra' }, search, stubResolveIndex);

      expect(getFirstRequest(calls).retriever).not.toHaveProperty('rrf');
      expect(getSequenceMultiMatch(calls)).toMatchObject({
        query: 'algebra',
        fuzziness: 'AUTO',
        fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
      });
    });

    it('includes key_stages filter when keyStage is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'maths', keyStage: 'ks3' }, search, stubResolveIndex);

      const filterClause = getFilterClause(calls);
      expect(filterClause).toEqual({
        bool: { filter: [{ term: { key_stages: 'ks3' } }] },
      });
    });

    it('includes subject_slug filter when subject is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra', subject: 'maths' }, search, stubResolveIndex);

      const filterClause = getFilterClause(calls);
      expect(filterClause).toEqual({
        bool: { filter: [{ term: { subject_slug: 'maths' } }] },
      });
    });

    it('combines subject, phaseSlug, and keyStage filters', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences(
        { query: 'science', subject: 'science', phaseSlug: 'secondary', keyStage: 'ks4' },
        search,
        stubResolveIndex,
      );

      const filterClause = getFilterClause(calls);
      expect(filterClause).toEqual({
        bool: {
          filter: [
            { term: { subject_slug: 'science' } },
            { term: { phase_slug: 'secondary' } },
            { term: { key_stages: 'ks4' } },
          ],
        },
      });
    });

    it('includes category_titles filter when category is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences(
        {
          query: 'maths',
          category: 'algebra',
        },
        search,
        stubResolveIndex,
      );

      const filterClause = getFilterClause(calls);
      expect(filterClause).toEqual({
        bool: { filter: [{ match_phrase: { category_titles: 'algebra' } }] },
      });
    });

    it('combines category with other filters', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences(
        {
          query: 'science',
          subject: 'science',
          phaseSlug: 'secondary',
          keyStage: 'ks4',
          category: 'physics',
        },
        search,
        stubResolveIndex,
      );

      const filterClause = getFilterClause(calls);
      expect(filterClause).toEqual({
        bool: {
          filter: [
            { term: { subject_slug: 'science' } },
            { term: { phase_slug: 'secondary' } },
            { term: { key_stages: 'ks4' } },
            { match_phrase: { category_titles: 'physics' } },
          ],
        },
      });
    });

    it('passes no filter when no filtering params provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'geography' }, search, stubResolveIndex);

      const filterClause = getFilterClause(calls);
      expect(filterClause).toBeUndefined();
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
                doc_type: 'sequence',
                subject_slug: 'maths',
                subject_title: 'Maths',
                phase_slug: 'primary',
                phase_title: 'Primary',
                key_stages: ['ks1', 'ks2'],
                years: ['1', '2', '3', '4', '5', '6'],
                unit_slugs: ['counting'],
                sequence_url: 'https://example.com/maths-primary',
              },
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
      const failingSearch = () => Promise.reject(new Error('connection refused'));

      const result = await searchSequences({ query: 'maths' }, failingSearch, stubResolveIndex);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('connection refused');
      }
    });
  });
});
