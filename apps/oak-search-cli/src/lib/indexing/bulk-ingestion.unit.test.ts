import { describe, expect, it, vi } from 'vitest';
import type { BulkDownloadFile, BulkFileResult } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from '../../adapters/oak-adapter';
import type { SearchIndexKind } from '../search-index-target';
import { prepareBulkIngestion, type BulkIngestionDeps } from './bulk-ingestion';

function createMockClient(): OakClient {
  return {
    getSubjectSequences: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getSequenceUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getUnitsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonTranscript: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getLessonsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getUnitSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getAllThreads: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getThreadUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getSubjectAssets: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    rateLimitTracker: {
      getStatus: () => ({
        limit: 1000,
        remaining: 1000,
        reset: Date.now(),
        resetDate: new Date(),
        lastChecked: new Date(),
      }),
      getRequestCount: () => 0,
      getRequestRate: () => 0,
      reset: vi.fn(),
    },
    getCacheStats: vi.fn().mockReturnValue({
      hits: 0,
      misses: 0,
      connected: false,
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
}

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

function createDeps(
  files: readonly BulkFileResult[],
  collectCalls: {
    filteredFiles?: readonly BulkFileResult[];
    indexes?: readonly SearchIndexKind[];
  },
): BulkIngestionDeps {
  return {
    readAllBulkFiles: vi.fn().mockResolvedValue(files),
    collectPhaseResults: vi
      .fn<BulkIngestionDeps['collectPhaseResults']>()
      .mockImplementation(async (filteredFiles, _bulkFiles, _client, indexes) => {
        collectCalls.filteredFiles = filteredFiles;
        collectCalls.indexes = indexes;
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
      }),
  };
}

describe('prepareBulkIngestion', () => {
  it('filters files by subject before phase collection', async () => {
    const files = [
      createBulkFileResult('maths-primary', 'Maths'),
      createBulkFileResult('english-primary', 'English'),
    ];
    const collectCalls: { filteredFiles?: readonly BulkFileResult[] } = {};
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
    const collectCalls: { indexes?: readonly SearchIndexKind[] } = {};
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
});
