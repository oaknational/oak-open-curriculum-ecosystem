/**
 * Unit tests for key learning point extraction.
 */
import { describe, expect, it } from 'vitest';

import type { Lesson } from '../lib/index.js';

import { extractLearningPoints } from './learning-point-extractor.js';

describe('extractLearningPoints', () => {
  const createLesson = (overrides: Partial<Lesson>): Lesson => ({
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'science',
    subjectTitle: 'Science',
    keyStageSlug: 'ks3',
    keyStageTitle: 'Key Stage 3',
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

  it('extracts learning points from a lesson', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        keyLearningPoints: [
          { keyLearningPoint: 'Understand photosynthesis' },
          { keyLearningPoint: 'Identify chloroplasts' },
        ],
      }),
    ];

    const result = extractLearningPoints(lessons);

    expect(result).toHaveLength(2);
    expect(result[0].learningPoint).toBe('Understand photosynthesis');
  });

  it('preserves lesson context', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'cells-lesson',
        lessonTitle: 'Introduction to Cells',
        subjectSlug: 'biology',
        keyLearningPoints: [{ keyLearningPoint: 'Know cell structure' }],
      }),
    ];

    const result = extractLearningPoints(lessons);

    expect(result[0].lessonSlug).toBe('cells-lesson');
    expect(result[0].lessonTitle).toBe('Introduction to Cells');
    expect(result[0].subject).toBe('biology');
  });

  it('filters empty learning points', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        keyLearningPoints: [
          { keyLearningPoint: '' },
          { keyLearningPoint: '   ' },
          { keyLearningPoint: 'Valid point' },
        ],
      }),
    ];

    const result = extractLearningPoints(lessons);

    expect(result).toHaveLength(1);
  });
});
