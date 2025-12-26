/**
 * Unit tests for teacher tip extraction.
 */
import { describe, expect, it } from 'vitest';

import type { Lesson } from '../lib/index.js';

import { extractTeacherTips } from './teacher-tip-extractor.js';

describe('extractTeacherTips', () => {
  const createLesson = (overrides: Partial<Lesson>): Lesson => ({
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'english',
    subjectTitle: 'English',
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

  it('extracts teacher tips from a lesson', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        teacherTips: [
          { teacherTip: 'Use visual aids for this concept' },
          { teacherTip: 'Allow extra time for discussion' },
        ],
      }),
    ];

    const result = extractTeacherTips(lessons);

    expect(result).toHaveLength(2);
    expect(result[0].tip).toBe('Use visual aids for this concept');
  });

  it('preserves lesson context', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'poetry-lesson',
        lessonTitle: 'Introduction to Poetry',
        subjectSlug: 'english',
        keyStageSlug: 'ks3',
        teacherTips: [{ teacherTip: 'Read aloud' }],
      }),
    ];

    const result = extractTeacherTips(lessons);

    expect(result[0].lessonSlug).toBe('poetry-lesson');
    expect(result[0].subject).toBe('english');
    expect(result[0].keyStage).toBe('ks3');
  });

  it('filters empty teacher tips', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        teacherTips: [{ teacherTip: '' }, { teacherTip: '   ' }, { teacherTip: 'Valid tip' }],
      }),
    ];

    const result = extractTeacherTips(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].tip).toBe('Valid tip');
  });
});
