/**
 * Integration tests for the restricted-lesson exclusion at the ingest boundary.
 *
 * @remarks
 * Runs the REAL `collectPhaseResults` pipeline (no phase faking) so the
 * assertions observe actual document content across every produced index
 * operation. The exclusion is the MCP-204 decision: restricted lessons are
 * filtered before any ingestion phase, and every run reports the count.
 *
 * The guarantee proven here is "no lesson document, no lesson-derived
 * content" for restricted lessons: no lesson doc by slug, no transcript
 * text anywhere in the payload, no keywords in the mined vocabulary.
 */
import { describe, expect, it, vi } from 'vitest';
import type { BulkDownloadFile, BulkFileResult, Lesson, Unit } from '@oaknational/sdk-codegen/bulk';
import { ok } from '@oaknational/result';
import { createMockClient } from '../../test-helpers/mock-oak-client.js';
import type { SearchLessonsIndexDoc } from '../../types/oak';
import { collectPhaseResults } from './bulk-ingestion-phases.js';
import { prepareBulkIngestion, type BulkIngestionDeps } from './bulk-ingestion.js';

const RESTRICTED_TRANSCRIPT_SENTINEL = 'SENTINEL-RESTRICTED-TRANSCRIPT-TEXT';
const RESTRICTED_KEYWORD_SENTINEL = 'sentinelrestrictedkeyword';

interface LessonFixtureOptions {
  readonly lessonSlug: string;
  readonly sequence: 'maths-primary' | 'science-primary';
  readonly restricted?: boolean;
}

function createLesson(options: LessonFixtureOptions): Lesson {
  const subjectSlug = options.sequence === 'maths-primary' ? 'maths' : 'science';
  const subjectTitle = options.sequence === 'maths-primary' ? 'Mathematics' : 'Science';
  const base: Lesson = {
    oakUrl: `https://www.thenational.academy/teachers/lessons/${options.lessonSlug}`,
    canonicalUrl: `https://www.thenational.academy/teachers/programmes/${subjectSlug}-primary-ks2/units/test-unit/lessons/${options.lessonSlug}`,
    lessonSlug: options.lessonSlug,
    lessonTitle: `Title of ${options.lessonSlug}`,
    unitSlug: `${options.sequence}-unit`,
    unitTitle: `Unit for ${options.sequence}`,
    subjectSlug,
    subjectTitle,
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'I can learn.',
    teacherTips: [],
    contentGuidance: null,
    supervisionLevel: null,
    downloadsavailable: true,
  };
  if (options.restricted === true) {
    return {
      ...base,
      restricted: true,
      transcript_sentences: RESTRICTED_TRANSCRIPT_SENTINEL,
      lessonKeywords: [
        { keyword: RESTRICTED_KEYWORD_SENTINEL, description: 'A restricted definition.' },
      ],
    };
  }
  return base;
}

function createUnit(
  sequence: 'maths-primary' | 'science-primary',
  lessons: readonly Lesson[],
): Unit {
  const subjectSlug = sequence === 'maths-primary' ? 'maths' : 'science';
  return {
    canonicalUrl: `https://www.thenational.academy/teachers/programmes/${subjectSlug}-primary-ks2/units/${sequence}-unit/lessons`,
    subjectSlug,
    unitSlug: `${sequence}-unit`,
    unitTitle: `Unit for ${sequence}`,
    year: 4,
    yearSlug: 'year-4',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: `A unit for ${sequence}.`,
    threads: [],
    unitLessons: lessons.map((lesson, index) => ({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      lessonOrder: index + 1,
      state: 'published',
    })),
  };
}

function createFileResult(
  sequence: 'maths-primary' | 'science-primary',
  lessons: readonly Lesson[],
): BulkFileResult {
  const subjectTitle = sequence === 'maths-primary' ? 'Mathematics' : 'Science';
  const data: BulkDownloadFile = {
    sequenceSlug: sequence,
    subjectTitle,
    sequence: [createUnit(sequence, lessons)],
    lessons: [...lessons],
  };
  return {
    filename: `${sequence}.json`,
    subjectPhase: { subject: sequence === 'maths-primary' ? 'maths' : 'science', phase: 'primary' },
    data,
  };
}

/**
 * Two files, pairwise-distinct counts so a positional mis-wire in the stats
 * builder fails loud: filesProcessed 2, lessons kept 3, restricted excluded 5.
 */
function createFixtureFiles(): readonly BulkFileResult[] {
  const mathsLessons = [
    createLesson({ lessonSlug: 'maths-kept-1', sequence: 'maths-primary' }),
    createLesson({ lessonSlug: 'maths-hidden-1', sequence: 'maths-primary', restricted: true }),
    createLesson({ lessonSlug: 'maths-hidden-2', sequence: 'maths-primary', restricted: true }),
  ];
  const scienceLessons = [
    createLesson({ lessonSlug: 'science-kept-1', sequence: 'science-primary' }),
    createLesson({ lessonSlug: 'science-kept-2', sequence: 'science-primary' }),
    createLesson({ lessonSlug: 'science-hidden-1', sequence: 'science-primary', restricted: true }),
    createLesson({ lessonSlug: 'science-hidden-2', sequence: 'science-primary', restricted: true }),
    createLesson({ lessonSlug: 'science-hidden-3', sequence: 'science-primary', restricted: true }),
  ];
  return [
    createFileResult('maths-primary', mathsLessons),
    createFileResult('science-primary', scienceLessons),
  ];
}

async function runIngestionOverFixture(overrides: { readonly includeRestricted?: boolean } = {}) {
  const deps: BulkIngestionDeps = {
    readAllBulkFiles: vi.fn().mockResolvedValue(createFixtureFiles()),
    collectPhaseResults,
    fetchCategoryMapForSequences: vi.fn().mockResolvedValue(ok(new Map())),
  };
  return prepareBulkIngestion(
    { bulkDir: 'fixture-dir-unused', client: createMockClient(), indexes: [], ...overrides },
    deps,
  );
}

describe('bulk ingestion excludes restricted lessons from every produced operation', () => {
  it('produces lesson documents for exactly the unrestricted lessons', async () => {
    const result = await runIngestionOverFixture();

    const lessonSlugs = result.operations
      .filter(
        (entry): entry is SearchLessonsIndexDoc =>
          typeof entry === 'object' && entry !== null && 'lesson_slug' in entry,
      )
      .map((doc) => doc.lesson_slug);
    expect(lessonSlugs.sort((a, b) => a.localeCompare(b))).toEqual([
      'maths-kept-1',
      'science-kept-1',
      'science-kept-2',
    ]);
  });

  it('keeps restricted lesson transcript text out of every produced document', async () => {
    const result = await runIngestionOverFixture();

    expect(JSON.stringify(result.operations)).not.toContain(RESTRICTED_TRANSCRIPT_SENTINEL);
  });

  it('excludes restricted lesson vocabulary from the mined vocabulary statistics', async () => {
    const result = await runIngestionOverFixture();

    expect(JSON.stringify(result.operations)).not.toContain(RESTRICTED_KEYWORD_SENTINEL);
    expect(result.stats.vocabularyStats.uniqueKeywords).toBe(0);
  });

  it('reports the number of restricted lessons excluded in the run statistics', async () => {
    const result = await runIngestionOverFixture();

    expect(result.stats.restrictedLessonsExcluded).toBe(5);
    expect(result.stats.filesProcessed).toBe(2);
    expect(result.stats.lessonsIndexed).toBe(3);
  });
});

describe('bulk ingestion retains restricted lessons when includeRestricted is true', () => {
  it('produces lesson documents for every lesson, restricted included', async () => {
    const result = await runIngestionOverFixture({ includeRestricted: true });

    const lessonSlugs = result.operations
      .filter(
        (entry): entry is SearchLessonsIndexDoc =>
          typeof entry === 'object' && entry !== null && 'lesson_slug' in entry,
      )
      .map((doc) => doc.lesson_slug);
    expect(lessonSlugs.sort((a, b) => a.localeCompare(b))).toEqual([
      'maths-hidden-1',
      'maths-hidden-2',
      'maths-kept-1',
      'science-hidden-1',
      'science-hidden-2',
      'science-hidden-3',
      'science-kept-1',
      'science-kept-2',
    ]);
  });

  it('reports zero restricted lessons excluded and indexes every lesson', async () => {
    const result = await runIngestionOverFixture({ includeRestricted: true });

    expect(result.stats.restrictedLessonsExcluded).toBe(0);
    expect(result.stats.filesProcessed).toBe(2);
    expect(result.stats.lessonsIndexed).toBe(8);
  });
});
