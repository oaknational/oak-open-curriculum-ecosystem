import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HybridSearchResult, StructuredQuery } from './types';

const runLessonsSearch = vi.hoisted(() =>
  vi.fn<
    (
      query: StructuredQuery,
      size: number,
      from: number,
      highlight: boolean,
    ) => Promise<HybridSearchResult>
  >(),
);
const runUnitsSearch = vi.hoisted(() =>
  vi.fn<
    (
      query: StructuredQuery,
      size: number,
      from: number,
      highlight: boolean,
    ) => Promise<HybridSearchResult>
  >(),
);
const runSequencesSearch = vi.hoisted(() =>
  vi.fn<(query: StructuredQuery, size: number, from: number) => Promise<HybridSearchResult>>(),
);
const fetchSequenceFacets = vi.hoisted(() =>
  vi.fn<
    (params: {
      subject?: StructuredQuery['subject'];
      keyStage?: StructuredQuery['keyStage'];
    }) => Promise<{ sequences: unknown[] }>
  >(),
);

vi.mock('./lessons', () => ({
  runLessonsSearch: runLessonsSearch,
}));
vi.mock('./units', () => ({
  runUnitsSearch: runUnitsSearch,
}));
vi.mock('./sequences', () => ({
  runSequencesSearch: runSequencesSearch,
}));
vi.mock('./sequence-facets', () => ({
  fetchSequenceFacets: fetchSequenceFacets,
}));

import { runHybridSearch } from './index';

describe('runHybridSearch', () => {
  beforeEach(() => {
    runLessonsSearch.mockReset();
    runUnitsSearch.mockReset();
    runSequencesSearch.mockReset();
    fetchSequenceFacets.mockReset();

    runLessonsSearch.mockResolvedValue({
      scope: 'lessons',
      results: [],
      total: 0,
      took: 10,
      timedOut: false,
    });
    runUnitsSearch.mockResolvedValue({
      scope: 'units',
      results: [],
      total: 0,
      took: 11,
      timedOut: false,
    });
    runSequencesSearch.mockResolvedValue({
      scope: 'sequences',
      results: [],
      total: 0,
      took: 12,
      timedOut: false,
    });
    fetchSequenceFacets.mockResolvedValue({ sequences: [] });
  });

  it('executes scope-specific searches with normalised pagination', async () => {
    const result = await runHybridSearch({
      scope: 'units',
      text: 'fractions',
      size: 150,
      from: -5,
    });

    expect(runUnitsSearch).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'units', text: 'fractions' }),
      100,
      0,
      true,
    );
    expect(result).toMatchObject({ scope: 'units', took: 11, total: 0 });
    expect(fetchSequenceFacets).not.toHaveBeenCalled();
  });

  it('returns base result when facets are not requested', async () => {
    const result = await runHybridSearch({
      scope: 'lessons',
      text: 'fractions',
      includeFacets: false,
    });

    expect(runLessonsSearch).toHaveBeenCalledWith(
      expect.objectContaining({ scope: 'lessons', text: 'fractions' }),
      25,
      0,
      true,
    );
    expect(result).not.toHaveProperty('facets');
    expect(fetchSequenceFacets).not.toHaveBeenCalled();
  });

  it('enriches the result with sequence facets when requested', async () => {
    fetchSequenceFacets.mockResolvedValueOnce({ sequences: [{ sequenceSlug: 's1' }] });

    const result = await runHybridSearch({
      scope: 'lessons',
      text: 'fractions',
      subject: 'maths',
      keyStage: 'ks2',
      includeFacets: true,
    });

    expect(fetchSequenceFacets).toHaveBeenCalledWith({ subject: 'maths', keyStage: 'ks2' });
    expect(result).toMatchObject({
      scope: 'lessons',
      facets: { sequences: [{ sequenceSlug: 's1' }] },
    });
  });
});
