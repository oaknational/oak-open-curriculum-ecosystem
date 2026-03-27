/**
 * Integration tests for searchSequences with injected search dependencies.
 *
 * Verifies 2-way RRF retriever shape, filter construction, and result mapping
 * without network calls.
 */

import type { JsonObject, Logger } from '@oaknational/logger';
import { describe, it, expect, vi } from 'vitest';
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

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Extracts the `standard` property from an RRF sub-retriever via runtime narrowing. */
function getStandard(retriever: unknown): JsonObject | undefined {
  if (!isJsonObject(retriever)) {
    return undefined;
  }
  const std = retriever.standard;
  if (!isJsonObject(std)) {
    return undefined;
  }
  return std;
}

function getNestedJsonObject(
  value: JsonObject | null | undefined,
  key: string,
): JsonObject | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const nestedValue = value[key];
  return isJsonObject(nestedValue) ? nestedValue : undefined;
}

function createLoggerMock() {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  } satisfies Logger;
}

function extractLoggedFilterEntries(logger: ReturnType<typeof createLoggerMock>): readonly unknown[] {
  const callPayload: unknown = logger.debug.mock.calls[0]?.[1];
  if (!isJsonObject(callPayload)) {
    throw new Error('Expected logger payload to be an object');
  }

  const filterClause = callPayload.filterClause;
  if (!isJsonObject(filterClause)) {
    throw new Error('Expected logger payload to contain a filter clause');
  }

  const boolClause = filterClause.bool;
  if (!isJsonObject(boolClause) || !Array.isArray(boolClause.filter)) {
    throw new Error('Expected filter clause to contain a bool.filter array');
  }

  return boolClause.filter;
}

/** Extracts the filter from the first RRF sub-retriever. */
function extractFilter(calls: EsSearchRequest[]) {
  const request = getFirstRequest(calls);
  const retrievers = request.retriever?.rrf?.retrievers;
  if (!retrievers || retrievers.length === 0) {
    return undefined;
  }
  return getStandard(retrievers[0])?.filter;
}

const stubResolveIndex = () => 'oak_sequences_test';

describe('searchSequences', () => {
  describe('retriever shape', () => {
    it('returns an RRF retriever with two sub-retrievers', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra' }, search, stubResolveIndex);

      const rrf = getFirstRequest(calls).retriever?.rrf;
      expect(rrf).toBeDefined();
      expect(rrf?.retrievers).toHaveLength(2);
      expect(rrf?.rank_window_size).toBe(40);
      expect(rrf?.rank_constant).toBe(40);
    });

    it('includes BM25 multi_match as the first RRF sub-retriever', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra' }, search, stubResolveIndex);

      const retrievers = getFirstRequest(calls).retriever?.rrf?.retrievers ?? [];
      const query = getStandard(retrievers[0])?.query;
      expect(getNestedJsonObject(isJsonObject(query) ? query : undefined, 'multi_match')).toMatchObject({
        query: 'algebra',
        fuzziness: 'AUTO',
        fields: ['sequence_title^2', 'category_titles', 'subject_title', 'phase_title'],
      });
    });

    it('includes ELSER semantic as the second RRF sub-retriever', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra' }, search, stubResolveIndex);

      const retrievers = getFirstRequest(calls).retriever?.rrf?.retrievers ?? [];
      const query = getStandard(retrievers[1])?.query;
      expect(getNestedJsonObject(isJsonObject(query) ? query : undefined, 'semantic')).toEqual({
        field: 'sequence_semantic',
        query: 'algebra',
      });
    });

    it('applies identical filter to both RRF sub-retrievers when filters are provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'maths', keyStage: 'ks3' }, search, stubResolveIndex);

      const request = getFirstRequest(calls);
      const retrievers = request.retriever?.rrf?.retrievers ?? [];
      expect(retrievers).toHaveLength(2);

      const expectedFilter = { bool: { filter: [{ term: { key_stages: 'ks3' } }] } };
      for (const entry of retrievers) {
        expect(getStandard(entry)?.filter).toEqual(expectedFilter);
      }
    });
  });

  describe('filter construction', () => {
    it('includes key_stages filter when keyStage is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'maths', keyStage: 'ks3' }, search, stubResolveIndex);

      const filterClause = extractFilter(calls);
      expect(filterClause).toEqual({
        bool: { filter: [{ term: { key_stages: 'ks3' } }] },
      });
    });

    it('includes subject_slug filter when subject is provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'algebra', subject: 'maths' }, search, stubResolveIndex);

      const filterClause = extractFilter(calls);
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

      const filterClause = extractFilter(calls);
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

      await searchSequences({ query: 'maths', category: 'algebra' }, search, stubResolveIndex);

      const filterClause = extractFilter(calls);
      expect(filterClause).toEqual({
        bool: { filter: [{ match_phrase: { category_titles: 'algebra' } }] },
      });
    });

    it('passes no filter when no filtering params provided', async () => {
      const { search, calls } = createMockSearch();

      await searchSequences({ query: 'geography' }, search, stubResolveIndex);

      const filterClause = extractFilter(calls);
      expect(filterClause).toBeUndefined();
    });

    it('logs resolved sequence filters for debugging', async () => {
      const { search } = createMockSearch();
      const logger = createLoggerMock();

      await searchSequences(
        {
          query: 'science',
          subject: 'science',
          keyStage: 'ks4',
          phaseSlug: 'secondary',
          category: 'Biology',
          size: 10,
        },
        search,
        stubResolveIndex,
        logger,
      );

      expect(logger.debug).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(
        'searchSequences',
        expect.objectContaining({
          query: 'science',
          size: 10,
          from: undefined,
          subject: 'science',
          keyStage: 'ks4',
          phaseSlug: 'secondary',
          category: 'Biology',
          hasFilter: true,
        }),
      );

      const loggedFilters = extractLoggedFilterEntries(logger);
      expect(loggedFilters).toHaveLength(4);
      expect(loggedFilters).toContainEqual({
        term: { subject_slug: 'science' },
      });
      expect(loggedFilters).toContainEqual({
        term: { phase_slug: 'secondary' },
      });
      expect(loggedFilters).toContainEqual({ term: { key_stages: 'ks4' } });
      expect(loggedFilters).toContainEqual({
        match_phrase: { category_titles: 'Biology' },
      });
    });

    it('logs the empty-filter branch for debugging', async () => {
      const { search } = createMockSearch();
      const logger = createLoggerMock();

      await searchSequences({ query: 'geography' }, search, stubResolveIndex, logger);

      expect(logger.debug).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(
        'searchSequences',
        expect.objectContaining({
          query: 'geography',
          size: 25,
          from: undefined,
          hasFilter: false,
          filterClause: undefined,
        }),
      );
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
