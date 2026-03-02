/**
 * Integration tests for search CLI handlers.
 *
 * Each handler receives an SDK retrieval service (mocked) and
 * validated parameters, returning Result-wrapped results.
 */

import { describe, it, expect, vi } from 'vitest';
import type { RetrievalService } from '@oaknational/oak-search-sdk';
import { ok } from '@oaknational/result';
import {
  handleSearchLessons,
  handleSearchUnits,
  handleSearchSequences,
  handleSearchThreads,
  handleSuggest,
  handleFetchFacets,
} from './handlers.js';

/** Create a mock retrieval service returning ok() Results for all methods. */
function createMockRetrieval(): RetrievalService {
  return {
    searchLessons: vi.fn().mockResolvedValue(
      ok({
        scope: 'lessons',
        results: [],
        total: 0,
        took: 1,
        timedOut: false,
      }),
    ),
    searchUnits: vi.fn().mockResolvedValue(
      ok({
        scope: 'units',
        results: [],
        total: 0,
        took: 1,
        timedOut: false,
      }),
    ),
    searchSequences: vi.fn().mockResolvedValue(
      ok({
        scope: 'sequences',
        results: [],
        total: 0,
        took: 1,
        timedOut: false,
      }),
    ),
    searchThreads: vi.fn().mockResolvedValue(
      ok({
        scope: 'threads',
        results: [],
        total: 0,
        took: 1,
        timedOut: false,
      }),
    ),
    suggest: vi.fn().mockResolvedValue(
      ok({
        suggestions: [],
        cache: { version: 'v1', ttlSeconds: 300 },
      }),
    ),
    fetchSequenceFacets: vi.fn().mockResolvedValue(ok({})),
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

  it('returns ok with the search result from the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    const result = await handleSearchLessons(retrieval, { text: 'fractions' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        scope: 'lessons',
        results: [],
        total: 0,
        took: 1,
        timedOut: false,
      });
    }
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

describe('handleSearchThreads', () => {
  it('passes text and optional filters to the retrieval service', async () => {
    const retrieval = createMockRetrieval();

    await handleSearchThreads(retrieval, {
      text: 'algebra equations progression',
      subject: 'maths',
    });

    expect(retrieval.searchThreads).toHaveBeenCalledWith({
      text: 'algebra equations progression',
      subject: 'maths',
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
