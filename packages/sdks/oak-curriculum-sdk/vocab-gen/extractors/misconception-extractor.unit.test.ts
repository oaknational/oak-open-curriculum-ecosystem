/**
 * Unit tests for misconception extraction.
 */
import { describe, expect, it } from 'vitest';

import type { Lesson } from '../lib/index.js';

import { extractMisconceptions } from './misconception-extractor.js';

describe('extractMisconceptions', () => {
  const createLesson = (overrides: Partial<Lesson>): Lesson => ({
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
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
    contentGuidance: undefined,
    downloadsavailable: true,
    supervisionLevel: undefined,
    ...overrides,
  });

  it('extracts misconceptions from a lesson', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'fractions-lesson',
        subjectSlug: 'maths',
        misconceptionsAndCommonMistakes: [
          {
            misconception: 'Bigger denominator means bigger fraction',
            response: 'Compare with visual representations',
          },
        ],
      }),
    ];

    const result = extractMisconceptions(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].misconception).toBe('Bigger denominator means bigger fraction');
    expect(result[0].response).toBe('Compare with visual representations');
    expect(result[0].subject).toBe('maths');
  });

  it('preserves lesson context', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'my-lesson',
        lessonTitle: 'My Lesson Title',
        keyStageSlug: 'ks3',
        misconceptionsAndCommonMistakes: [
          { misconception: 'Test misconception', response: 'Test response' },
        ],
      }),
    ];

    const result = extractMisconceptions(lessons);

    expect(result[0].lessonSlug).toBe('my-lesson');
    expect(result[0].lessonTitle).toBe('My Lesson Title');
    expect(result[0].keyStage).toBe('ks3');
  });

  it('filters empty misconceptions', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        misconceptionsAndCommonMistakes: [
          { misconception: '', response: 'Should not appear' },
          { misconception: '  ', response: 'Also should not appear' },
          { misconception: 'Valid', response: 'Valid response' },
        ],
      }),
    ];

    const result = extractMisconceptions(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].misconception).toBe('Valid');
  });

  it('returns empty array for lessons without misconceptions', () => {
    const lessons: readonly Lesson[] = [createLesson({ misconceptionsAndCommonMistakes: [] })];

    const result = extractMisconceptions(lessons);

    expect(result).toHaveLength(0);
  });
});
