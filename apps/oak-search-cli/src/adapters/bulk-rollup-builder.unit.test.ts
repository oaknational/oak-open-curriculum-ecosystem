/**
 * Unit tests for bulk-rollup-builder.
 *
 * @remarks
 * Tests the transformation of bulk download unit data into SearchUnitSummary
 * format for rollup document generation, and lesson snippet collection.
 *
 */
import { describe, it, expect } from 'vitest';
import type { Unit, Lesson } from '@oaknational/curriculum-sdk-generation/bulk';
import { transformBulkUnitToSummary, collectLessonSnippets } from './bulk-rollup-builder';

/**
 * Creates a minimal valid bulk unit fixture for testing.
 */
function createMinimalUnit(overrides?: Partial<Unit>): Unit {
  return {
    unitSlug: 'fractions-year-4',
    unitTitle: 'Fractions Year 4',
    year: 4,
    yearSlug: 'year-4',
    keyStageSlug: 'ks2',
    threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 1 }],
    priorKnowledgeRequirements: ['Understand equal parts'],
    nationalCurriculumContent: ['Recognise and show fractions'],
    description: 'Learn about fractions in Year 4',
    unitLessons: [
      {
        lessonSlug: 'what-is-a-fraction',
        lessonTitle: 'What is a fraction?',
        lessonOrder: 1,
        state: 'published',
      },
      {
        lessonSlug: 'comparing-fractions',
        lessonTitle: 'Comparing fractions',
        lessonOrder: 2,
        state: 'published',
      },
    ],
    ...overrides,
  };
}

/**
 * Creates a minimal valid bulk lesson fixture for testing.
 */
function createMinimalLesson(overrides?: Partial<Lesson>): Lesson {
  return {
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
    pupilLessonOutcome: 'I can learn.',
    teacherTips: [],
    contentGuidance: null,
    supervisionLevel: null,
    downloadsavailable: true,
    ...overrides,
  };
}

describe('bulk-rollup-builder', () => {
  describe('transformBulkUnitToSummary', () => {
    it('maps bulk Unit fields to SearchUnitSummary', () => {
      const bulkUnit = createMinimalUnit();
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.unitSlug).toBe(bulkUnit.unitSlug);
      expect(summary.unitTitle).toBe(bulkUnit.unitTitle);
      expect(summary.subjectSlug).toBe('maths');
      expect(summary.keyStageSlug).toBe('ks2');
    });

    it('preserves year information', () => {
      const bulkUnit = createMinimalUnit({ year: 4, yearSlug: 'year-4' });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.year).toBe(4);
      expect(summary.yearSlug).toBe('year-4');
    });

    it('handles "All years" year value', () => {
      const bulkUnit = createMinimalUnit({ year: 'All years', yearSlug: 'year-mixed' });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks4');

      expect(summary.year).toBe('All years');
    });

    it('maps threads array', () => {
      const bulkUnit = createMinimalUnit({
        threads: [
          { slug: 'number-fractions', title: 'Number: Fractions', order: 1 },
          { slug: 'number-decimals', title: 'Number: Decimals', order: 2 },
        ],
      });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.threads).toHaveLength(2);
      expect(summary.threads?.[0]?.slug).toBe('number-fractions');
      expect(summary.threads?.[1]?.slug).toBe('number-decimals');
    });

    it('maps unitLessons array', () => {
      const bulkUnit = createMinimalUnit({
        unitLessons: [
          { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', lessonOrder: 1, state: 'published' },
          { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', lessonOrder: 2, state: 'published' },
        ],
      });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.unitLessons).toHaveLength(2);
      expect(summary.unitLessons[0]?.lessonSlug).toBe('lesson-1');
    });

    it('generates canonical URL from unit slug', () => {
      const bulkUnit = createMinimalUnit({ unitSlug: 'fractions-year-4' });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.canonicalUrl).toBe(
        'https://www.thenational.academy/teachers/units/fractions-year-4',
      );
    });

    it('maps priorKnowledgeRequirements', () => {
      const bulkUnit = createMinimalUnit({
        priorKnowledgeRequirements: ['Understand equal parts', 'Count to 100'],
      });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.priorKnowledgeRequirements).toEqual([
        'Understand equal parts',
        'Count to 100',
      ]);
    });

    it('maps nationalCurriculumContent', () => {
      const bulkUnit = createMinimalUnit({
        nationalCurriculumContent: ['Recognise and show fractions', 'Compare fractions'],
      });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.nationalCurriculumContent).toEqual([
        'Recognise and show fractions',
        'Compare fractions',
      ]);
    });

    it('maps description', () => {
      const bulkUnit = createMinimalUnit({ description: 'Learn about fractions' });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.description).toBe('Learn about fractions');
    });

    it('maps whyThisWhyNow when present', () => {
      const bulkUnit = createMinimalUnit({ whyThisWhyNow: 'Builds on Year 3 fraction knowledge' });
      const summary = transformBulkUnitToSummary(bulkUnit, 'maths', 'ks2');

      expect(summary.whyThisWhyNow).toBe('Builds on Year 3 fraction knowledge');
    });
  });

  describe('collectLessonSnippets', () => {
    it('groups lesson transcript content by unit slug', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          lessonTitle: 'Lesson 1',
          transcript_sentences: 'This is the transcript for lesson 1.',
        }),
        createMinimalLesson({
          lessonSlug: 'l2',
          unitSlug: 'u1',
          lessonTitle: 'Lesson 2',
          transcript_sentences: 'This is the transcript for lesson 2.',
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.get('u1')).toEqual([
        'This is the transcript for lesson 1.',
        'This is the transcript for lesson 2.',
      ]);
    });

    it('creates separate entries for different units', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          transcript_sentences: 'Unit 1 content.',
        }),
        createMinimalLesson({
          lessonSlug: 'l2',
          unitSlug: 'u2',
          transcript_sentences: 'Unit 2 content.',
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.get('u1')).toEqual(['Unit 1 content.']);
      expect(snippets.get('u2')).toEqual(['Unit 2 content.']);
    });

    it('returns empty map when no lessons provided', () => {
      const snippets = collectLessonSnippets([]);

      expect(snippets.size).toBe(0);
    });

    it('handles lessons with same unit in order', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          transcript_sentences: 'First content.',
        }),
        createMinimalLesson({
          lessonSlug: 'l2',
          unitSlug: 'u1',
          transcript_sentences: 'Second content.',
        }),
        createMinimalLesson({
          lessonSlug: 'l3',
          unitSlug: 'u1',
          transcript_sentences: 'Third content.',
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.get('u1')).toEqual(['First content.', 'Second content.', 'Third content.']);
    });

    it('skips lessons with null transcript', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          transcript_sentences: 'Has transcript.',
        }),
        createMinimalLesson({
          lessonSlug: 'l2',
          unitSlug: 'u1',
          transcript_sentences: null,
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.get('u1')).toEqual(['Has transcript.']);
    });

    it('skips lessons with undefined transcript', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          transcript_sentences: 'Has transcript.',
        }),
        createMinimalLesson({
          lessonSlug: 'l2',
          unitSlug: 'u1',
          transcript_sentences: undefined,
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.get('u1')).toEqual(['Has transcript.']);
    });

    it('handles unit with all null transcripts by not creating entry', () => {
      const lessons = [
        createMinimalLesson({
          lessonSlug: 'l1',
          unitSlug: 'u1',
          transcript_sentences: null,
        }),
      ];

      const snippets = collectLessonSnippets(lessons);

      expect(snippets.has('u1')).toBe(false);
    });
  });
});
