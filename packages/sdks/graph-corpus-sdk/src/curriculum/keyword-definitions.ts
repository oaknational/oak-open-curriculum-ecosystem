/**
 * Keyword definitions in scope — the definitions a keyword's in-scope lessons
 * authored, for the keyword view.
 *
 * @remarks
 * One term can mean different things in different lessons ("subject" in
 * English grammar is not "subject" in art), so the view never serves one
 * definition per term. Every definition the scope's lessons authored is
 * returned, most-used first, each naming the lessons that author it by slug,
 * windowed at {@link KEYWORD_DEFINITION_LESSON_LIMIT}. The definitions
 * themselves are never windowed: cutting one would hide a meaning the scope
 * teaches. The lesson window is kept small because it repeats per definition,
 * and a default call must fit a host's per-result limit.
 */
import type {
  GraphCorpusKeywordDefinition,
  GraphCorpusLessonNode,
  GraphCorpusLessonNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';

/** Per-definition in-scope lesson window (slug-sorted; `hasMoreLessons` marks the cut). */
export const KEYWORD_DEFINITION_LESSON_LIMIT = 3;

/** One definition as in-scope lessons authored it, with those lessons windowed. */
export interface KeywordDefinitionLessons {
  readonly term: string;
  readonly definition: string;
  /**
   * In-scope lessons authoring this definition. Counts across a keyword's
   * definitions can sum above the keyword's own count: a lesson that authors
   * two definitions counts under both.
   */
  readonly scopedLessonCount: number;
  readonly lessonSlugs: readonly string[];
  readonly hasMoreLessons: boolean;
}

/**
 * Builds the in-scope definitions of one keyword.
 *
 * @param rows - The keyword's definition rows, in corpus order.
 * @param scopedLessons - The keyword's in-scope placing lessons.
 * @returns Definitions with at least one in-scope lesson, by in-scope lesson
 *   count descending; equal counts keep the corpus order (the sort is stable).
 */
export function scopedDefinitions(
  rows: readonly GraphCorpusKeywordDefinition[],
  scopedLessons: readonly GraphCorpusLessonNode[],
): readonly KeywordDefinitionLessons[] {
  const scopedById = new Map<GraphCorpusLessonNodeId, GraphCorpusLessonNode>(
    scopedLessons.map((lesson) => [lesson.id, lesson]),
  );
  return rows
    .map(({ term, definition, lessonIds }): KeywordDefinitionLessons => {
      const lessonSlugs = lessonIds
        .flatMap((lessonId) => scopedById.get(lessonId)?.lessonSlug ?? [])
        .sort((a, b) => a.localeCompare(b));
      return {
        term,
        definition,
        scopedLessonCount: lessonSlugs.length,
        lessonSlugs: lessonSlugs.slice(0, KEYWORD_DEFINITION_LESSON_LIMIT),
        hasMoreLessons: lessonSlugs.length > KEYWORD_DEFINITION_LESSON_LIMIT,
      };
    })
    .filter((entry) => entry.scopedLessonCount > 0)
    .sort((a, b) => b.scopedLessonCount - a.scopedLessonCount);
}
