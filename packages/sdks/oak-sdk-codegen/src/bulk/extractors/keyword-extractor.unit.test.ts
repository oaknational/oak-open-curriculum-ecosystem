/**
 * Unit tests for keyword extraction from bulk download data.
 *
 * @remarks
 * Tests the pure extraction function that processes lessons and returns
 * deduplicated keywords with frequency, subject, and year metadata, plus the
 * `normaliseKeyword` mint contract the graph-corpus keyword node id rests on
 * (plan `graph-tools-value-redesign`, deliverable G4b: id =
 * `keyword:<normalised-term>`; the normalisation is deliberately lc+trim and
 * nothing more).
 */
import { describe, expect, it } from 'vitest';

import type { Lesson } from '../../types/generated/bulk/index.js';

import { extractKeywords, normaliseKeyword } from './keyword-extractor.js';

describe('normaliseKeyword (the G4b id-mint contract: lc+trim, nothing more)', () => {
  it('converts to lowercase', () => {
    expect(normaliseKeyword('Photosynthesis')).toBe('photosynthesis');
  });

  it('trims whitespace', () => {
    expect(normaliseKeyword('  fraction  ')).toBe('fraction');
  });

  it('handles mixed case and whitespace', () => {
    expect(normaliseKeyword('  Mixed Case  ')).toBe('mixed case');
  });

  it('preserves internal whitespace (only the ends are trimmed)', () => {
    expect(normaliseKeyword('plum pudding model')).toBe('plum pudding model');
  });

  it('preserves punctuation and diacritics (no over-built unicode layer)', () => {
    expect(normaliseKeyword("Rutherford's experiment")).toBe("rutherford's experiment");
    expect(normaliseKeyword('Café')).toBe('café');
  });

  it('is idempotent (normalising a normalised term is a no-op)', () => {
    const once = normaliseKeyword('  Plum Pudding Model  ');
    expect(normaliseKeyword(once)).toBe(once);
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
    contentGuidance: null,
    downloadsavailable: true,
    supervisionLevel: null,
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

  it('counts every occurrence — frequency can exceed the unique-lesson count', () => {
    // A lesson repeating the same normalised keyword contributes one lesson
    // slug but two occurrences; `lessonSlugs` carries the unique set (the
    // graph-corpus keyword node derives ITS frequency from lessonSlugs).
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'repeating-lesson',
        lessonKeywords: [
          { keyword: 'fraction', description: 'Part of a whole' },
          { keyword: 'Fraction', description: 'Part of a whole (restated)' },
        ],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result).toHaveLength(1);
    expect(result[0].frequency).toBe(2);
    expect(result[0].lessonSlugs).toEqual(['repeating-lesson']);
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

  it('preserves the first-occurrence casing as the display term', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-1',
        lessonKeywords: [{ keyword: "Rutherford's experiment", description: 'Gold foil' }],
      }),
      createLesson({
        lessonSlug: 'lesson-2',
        lessonKeywords: [{ keyword: "rutherford's experiment", description: 'Alpha particles' }],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result[0].term).toBe("rutherford's experiment");
    expect(result[0].displayTerm).toBe("Rutherford's experiment");
  });

  it('trims the display term without changing its casing', () => {
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-1',
        lessonKeywords: [{ keyword: '  Plum Pudding Model  ', description: 'Atomic model' }],
      }),
    ];

    const result = extractKeywords(lessons);

    expect(result[0].term).toBe('plum pudding model');
    expect(result[0].displayTerm).toBe('Plum Pudding Model');
  });

  it('extracts identically regardless of lesson arrival order (deterministic first-occurrence)', () => {
    // The bulk file enumeration is an unsorted readdir, so "first occurrence"
    // must be defined by a deterministic order (lessonSlug), never by
    // encounter order — otherwise definition and displayTerm drift between
    // regenerations of the same logical corpus.
    const lessons: readonly Lesson[] = [
      createLesson({
        lessonSlug: 'lesson-a',
        subjectSlug: 'science',
        lessonKeywords: [{ keyword: 'Energy', description: 'Ability to do work' }],
      }),
      createLesson({
        lessonSlug: 'lesson-b',
        subjectSlug: 'physical-education',
        lessonKeywords: [{ keyword: 'energy', description: 'Power for activity' }],
      }),
    ];

    const forward = extractKeywords(lessons);
    const reversed = extractKeywords([...lessons].reverse());

    expect(reversed).toEqual(forward);
    expect(forward[0].definition).toBe('Ability to do work');
    expect(forward[0].displayTerm).toBe('Energy');
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
