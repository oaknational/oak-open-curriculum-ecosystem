/**
 * Lesson aggregation utilities for ingestion.
 *
 * These functions aggregate lessons by slug while collecting ALL unit
 * relationships. This is critical because lessons can legitimately belong
 * to multiple units (e.g., different tier variants in KS4).
 *
 * @see ADR-083 Complete Lesson Enumeration Strategy
 */

/**
 * A group of lessons belonging to a unit, as returned by the
 * `/key-stages/{ks}/subject/{subject}/lessons` endpoint.
 */
export interface LessonUnitGroup {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly lessons: readonly {
    readonly lessonSlug: string;
    readonly lessonTitle: string;
  }[];
}

/**
 * An aggregated lesson with all units it belongs to.
 *
 * Unlike simple deduplication, this structure preserves the relationship
 * between a lesson and ALL units it appears in.
 */
export interface AggregatedLesson {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  readonly unitSlugs: ReadonlySet<string>;
}

/**
 * Aggregates lessons from paginated API responses by lesson slug.
 *
 * This function:
 * 1. Indexes each unique lesson ONCE by `lessonSlug`
 * 2. Aggregates ALL unit relationships for each lesson
 * 3. Preserves the first lesson title encountered (titles should be identical)
 *
 * This is aggregation, NOT deduplication. A lesson appearing in multiple
 * units is semantically meaningful - search needs to know ALL units where
 * a lesson appears.
 *
 * @param pages - Array of unit groups from paginated API responses
 * @returns Map of lesson slugs to aggregated lesson data
 *
 * @example
 * ```typescript
 * const pages = [
 *   { unitSlug: 'foundation', lessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'L1' }] },
 *   { unitSlug: 'higher', lessons: [{ lessonSlug: 'lesson-1', lessonTitle: 'L1' }] },
 * ];
 * const aggregated = aggregateLessonsBySlug(pages);
 * // aggregated.get('lesson-1').unitSlugs === Set(['foundation', 'higher'])
 * ```
 */
export function aggregateLessonsBySlug(
  pages: readonly LessonUnitGroup[],
): Map<string, AggregatedLesson> {
  const lessonMap = new Map<
    string,
    { lessonSlug: string; lessonTitle: string; unitSlugs: Set<string> }
  >();

  for (const page of pages) {
    for (const lesson of page.lessons) {
      const existing = lessonMap.get(lesson.lessonSlug);
      if (existing) {
        // Aggregate: add this unit to the existing lesson's unit set
        existing.unitSlugs.add(page.unitSlug);
      } else {
        // First occurrence: create new entry with initial unit
        lessonMap.set(lesson.lessonSlug, {
          lessonSlug: lesson.lessonSlug,
          lessonTitle: lesson.lessonTitle,
          unitSlugs: new Set([page.unitSlug]),
        });
      }
    }
  }

  // Convert mutable Sets to ReadonlySets for the return type
  const result = new Map<string, AggregatedLesson>();
  for (const [slug, lesson] of lessonMap) {
    result.set(slug, {
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlugs: lesson.unitSlugs,
    });
  }

  return result;
}

/**
 * Builds a map of unit slugs to their lesson slugs from aggregated lesson data.
 *
 * This inverts the lesson→units relationship to create a unit→lessons lookup,
 * which is used to populate unit documents with correct lesson counts.
 *
 * @param aggregatedLessons - Map of lesson slugs to aggregated lesson data
 * @returns Map of unit slugs to arrays of lesson slugs
 *
 * @example
 * ```typescript
 * const lessons = new Map([
 *   ['lesson-1', { lessonSlug: 'lesson-1', lessonTitle: 'L1', unitSlugs: new Set(['unit-a', 'unit-b']) }],
 *   ['lesson-2', { lessonSlug: 'lesson-2', lessonTitle: 'L2', unitSlugs: new Set(['unit-a']) }],
 * ]);
 * const byUnit = buildLessonsByUnit(lessons);
 * // byUnit.get('unit-a') === ['lesson-1', 'lesson-2']
 * // byUnit.get('unit-b') === ['lesson-1']
 * ```
 */
export function buildLessonsByUnit(
  aggregatedLessons: Map<string, AggregatedLesson>,
): Map<string, readonly string[]> {
  const lessonsByUnit = new Map<string, string[]>();

  for (const lesson of aggregatedLessons.values()) {
    for (const unitSlug of lesson.unitSlugs) {
      const existing = lessonsByUnit.get(unitSlug) ?? [];
      existing.push(lesson.lessonSlug);
      lessonsByUnit.set(unitSlug, existing);
    }
  }

  return lessonsByUnit;
}
