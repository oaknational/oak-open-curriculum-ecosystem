/**
 * Content guidance extractor for bulk download data.
 *
 * @remarks
 * Extracts content guidance metadata from lessons. This includes
 * guidance areas, labels, descriptions, and supervision levels.
 * Useful for content filtering, safety features, and parental guidance.

 */

import type { Lesson } from '../../types/generated/bulk/index.js';

/**
 * Content guidance item as extracted from a lesson.
 */
export interface ExtractedContentGuidanceItem {
  /** Category of content guidance (e.g., "Violence", "Sensitive content") */
  readonly contentGuidanceArea: string;
  /** Short label for the guidance */
  readonly contentGuidanceLabel: string;
  /** Detailed description of the guidance */
  readonly contentGuidanceDescription: string;
  /** Supervision level ID */
  readonly supervisionLevelId: number;
}

/**
 * Extracted content guidance with lesson context.
 */
export interface ExtractedContentGuidance {
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
  /** Overall supervision level (if any) */
  readonly supervisionLevel: string | null;
  /** Array of content guidance items */
  readonly guidanceItems: readonly ExtractedContentGuidanceItem[];
}

/**
 * Type guard to check if content guidance is a valid array (not NULL sentinel).
 */
function isValidContentGuidanceArray(guidance: Lesson['contentGuidance']): guidance is {
  contentGuidanceArea: string;
  contentGuidanceLabel: string;
  contentGuidanceDescription: string;
  supervisionlevel_id: number;
}[] {
  return Array.isArray(guidance) && guidance.length > 0;
}

/**
 * Extracts content guidance from an array of lessons.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Array of lessons with content guidance and their guidance items
 *
 * @remarks
 * Only returns lessons that have actual content guidance (skips NULL sentinel).
 *
 * @example
 * ```ts
 * const guidance = extractContentGuidance(bulkData.lessons);
 * const flaggedLessons = guidance.filter(g => g.supervisionLevel !== null);
 * ```
 */
export function extractContentGuidance(
  lessons: readonly Lesson[],
): readonly ExtractedContentGuidance[] {
  const results: ExtractedContentGuidance[] = [];

  for (const lesson of lessons) {
    // Skip lessons without content guidance or with NULL sentinel
    if (!isValidContentGuidanceArray(lesson.contentGuidance)) {
      continue;
    }

    const guidanceItems: ExtractedContentGuidanceItem[] = lesson.contentGuidance.map((item) => ({
      contentGuidanceArea: item.contentGuidanceArea,
      contentGuidanceLabel: item.contentGuidanceLabel,
      contentGuidanceDescription: item.contentGuidanceDescription,
      supervisionLevelId: item.supervisionlevel_id,
    }));

    // Normalize supervision level (handle NULL sentinel)
    const supervisionLevel =
      lesson.supervisionLevel === 'NULL' || lesson.supervisionLevel === null
        ? null
        : lesson.supervisionLevel;

    results.push({
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlug: lesson.unitSlug,
      subjectSlug: lesson.subjectSlug,
      keyStageSlug: lesson.keyStageSlug,
      supervisionLevel,
      guidanceItems,
    });
  }

  return results;
}

/**
 * Gets all unique content guidance areas across lessons.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Set of unique content guidance area names
 */
export function getUniqueGuidanceAreas(lessons: readonly Lesson[]): ReadonlySet<string> {
  const areas = new Set<string>();

  for (const lesson of lessons) {
    if (!isValidContentGuidanceArray(lesson.contentGuidance)) {
      continue;
    }

    for (const item of lesson.contentGuidance) {
      areas.add(item.contentGuidanceArea);
    }
  }

  return areas;
}
