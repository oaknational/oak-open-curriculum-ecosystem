/**
 * Lesson extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts every lesson record with its unit placement context. Records are
 * NOT deduplicated — a lesson placed in more than one unit (or appearing in
 * more than one sequence file) yields one entry per record, so the graph
 * generator can model placement as edges (the placement-as-edge identity
 * model: a lesson node is unique by slug; each distinct (unit, lesson) pair
 * becomes a placement edge).
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Lesson } from '../lib/index.js';

/**
 * Extracted lesson with unit placement context.
 */
export interface ExtractedLesson {
  /** Lesson slug (the lesson's content key) */
  readonly lessonSlug: string;
  /** Lesson title */
  readonly lessonTitle: string;
  /** Unit this record places the lesson in */
  readonly unitSlug: string;
  /** Unit title for context */
  readonly unitTitle: string;
  /** Subject of the lesson */
  readonly subject: string;
  /** Key stage of the lesson */
  readonly keyStage: string;
}

/**
 * Extracts all lesson records with placement context.
 *
 * @param lessons - Array of lessons to extract from
 * @returns One entry per lesson record (no deduplication)
 */
export function extractLessons(lessons: readonly Lesson[]): readonly ExtractedLesson[] {
  return lessons.map((lesson) => ({
    lessonSlug: lesson.lessonSlug,
    lessonTitle: lesson.lessonTitle,
    unitSlug: lesson.unitSlug,
    unitTitle: lesson.unitTitle,
    subject: lesson.subjectSlug,
    keyStage: lesson.keyStageSlug,
  }));
}
