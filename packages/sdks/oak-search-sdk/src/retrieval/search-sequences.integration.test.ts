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

const stubResolveIndex = () => 'oak_sequences_test';

describe('searchSequences', () => {
  describe('filter construction', () => {
    it('includes key_stages filter when keyStage is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'maths', keyStage: 'ks3' }, search, stubResolveIndex);

      const requestJson = JSON.stringify(getFirstRequest(calls).retriever);
      expect(requestJson).toContain('"key_stages":"ks3"');
    });

    it('includes subject_slug filter when subject is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra', subject: 'maths' }, search, stubResolveIndex);

      const requestJson = JSON.stringify(getFirstRequest(calls).retriever);
      expect(requestJson).toContain('"subject_slug":"maths"');
    });

    it('combines subject, phaseSlug, and keyStage filters', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences(
        { query: 'science', subject: 'science', phaseSlug: 'secondary', keyStage: 'ks4' },
        search,
        stubResolveIndex,
      );

      const requestJson = JSON.stringify(getFirstRequest(calls).retriever);
      expect(requestJson).toContain('"subject_slug":"science"');
      expect(requestJson).toContain('"phase_slug":"secondary"');
      expect(requestJson).toContain('"key_stages":"ks4"');
    });

    it('passes no filter when no filtering params provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'geography' }, search, stubResolveIndex);

      const requestJson = JSON.stringify(getFirstRequest(calls).retriever);
      expect(requestJson).not.toContain('"subject_slug"');
      expect(requestJson).not.toContain('"phase_slug"');
      expect(requestJson).not.toContain('"key_stages"');
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
