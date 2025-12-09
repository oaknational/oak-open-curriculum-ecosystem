/**
 * Unit tests for index-bulk-helpers functions.
 *
 * Tests the deriveLessonGroupsFromUnitSummaries function which extracts
 * lesson groups from unit summaries instead of the paginated lessons endpoint.
 *
 * @module index-bulk-helpers.unit.test
 */
import { describe, it, expect } from 'vitest';
import { deriveLessonGroupsFromUnitSummaries } from './index-bulk-helpers';

describe('deriveLessonGroupsFromUnitSummaries', () => {
  it('extracts lesson groups from unit summaries', () => {
    const unitSummaries = new Map<string, unknown>();
    unitSummaries.set('unit-1', {
      unitSlug: 'unit-1',
      unitTitle: 'Unit One',
      canonicalUrl: 'https://example.com/unit-1',
      unitLessons: [
        { lessonSlug: 'lesson-1a', lessonTitle: 'Lesson 1A', state: 'published' },
        { lessonSlug: 'lesson-1b', lessonTitle: 'Lesson 1B', state: 'published' },
      ],
    });
    unitSummaries.set('unit-2', {
      unitSlug: 'unit-2',
      unitTitle: 'Unit Two',
      canonicalUrl: 'https://example.com/unit-2',
      unitLessons: [{ lessonSlug: 'lesson-2a', lessonTitle: 'Lesson 2A', state: 'published' }],
    });

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual({
      unitSlug: 'unit-1',
      unitTitle: 'Unit One',
      lessons: [
        { lessonSlug: 'lesson-1a', lessonTitle: 'Lesson 1A' },
        { lessonSlug: 'lesson-1b', lessonTitle: 'Lesson 1B' },
      ],
    });
    expect(groups[1]).toEqual({
      unitSlug: 'unit-2',
      unitTitle: 'Unit Two',
      lessons: [{ lessonSlug: 'lesson-2a', lessonTitle: 'Lesson 2A' }],
    });
  });

  it('skips units with empty unitLessons array', () => {
    const unitSummaries = new Map<string, unknown>();
    unitSummaries.set('unit-with-lessons', {
      unitSlug: 'unit-with-lessons',
      unitTitle: 'Unit With Lessons',
      canonicalUrl: 'https://example.com/unit-with-lessons',
      unitLessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', state: 'published' }],
    });
    unitSummaries.set('unit-no-lessons', {
      unitSlug: 'unit-no-lessons',
      unitTitle: 'Unit Without Lessons',
      canonicalUrl: 'https://example.com/unit-no-lessons',
      unitLessons: [],
    });

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.unitSlug).toBe('unit-with-lessons');
  });

  it('skips units with missing unitLessons field', () => {
    const unitSummaries = new Map<string, unknown>();
    unitSummaries.set('unit-with-lessons', {
      unitSlug: 'unit-with-lessons',
      unitTitle: 'Unit With Lessons',
      canonicalUrl: 'https://example.com/unit-with-lessons',
      unitLessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', state: 'published' }],
    });
    unitSummaries.set('unit-missing-field', {
      unitSlug: 'unit-missing-field',
      unitTitle: 'Unit Missing unitLessons',
      canonicalUrl: 'https://example.com/unit-missing-field',
      // unitLessons field is missing
    });

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.unitSlug).toBe('unit-with-lessons');
  });

  it('filters out invalid lesson entries within unitLessons', () => {
    const unitSummaries = new Map<string, unknown>();
    unitSummaries.set('unit-1', {
      unitSlug: 'unit-1',
      unitTitle: 'Unit One',
      canonicalUrl: 'https://example.com/unit-1',
      unitLessons: [
        { lessonSlug: 'valid-lesson', lessonTitle: 'Valid Lesson', state: 'published' },
        { lessonSlug: '', lessonTitle: 'Missing slug', state: 'published' },
        { lessonSlug: 'missing-title', lessonTitle: '', state: 'published' },
        null,
        'not-an-object',
      ],
    });

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.lessons).toHaveLength(1);
    expect(groups[0]?.lessons[0]?.lessonSlug).toBe('valid-lesson');
  });

  it('returns empty array for empty unitSummaries map', () => {
    const unitSummaries = new Map<string, unknown>();

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(0);
  });

  it('handles many units with many lessons correctly', () => {
    const unitSummaries = new Map<string, unknown>();

    // Simulate 36 units with varying lesson counts (like Maths KS4)
    for (let i = 1; i <= 36; i++) {
      const lessonCount = Math.floor(Math.random() * 20) + 5; // 5-24 lessons per unit
      const unitLessons = Array.from({ length: lessonCount }, (_, j) => ({
        lessonSlug: `unit-${i}-lesson-${j + 1}`,
        lessonTitle: `Unit ${i} Lesson ${j + 1}`,
        state: 'published',
      }));

      unitSummaries.set(`unit-${i}`, {
        unitSlug: `unit-${i}`,
        unitTitle: `Unit ${i}`,
        canonicalUrl: `https://example.com/unit-${i}`,
        unitLessons,
      });
    }

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    // All 36 units should have groups
    expect(groups).toHaveLength(36);

    // All groups should have lessons
    for (const group of groups) {
      expect(group.lessons.length).toBeGreaterThanOrEqual(5);
    }
  });
});
