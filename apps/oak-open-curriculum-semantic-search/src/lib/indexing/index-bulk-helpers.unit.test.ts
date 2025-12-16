/**
 * Unit tests for index-bulk-helpers functions.
 *
 * Tests the deriveLessonGroupsFromUnitSummaries function which extracts
 * lesson groups from validated unit summaries.
 *
 * Note: The function now receives validated SearchUnitSummary data,
 * so defensive handling of malformed data is not needed - validation
 * happens at the SDK boundary (isUnitSummary type guard).
 *
 */
import { describe, it, expect } from 'vitest';
import { unitSummarySchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SearchUnitSummary } from '../../types/oak';
import { deriveLessonGroupsFromUnitSummaries } from './index-bulk-helpers';

/** Build a valid SearchUnitSummary fixture with required fields. */
function buildUnitSummary(overrides: Partial<SearchUnitSummary> = {}): SearchUnitSummary {
  const base = {
    unitSlug: 'unit-slug',
    unitTitle: 'Unit Title',
    yearSlug: 'year-10',
    year: 'Year 10',
    phaseSlug: 'secondary',
    subjectSlug: 'maths',
    keyStageSlug: 'ks4',
    priorKnowledgeRequirements: [],
    nationalCurriculumContent: [],
    unitLessons: [],
    canonicalUrl: 'https://teachers.thenational.academy/units/unit-slug',
    ...overrides,
  };
  // Validate to ensure fixture is correct
  return unitSummarySchema.parse(base);
}

describe('deriveLessonGroupsFromUnitSummaries', () => {
  it('extracts lesson groups from unit summaries', () => {
    const unitSummaries = new Map<string, SearchUnitSummary>();
    unitSummaries.set(
      'unit-1',
      buildUnitSummary({
        unitSlug: 'unit-1',
        unitTitle: 'Unit One',
        unitLessons: [
          { lessonSlug: 'lesson-1a', lessonTitle: 'Lesson 1A', state: 'published' },
          { lessonSlug: 'lesson-1b', lessonTitle: 'Lesson 1B', state: 'published' },
        ],
      }),
    );
    unitSummaries.set(
      'unit-2',
      buildUnitSummary({
        unitSlug: 'unit-2',
        unitTitle: 'Unit Two',
        unitLessons: [{ lessonSlug: 'lesson-2a', lessonTitle: 'Lesson 2A', state: 'published' }],
      }),
    );

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
    const unitSummaries = new Map<string, SearchUnitSummary>();
    unitSummaries.set(
      'unit-with-lessons',
      buildUnitSummary({
        unitSlug: 'unit-with-lessons',
        unitTitle: 'Unit With Lessons',
        unitLessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', state: 'published' }],
      }),
    );
    unitSummaries.set(
      'unit-no-lessons',
      buildUnitSummary({
        unitSlug: 'unit-no-lessons',
        unitTitle: 'Unit Without Lessons',
        unitLessons: [],
      }),
    );

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.unitSlug).toBe('unit-with-lessons');
  });

  it('returns empty array for empty unitSummaries map', () => {
    const unitSummaries = new Map<string, SearchUnitSummary>();

    const groups = deriveLessonGroupsFromUnitSummaries(unitSummaries);

    expect(groups).toHaveLength(0);
  });

  it('handles many units with many lessons correctly', () => {
    const unitSummaries = new Map<string, SearchUnitSummary>();

    // Simulate 36 units with varying lesson counts (like Maths KS4)
    for (let i = 1; i <= 36; i++) {
      const lessonCount = Math.floor(Math.random() * 20) + 5; // 5-24 lessons per unit
      const unitLessons = Array.from({ length: lessonCount }, (_, j) => ({
        lessonSlug: `unit-${i}-lesson-${j + 1}`,
        lessonTitle: `Unit ${i} Lesson ${j + 1}`,
        state: 'published' as const,
      }));

      unitSummaries.set(
        `unit-${i}`,
        buildUnitSummary({
          unitSlug: `unit-${i}`,
          unitTitle: `Unit ${i}`,
          unitLessons,
        }),
      );
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
