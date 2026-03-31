/**
 * Unit tests for the batch generator that yields (subject, keyStage) batches
 * for incremental Elasticsearch ingestion.
 */

import { describe, expect, it } from 'vitest';
import {
  generateIndexBatches,
  type IngestionBatch,
  type BatchGeneratorOptions,
} from './index-batch-generator';
import type { OakClient } from '../adapters/oak-adapter';
import type {
  KeyStage,
  SearchLessonSummary,
  SearchSubjectSlug,
  SearchUnitSummary,
} from '../types/oak';
import type { RateLimitTracker } from '@oaknational/curriculum-sdk';
import { ok } from '@oaknational/result';

/** Minimal valid SearchLessonSummary for mock client (tests do not inspect fields). */
function minimalLessonSummary(): SearchLessonSummary {
  return {
    lessonTitle: '',
    canonicalUrl: 'https://teachers.thenational.academy/lessons/test-lesson',
    oakUrl: 'https://www.thenational.academy/teachers/lessons/test-lesson',
    unitSlug: '',
    unitTitle: '',
    subjectSlug: 'maths',
    subjectTitle: '',
    keyStageSlug: 'ks1',
    keyStageTitle: '',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    teacherTips: [],
    contentGuidance: [],
    supervisionLevel: null,
    downloadsAvailable: false,
  };
}

/** Minimal valid SearchUnitSummary for mock client (tests do not inspect fields). */
function minimalUnitSummary(): SearchUnitSummary {
  return {
    unitSlug: '',
    unitTitle: '',
    yearSlug: 'year-1',
    year: 1,
    phaseSlug: 'primary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks1',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    unitLessons: [],
  };
}

/**
 * Creates a minimal mock OakClient that returns empty results for all methods.
 * All methods return Result types per ADR-088.
 * This allows testing the generator's iteration logic without actual API calls.
 */
function createMinimalMockClient(): OakClient {
  const rateLimitTracker: RateLimitTracker = {
    getStatus: () => ({
      limit: null,
      remaining: null,
      reset: null,
      resetDate: null,
      lastChecked: new Date(),
    }),
    getRequestCount: () => 0,
    getRequestRate: () => 0,
    reset: () => {
      /* no-op for mock */
    },
  };

  return {
    getUnitsByKeyStageAndSubject: async () => ok([]),
    getLessonTranscript: async () => ok({ transcript: '', vtt: '' }),
    getLessonSummary: async () => ok(minimalLessonSummary()),
    getUnitSummary: async () => ok(minimalUnitSummary()),
    getSubjectSequences: async () => ok([]),
    getSequenceUnits: async () => ok([]),
    getAllThreads: async () => ok([]),
    getThreadUnits: async () => ok([]),
    getLessonsByKeyStageAndSubject: async () => ok([]),
    getSubjectAssets: async () => ok([]),
    rateLimitTracker,
    getCacheStats: () => ({ hits: 0, misses: 0, connected: false }),
    disconnect: async () => Promise.resolve(),
  };
}

describe('generateIndexBatches', () => {
  it('yields one batch per subject-keystage pair when granularity is subject-keystage', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths', 'english'];
    const keyStages: readonly KeyStage[] = ['ks1', 'ks2'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
      granularity: { kind: 'subject-keystage' },
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    // 2 subjects × 2 keyStages = 4 curriculum batches + 1 threads batch = 5 total
    expect(batches).toHaveLength(5);

    // Verify curriculum batches have correct subject/keystage pairs
    const curriculumBatches = batches.filter((b) => b.kind === 'curriculum');
    expect(curriculumBatches).toHaveLength(4);
    expect(curriculumBatches[0]).toMatchObject({ subject: 'maths', keyStage: 'ks1' });
    expect(curriculumBatches[1]).toMatchObject({ subject: 'maths', keyStage: 'ks2' });
    expect(curriculumBatches[2]).toMatchObject({ subject: 'english', keyStage: 'ks1' });
    expect(curriculumBatches[3]).toMatchObject({ subject: 'english', keyStage: 'ks2' });

    // Verify threads batch is last
    const threadsBatchIndex = batches.findIndex((b) => b.kind === 'threads');
    expect(threadsBatchIndex).not.toBe(-1);
    expect(threadsBatchIndex).toBe(batches.length - 1);
  });

  it('yields one batch per subject when granularity is subject', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths', 'english'];
    const keyStages: readonly KeyStage[] = ['ks1', 'ks2'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
      granularity: { kind: 'subject' },
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    // 2 subjects = 2 curriculum batches + 1 threads batch = 3 total
    expect(batches).toHaveLength(3);

    const curriculumBatches = batches.filter((b) => b.kind === 'curriculum');
    expect(curriculumBatches).toHaveLength(2);
    expect(curriculumBatches[0]).toMatchObject({ subject: 'maths', keyStage: null });
    expect(curriculumBatches[1]).toMatchObject({ subject: 'english', keyStage: null });
  });

  it('yields single batch when granularity is all', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths', 'english'];
    const keyStages: readonly KeyStage[] = ['ks1', 'ks2'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
      granularity: { kind: 'all' },
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    // 1 combined batch + 1 threads batch = 2 total
    expect(batches).toHaveLength(2);

    const curriculumBatch = batches.find((b) => b.kind === 'curriculum');
    expect(curriculumBatch).toMatchObject({ subject: null, keyStage: null });
  });

  it('defaults to subject-keystage granularity when not specified', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths'];
    const keyStages: readonly KeyStage[] = ['ks1'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    // 1 curriculum batch + 1 threads batch = 2 total
    expect(batches).toHaveLength(2);
    expect(batches[0]).toMatchObject({
      kind: 'curriculum',
      subject: 'maths',
      keyStage: 'ks1',
    });
  });

  it('includes operations array in each batch', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths'];
    const keyStages: readonly KeyStage[] = ['ks1'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    // All batches should have an operations array (may be empty with mock client)
    for (const batch of batches) {
      expect(Array.isArray(batch.operations)).toBe(true);
    }
  });

  it('includes data integrity report in curriculum batches', async () => {
    const client = createMinimalMockClient();
    const subjects: readonly SearchSubjectSlug[] = ['maths'];
    const keyStages: readonly KeyStage[] = ['ks1'];

    const options: BatchGeneratorOptions = {
      client,
      subjects,
      keyStages,
    };

    const batches: IngestionBatch[] = [];
    for await (const batch of generateIndexBatches(options)) {
      batches.push(batch);
    }

    const curriculumBatch = batches.find((b) => b.kind === 'curriculum');
    expect(curriculumBatch?.dataIntegrityReport).toBeDefined();
    expect(curriculumBatch?.dataIntegrityReport?.skippedUnits).toBeDefined();
    expect(curriculumBatch?.dataIntegrityReport?.skippedLessons).toBeDefined();
  });
});
