/**
 * Key learning point extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts `keyLearningPoints` from lesson records.
 *
 * @see {@link https://github.com/oaknationalacademy/oak-notion-mcp/blob/main/docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for extraction methodology
 */
import type { Lesson } from '../lib/index.js';

/**
 * Extracted key learning point with lesson context.
 */
export interface ExtractedLearningPoint {
  /** The key learning point text */
  readonly learningPoint: string;
  /** Lesson containing this learning point */
  readonly lessonSlug: string;
  /** Lesson title for context */
  readonly lessonTitle: string;
  /** Subject of the lesson */
  readonly subject: string;
  /** Key stage of the lesson */
  readonly keyStage: string;
}

/**
 * Extracts all key learning points from lesson data.
 *
 * @param lessons - Array of lessons to extract learning points from
 * @returns All learning points with context
 */
export function extractLearningPoints(
  lessons: readonly Lesson[],
): readonly ExtractedLearningPoint[] {
  const results: ExtractedLearningPoint[] = [];

  for (const lesson of lessons) {
    for (const lp of lesson.keyLearningPoints) {
      // Skip empty learning points
      if (!lp.keyLearningPoint.trim()) {
        continue;
      }

      results.push({
        learningPoint: lp.keyLearningPoint,
        lessonSlug: lesson.lessonSlug,
        lessonTitle: lesson.lessonTitle,
        subject: lesson.subjectSlug,
        keyStage: lesson.keyStageSlug,
      });
    }
  }

  return results;
}
