/**
 * Paginated lesson fetching utilities.
 *
 * These functions exhaust paginated API responses to fetch ALL lessons
 * for a subject/keystage pair, then aggregate them by lesson slug.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { LessonGroupResponse, LessonsPaginationOptions } from '../../adapters/oak-adapter-sdk';
import {
  aggregateLessonsBySlug,
  type AggregatedLesson,
  type LessonUnitGroup,
} from './lesson-aggregation';

/**
 * Function signature for fetching lessons by key stage and subject.
 *
 * This matches the OakClient.getLessonsByKeyStageAndSubject method signature.
 */
export type GetLessonsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  options?: LessonsPaginationOptions,
) => Promise<readonly LessonGroupResponse[]>;

/**
 * Exhausts paginated lesson responses and aggregates by lesson slug.
 *
 * This function:
 * 1. Fetches pages of lessons (limit=100) until empty response
 * 2. Aggregates all lessons by slug, collecting unit relationships
 * 3. Returns a Map of unique lessons with all their unit associations
 *
 * @param getLessons - Function to fetch a page of lessons (injected for testability)
 * @param keyStage - Key stage to fetch lessons for
 * @param subject - Subject to fetch lessons for
 * @returns Map of lesson slugs to aggregated lesson data
 *
 * @example
 * ```typescript
 * const client = createOakSdkClient();
 * const lessons = await fetchAllLessonsWithPagination(
 *   client.getLessonsByKeyStageAndSubject,
 *   'ks4',
 *   'maths'
 * );
 * // lessons.size === ~650 for Maths KS4
 * ```
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */
export async function fetchAllLessonsWithPagination(
  getLessons: GetLessonsFn,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
): Promise<Map<string, AggregatedLesson>> {
  const allPages: LessonUnitGroup[] = [];
  const limit = 100;
  let offset = 0;

  // Exhaust pagination
  while (true) {
    const page = await getLessons(keyStage, subject, { limit, offset });
    if (page.length === 0) {
      break;
    }

    // Convert LessonGroupResponse to LessonUnitGroup (compatible types)
    for (const group of page) {
      allPages.push({
        unitSlug: group.unitSlug,
        unitTitle: group.unitTitle,
        lessons: group.lessons,
      });
    }

    offset += limit;
  }

  // Aggregate by lesson slug
  return aggregateLessonsBySlug(allPages);
}
