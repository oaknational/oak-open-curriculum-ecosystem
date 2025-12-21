/**
 * Unit tests for lesson aggregation functions.
 *
 * These tests verify that lessons are correctly aggregated by slug,
 * collecting ALL unit relationships rather than just deduplicating.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */
import { describe, it, expect } from 'vitest';
import { aggregateLessonsBySlug, type LessonUnitGroup } from './lesson-aggregation';

describe('aggregateLessonsBySlug', () => {
  it('aggregates a single page with distinct lessons', () => {
    const pages: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'unit-1',
        unitTitle: 'Unit One',
        lessons: [
          { lessonSlug: 'lesson-a', lessonTitle: 'Lesson A' },
          { lessonSlug: 'lesson-b', lessonTitle: 'Lesson B' },
        ],
      },
    ];

    const result = aggregateLessonsBySlug(pages);

    expect(result.size).toBe(2);
    expect(result.get('lesson-a')).toEqual({
      lessonSlug: 'lesson-a',
      lessonTitle: 'Lesson A',
      unitSlugs: new Set(['unit-1']),
    });
    expect(result.get('lesson-b')).toEqual({
      lessonSlug: 'lesson-b',
      lessonTitle: 'Lesson B',
      unitSlugs: new Set(['unit-1']),
    });
  });

  it('aggregates lessons that appear in multiple units', () => {
    const pages: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'unit-foundation',
        unitTitle: 'Foundation Tier',
        lessons: [{ lessonSlug: 'shared-lesson', lessonTitle: 'Shared Lesson' }],
      },
      {
        unitSlug: 'unit-higher',
        unitTitle: 'Higher Tier',
        lessons: [{ lessonSlug: 'shared-lesson', lessonTitle: 'Shared Lesson' }],
      },
    ];

    const result = aggregateLessonsBySlug(pages);

    expect(result.size).toBe(1);
    const sharedLesson = result.get('shared-lesson');
    expect(sharedLesson).toBeDefined();
    expect(sharedLesson?.unitSlugs).toEqual(new Set(['unit-foundation', 'unit-higher']));
  });

  it('handles the algebraic-fractions case with 8+ lessons', () => {
    // This simulates the real scenario: algebraic-fractions has 8 unique lessons
    // but they may appear across different tier variants
    const pages: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'algebraic-fractions-foundation',
        unitTitle: 'Algebraic Fractions (Foundation)',
        lessons: [
          { lessonSlug: 'lesson-1', lessonTitle: 'Adding algebraic fractions' },
          { lessonSlug: 'lesson-2', lessonTitle: 'Subtracting algebraic fractions' },
          { lessonSlug: 'lesson-3', lessonTitle: 'Multiplying algebraic fractions' },
          { lessonSlug: 'lesson-4', lessonTitle: 'Dividing algebraic fractions' },
        ],
      },
      {
        unitSlug: 'algebraic-fractions-higher',
        unitTitle: 'Algebraic Fractions (Higher)',
        lessons: [
          { lessonSlug: 'lesson-1', lessonTitle: 'Adding algebraic fractions' },
          { lessonSlug: 'lesson-2', lessonTitle: 'Subtracting algebraic fractions' },
          { lessonSlug: 'lesson-3', lessonTitle: 'Multiplying algebraic fractions' },
          { lessonSlug: 'lesson-4', lessonTitle: 'Dividing algebraic fractions' },
          { lessonSlug: 'lesson-5', lessonTitle: 'Simplifying complex fractions' },
          { lessonSlug: 'lesson-6', lessonTitle: 'Equations with algebraic fractions' },
          { lessonSlug: 'lesson-7', lessonTitle: 'Inequalities with algebraic fractions' },
          { lessonSlug: 'lesson-8', lessonTitle: 'Problem solving with algebraic fractions' },
        ],
      },
    ];

    const result = aggregateLessonsBySlug(pages);

    // Should have 8 unique lessons, not 12
    expect(result.size).toBe(8);

    // Lessons 1-4 should belong to BOTH units
    const lesson1 = result.get('lesson-1');
    expect(lesson1?.unitSlugs).toEqual(
      new Set(['algebraic-fractions-foundation', 'algebraic-fractions-higher']),
    );

    // Lessons 5-8 should only belong to higher tier
    const lesson5 = result.get('lesson-5');
    expect(lesson5?.unitSlugs).toEqual(new Set(['algebraic-fractions-higher']));
  });

  it('handles empty input', () => {
    const result = aggregateLessonsBySlug([]);
    expect(result.size).toBe(0);
  });

  it('handles units with no lessons', () => {
    const pages: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'empty-unit',
        unitTitle: 'Empty Unit',
        lessons: [],
      },
    ];

    const result = aggregateLessonsBySlug(pages);
    expect(result.size).toBe(0);
  });

  it('preserves the first lesson title encountered', () => {
    // If the same lesson appears with slightly different titles (edge case),
    // we keep the first one encountered
    const pages: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'unit-a',
        unitTitle: 'Unit A',
        lessons: [{ lessonSlug: 'lesson-x', lessonTitle: 'Lesson X (Version 1)' }],
      },
      {
        unitSlug: 'unit-b',
        unitTitle: 'Unit B',
        lessons: [{ lessonSlug: 'lesson-x', lessonTitle: 'Lesson X (Version 2)' }],
      },
    ];

    const result = aggregateLessonsBySlug(pages);

    expect(result.size).toBe(1);
    const lesson = result.get('lesson-x');
    expect(lesson?.lessonTitle).toBe('Lesson X (Version 1)');
    expect(lesson?.unitSlugs).toEqual(new Set(['unit-a', 'unit-b']));
  });
});
