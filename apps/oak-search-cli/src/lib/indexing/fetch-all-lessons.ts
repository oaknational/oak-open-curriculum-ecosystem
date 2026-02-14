/**
 * Paginated lesson fetching utilities.
 *
 * These functions exhaust paginated API responses to fetch ALL lessons
 * for a subject/keystage pair, then aggregate them by lesson slug.
 *
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { LessonGroupResponse, LessonsPaginationOptions } from '../../adapters/oak-adapter';
import type { Result } from '@oaknational/result';
import { type SdkFetchError, formatSdkError } from '@oaknational/curriculum-sdk';
import {
  aggregateLessonsBySlug,
  type AggregatedLesson,
  type LessonUnitGroup,
} from './lesson-aggregation';
import { ingestLogger } from '../logger';

/**
 * Function signature for fetching lessons by key stage and subject.
 *
 * This matches the OakClient.getLessonsByKeyStageAndSubject method signature.
 * Returns Result per ADR-088.
 */
export type GetLessonsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  options?: LessonsPaginationOptions,
) => Promise<Result<readonly LessonGroupResponse[], SdkFetchError>>;

/**
 * Unwrap a Result, throwing on error.
 * Used to convert Result-returning SDK calls to exception-based flow
 * for pagination exhaustion where errors should terminate the loop.
 */
function unwrapResult<T>(
  result: Result<T, SdkFetchError>,
  context: { keyStage: KeyStage; subject: SearchSubjectSlug; unit?: string },
): T {
  if (!result.ok) {
    const error = result.error;
    const message = formatSdkError(error);
    ingestLogger.error('Failed to fetch lessons', { ...context, error: message });
    if (error.kind === 'network_error') {
      throw error.cause;
    }
    throw new Error(message);
  }
  return result.value;
}

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
    const result = await getLessons(keyStage, subject, { limit, offset });
    const page = unwrapResult(result, { keyStage, subject });
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
 * const client = await createOakClient();
 * const unitsResult = await client.getUnitsByKeyStageAndSubject('ks4', 'maths');
 * if (!unitsResult.ok) throw new Error(formatSdkError(unitsResult.error));
 * const unitSlugs = unitsResult.value.map(u => u.unitSlug);
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
    const result = await getLessons(keyStage, subject, { unit: unitSlug, limit: 100 });
    const unitLessons = unwrapResult(result, { keyStage, subject, unit: unitSlug });

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
