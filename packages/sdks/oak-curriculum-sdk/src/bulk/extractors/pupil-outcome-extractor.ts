/**
 * Pupil outcome extractor for bulk download data.
 *
 * @remarks
 * Extracts pupil lesson outcomes from lessons. These represent the
 * intended learning outcome for each lesson and are valuable for
 * semantic search indexing.

 */

import type { Lesson } from '../../types/generated/bulk/index.js';

/**
 * Extracted pupil outcome with lesson context.
 */
export interface ExtractedPupilOutcome {
  /** The pupil lesson outcome text */
  readonly outcome: string;
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
}

/**
 * Extracts pupil outcomes from an array of lessons.
 *
 * @param lessons - Array of lessons from bulk download
 * @returns Array of extracted pupil outcomes with context
 *
 * @example
 * ```ts
 * const outcomes = extractPupilOutcomes(bulkData.lessons);
 * outcomes.forEach(o => console.log(`${o.lessonTitle}: ${o.outcome}`));
 * ```
 */
export function extractPupilOutcomes(lessons: readonly Lesson[]): readonly ExtractedPupilOutcome[] {
  const outcomes: ExtractedPupilOutcome[] = [];

  for (const lesson of lessons) {
    // Skip lessons without outcomes
    if (!lesson.pupilLessonOutcome) {
      continue;
    }

    const outcome = lesson.pupilLessonOutcome.trim();
    if (outcome.length === 0) {
      continue;
    }

    outcomes.push({
      outcome,
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlug: lesson.unitSlug,
      subjectSlug: lesson.subjectSlug,
      keyStageSlug: lesson.keyStageSlug,
    });
  }

  return outcomes;
}
