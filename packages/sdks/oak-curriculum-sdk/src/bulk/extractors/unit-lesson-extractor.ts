/**
 * Unit lesson extractor for bulk download data.
 *
 * @remarks
 * Extracts the lesson structure from units, providing a map of which
 * lessons belong to which units. Useful for navigation and curriculum
 * structure analysis.
 *
 * @module bulk/extractors/unit-lesson-extractor
 */

import type { Unit } from '../../types/generated/bulk/index.js';

/**
 * Lesson reference within a unit.
 */
export interface UnitLessonReference {
  /** Lesson slug */
  readonly lessonSlug: string;
  /** Lesson title */
  readonly lessonTitle: string;
  /** Lesson order within unit (if available) */
  readonly lessonOrder: number | null;
  /** Publication state */
  readonly state: string;
}

/**
 * Extracted unit with its lessons.
 */
export interface ExtractedUnitLessons {
  /** Unit slug for reference */
  readonly unitSlug: string;
  /** Unit title */
  readonly unitTitle: string;
  /** Year group */
  readonly year: number | string;
  /** Year slug */
  readonly yearSlug: string;
  /** Key stage slug (derived) */
  readonly keyStageSlug: string;
  /** Total lesson count */
  readonly lessonCount: number;
  /** Lessons in this unit */
  readonly lessons: readonly UnitLessonReference[];
}

/**
 * Derives key stage slug from year number.
 */
function deriveKeyStageFromYear(year: number | string): string {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;

  if (isNaN(yearNum)) {
    return 'unknown';
  }

  if (yearNum <= 2) {
    return 'ks1';
  }
  if (yearNum <= 6) {
    return 'ks2';
  }
  if (yearNum <= 9) {
    return 'ks3';
  }
  return 'ks4';
}

/**
 * Extracts unit-lesson relationships from an array of units.
 *
 * @param units - Array of units from bulk download
 * @returns Array of units with their lesson lists
 *
 * @example
 * ```ts
 * const unitLessons = extractUnitLessons(bulkData.sequence);
 * const largeUnits = unitLessons.filter(u => u.lessonCount > 10);
 * ```
 */
export function extractUnitLessons(units: readonly Unit[]): readonly ExtractedUnitLessons[] {
  const results: ExtractedUnitLessons[] = [];

  for (const unit of units) {
    const lessons: UnitLessonReference[] = (unit.unitLessons ?? []).map((lesson, index) => ({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      lessonOrder: lesson.lessonOrder ?? index + 1,
      state: lesson.state ?? 'published',
    }));

    results.push({
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      year: unit.year,
      yearSlug: unit.yearSlug,
      keyStageSlug: deriveKeyStageFromYear(unit.year),
      lessonCount: lessons.length,
      lessons,
    });
  }

  return results;
}

/**
 * Creates a lesson-to-unit lookup map.
 *
 * @param unitLessons - Array of extracted unit lessons
 * @returns Map from lesson slug to unit slug
 */
export function createLessonToUnitMap(
  unitLessons: readonly ExtractedUnitLessons[],
): ReadonlyMap<string, string> {
  const map = new Map<string, string>();

  for (const unit of unitLessons) {
    for (const lesson of unit.lessons) {
      map.set(lesson.lessonSlug, unit.unitSlug);
    }
  }

  return map;
}
