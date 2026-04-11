/**
 * Integration test proving that unit documents get correct lesson counts
 * from aggregated lesson data, not truncated unitLessons arrays.
 *
 * This test would have caught the bug where 3 units had incorrect counts.
 */

import { describe, it, expect } from 'vitest';
import {
  buildLessonsByUnit,
  aggregateLessonsBySlug,
  type LessonUnitGroup,
} from './lesson-aggregation';
import { createUnitDocument } from './document-transforms';
import type { SearchUnitSummary } from '../../types/oak';
import type { UnitContextMap } from './ks4-context-builder';

function requireOakUrl(summary: SearchUnitSummary): string {
  if (!summary.oakUrl) {
    throw new Error('Test fixture missing oakUrl');
  }
  return summary.oakUrl;
}

describe('Unit Lesson Count Correctness', () => {
  const emptyContextMap: UnitContextMap = new Map();

  it('unit document uses aggregated lesson count, not truncated unitLessons', () => {
    // Simulate the paginated lessons endpoint returning ALL lessons
    const paginatedLessons: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'compound-measures',
        unitTitle: 'Compound Measures',
        lessons: [
          { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
          { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2' },
          { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3' },
          { lessonSlug: 'lesson-4', lessonTitle: 'Lesson 4' },
          { lessonSlug: 'lesson-5', lessonTitle: 'Lesson 5' },
          { lessonSlug: 'lesson-6', lessonTitle: 'Lesson 6' },
          { lessonSlug: 'lesson-7', lessonTitle: 'Lesson 7' },
          { lessonSlug: 'lesson-8', lessonTitle: 'Lesson 8' },
          { lessonSlug: 'lesson-9', lessonTitle: 'Lesson 9' },
          { lessonSlug: 'lesson-10', lessonTitle: 'Lesson 10' },
          { lessonSlug: 'lesson-11', lessonTitle: 'Lesson 11' }, // The missing one!
        ],
      },
    ];

    // Aggregate lessons by slug
    const aggregatedLessons = aggregateLessonsBySlug(paginatedLessons);
    expect(aggregatedLessons.size).toBe(11);

    // Build lessonsByUnit map
    const lessonsByUnit = buildLessonsByUnit(aggregatedLessons);
    expect(lessonsByUnit.get('compound-measures')?.length).toBe(11);

    // Simulate the unit summary endpoint returning TRUNCATED unitLessons (only 10)
    const truncatedUnitSummary: SearchUnitSummary = {
      unitSlug: 'compound-measures',
      unitTitle: 'Compound Measures',
      yearSlug: 'year-10',
      year: 'Year 10',
      phaseSlug: 'secondary',
      subjectSlug: 'maths',
      keyStageSlug: 'ks4',
      notes: undefined,
      description: 'Test unit',
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
      whyThisWhyNow: 'Test',
      threads: undefined,
      categories: undefined,
      unitLessons: [
        // TRUNCATED - only 10 lessons, missing lesson-11
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', lessonOrder: 1, state: 'published' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', lessonOrder: 2, state: 'published' },
        { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3', lessonOrder: 3, state: 'published' },
        { lessonSlug: 'lesson-4', lessonTitle: 'Lesson 4', lessonOrder: 4, state: 'published' },
        { lessonSlug: 'lesson-5', lessonTitle: 'Lesson 5', lessonOrder: 5, state: 'published' },
        { lessonSlug: 'lesson-6', lessonTitle: 'Lesson 6', lessonOrder: 6, state: 'published' },
        { lessonSlug: 'lesson-7', lessonTitle: 'Lesson 7', lessonOrder: 7, state: 'published' },
        { lessonSlug: 'lesson-8', lessonTitle: 'Lesson 8', lessonOrder: 8, state: 'published' },
        { lessonSlug: 'lesson-9', lessonTitle: 'Lesson 9', lessonOrder: 9, state: 'published' },
        { lessonSlug: 'lesson-10', lessonTitle: 'Lesson 10', lessonOrder: 10, state: 'published' },
      ],
      oakUrl: 'https://test.com/units/compound-measures',
    };

    // Create unit document WITH lessonsByUnit map
    const unitDocWithAggregation = createUnitDocument({
      summary: truncatedUnitSummary,
      subject: 'maths',
      keyStage: 'ks4',
      subjectProgrammesUrl: 'https://test.com',
      unitUrl: requireOakUrl(truncatedUnitSummary),
      unitContextMap: emptyContextMap,
      lessonsByUnit, // ← This should override truncated unitLessons
    });

    // CRITICAL ASSERTION: Unit document must have 11 lessons, not 10
    expect(unitDocWithAggregation.lesson_count).toBe(11);
    expect(unitDocWithAggregation.lesson_ids).toHaveLength(11);
    expect(unitDocWithAggregation.lesson_ids).toContain('lesson-11');

    // Create unit document WITHOUT lessonsByUnit (fallback to truncated)
    const unitDocWithoutAggregation = createUnitDocument({
      summary: truncatedUnitSummary,
      subject: 'maths',
      keyStage: 'ks4',
      subjectProgrammesUrl: 'https://test.com',
      unitUrl: requireOakUrl(truncatedUnitSummary),
      unitContextMap: emptyContextMap,
      // No lessonsByUnit - falls back to truncated unitLessons
    });

    // This WILL be wrong (10 instead of 11)
    expect(unitDocWithoutAggregation.lesson_count).toBe(10);
    expect(unitDocWithoutAggregation.lesson_ids).toHaveLength(10);
    expect(unitDocWithoutAggregation.lesson_ids).not.toContain('lesson-11');
  });

  it('lesson_ids array is correctly converted from readonly to mutable', () => {
    const paginatedLessons: readonly LessonUnitGroup[] = [
      {
        unitSlug: 'test-unit',
        unitTitle: 'Test Unit',
        lessons: [
          { lessonSlug: 'lesson-a', lessonTitle: 'Lesson A' },
          { lessonSlug: 'lesson-b', lessonTitle: 'Lesson B' },
        ],
      },
    ];

    const aggregatedLessons = aggregateLessonsBySlug(paginatedLessons);
    const lessonsByUnit = buildLessonsByUnit(aggregatedLessons);

    const summary: SearchUnitSummary = {
      unitSlug: 'test-unit',
      unitTitle: 'Test Unit',
      yearSlug: 'year-10',
      year: 'Year 10',
      phaseSlug: 'secondary',
      subjectSlug: 'maths',
      keyStageSlug: 'ks4',
      notes: undefined,
      description: 'Test',
      priorKnowledgeRequirements: [],
      nationalCurriculumContent: [],
      whyThisWhyNow: 'Test',
      threads: undefined,
      categories: undefined,
      unitLessons: [],
      oakUrl: 'https://test.com',
    };

    const unitDoc = createUnitDocument({
      summary,
      subject: 'maths',
      keyStage: 'ks4',
      subjectProgrammesUrl: 'https://test.com',
      unitUrl: requireOakUrl(summary),
      unitContextMap: emptyContextMap,
      lessonsByUnit,
    });

    // lesson_ids should be a mutable array (string[]), not readonly
    expect(Array.isArray(unitDoc.lesson_ids)).toBe(true);
    expect(unitDoc.lesson_ids).toEqual(['lesson-a', 'lesson-b']);
  });
});
