/**
 * Unit tests for keyword extraction from bulk download data.
 *
 * @remarks
 * Tests the pure extraction function that processes lessons and returns
 * deduplicated keywords with frequency, subject, and year metadata.
 */
import { describe, expect, it } from 'vitest';

import type { Lesson } from '../lib/index.js';

import { extractKeywords, normaliseKeyword } from './keyword-extractor.js';

describe('normaliseKeyword', () => {
  it('converts to lowercase', () => {
    expect(normaliseKeyword('Photosynthesis')).toBe('photosynthesis');
  });

  it('trims whitespace', () => {
    expect(normaliseKeyword('  fraction  ')).toBe('fraction');
  });

  it('handles mixed case and whitespace', () => {
    expect(normaliseKeyword('  Mixed Case  ')).toBe('mixed case');
  });
});

describe('extractKeywords', () => {
  const createLesson = (
    overrides: Partial<Lesson> & { lessonKeywords: Lesson['lessonKeywords'] },
  ): Lesson => ({
    lessonTitle: 'Test Lesson',
    lessonSlug: 'test-lesson',
    unitSlug: 'test-unit',
    unitTitle: 'Test Unit',
    subjectSlug: 'maths',
    subjectTitle: 'Maths',
    keyStageSlug: 'ks2',
    keyStageTitle: 'Key Stage 2',
    keyLearningPoints: [],
    misconceptionsAndCommonMistakes: [],
    pupilLessonOutcome: 'Test outcome',
    teacherTips: [],
    contentGuidance: undefined,
    downloadsavailable: true,
    supervisionLevel: undefined,
    ...overrides,
  });

  it('extracts keywords from a single lesson', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'fractions-lesson',
        subjectSlug: 'maths',
        keyStageSlug: 'ks2',
        lessonKeywords: [
          { keyword: 'fraction', description: 'Part of a whole' },
          { keyword: 'numerator', description: 'Top number in a fraction' },
        ],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result).toHaveLength(2);
    expect(result.find((k) => k.term === 'fraction')).toBeDefined();
    expect(result.find((k) => k.term === 'numerator')).toBeDefined();
  });

  it('deduplicates keywords by normalised form', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-1',
        lessonKeywords: [{ keyword: 'Fraction', description: 'Part of a whole' }],
      }),
      createLesson({
        lessonSlug: 'lesson-2',
        lessonKeywords: [{ keyword: 'fraction', description: 'A portion' }],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].term).toBe('fraction');
  });

  it('counts frequency across lessons', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-1',
        lessonKeywords: [{ keyword: 'fraction', description: 'Part of a whole' }],
      }),
      createLesson({
        lessonSlug: 'lesson-2',
        lessonKeywords: [{ keyword: 'fraction', description: 'A portion' }],
      }),
      createLesson({
        lessonSlug: 'lesson-3',
        lessonKeywords: [{ keyword: 'fraction', description: 'Part' }],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result[0].frequency).toBe(3);
  });

  it('collects all lesson slugs where keyword appears', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-a',
        lessonKeywords: [{ keyword: 'photosynthesis', description: 'Plant process' }],
      }),
      createLesson({
        lessonSlug: 'lesson-b',
        lessonKeywords: [{ keyword: 'photosynthesis', description: 'Making food' }],
      }),
    ];

    const result = extractKeywords(lessons);
    const keyword = result.find((k) => k.term === 'photosynthesis');

    expect(keyword?.lessonSlugs).toContain('lesson-a');
    expect(keyword?.lessonSlugs).toContain('lesson-b');
  });

  it('tracks subjects where keyword is used', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'science-lesson',
        subjectSlug: 'science',
        lessonKeywords: [{ keyword: 'energy', description: 'Ability to do work' }],
      }),
      createLesson({
        lessonSlug: 'pe-lesson',
        subjectSlug: 'physical-education',
        lessonKeywords: [{ keyword: 'energy', description: 'Power for activity' }],
      }),
    ];

    const result = extractKeywords(lessons);
    const keyword = result.find((k) => k.term === 'energy');

    expect(keyword?.subjects).toContain('science');
    expect(keyword?.subjects).toContain('physical-education');
    expect(keyword?.subjects).toHaveLength(2);
  });

  it('determines first year of introduction from key stage', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'ks3-lesson',
        keyStageSlug: 'ks3',
        lessonKeywords: [{ keyword: 'algebra', description: 'Using letters' }],
      }),
      createLesson({
        lessonSlug: 'ks2-lesson',
        keyStageSlug: 'ks2',
        lessonKeywords: [{ keyword: 'algebra', description: 'Letter patterns' }],
      }),
    ];

    const result = extractKeywords(lessons);
    const keyword = result.find((k) => k.term === 'algebra');

    // KS2 starts at year 3, so firstYear should be 3
    expect(keyword?.firstYear).toBe(3);
  });

  it('uses first definition encountered as canonical', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-1',
        lessonKeywords: [{ keyword: 'denominator', description: 'Bottom of fraction' }],
      }),
      createLesson({
        lessonSlug: 'lesson-2',
        lessonKeywords: [{ keyword: 'denominator', description: 'Number below the line' }],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result[0].definition).toBe('Bottom of fraction');
  });

  it('returns empty array for lessons with no keywords', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'no-keywords',
        lessonKeywords: [],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result).toHaveLength(0);
  });

  it('handles empty lessons array', () => {
    const result = extractKeywords([]);

    expect(result).toHaveLength(0);
  });
});
