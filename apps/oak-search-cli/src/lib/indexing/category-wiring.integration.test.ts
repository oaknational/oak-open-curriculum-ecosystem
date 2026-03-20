/**
 * Integration tests proving categoryMap flows through the ingestion pipeline.
 *
 * @remarks
 * These tests verify the F2 fix: `categoryMap` must be wired from the
 * orchestration layer through to both the sequence transformer (for
 * `category_titles`) and the unit transformer (for `unit_topics`).
 *
 * @see F2 finding in search-tool-prod-validation-findings-2026-03-15.md
 */
import { describe, expect, it, vi } from 'vitest';
import type { BulkDownloadFile, BulkFileResult } from '@oaknational/sdk-codegen/bulk';
import type { OakClient } from '../../adapters/oak-adapter';
import type { CategoryMap } from '../../adapters/category-supplementation';
import { collectPhaseResults } from './bulk-ingestion-phases';

function createUnitWithSlug(unitSlug: string) {
  return {
    unitSlug,
    unitTitle: `Unit ${unitSlug}`,
    year: 3,
    yearSlug: 'year-3',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: 'Test unit',
    whyThisWhyNow: 'Test',
    threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 1 }],
    unitLessons: [
      {
        lessonSlug: 'test-lesson',
        lessonTitle: 'Test Lesson',
        lessonOrder: 1,
        state: 'published' as const,
      },
    ],
  };
}

function createBulkDownloadFile(): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Mathematics',
    sequence: [createUnitWithSlug('fractions-year-3')],
    lessons: [
      {
        lessonSlug: 'test-lesson',
        lessonTitle: 'Test Lesson',
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks2',
        keyStageTitle: 'Key Stage 2',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        pupilLessonOutcome: 'Test outcome',
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsavailable: true,
        transcript_sentences: 'Test transcript.',
      },
    ],
  };
}

function createBulkFileResult(): BulkFileResult {
  return {
    filename: 'maths-primary.json',
    subjectPhase: { subject: 'maths', phase: 'primary' },
    data: createBulkDownloadFile(),
  };
}

function createCategoryMap(): CategoryMap {
  return new Map([['fractions-year-3', [{ title: 'Number', slug: 'number' }]]]);
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

describe('categoryMap pipeline wiring (F2 fix)', () => {
  it('produces sequence documents with populated category_titles when categoryMap is provided', async () => {
    const bulkFile = createBulkDownloadFile();
    const categoryMap = createCategoryMap();
    const fileResult = createBulkFileResult();

    const result = await collectPhaseResults(
      [fileResult],
      [bulkFile],
      createMockClient(),
      ['sequences', 'sequence_facets'],
      undefined,
      categoryMap,
    );

    const sequenceDoc = result.operations.find(
      (entry) => typeof entry === 'object' && entry !== null && 'category_titles' in entry,
    );

    expect(sequenceDoc).toBeDefined();
    if (sequenceDoc && typeof sequenceDoc === 'object' && 'category_titles' in sequenceDoc) {
      expect(sequenceDoc.category_titles).toEqual(['Number']);
    }
  });

  it('produces unit documents with populated unit_topics when categoryMap is provided', async () => {
    const bulkFile = createBulkDownloadFile();
    const categoryMap = createCategoryMap();
    const fileResult = createBulkFileResult();

    const result = await collectPhaseResults(
      [fileResult],
      [bulkFile],
      createMockClient(),
      ['lessons', 'units', 'unit_rollup'],
      undefined,
      categoryMap,
    );

    const unitDoc = result.operations.find(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        'unit_slug' in entry &&
        'unit_topics' in entry,
    );

    expect(unitDoc).toBeDefined();
    if (unitDoc && typeof unitDoc === 'object' && 'unit_topics' in unitDoc) {
      expect(unitDoc.unit_topics).toEqual(['Number']);
    }
  });
});
