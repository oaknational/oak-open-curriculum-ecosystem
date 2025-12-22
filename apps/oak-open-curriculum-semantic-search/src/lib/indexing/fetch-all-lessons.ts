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
 * **DEPRECATED**: Use `fetchAllLessonsByUnit` instead. This function has a known
 * issue where the upstream API doesn't return all lessons when fetching without
 * a unit filter (returns 431 instead of 436 for Maths KS4).
 *
 * @param getLessons - Function to fetch a page of lessons (injected for testability)
 * @param keyStage - Key stage to fetch lessons for
 * @param subject - Subject to fetch lessons for
 * @returns Map of lesson slugs to aggregated lesson data
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 * @see fetchAllLessonsByUnit for the correct implementation
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

/**
 * Fetches ALL lessons by fetching each unit individually.
 *
 * **WORKAROUND**: The upstream API `/key-stages/{ks}/subject/{subject}/lessons`
 * endpoint has a bug where it doesn't return all lessons when called without a
 * unit filter (returns 431 instead of 436 for Maths KS4). However, when filtering
 * by unit, it returns complete data. This function works around the API bug by:
 *
 * 1. Accepting a list of unit slugs
 * 2. Fetching lessons for each unit individually
 * 3. Aggregating all lessons across all units
 *
 * @param getLessons - Function to fetch a page of lessons (injected for testability)
 * @param keyStage - Key stage to fetch lessons for
 * @param subject - Subject to fetch lessons for
 * @param unitSlugs - Array of unit slugs to fetch lessons for
 * @returns Map of lesson slugs to aggregated lesson data
 *
 * @example
 * ```typescript
 * const client = createOakSdkClient();
 * const units = await client.getUnitsByKeyStageAndSubject('ks4', 'maths');
 * const unitSlugs = units.map(u => u.unitSlug);
 * const lessons = await fetchAllLessonsByUnit(
 *   client.getLessonsByKeyStageAndSubject,
 *   'ks4',
 *   'maths',
 *   unitSlugs
 * );
 * // lessons.size === 436 for Maths KS4 (complete data)
 * ```
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */
export async function fetchAllLessonsByUnit(
  getLessons: GetLessonsFn,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  unitSlugs: readonly string[],
): Promise<Map<string, AggregatedLesson>> {
  const allPages: LessonUnitGroup[] = [];

  // Fetch lessons for each unit
  for (const unitSlug of unitSlugs) {
    const unitLessons = await getLessons(keyStage, subject, { unit: unitSlug, limit: 100 });

    // Convert to LessonUnitGroup
    for (const group of unitLessons) {
      allPages.push({
        unitSlug: group.unitSlug,
        unitTitle: group.unitTitle,
        lessons: group.lessons,
      });
    }
  }

  // Aggregate by lesson slug (handles lessons that belong to multiple units)
  return aggregateLessonsBySlug(allPages);
}
