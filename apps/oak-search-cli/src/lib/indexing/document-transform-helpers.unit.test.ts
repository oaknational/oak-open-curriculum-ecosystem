import { describe, expect, it } from 'vitest';
import type { SearchLessonSummary, SearchUnitSummary } from '../../types/oak';
import {
  lessonSummarySchema,
  unitSummarySchema,
} from '@oaknational/curriculum-sdk/public/search.js';
import {
  extractLessonPlanningFields,
  extractLessonDocumentFields,
  extractRollupDocumentFields,
} from './document-transform-helpers';

/**
 * Builds a typed unit summary fixture.
 *
 * Note: This fixture must match the shape expected by the SDK's unitSummarySchema.
 */
function buildUnitSummary(overrides: Partial<SearchUnitSummary> = {}): SearchUnitSummary {
  const base = {
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    yearSlug: 'year-6',
    year: 'Year 6',
    phaseSlug: 'primary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks2',
    priorKnowledgeRequirements: ['Add fractions with like denominators'],
    nationalCurriculumContent: ['Numerator and denominator'],
    threads: [{ slug: 'sequence-1', title: 'Sequence 1', order: 1 }],
    categories: [{ categoryTitle: 'Fractions', categorySlug: 'fractions' }],
    unitLessons: [
      { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', state: 'published' },
      { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', state: 'published' },
    ],
    canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
    ...overrides,
  };
  // Validate against schema to ensure fixture is correct
  const parsed = unitSummarySchema.parse(base);
  return parsed;
}

/**
 * Builds a typed lesson summary fixture.
 *
 * Note: This fixture must match the shape expected by the SDK's lessonSummarySchema.
 */
function buildLessonSummary(overrides: Partial<SearchLessonSummary> = {}): SearchLessonSummary {
  const base = {
    lessonTitle: 'Lesson Title',
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    lessonKeywords: [
      { keyword: 'fractions', description: 'Fractions overview' },
      { keyword: 'ratio', description: 'Ratio overview' },
    ],
    keyLearningPoints: [{ keyLearningPoint: 'Understand fractions' }],
    misconceptionsAndCommonMistakes: [
      { misconception: 'Confuse numerator', response: 'Explain with bar models' },
    ],
    teacherTips: [{ teacherTip: 'Model representations' }],
    contentGuidance: [
      {
        contentGuidanceArea: 'Mathematics',
        supervisionlevel_id: 1,
        contentGuidanceLabel: 'General',
        contentGuidanceDescription: 'Consider prior knowledge',
      },
    ],
    pupilLessonOutcome: 'Learners can describe key ideas.',
    supervisionLevel: 'low',
    downloadsAvailable: true,
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    canonicalUrl: 'https://teachers.thenational.academy/lessons/lesson-slug',
    oakUrl: 'https://www.thenational.academy/teachers/lessons/lesson-slug',
    ...overrides,
  };
  // Validate against schema to ensure fixture is correct
  const parsed = lessonSummarySchema.parse(base);
  return parsed;
}

describe('document-transform-helpers', () => {
  describe('extractLessonPlanningFields', () => {
    it('normalises optional planning fields into string arrays', () => {
      const summary = buildLessonSummary();
      const fields = extractLessonPlanningFields(summary);

      expect(fields.lessonKeywords).toEqual(['fractions', 'ratio']);
      expect(fields.keyLearningPoints).toEqual(['Understand fractions']);
      expect(fields.misconceptions).toEqual(['Confuse numerator → Explain with bar models']);
      expect(fields.teacherTips).toEqual(['Model representations']);
      expect(fields.contentGuidance).toEqual(['Consider prior knowledge']);
    });

    it('returns undefined for empty arrays', () => {
      const summary = buildLessonSummary({
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        teacherTips: [],
        contentGuidance: [],
      });
      const fields = extractLessonPlanningFields(summary);

      expect(fields.lessonKeywords).toBeUndefined();
      expect(fields.keyLearningPoints).toBeUndefined();
      expect(fields.misconceptions).toBeUndefined();
      expect(fields.teacherTips).toBeUndefined();
      expect(fields.contentGuidance).toBeUndefined();
    });
  });

  describe('extractLessonDocumentFields', () => {
    it('extracts all lesson document fields', () => {
      const summary = buildLessonSummary();
      const fields = extractLessonDocumentFields(summary);

      expect(fields.unitSlug).toBe('unit-slug');
      expect(fields.unitTitle).toBe('Unit Title');
      expect(fields.canonicalUrl).toBe('https://teachers.thenational.academy/lessons/lesson-slug');
      expect(fields.lessonKeywords).toEqual(['fractions', 'ratio']);
    });

    it('throws when canonical URL is missing', () => {
      const summary: Parameters<typeof extractLessonDocumentFields>[0] = {
        ...buildLessonSummary(),
        canonicalUrl: undefined,
      };
      expect(() => extractLessonDocumentFields(summary)).toThrow(/canonical url/i);
    });
  });

  describe('extractRollupDocumentFields', () => {
    it('extracts all rollup document fields', () => {
      const summary = buildUnitSummary();
      const normaliseYears = (year: string | number, yearSlug: string) =>
        yearSlug ? [String(year)] : [String(year)];
      const fields = extractRollupDocumentFields(summary, normaliseYears);

      expect(fields.unitSlug).toBe('unit-slug');
      expect(fields.unitTitle).toBe('Unit Title');
      expect(fields.canonicalUrl).toBe('https://teachers.thenational.academy/units/unit-slug');
      expect(fields.lessonIds).toEqual(['lesson-1', 'lesson-2']);
    });

    it('throws when canonical URL is missing', () => {
      const summary = buildUnitSummary({ canonicalUrl: undefined });
      const normaliseYears = (year: string | number, yearSlug: string) =>
        yearSlug ? [String(year)] : [String(year)];
      expect(() => extractRollupDocumentFields(summary, normaliseYears)).toThrow(/canonical url/i);
    });
  });
});
