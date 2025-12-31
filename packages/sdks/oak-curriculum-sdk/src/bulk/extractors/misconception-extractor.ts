/**
 * Misconception extraction from bulk download lesson data.
 *
 * @remarks
 * Extracts all `misconceptionsAndCommonMistakes` from lesson records,
 * including both the misconception and the response for addressing it.
 *
 * @see {@link https://github.com/oaknationalacademy/oak-notion-mcp/blob/main/docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for extraction methodology
 * @module bulk/extractors/misconception-extractor
 */
import type { Lesson } from '../../types/generated/bulk/index.js';

/**
 * Extracted misconception with context from vocabulary mining.
 */
export interface ExtractedMisconception {
  /** The incorrect belief or common mistake */
  readonly misconception: string;
  /** How to address or correct the misconception */
  readonly response: string;
  /** Subject where this misconception appears */
  readonly subject: string;
  /** Key stage where this misconception is addressed */
  readonly keyStage: string;
  /** Lesson that addresses this misconception */
  readonly lessonSlug: string;
  /** Lesson title for context */
  readonly lessonTitle: string;
}

/**
 * Extracts all misconceptions from lesson data.
 *
 * @param lessons - Array of lessons to extract misconceptions from
 * @returns All misconceptions with context
 *
 * @remarks
 * Unlike keywords, misconceptions are NOT deduplicated — each occurrence
 * is preserved with its lesson context, as the same misconception may be
 * addressed differently in different contexts.
 */
export function extractMisconceptions(
  lessons: readonly Lesson[],
): readonly ExtractedMisconception[] {
  const results: ExtractedMisconception[] = [];

  for (const lesson of lessons) {
    for (const m of lesson.misconceptionsAndCommonMistakes) {
      // Skip empty misconceptions
      if (!m.misconception.trim()) {
        continue;
      }

      results.push({
        misconception: m.misconception,
        response: m.response,
        subject: lesson.subjectSlug,
        keyStage: lesson.keyStageSlug,
        lessonSlug: lesson.lessonSlug,
        lessonTitle: lesson.lessonTitle,
      });
    }
  }

  return results;
}
