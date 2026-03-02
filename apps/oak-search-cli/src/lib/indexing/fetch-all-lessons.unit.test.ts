/**
 * Unit tests for fetchAllLessonsWithPagination.
 *
 * Tests that the function correctly exhausts paginated API responses
 * and aggregates lessons by slug.
 *
 * All SDK methods return `Result<T, SdkFetchError>` per ADR-088.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */
import { describe, it, expect } from 'vitest';
import {
  fetchAllLessonsWithPagination,
  fetchAllLessonsByUnit,
  type GetLessonsFn,
} from './fetch-all-lessons';
import type { LessonGroupResponse, LessonsPaginationOptions } from '../../adapters/oak-adapter';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import { ok, type Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/curriculum-sdk';

/**
 * Helper to create a mock GetLessonsFn from a simple data-returning function.
 * Wraps the data in ok() Result for ADR-088 compliance.
 */
function createMockGetLessons(
  fn: (
    keyStage: KeyStage,
    subject: SearchSubjectSlug,
    options?: LessonsPaginationOptions,
  ) => readonly LessonGroupResponse[],
): GetLessonsFn {
  return async (ks, subj, opts): Promise<Result<readonly LessonGroupResponse[], SdkFetchError>> => {
    return ok(fn(ks, subj, opts));
  };
}

describe('fetchAllLessonsWithPagination', () => {
  it('exhausts paginated responses and aggregates lessons', async () => {
    // Simulate 3 pages of results
    const mockGetLessons = createMockGetLessons((ks, subj, options = {}) => {
      // Verify parameters are passed correctly
      expect(ks).toBe('ks4');
      expect(subj).toBe('maths');
      const offset = options.offset ?? 0;

      if (offset === 0) {
        return [
          {
            unitSlug: 'unit-1',
            unitTitle: 'Unit 1',
            lessons: [
              { lessonSlug: 'lesson-a', lessonTitle: 'Lesson A' },
              { lessonSlug: 'lesson-b', lessonTitle: 'Lesson B' },
            ],
          },
        ];
      }
      if (offset === 100) {
        return [
          {
            unitSlug: 'unit-2',
            unitTitle: 'Unit 2',
            lessons: [
              { lessonSlug: 'lesson-c', lessonTitle: 'Lesson C' },
              { lessonSlug: 'lesson-a', lessonTitle: 'Lesson A' }, // Shared with unit-1
            ],
          },
        ];
      }
      // No more results
      return [];
    });

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    // Should have 3 unique lessons (a, b, c)
    expect(result.size).toBe(3);

    // Lesson A should belong to both units
    const lessonA = result.get('lesson-a');
    expect(lessonA?.unitSlugs).toEqual(new Set(['unit-1', 'unit-2']));

    // Lesson B should only belong to unit-1
    const lessonB = result.get('lesson-b');
    expect(lessonB?.unitSlugs).toEqual(new Set(['unit-1']));

    // Lesson C should only belong to unit-2
    const lessonC = result.get('lesson-c');
    expect(lessonC?.unitSlugs).toEqual(new Set(['unit-2']));
  });

  it('handles empty response on first page', async () => {
    const mockGetLessons = createMockGetLessons(() => []);

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    expect(result.size).toBe(0);
  });

  it('handles single page response', async () => {
    const mockGetLessons = createMockGetLessons((ks, subj, options = {}) => {
      expect(ks).toBe('ks4');
      expect(subj).toBe('maths');
      const offset = options.offset ?? 0;
      if (offset === 0) {
        return [
          {
            unitSlug: 'only-unit',
            unitTitle: 'Only Unit',
            lessons: [{ lessonSlug: 'only-lesson', lessonTitle: 'Only Lesson' }],
          },
        ];
      }
      return [];
    });

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    expect(result.size).toBe(1);
    expect(result.get('only-lesson')).toBeDefined();
  });

  it('handles many pages (simulating 650+ lessons)', async () => {
    // Simulate 7 pages of 100 lessons each
    const mockGetLessons = createMockGetLessons((ks, subj, options = {}) => {
      expect(ks).toBe('ks4');
      expect(subj).toBe('maths');
      const offset = options.offset ?? 0;
      const pageNumber = offset / 100;

      if (pageNumber >= 7) {
        return [];
      }

      // Each page has 100 lessons from 10 units with 10 lessons each
      const groups: LessonGroupResponse[] = [];
      for (let u = 0; u < 10; u++) {
        const lessons = [];
        for (let l = 0; l < 10; l++) {
          const lessonIndex = pageNumber * 100 + u * 10 + l;
          lessons.push({
            lessonSlug: `lesson-${lessonIndex}`,
            lessonTitle: `Lesson ${lessonIndex}`,
          });
        }
        groups.push({
          unitSlug: `unit-page${pageNumber}-${u}`,
          unitTitle: `Unit Page ${pageNumber} - ${u}`,
          lessons,
        });
      }
      return groups;
    });

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    // Should have 700 unique lessons (7 pages * 100 lessons)
    expect(result.size).toBe(700);
  });
});

describe('fetchAllLessonsByUnit', () => {
  it('fetches lessons for each unit and aggregates', async () => {
    // Simulate fetching lessons for 3 units
    const mockGetLessons = createMockGetLessons((ks, subj, options = {}) => {
      expect(ks).toBe('ks4');
      expect(subj).toBe('maths');
      const { unit } = options;

      if (unit === 'compound-measures') {
        return [
          {
            unitSlug: 'compound-measures',
            unitTitle: 'Compound Measures',
            lessons: [
              { lessonSlug: 'compound-measures-for-speed', lessonTitle: 'Speed' },
              { lessonSlug: 'compound-measures-for-density', lessonTitle: 'Density' },
              {
                lessonSlug: 'problem-solving-with-compound-measures',
                lessonTitle: 'Problem Solving',
              },
            ],
          },
        ];
      }

      if (unit === 'angles') {
        return [
          {
            unitSlug: 'angles',
            unitTitle: 'Angles',
            lessons: [
              { lessonSlug: 'basic-angle-facts', lessonTitle: 'Basic Angles' },
              { lessonSlug: 'exterior-angles', lessonTitle: 'Exterior Angles' },
              {
                lessonSlug: 'problem-solving-with-compound-measures',
                lessonTitle: 'Problem Solving',
              }, // Shared lesson!
            ],
          },
        ];
      }

      if (unit === 'surds') {
        return [
          {
            unitSlug: 'surds',
            unitTitle: 'Surds',
            lessons: [{ lessonSlug: 'simplifying-surds', lessonTitle: 'Simplifying' }],
          },
        ];
      }

      return [];
    });

    const result = await fetchAllLessonsByUnit(mockGetLessons, 'ks4', 'maths', [
      'compound-measures',
      'angles',
      'surds',
    ]);

    // Should have 6 unique lessons (all lessons from all 3 units)
    // compound-measures: 3 lessons
    // angles: 3 lessons (1 shared with compound-measures)
    // surds: 1 lesson
    // Total unique: 3 + 2 (angles-only) + 1 = 6
    expect(result.size).toBe(6);

    // Check the shared lesson belongs to both units
    const sharedLesson = result.get('problem-solving-with-compound-measures');
    expect(sharedLesson?.unitSlugs).toEqual(new Set(['compound-measures', 'angles']));

    // Check other lessons belong to single units
    expect(result.get('compound-measures-for-speed')?.unitSlugs).toEqual(
      new Set(['compound-measures']),
    );
    expect(result.get('exterior-angles')?.unitSlugs).toEqual(new Set(['angles']));
    expect(result.get('simplifying-surds')?.unitSlugs).toEqual(new Set(['surds']));
  });

  it('handles empty unit list', async () => {
    const mockGetLessons = createMockGetLessons(() => {
      throw new Error('Should not be called');
    });

    const result = await fetchAllLessonsByUnit(mockGetLessons, 'ks4', 'maths', []);

    expect(result.size).toBe(0);
  });

  it('handles units with no lessons', async () => {
    const mockGetLessons = createMockGetLessons(() => []);

    const result = await fetchAllLessonsByUnit(mockGetLessons, 'ks4', 'maths', ['empty-unit']);

    expect(result.size).toBe(0);
  });

  it('correctly handles lesson-unit pairs (tier variants)', async () => {
    // Simulate API returning duplicate lessons for different tiers
    const mockGetLessons = createMockGetLessons((ks, subj, options = {}) => {
      expect(ks).toBe('ks4');
      expect(subj).toBe('maths');
      const { unit } = options;

      if (unit === 'algebra') {
        return [
          {
            unitSlug: 'algebra',
            unitTitle: 'Algebra',
            lessons: [
              { lessonSlug: 'factorising', lessonTitle: 'Factorising' },
              { lessonSlug: 'factorising', lessonTitle: 'Factorising' }, // Foundation tier
              { lessonSlug: 'solving-quadratics', lessonTitle: 'Solving Quadratics' },
              { lessonSlug: 'solving-quadratics', lessonTitle: 'Solving Quadratics' }, // Higher tier
            ],
          },
        ];
      }

      return [];
    });

    const result = await fetchAllLessonsByUnit(mockGetLessons, 'ks4', 'maths', ['algebra']);

    // Should deduplicate to 2 unique lessons
    expect(result.size).toBe(2);
    expect(result.get('factorising')).toBeDefined();
    expect(result.get('solving-quadratics')).toBeDefined();
  });
});
