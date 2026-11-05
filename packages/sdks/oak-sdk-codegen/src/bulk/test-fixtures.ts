/**
 * Shared input-shaped fixture factories for bulk-data tests.
 *
 * @remarks
 * Test-only module: builds minimal valid `z.input` shapes for the bulk
 * schemas so tests parse real data through the real gate instead of
 * hand-asserting output shapes.
 */
import type { z } from 'zod';
import type { Lesson, Unit, lessonSchema, unitSchema } from '../types/generated/bulk/index.js';

export type LessonInput = z.input<typeof lessonSchema>;
export type UnitInput = z.input<typeof unitSchema>;

/** Creates a minimal valid lesson input for testing */
export function createLessonInput(overrides: Partial<LessonInput> = {}): LessonInput {
  return {
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    oakUrl: 'https://www.thenational.academy/teachers/lessons/test-lesson',
    canonicalUrl:
      'https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/test-unit/lessons/test-lesson',
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
    contentGuidance: 'NULL',
    downloadsavailable: true,
    supervisionLevel: 'NULL',
    ...overrides,
  };
}

/** Creates a parsed lesson (the `z.output` shape the extractors consume) for testing */
export function createLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    oakUrl: 'https://www.thenational.academy/teachers/lessons/test-lesson',
    canonicalUrl:
      'https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/test-unit/lessons/test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    lessonKeywords: [],
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'Test outcome',
    teacherTips: [],
    contentGuidance: null,
    downloadsavailable: true,
    supervisionLevel: null,
    ...overrides,
  };
}

/** Creates a parsed unit (the `z.output` shape the extractors consume) for testing */
export function createUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    canonicalUrl:
      'https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/test-unit/lessons',
    subjectSlug: 'maths',
    threads: [],
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: '',
    yearSlug: 'year-4',
    year: 4,
    keyStageSlug: 'ks2',
    unitLessons: [],
    ...overrides,
  };
}

/** Creates a minimal valid unit input for testing */
export function createUnitInput(overrides: Partial<UnitInput> = {}): UnitInput {
  return {
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    canonicalUrl:
      'https://www.thenational.academy/teachers/programmes/maths-primary-ks2/units/test-unit/lessons',
    subjectSlug: 'maths',
    threads: [],
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    description: 'A test unit.',
    yearSlug: 'year-4',
    year: 4,
    keyStageSlug: 'ks2',
    unitLessons: [],
    ...overrides,
  };
}
