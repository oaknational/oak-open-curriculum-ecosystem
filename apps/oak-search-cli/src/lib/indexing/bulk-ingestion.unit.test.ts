/**
 * Unit tests for bulk-ingestion module.
 *
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BulkDownloadFile, BulkFileResult, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from '../../adapters/oak-adapter';
import type { HybridDataSource } from '../../adapters/hybrid-data-source';
import type { VocabularyMiningAdapter } from '../../adapters/vocabulary-mining-adapter';
import type { BulkIngestionOptions, BulkIngestionStats } from './bulk-ingestion';

// Mock the dependencies
vi.mock('@oaknational/sdk-codegen/bulk', () => ({
  readAllBulkFiles: vi.fn(),
}));

vi.mock('../../adapters/hybrid-data-source', () => ({
  createHybridDataSource: vi.fn(),
}));

vi.mock('../../adapters/vocabulary-mining-adapter', () => ({
  createVocabularyMiningAdapter: vi.fn(),
}));

vi.mock('../../adapters/bulk-thread-transformer', () => ({
  extractThreadsFromBulkFiles: vi.fn(),
  buildThreadBulkOperations: vi.fn(),
}));

vi.mock('../../adapters/bulk-sequence-transformer', () => ({
  buildSequenceBulkOperations: vi.fn(),
}));

vi.mock('../logger', () => ({
  ingestLogger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('bulk-ingestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('prepareBulkIngestion', () => {
    it('processes bulk files and returns operations with stats including threads', async () => {
      // Arrange - setup mocks via helper
      const { mockClient } = await setupMocksWithThreads();
      const options: BulkIngestionOptions = { bulkDir: '/path/to/bulk', client: mockClient };

      // Act
      const { prepareBulkIngestion } = await import('./bulk-ingestion');
      const result = await prepareBulkIngestion(options);

      // Assert - verify stats and operations
      assertBulkIngestionStats(result.stats, {
        files: 1,
        lessons: 2,
        units: 1,
        threads: 2,
        sequences: 1,
        facets: 1,
        keywords: 10,
        misconceptions: 5,
        synonyms: 3,
      });
      // 6 lesson/unit + 4 thread + 4 sequence operations (1 sequence + 1 facet × 2 entries each)
      expect(result.operations.length).toBe(14);
    });

    it('filters by subject when subjectFilter is provided', async () => {
      const mathsFile = createMockBulkFile('maths-primary', 'Maths');
      const englishFile = createMockBulkFile('english-primary', 'English');
      const mathsFileResult = createMockBulkFileResult(mathsFile);
      const englishFileResult = createMockBulkFileResult(englishFile);
      await setupSubjectFilterMocks(mathsFile, mathsFileResult, englishFileResult);
      const { createHybridDataSource } = await import('../../adapters/hybrid-data-source');
      const mockClient = createMockClient();
      const options: BulkIngestionOptions = {
        bulkDir: '/path/to/bulk',
        client: mockClient,
        subjectFilter: ['maths'],
      };
      const { prepareBulkIngestion } = await import('./bulk-ingestion');
      const result = await prepareBulkIngestion(options);
      expect(result.stats.filesProcessed).toBe(1);
      expect(createHybridDataSource).toHaveBeenCalledTimes(1);
      expect(createHybridDataSource).toHaveBeenCalledWith(mathsFile, mockClient);
    });

    it('handles empty bulk directory', async () => {
      // Arrange
      const { readAllBulkFiles } = await import('@oaknational/sdk-codegen/bulk');
      const { createVocabularyMiningAdapter } =
        await import('../../adapters/vocabulary-mining-adapter');
      const { extractThreadsFromBulkFiles, buildThreadBulkOperations } =
        await import('../../adapters/bulk-thread-transformer');
      const { buildSequenceBulkOperations } =
        await import('../../adapters/bulk-sequence-transformer');

      vi.mocked(readAllBulkFiles).mockResolvedValue([]);
      vi.mocked(createVocabularyMiningAdapter).mockReturnValue(
        createMockVocabularyAdapter(0, 0, 0),
      );
      vi.mocked(extractThreadsFromBulkFiles).mockReturnValue([]);
      vi.mocked(buildThreadBulkOperations).mockReturnValue([]);
      vi.mocked(buildSequenceBulkOperations).mockReturnValue([]);

      const mockClient = createMockClient();
      const options: BulkIngestionOptions = {
        bulkDir: '/empty/path',
        client: mockClient,
      };

      // Act
      const { prepareBulkIngestion } = await import('./bulk-ingestion');
      const result = await prepareBulkIngestion(options);

      // Assert
      expect(result.stats.filesProcessed).toBe(0);
      expect(result.stats.lessonsIndexed).toBe(0);
      expect(result.stats.unitsIndexed).toBe(0);
      expect(result.stats.threadsIndexed).toBe(0);
      expect(result.stats.sequencesIndexed).toBe(0);
      expect(result.stats.sequenceFacetsIndexed).toBe(0);
      expect(result.operations.length).toBe(0);
    });
  });
});

// ============================================================================
// Test Helpers
// ============================================================================

function createMockLesson(lessonSlug: string, unitSlug: string): Lesson {
  return {
    lessonSlug,
    lessonTitle: `Lesson ${lessonSlug}`,
    unitSlug,
    unitTitle: `Unit ${unitSlug}`,
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [],
    misconceptionsAndCommonMistakes: [],
    keyLearningPoints: [],
    teacherTips: [],
    pupilLessonOutcome: '',
    contentGuidance: null,
    supervisionLevel: null,
    downloadsavailable: true,
  };
}

function createMockUnit(unitSlug: string): Unit {
  return {
    unitSlug,
    unitTitle: `Unit ${unitSlug}`,
    year: 3,
    yearSlug: 'year-3',
    keyStageSlug: 'ks2',
    unitLessons: [],
    threads: [],
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: `Description for ${unitSlug}`,
  };
}

function createMockBulkFile(sequenceSlug: string, subjectTitle: string): BulkDownloadFile {
  return {
    sequenceSlug,
    subjectTitle,
    lessons: [createMockLesson('lesson-1', 'unit-1'), createMockLesson('lesson-2', 'unit-1')],
    sequence: [createMockUnit('unit-1')],
  };
}

function createMockBulkFileResult(bulkFile: BulkDownloadFile): BulkFileResult {
  const [subject, phasePart] = bulkFile.sequenceSlug.split('-');
  const phase: 'primary' | 'secondary' = phasePart === 'secondary' ? 'secondary' : 'primary';
  return {
    filename: `${bulkFile.sequenceSlug}.json`,
    subjectPhase: { subject: subject ?? 'unknown', phase },
    data: bulkFile,
  };
}

function createMockHybridDataSource(
  bulkFile: BulkDownloadFile,
  lessonCount: number,
  unitCount: number,
  operationCount: number,
): HybridDataSource {
  return {
    sequenceSlug: bulkFile.sequenceSlug,
    subjectSlug: 'maths',
    subjectTitle: bulkFile.subjectTitle,
    getLessons: () => bulkFile.lessons,
    getUnits: () => bulkFile.sequence,
    transformLessonsToES: () => [],
    transformUnitsToES: () => [],
    transformUnitsToRollupDocs: () => [],
    toBulkOperations: () => {
      // Create minimal valid operations for the count
      return Array.from({ length: operationCount }, (_, i) => ({
        index: { _index: 'test', _id: `op-${i}` },
      }));
    },
    getStats: () => ({
      lessonCount,
      unitCount,
      rollupCount: unitCount,
      ks4LessonsEnriched: 0,
      ks4UnitsEnriched: 0,
    }),
  };
}

function createMockVocabularyAdapter(
  uniqueKeywords: number,
  totalMisconceptions: number,
  synonymsExtracted: number,
): VocabularyMiningAdapter {
  return {
    getVocabularyResult: () => ({
      stats: {
        uniqueKeywords,
        totalMisconceptions,
        totalLearningPoints: 20,
        totalTeacherTips: 8,
        totalPriorKnowledge: 3,
        totalNCStatements: 15,
        uniqueThreads: 2,
      },
      extractedData: {
        keywords: [],
        misconceptions: [],
        learningPoints: [],
        teacherTips: [],
        priorKnowledge: [],
        ncStatements: [],
        threads: [],
      },
    }),
    getMinedSynonyms: () => ({
      version: '1.0.0',
      generatedAt: '2025-01-01T00:00:00.000Z',
      synonyms: [],
      stats: {
        synonymsExtracted,
        totalKeywordsProcessed: uniqueKeywords,
        patternCounts: {},
      },
    }),
    getStats: () => ({
      filesProcessed: 1,
      totalLessons: 2,
      totalUnits: 1,
      uniqueKeywords,
      totalMisconceptions,
      totalLearningPoints: 20,
      totalTeacherTips: 8,
      totalPriorKnowledge: 3,
      totalNCStatements: 15,
      uniqueThreads: 2,
      synonymsExtracted,
    }),
  };
}

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

// ============================================================================
// Composite Test Setup Helpers
// ============================================================================

interface MockSetupResult {
  mockBulkFile: BulkDownloadFile;
  mockClient: OakClient;
}

async function setupSubjectFilterMocks(
  mathsFile: BulkDownloadFile,
  mathsFileResult: BulkFileResult,
  englishFileResult: BulkFileResult,
): Promise<void> {
  const { readAllBulkFiles } = await import('@oaknational/sdk-codegen/bulk');
  const { createHybridDataSource } = await import('../../adapters/hybrid-data-source');
  const { createVocabularyMiningAdapter } =
    await import('../../adapters/vocabulary-mining-adapter');
  const { extractThreadsFromBulkFiles, buildThreadBulkOperations } =
    await import('../../adapters/bulk-thread-transformer');
  const { buildSequenceBulkOperations } = await import('../../adapters/bulk-sequence-transformer');
  vi.mocked(readAllBulkFiles).mockResolvedValue([mathsFileResult, englishFileResult]);
  vi.mocked(createHybridDataSource).mockResolvedValue(
    createMockHybridDataSource(mathsFile, 1, 1, 2),
  );
  vi.mocked(createVocabularyMiningAdapter).mockReturnValue(createMockVocabularyAdapter(5, 2, 1));
  vi.mocked(extractThreadsFromBulkFiles).mockReturnValue([]);
  vi.mocked(buildThreadBulkOperations).mockReturnValue([]);
  vi.mocked(buildSequenceBulkOperations).mockReturnValue([]);
}

async function setupMocksWithThreads(): Promise<MockSetupResult> {
  const mockBulkFile = createMockBulkFile('maths-primary', 'Maths');
  const mockBulkFileResult = createMockBulkFileResult(mockBulkFile);

  const { readAllBulkFiles } = await import('@oaknational/sdk-codegen/bulk');
  const { createHybridDataSource } = await import('../../adapters/hybrid-data-source');
  const { createVocabularyMiningAdapter } =
    await import('../../adapters/vocabulary-mining-adapter');
  const { extractThreadsFromBulkFiles, buildThreadBulkOperations } =
    await import('../../adapters/bulk-thread-transformer');
  const { buildSequenceBulkOperations } = await import('../../adapters/bulk-sequence-transformer');

  vi.mocked(readAllBulkFiles).mockResolvedValue([mockBulkFileResult]);
  vi.mocked(createHybridDataSource).mockResolvedValue(
    createMockHybridDataSource(mockBulkFile, 2, 1, 6),
  );
  vi.mocked(createVocabularyMiningAdapter).mockReturnValue(createMockVocabularyAdapter(10, 5, 3));

  const mockThreads = [
    { slug: 'number', title: 'Number', unitCount: 2, subjectSlugs: ['maths'] },
    { slug: 'algebra', title: 'Algebra', unitCount: 1, subjectSlugs: ['maths'] },
  ];
  vi.mocked(extractThreadsFromBulkFiles).mockReturnValue(mockThreads);
  vi.mocked(buildThreadBulkOperations).mockReturnValue([
    { index: { _index: 'oak_threads', _id: 'number' } },
    {
      thread_slug: 'number',
      thread_title: 'Number',
      unit_count: 2,
    },
    { index: { _index: 'oak_threads', _id: 'algebra' } },
    {
      thread_slug: 'algebra',
      thread_title: 'Algebra',
      unit_count: 1,
    },
  ]);

  // Mock sequence operations (1 sequence + 1 facet = 4 entries: 2 actions + 2 docs)
  // Use type-cast-free minimal structure that satisfies BulkOperationEntry
  vi.mocked(buildSequenceBulkOperations).mockReturnValue([
    { index: { _index: 'oak_sequences', _id: 'maths-primary' } },
    { index: { _index: 'oak_sequences', _id: 'seq-doc-placeholder' } }, // doc entry
    { index: { _index: 'oak_sequence_facets', _id: 'maths-maths-primary-ks2' } },
    { index: { _index: 'oak_sequence_facets', _id: 'facet-doc-placeholder' } }, // doc entry
  ]);

  return { mockBulkFile, mockClient: createMockClient() };
}

interface ExpectedStats {
  files: number;
  lessons: number;
  units: number;
  threads: number;
  sequences: number;
  facets: number;
  keywords: number;
  misconceptions: number;
  synonyms: number;
}

function assertBulkIngestionStats(stats: BulkIngestionStats, expected: ExpectedStats): void {
  expect(stats.filesProcessed).toBe(expected.files);
  expect(stats.lessonsIndexed).toBe(expected.lessons);
  expect(stats.unitsIndexed).toBe(expected.units);
  expect(stats.threadsIndexed).toBe(expected.threads);
  expect(stats.sequencesIndexed).toBe(expected.sequences);
  expect(stats.sequenceFacetsIndexed).toBe(expected.facets);
  expect(stats.vocabularyStats.uniqueKeywords).toBe(expected.keywords);
  expect(stats.vocabularyStats.totalMisconceptions).toBe(expected.misconceptions);
  expect(stats.vocabularyStats.synonymsExtracted).toBe(expected.synonyms);
}
