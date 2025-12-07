import { describe, expect, it } from 'vitest';
import {
  lessonSummarySchema,
  unitSummarySchema,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import {
  extractLessonPlanningFields,
  extractMisconceptions,
  extractUnitLessons,
  resolveLessonSummaryIdentifiers,
  resolveUnitSummaryIdentifiers,
  extractTier,
  extractExamBoard,
  extractPathway,
} from './document-transform-helpers';

interface UnitSummaryFixture {
  unitSlug: string;
  unitTitle: string;
  yearSlug: string;
  year: string | number;
  phaseSlug: string;
  subjectSlug: string;
  keyStageSlug: string;
  priorKnowledgeRequirements: readonly string[];
  nationalCurriculumContent: readonly string[];
  threads?: readonly { slug: string; title: string; order: number }[];
  categories?: readonly { categoryTitle: string; categorySlug?: string }[];
  unitLessons: readonly {
    lessonSlug: string;
    lessonTitle: string;
    lessonOrder?: number;
    state: 'published' | 'new';
  }[];
  canonicalUrl?: string;
}

interface LessonSummaryFixture {
  lessonTitle: string;
  unitSlug: string;
  unitTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  lessonKeywords: readonly { keyword: string; description: string }[];
  keyLearningPoints: readonly { keyLearningPoint: string }[];
  misconceptionsAndCommonMistakes: readonly { misconception: string; response: string }[];
  teacherTips: readonly { teacherTip: string }[];
  contentGuidance:
    | readonly {
        contentGuidanceArea: string;
        supervisionlevel_id: number;
        contentGuidanceLabel: string;
        contentGuidanceDescription: string;
      }[]
    | null;
  pupilLessonOutcome?: string;
  supervisionLevel?: string | null;
  downloadsAvailable?: boolean;
  canonicalUrl?: string;
  programmeFactors?: {
    tier?: string;
    examBoard?: string;
    pathway?: string;
  };
}

function buildUnitSummary(overrides: Partial<UnitSummaryFixture> = {}): UnitSummaryFixture {
  const base: UnitSummaryFixture = {
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
  };
  const summary: UnitSummaryFixture = { ...base, ...overrides };
  void unitSummarySchema.parse(summary);
  return summary;
}

function buildLessonSummary(overrides: Partial<LessonSummaryFixture> = {}): LessonSummaryFixture {
  const base: LessonSummaryFixture = {
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
  };
  const summary: LessonSummaryFixture = { ...base, ...overrides };
  void lessonSummarySchema.parse(summary);
  return summary;
}

describe('document-transform-helpers', () => {
  describe('resolveUnitSummaryIdentifiers', () => {
    it('returns the canonical identifiers for a unit summary', () => {
      const summary = buildUnitSummary();

      const identifiers = resolveUnitSummaryIdentifiers(summary);

      expect(identifiers.unitSlug).toBe('unit-slug');
      expect(identifiers.unitTitle).toBe('Unit Title');
      expect(identifiers.canonicalUrl).toBe('https://teachers.thenational.academy/units/unit-slug');
    });

    it('throws when the canonical URL is missing', () => {
      const summary = buildUnitSummary({ canonicalUrl: undefined });

      expect(() => resolveUnitSummaryIdentifiers(summary)).toThrow(/canonical url/i);
    });
  });

  describe('resolveLessonSummaryIdentifiers', () => {
    it('returns lesson planning identifiers', () => {
      const summary = buildLessonSummary();

      const identifiers = resolveLessonSummaryIdentifiers(summary);

      expect(identifiers.unitSlug).toBe('unit-slug');
      expect(identifiers.unitTitle).toBe('Unit Title');
      expect(identifiers.canonicalUrl).toBe(
        'https://teachers.thenational.academy/lessons/lesson-slug',
      );
    });

    it('throws when the lesson canonical URL is missing', () => {
      const summary = buildLessonSummary({ canonicalUrl: undefined });

      expect(() => resolveLessonSummaryIdentifiers(summary)).toThrow(/canonical url/i);
    });
  });

  describe('extractUnitLessons', () => {
    it('filters out invalid lesson entries', () => {
      const summary = buildUnitSummary({
        unitLessons: [
          { lessonSlug: 'valid-lesson', lessonTitle: 'Valid Lesson', state: 'published' },
          { lessonSlug: '', lessonTitle: 'Missing slug', state: 'published' },
          { lessonSlug: 'missing-title', lessonTitle: '', state: 'published' },
        ],
      });

      const lessons = extractUnitLessons([
        ...summary.unitLessons,
        { lessonSlug: '', lessonTitle: 'Missing slug', state: 'published' } as unknown,
        { lessonSlug: 'missing-title', lessonTitle: '', state: 'published' } as unknown,
      ]);

      expect(lessons).toEqual([{ lessonSlug: 'valid-lesson', lessonTitle: 'Valid Lesson' }]);
    });
  });

  describe('extractMisconceptions', () => {
    it('joins misconception-response pairs and skips incomplete entries', () => {
      const summary = buildLessonSummary();

      const misconceptions = extractMisconceptions([
        ...summary.misconceptionsAndCommonMistakes,
        { misconception: 'Missing response only', response: undefined } as unknown,
      ]);

      expect(misconceptions).toEqual(['Confuse numerator → Explain with bar models']);
    });
  });

  describe('extractLessonPlanningFields', () => {
    it('normalises optional planning fields into string arrays', () => {
      const summary = buildLessonSummary();

      const summaryWithGaps = {
        ...summary,
        lessonKeywords: [
          ...summary.lessonKeywords,
          { keyword: '', description: 'Ignored empty keyword' } as unknown,
        ],
        keyLearningPoints: [
          ...summary.keyLearningPoints,
          { keyLearningPoint: undefined } as unknown,
        ],
        misconceptionsAndCommonMistakes: [
          ...summary.misconceptionsAndCommonMistakes,
          { misconception: 'Missing response only', response: undefined } as unknown,
        ],
        teacherTips: [...summary.teacherTips, { teacherTip: '' } as unknown],
        contentGuidance: [
          ...(summary.contentGuidance ?? []),
          { contentGuidanceDescription: undefined } as unknown,
        ],
      } as LessonSummaryFixture;

      const fields = extractLessonPlanningFields(
        summaryWithGaps as unknown as Parameters<typeof extractLessonPlanningFields>[0],
      );

      expect(fields.lessonKeywords).toEqual(['fractions', 'ratio']);
      expect(fields.keyLearningPoints).toEqual(['Understand fractions']);
      expect(fields.misconceptions).toEqual(['Confuse numerator → Explain with bar models']);
      expect(fields.teacherTips).toEqual(['Model representations']);
      expect(fields.contentGuidance).toEqual(['Consider prior knowledge']);
    });
  });

  describe('extractTier', () => {
    it('should extract foundation tier from programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { tier: 'foundation' },
      });

      expect(extractTier(lessonData)).toBe('foundation');
    });

    it('should extract higher tier from programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { tier: 'higher' },
      });

      expect(extractTier(lessonData)).toBe('higher');
    });

    it('should return undefined if no tier in programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: {},
      });

      expect(extractTier(lessonData)).toBeUndefined();
    });

    it('should return undefined if no programme factors', () => {
      const lessonData = buildLessonSummary();

      expect(extractTier(lessonData)).toBeUndefined();
    });

    it('should return undefined for invalid tier values', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { tier: 'invalid' },
      });

      expect(extractTier(lessonData)).toBeUndefined();
    });
  });

  describe('extractExamBoard', () => {
    it('should extract exam board from programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { examBoard: 'aqa' },
      });

      expect(extractExamBoard(lessonData)).toBe('aqa');
    });

    it('should extract edexcel exam board', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { examBoard: 'edexcel' },
      });

      expect(extractExamBoard(lessonData)).toBe('edexcel');
    });

    it('should return undefined if no exam board in programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: {},
      });

      expect(extractExamBoard(lessonData)).toBeUndefined();
    });

    it('should return undefined if no programme factors', () => {
      const lessonData = buildLessonSummary();

      expect(extractExamBoard(lessonData)).toBeUndefined();
    });

    it('should return undefined for empty string exam board', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { examBoard: '' },
      });

      expect(extractExamBoard(lessonData)).toBeUndefined();
    });
  });

  describe('extractPathway', () => {
    it('should extract pathway from programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { pathway: 'core' },
      });

      expect(extractPathway(lessonData)).toBe('core');
    });

    it('should extract gcse pathway', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { pathway: 'gcse' },
      });

      expect(extractPathway(lessonData)).toBe('gcse');
    });

    it('should return undefined if no pathway in programme factors', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: {},
      });

      expect(extractPathway(lessonData)).toBeUndefined();
    });

    it('should return undefined if no programme factors', () => {
      const lessonData = buildLessonSummary();

      expect(extractPathway(lessonData)).toBeUndefined();
    });

    it('should return undefined for empty string pathway', () => {
      const lessonData = buildLessonSummary({
        programmeFactors: { pathway: '' },
      });

      expect(extractPathway(lessonData)).toBeUndefined();
    });
  });
});
