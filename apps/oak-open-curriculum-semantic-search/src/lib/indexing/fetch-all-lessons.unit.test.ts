/**
 * Unit tests for fetchAllLessonsWithPagination.
 *
 * Tests that the function correctly exhausts paginated API responses
 * and aggregates lessons by slug.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */
import { describe, it, expect } from 'vitest';
import { fetchAllLessonsWithPagination } from './fetch-all-lessons';
import type { LessonGroupResponse, LessonsPaginationOptions } from '../../adapters/oak-adapter-sdk';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

/** Simple mock for the getLessonsByKeyStageAndSubject function. */
type MockGetLessonsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  options?: LessonsPaginationOptions,
) => Promise<readonly LessonGroupResponse[]>;

describe('fetchAllLessonsWithPagination', () => {
  it('exhausts paginated responses and aggregates lessons', async () => {
    // Simulate 3 pages of results
    const mockGetLessons: MockGetLessonsFn = async (ks, subj, options = {}) => {
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
    };

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
    const mockGetLessons: MockGetLessonsFn = async () => [];

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    expect(result.size).toBe(0);
  });

  it('handles single page response', async () => {
    const mockGetLessons: MockGetLessonsFn = async (ks, subj, options = {}) => {
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
    };

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    expect(result.size).toBe(1);
    expect(result.get('only-lesson')).toBeDefined();
  });

  it('handles many pages (simulating 650+ lessons)', async () => {
    // Simulate 7 pages of 100 lessons each
    const mockGetLessons: MockGetLessonsFn = async (ks, subj, options = {}) => {
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
    };

    const result = await fetchAllLessonsWithPagination(mockGetLessons, 'ks4', 'maths');

    // Should have 700 unique lessons (7 pages * 100 lessons)
    expect(result.size).toBe(700);
  });
});
