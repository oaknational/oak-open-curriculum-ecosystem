import { describe, expect, it, vi } from 'vitest';
import type { BulkDownloadFile, BulkFileResult } from '@oaknational/sdk-codegen/bulk';
import { ok } from '@oaknational/result';
import type { CategoryMap } from '../../adapters/category-supplementation';
import type { SearchIndexKind } from '../search-index-target';
import { createMockClient } from '../../test-helpers/mock-oak-client';
import { prepareBulkIngestion, type BulkIngestionDeps } from './bulk-ingestion';

function createBulkFileResult(sequenceSlug: string, subjectTitle: string): BulkFileResult {
  const bulkFile: BulkDownloadFile = {
    sequenceSlug,
    subjectTitle,
    lessons: [],
    sequence: [],
  };
  return {
    filename: `${sequenceSlug}.json`,
    subjectPhase: { subject: 'maths', phase: 'primary' },
    data: bulkFile,
  };
}

/** Captured arguments from `collectPhaseResults` for assertion. */
interface CollectCalls {
  filteredFiles?: readonly BulkFileResult[];
  indexes?: readonly SearchIndexKind[];
  categoryMap?: CategoryMap;
}

function createDeps(
  files: readonly BulkFileResult[],
  collectCalls: CollectCalls,
  fakeCategoryMap: CategoryMap = new Map(),
): BulkIngestionDeps {
  return {
    readAllBulkFiles: vi.fn().mockResolvedValue(files),
    fetchCategoryMapForSequences: vi.fn().mockResolvedValue(ok(fakeCategoryMap)),
    collectPhaseResults: vi
      .fn<BulkIngestionDeps['collectPhaseResults']>()
      .mockImplementation(
        async (filteredFiles, _bulkDownloadFiles, _client, indexes, _resolveIndex, categoryMap) => {
          collectCalls.filteredFiles = filteredFiles;
          collectCalls.indexes = indexes;
          collectCalls.categoryMap = categoryMap;
          return {
            operations: [{ index: { _index: 'oak_lessons', _id: 'lesson-1' } }],
            processingResult: { operations: [], totalLessons: 1, totalUnits: 1, totalRollups: 1 },
            threadCount: 0,
            sequenceResult: { operations: [], sequenceCount: 0, facetCount: 0 },
            vocabStats: {
              filesProcessed: 1,
              totalLessons: 1,
              totalUnits: 1,
              uniqueKeywords: 0,
              totalMisconceptions: 0,
              totalLearningPoints: 0,
              totalTeacherTips: 0,
              totalPriorKnowledge: 0,
              totalNCStatements: 0,
              uniqueThreads: 0,
              synonymsExtracted: 0,
            },
          };
        },
      ),
  };
}

describe('prepareBulkIngestion', () => {
  it('filters files by subject before phase collection', async () => {
    const files = [
      createBulkFileResult('maths-primary', 'Maths'),
      createBulkFileResult('english-primary', 'English'),
    ];
    const collectCalls: CollectCalls = {};
    const deps = createDeps(files, collectCalls);

    await prepareBulkIngestion(
      {
        bulkDir: '/tmp/bulk',
        client: createMockClient(),
        subjectFilter: ['maths'],
      },
      deps,
    );

    expect(collectCalls.filteredFiles).toHaveLength(1);
    expect(collectCalls.filteredFiles?.[0]?.data.sequenceSlug).toBe('maths-primary');
  });

  it('passes index filters through to phase collection', async () => {
    const files = [createBulkFileResult('maths-primary', 'Maths')];
    const collectCalls: CollectCalls = {};
    const deps = createDeps(files, collectCalls);

    await prepareBulkIngestion(
      {
        bulkDir: '/tmp/bulk',
        client: createMockClient(),
        indexes: ['lessons'],
      },
      deps,
    );

    expect(collectCalls.indexes).toEqual(['lessons']);
  });

  it('returns operations and computed stats from phase results', async () => {
    const files = [createBulkFileResult('maths-primary', 'Maths')];
    const deps = createDeps(files, {});

    const result = await prepareBulkIngestion(
      {
        bulkDir: '/tmp/bulk',
        client: createMockClient(),
      },
      deps,
    );

    expect(result.operations).toHaveLength(1);
    expect(result.stats.filesProcessed).toBe(1);
    expect(result.stats.lessonsIndexed).toBe(1);
    expect(result.stats.unitsIndexed).toBe(1);
    expect(result.stats.threadsIndexed).toBe(0);
  });

  it('fetches categoryMap for sequence slugs and forwards it to phase collection', async () => {
    const files = [
      createBulkFileResult('maths-primary', 'Maths'),
      createBulkFileResult('english-primary', 'English'),
    ];
    const fakeCategoryMap: CategoryMap = new Map([
      ['fractions-year-3', [{ title: 'Number', slug: 'number' }]],
    ]);
    const collectCalls: CollectCalls = {};
    const deps = createDeps(files, collectCalls, fakeCategoryMap);

    await prepareBulkIngestion({ bulkDir: '/tmp/bulk', client: createMockClient() }, deps);

    // fetchCategoryMapForSequences receives the correct sequence slugs
    expect(deps.fetchCategoryMapForSequences).toHaveBeenCalledWith(expect.anything(), [
      'maths-primary',
      'english-primary',
    ]);
    // The returned categoryMap is forwarded to collectPhaseResults
    expect(collectCalls.categoryMap).toBe(fakeCategoryMap);
  });
});
