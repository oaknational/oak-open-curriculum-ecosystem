/**
 * Supervision level extractor for bulk download data.
 *
 * @remarks
 * Extracts and aggregates supervision level information from lessons.
 * Supervision levels indicate the degree of adult oversight recommended
 * for lesson content. Useful for content safety filtering.
 *
 * @module bulk/extractors/supervision-level-extractor
 */

import type { Lesson } from '../../types/generated/bulk/index.js';

/**
 * Extracted supervision level with lesson context.
 */
export interface ExtractedSupervisionLevel {
  /** Lesson slug for reference */
  readonly lessonSlug: string;
  /** Lesson title for context */
  readonly lessonTitle: string;
  /** Unit slug for grouping */
  readonly unitSlug: string;
  /** Subject slug for filtering */
  readonly subjectSlug: string;
  /** Key stage slug for filtering */
  readonly keyStageSlug: string;
  /** The supervision level (normalized, null if none) */
  readonly supervisionLevel: string;
}

/**
 * Summary of supervision levels across a set of lessons.
 */
export interface SupervisionLevelSummary {
  /** Total lessons analyzed */
  readonly totalLessons: number;
  /** Lessons with supervision requirements */
  readonly lessonsWithSupervision: number;
  /** Lessons without supervision requirements */
  readonly lessonsWithoutSupervision: number;
  /** Count by supervision level */
  readonly countByLevel: Readonly<Record<string, number>>;
  /** Percentage requiring supervision */
  readonly supervisionPercentage: number;
}

/**
 * Normalizes supervision level value.
 */
function normalizeSupervisionLevel(level: string | null): string | null {
  if (level === null || level === 'NULL' || level === '') {
    return null;
  }
  return level.trim();
}

/**
 * Extracts lessons that have supervision level requirements.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Array of lessons with supervision levels (excludes lessons with no supervision)
 *
 * @example
 * ```ts
 * const supervised = extractSupervisionLevels(bulkData.lessons);
 * console.log(`${supervised.length} lessons require supervision`);
 * ```
 */
export function extractSupervisionLevels(
  lessons: readonly Lesson[],
): readonly ExtractedSupervisionLevel[] {
  const results: ExtractedSupervisionLevel[] = [];

  for (const lesson of lessons) {
    const normalized = normalizeSupervisionLevel(lesson.supervisionLevel);

    // Only include lessons that have a supervision level
    if (normalized === null) {
      continue;
    }

    results.push({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlug: lesson.unitSlug,
      subjectSlug: lesson.subjectSlug,
      keyStageSlug: lesson.keyStageSlug,
      supervisionLevel: normalized,
    });
  }

  return results;
}

/**
 * Generates summary statistics for supervision levels.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Summary statistics for supervision levels
 */
export function summarizeSupervisionLevels(lessons: readonly Lesson[]): SupervisionLevelSummary {
  const countByLevel: Record<string, number> = {};
  let lessonsWithSupervision = 0;
  let lessonsWithoutSupervision = 0;

  for (const lesson of lessons) {
    const normalized = normalizeSupervisionLevel(lesson.supervisionLevel);

    if (normalized === null) {
      lessonsWithoutSupervision++;
    } else {
      lessonsWithSupervision++;
      countByLevel[normalized] = (countByLevel[normalized] ?? 0) + 1;
    }
  }

  const totalLessons = lessons.length;
  const supervisionPercentage =
    totalLessons > 0 ? (lessonsWithSupervision / totalLessons) * 100 : 0;

  return {
    totalLessons,
    lessonsWithSupervision,
    lessonsWithoutSupervision,
    countByLevel,
    supervisionPercentage: Math.round(supervisionPercentage * 100) / 100,
  };
}

/**
 * Gets all unique supervision levels across lessons.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Set of unique supervision level values
 */
export function getUniqueSupervisionLevels(lessons: readonly Lesson[]): ReadonlySet<string> {
  const levels = new Set<string>();

  for (const lesson of lessons) {
    const normalized = normalizeSupervisionLevel(lesson.supervisionLevel);
    if (normalized !== null) {
      levels.add(normalized);
    }
  }

  return levels;
}
