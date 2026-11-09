/**
 * Keyword definition construction — each definition of a keyword as lessons
 * authored it, with those lessons, as a section beside the corpus's edge set.
 *
 * @remarks
 * A keyword node is one term across the whole curriculum, but a term's
 * meaning belongs to the lesson that defines it: "subject" in an English
 * grammar lesson and in an art lesson are different ideas. A `containsKeyword`
 * edge records only THAT a lesson uses a term, so the text each lesson
 * authored lives here, the same way `unitLessonRuns` carries the order the
 * edge set cannot.
 *
 * Membership comes from the `containsKeyword` edges, so a definition never
 * names a lesson the edge set does not place: a lesson with no node loses its
 * edge and, with it, its definition. A lesson that authors two definitions for
 * one keyword appears under both.
 */

import type { ExtractedKeyword } from '../extractors/index.js';

import {
  keywordNodeId,
  lessonNodeId,
  type GraphCorpusEdge,
  type GraphCorpusKeywordDefinition,
} from './graph-corpus-types.js';

/** Orders strings by UTF-16 code unit — a total order, unlike locale collation. */
function compareCodeUnits(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

/**
 * Builds one row per distinct (keyword, authored definition).
 *
 * @param edges - The full corpus edge set; only `containsKeyword` is read.
 * @param keywords - Extracted keywords supplying the authored text.
 * @returns Rows with at least one placed lesson, sorted by keyword id, term,
 *   then definition (code-unit order); lesson ids sorted within each row.
 */
export function buildKeywordDefinitions(
  edges: readonly GraphCorpusEdge[],
  keywords: readonly ExtractedKeyword[],
): readonly GraphCorpusKeywordDefinition[] {
  const placed = new Set(
    edges
      .filter((edge) => edge.type === 'containsKeyword')
      .map((edge) => `${edge.source}→${edge.target}`),
  );
  return keywords
    .flatMap((keyword) => {
      const keywordId = keywordNodeId(keyword.term);
      return keyword.definitions.map(
        ({ term, definition, lessonSlugs }): GraphCorpusKeywordDefinition => ({
          keywordId,
          term,
          definition,
          lessonIds: lessonSlugs
            .map((lessonSlug) => lessonNodeId(lessonSlug))
            .filter((lessonId) => placed.has(`${lessonId}→${keywordId}`)),
        }),
      );
    })
    .filter((row) => row.lessonIds.length > 0)
    .sort(
      (a, b) =>
        compareCodeUnits(a.keywordId, b.keywordId) ||
        compareCodeUnits(a.term, b.term) ||
        compareCodeUnits(a.definition, b.definition),
    );
}
