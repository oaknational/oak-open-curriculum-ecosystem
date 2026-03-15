/**
 * Integration tests for HybridDataSource.
 */

import { describe, it, expect, vi } from 'vitest';
import { createHybridDataSource, type HybridDataSource } from './hybrid-data-source.js';
import { processBulkFileBatch } from './hybrid-batch-processor.js';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from './oak-adapter';
import type { AdminError } from '@oaknational/oak-search-sdk/admin';
import { unwrap } from '@oaknational/result';

/** Unwrap a Result from createHybridDataSource, failing the test on error. */
async function createSourceOrFail(
  bulkFile: BulkDownloadFile,
  client: OakClient | null,
  config?: Parameters<typeof createHybridDataSource>[2],
): Promise<HybridDataSource> {
  const result = await createHybridDataSource(bulkFile, client, config);
  return unwrap(result);
}

// ============================================================================
// Mock Fixtures
// ============================================================================

const createMockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  lessonSlug: 'test-lesson',
  lessonTitle: 'Test Lesson',
  unitSlug: 'test-unit',
  unitTitle: 'Test Unit',
  subjectSlug: 'maths',
  subjectTitle: 'Maths',
  keyStageSlug: 'ks2',
  keyStageTitle: 'Key Stage 2',
  lessonKeywords: [],
  keyLearningPoints: [],
  misconceptionsAndCommonMistakes: [],
  pupilLessonOutcome: '',
  teacherTips: [],
  contentGuidance: null,
  supervisionLevel: null,
  downloadsavailable: true,
  ...overrides,
});

const createMockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  unitSlug: 'test-unit',
  unitTitle: 'Test Unit',
  threads: [],
  priorKnowledgeRequirements: [],
  nationalCurriculumContent: [],
  description: '',
  yearSlug: 'year-4',
  year: 4,
  keyStageSlug: 'ks2',
  unitLessons: [],
  ...overrides,
});

const createMockBulkFile = (overrides: Partial<BulkDownloadFile> = {}): BulkDownloadFile => ({
  sequenceSlug: 'maths-primary',
  subjectTitle: 'Maths',
  sequence: [createMockUnit()],
  lessons: [createMockLesson()],
  ...overrides,
});

const createMockClient = (): OakClient => ({
  getUnitsByKeyStageAndSubject: vi.fn(),
  getLessonTranscript: vi.fn(),
  getLessonSummary: vi.fn(),
  getUnitSummary: vi.fn(),
  getSubjectSequences: vi.fn().mockResolvedValue({ ok: true, value: [] }),
  getSequenceUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
  getAllThreads: vi.fn(),
  getThreadUnits: vi.fn(),
  getLessonsByKeyStageAndSubject: vi.fn(),
  getSubjectAssets: vi.fn(),
  rateLimitTracker: {
    getStatus: vi.fn().mockReturnValue({ remaining: 1000, total: 1000 }),
    getRequestCount: vi.fn().mockReturnValue(0),
    getRequestRate: vi.fn().mockReturnValue(0),
    reset: vi.fn(),
  },
  getCacheStats: vi.fn().mockReturnValue({
    hits: 0,
    misses: 0,
    sets: 0,
    size: 0,
    hitRate: 0,
    cacheEnabled: true,
    adapters: {},
  }),
  disconnect: vi.fn().mockResolvedValue(undefined),
});

// ============================================================================
// Tests: createHybridDataSource
// ============================================================================

describe('createHybridDataSource', () => {
  it('creates a hybrid data source from bulk file', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    expect(source.sequenceSlug).toBe('maths-primary');
    expect(source.subjectSlug).toBe('maths');
    expect(source.subjectTitle).toBe('Maths');
  });

  it('provides access to raw units and lessons', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    expect(source.getUnits()).toHaveLength(1);
    expect(source.getLessons()).toHaveLength(1);
  });

  it('transforms lessons to ES documents', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    const docs = source.transformLessonsToES();

    expect(docs).toHaveLength(1);
    expect(docs[0].lesson_slug).toBe('test-lesson');
    expect(docs[0].doc_type).toBe('lesson');
  });

  it('transforms units to ES documents', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    const docs = source.transformUnitsToES();

    expect(docs).toHaveLength(1);
    expect(docs[0].unit_slug).toBe('test-unit');
    expect(docs[0].doc_type).toBe('unit');
  });

  it('generates bulk operations including rollups', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    const ops = source.toBulkOperations('oak_lessons', 'oak_units', 'oak_unit_rollup');

    // 1 lesson + 1 unit + 1 rollup, each with index action + doc = 6 operations
    expect(ops.length).toBe(6);

    const targetIndexes = ops.flatMap((entry): readonly string[] => {
      if (typeof entry !== 'object' || entry === null || !('index' in entry)) {
        return [];
      }
      const indexAction = entry.index;
      if (typeof indexAction !== 'object' || indexAction === null || !('_index' in indexAction)) {
        return [];
      }
      const indexName = indexAction._index;
      return typeof indexName === 'string' ? [indexName] : [];
    });

    expect(targetIndexes).toHaveLength(3);
    expect(targetIndexes).toEqual(['oak_lessons', 'oak_units', 'oak_unit_rollup']);
  });

  it('provides processing stats including rollup count', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    const stats = source.getStats();

    expect(stats.lessonCount).toBe(1);
    expect(stats.unitCount).toBe(1);
    expect(stats.rollupCount).toBe(1);
    expect(stats.ks4LessonsEnriched).toBe(0); // No KS4 lessons in mock
    expect(stats.ks4UnitsEnriched).toBe(0);
  });

  it('works without API client', async () => {
    const bulkFile = createMockBulkFile();
    const source = await createSourceOrFail(bulkFile, null);

    expect(source.transformLessonsToES()).toHaveLength(1);
  });
});

// ============================================================================
// Tests: KS4 Enrichment
// ============================================================================

describe('HybridDataSource KS4 enrichment', () => {
  it('enriches KS4 lessons when client and context available', async () => {
    const ks4Lesson = createMockLesson({
      lessonSlug: 'ks4-lesson',
      keyStageSlug: 'ks4',
      keyStageTitle: 'Key Stage 4',
      unitSlug: 'algebra-higher',
    });
    const ks4Unit = createMockUnit({
      unitSlug: 'algebra-higher',
      keyStageSlug: 'ks4',
    });
    const bulkFile = createMockBulkFile({
      sequenceSlug: 'maths-secondary',
      sequence: [ks4Unit],
      lessons: [ks4Lesson],
    });

    const client = createMockClient();
    // Mock sequence with tiers
    vi.mocked(client.getSubjectSequences).mockResolvedValue({
      ok: true,
      value: [
        {
          sequenceSlug: 'maths-secondary',
          ks4Options: null,
          years: [10, 11],
          keyStages: [{ keyStageSlug: 'ks4', keyStageTitle: 'Key Stage 4' }],
          phaseSlug: 'secondary',
          phaseTitle: 'Secondary',
        },
      ],
    });
    vi.mocked(client.getSequenceUnits).mockResolvedValue({
      ok: true,
      value: [
        {
          year: 10,
          tiers: [
            {
              tierSlug: 'higher',
              tierTitle: 'Higher',
              units: [{ unitSlug: 'algebra-higher' }],
            },
          ],
        },
      ],
    });

    const source = await createSourceOrFail(bulkFile, client);
    const docs = source.transformLessonsToES();

    expect(docs[0].tiers).toEqual(['higher']);
    expect(docs[0].tier_titles).toEqual(['Higher']);
  });

  it('skips enrichment when disabled via config', async () => {
    const ks4Lesson = createMockLesson({ keyStageSlug: 'ks4' });
    const ks4Unit = createMockUnit({ unitSlug: 'algebra', keyStageSlug: 'ks4' });
    const bulkFile = createMockBulkFile({
      sequenceSlug: 'maths-secondary',
      sequence: [ks4Unit],
      lessons: [ks4Lesson],
    });

    const client = createMockClient();
    const source = await createSourceOrFail(bulkFile, client, {
      enableKs4Supplementation: false,
    });

    const docs = source.transformLessonsToES();

    expect(docs[0].tiers).toBeUndefined();
    // Client should not be called
    expect(client.getSubjectSequences).not.toHaveBeenCalled();
  });

  it('skips enrichment for non-KS4 content', async () => {
    const ks2Lesson = createMockLesson({ keyStageSlug: 'ks2' });
    const bulkFile = createMockBulkFile({
      lessons: [ks2Lesson],
    });

    const client = createMockClient();
    const source = await createSourceOrFail(bulkFile, client);

    const docs = source.transformLessonsToES();

    expect(docs[0].tiers).toBeUndefined();
  });
});

// ============================================================================
// Tests: data_source_error on API failure
// ============================================================================

describe('createHybridDataSource error handling', () => {
  it('returns data_source_error when KS4 API supplementation throws', async () => {
    const ks4Lesson = createMockLesson({
      keyStageSlug: 'ks4',
      unitSlug: 'algebra-higher',
    });
    const ks4Unit = createMockUnit({
      unitSlug: 'algebra-higher',
      keyStageSlug: 'ks4',
    });
    const bulkFile = createMockBulkFile({
      sequenceSlug: 'maths-secondary',
      sequence: [ks4Unit],
      lessons: [ks4Lesson],
    });

    const client = createMockClient();
    // Simulate a network error during KS4 supplementation
    vi.mocked(client.getSubjectSequences).mockRejectedValue(
      new Error('Network timeout: ECONNREFUSED'),
    );

    const result = await createHybridDataSource(bulkFile, client);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      const error: AdminError = result.error;
      expect(error.type).toBe('data_source_error');
      expect(error.message).toContain('maths-secondary');
      expect(error.message).toContain('Network timeout');
    }
  });

  it('returns ok result on successful creation', async () => {
    const bulkFile = createMockBulkFile();

    const result = await createHybridDataSource(bulkFile, null);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.sequenceSlug).toBe('maths-primary');
      expect(result.value.subjectSlug).toBe('maths');
    }
  });
});

// ============================================================================
// Tests: processBulkFileBatch
// ============================================================================

describe('processBulkFileBatch', () => {
  it('processes multiple bulk files including rollups', async () => {
    const file1 = createMockBulkFile({
      sequenceSlug: 'maths-primary',
      lessons: [createMockLesson({ lessonSlug: 'lesson-1' })],
    });
    const file2 = createMockBulkFile({
      sequenceSlug: 'english-primary',
      subjectTitle: 'English',
      lessons: [createMockLesson({ lessonSlug: 'lesson-2', subjectSlug: 'english' })],
    });

    const batchResult = await processBulkFileBatch(
      [file1, file2],
      null,
      'oak_lessons',
      'oak_units',
      'oak_unit_rollup',
    );
    const result = unwrap(batchResult);

    expect(result.sources).toHaveLength(2);
    expect(result.stats.lessonCount).toBe(2);
    expect(result.stats.unitCount).toBe(2);
    expect(result.stats.rollupCount).toBe(2);
  });

  it('aggregates statistics across files including rollups', async () => {
    const file1 = createMockBulkFile({
      lessons: [createMockLesson(), createMockLesson({ lessonSlug: 'l2' })],
      sequence: [createMockUnit()],
    });
    const file2 = createMockBulkFile({
      sequenceSlug: 'english-primary',
      lessons: [createMockLesson({ lessonSlug: 'l3', subjectSlug: 'english' })],
      sequence: [createMockUnit({ unitSlug: 'u2' }), createMockUnit({ unitSlug: 'u3' })],
    });

    const batchResult = await processBulkFileBatch(
      [file1, file2],
      null,
      'oak_lessons',
      'oak_units',
      'oak_unit_rollup',
    );
    const result = unwrap(batchResult);

    expect(result.stats.lessonCount).toBe(3);
    expect(result.stats.unitCount).toBe(3);
    expect(result.stats.rollupCount).toBe(3);
  });

  it('returns data_source_error when one file fails during batch processing', async () => {
    const safeFile = createMockBulkFile({
      sequenceSlug: 'maths-primary',
      lessons: [createMockLesson({ keyStageSlug: 'ks2' })],
    });
    const failingFile = createMockBulkFile({
      sequenceSlug: 'maths-secondary',
      sequence: [createMockUnit({ unitSlug: 'algebra-higher', keyStageSlug: 'ks4' })],
      lessons: [createMockLesson({ keyStageSlug: 'ks4', unitSlug: 'algebra-higher' })],
    });
    const client = createMockClient();
    vi.mocked(client.getSubjectSequences).mockRejectedValue(new Error('Injected batch failure'));

    const result = await processBulkFileBatch(
      [safeFile, failingFile],
      client,
      'oak_lessons',
      'oak_units',
      'oak_unit_rollup',
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('data_source_error');
      expect(result.error.message).toContain('Injected batch failure');
    }
  });
});
