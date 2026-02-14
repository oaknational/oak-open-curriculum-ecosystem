/**
 * Teacher tip extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts `teacherTips` from lesson records, filtering empty tips.
 * Handles maths-secondary tier variants by including all tips
 * (deduplication happens if needed at a higher level).
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Lesson } from '../lib/index.js';

/**
 * Extracted teacher tip with lesson context.
 */
export interface ExtractedTeacherTip {
  /** The teacher tip text */
  readonly tip: string;
  /** Lesson containing this tip */
  readonly lessonSlug: string;
  /** Lesson title for context */
  readonly lessonTitle: string;
  /** Subject of the lesson */
  readonly subject: string;
  /** Key stage of the lesson */
  readonly keyStage: string;
}

/**
 * Extracts all teacher tips from lesson data.
 *
 * @param lessons - Array of lessons to extract tips from
 * @returns All teacher tips with context (empty tips filtered)
 */
export function extractTeacherTips(lessons: readonly Lesson[]): readonly ExtractedTeacherTip[] {
  const results: ExtractedTeacherTip[] = [];

  for (const lesson of lessons) {
    for (const t of lesson.teacherTips) {
      // Filter empty tips (per plan: empty strings excluded)
      if (!t.teacherTip.trim()) {
        continue;
      }

      results.push({
        tip: t.teacherTip,
        lessonSlug: lesson.lessonSlug,
        lessonTitle: lesson.lessonTitle,
        subject: lesson.subjectSlug,
        keyStage: lesson.keyStageSlug,
      });
    }
  }

  return results;
}
