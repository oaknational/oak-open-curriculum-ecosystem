/**
 * Integration tests for search CLI handlers.
 *
 * Each handler receives an SDK retrieval service (mocked) and
 * validated parameters, returning structured results.
 */

import { describe, it, expect, vi } from 'vitest';
import type { RetrievalService } from '@oaknational/oak-search-sdk';
import {
  handleSearchLessons,
  handleSearchUnits,
  handleSearchSequences,
  handleSuggest,
  handleFetchFacets,
} from './handlers.js';

/** Create a mock retrieval service with vi.fn() for all methods. */
function createMockRetrieval(): RetrievalService {
  return {
    searchLessons: vi.fn().mockResolvedValue({
      scope: 'lessons',
      results: [],
      total: 0,
      took: 1,
      timedOut: false,
    }),
    searchUnits: vi.fn().mockResolvedValue({
      scope: 'units',
      results: [],
      total: 0,
      took: 1,
      timedOut: false,
    }),
    searchSequences: vi.fn().mockResolvedValue({
      scope: 'sequences',
      results: [],
      total: 0,
      took: 1,
      timedOut: false,
    }),
    suggest: vi.fn().mockResolvedValue({
      suggestions: [],
      cache: { version: 'v1', ttlSeconds: 300 },
    }),
    fetchSequenceFacets: vi.fn().mockResolvedValue({}),
  };
}

describe('handleSearchLessons', () => {
  it('passes text and optional filters to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleSearchLessons(retrieval, {
      text: 'expanding brackets',
      subject: 'maths',
      keyStage: 'ks3',
      size: 10,
    });

    expect(retrieval.searchLessons).toHaveBeenCalledWith({
      text: 'expanding brackets',
      subject: 'maths',
      keyStage: 'ks3',
      size: 10,
    });
  });

  it('returns the search result from the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    const result = await handleSearchLessons(retrieval, { text: 'fractions' });

    expect(result).toEqual({
      scope: 'lessons',
      results: [],
      total: 0,
      took: 1,
      timedOut: false,
    });
  });
});

describe('handleSearchUnits', () => {
  it('passes text and optional filters to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleSearchUnits(retrieval, {
      text: 'algebra',
      subject: 'maths',
      keyStage: 'ks4',
    });

    expect(retrieval.searchUnits).toHaveBeenCalledWith({
      text: 'algebra',
      subject: 'maths',
      keyStage: 'ks4',
    });
  });
});

describe('handleSearchSequences', () => {
  it('passes text and optional filters to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleSearchSequences(retrieval, {
      text: 'secondary science',
      size: 5,
    });

    expect(retrieval.searchSequences).toHaveBeenCalledWith({
      text: 'secondary science',
      size: 5,
    });
  });
});

describe('handleSuggest', () => {
  it('passes prefix and scope to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleSuggest(retrieval, {
      prefix: 'frac',
      scope: 'lessons',
    });

    expect(retrieval.suggest).toHaveBeenCalledWith({
      prefix: 'frac',
      scope: 'lessons',
    });
  });
});

describe('handleFetchFacets', () => {
  it('passes optional filters to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleFetchFacets(retrieval, {
      subject: 'maths',
      keyStage: 'ks3',
    });

    expect(retrieval.fetchSequenceFacets).toHaveBeenCalledWith({
      subject: 'maths',
      keyStage: 'ks3',
    });
  });

  it('calls with empty params when no filters provided', async () => {
    const retrieval = createMockRetrieval();

    await handleFetchFacets(retrieval, {});

    expect(retrieval.fetchSequenceFacets).toHaveBeenCalledWith({});
  });
});
