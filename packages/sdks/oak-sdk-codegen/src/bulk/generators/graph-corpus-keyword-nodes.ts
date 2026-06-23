/**
 * Graph-corpus keyword node builder (G4b): lean keyword nodes minted as
 * `keyword:<normalised-term>` with the first-occurrence display casing, the
 * unique-lesson frequency, and the lesson→keyword edge endpoints. Split from
 * the unit/thread/lesson builders in `graph-corpus-nodes.ts` along the same
 * seam as the misconception builder.
 */
import type { ExtractedKeyword } from '../extractors/index.js';

import {
  keywordNodeId,
  lessonNodeId,
  type GraphCorpusKeywordNode,
  type GraphCorpusKeywordNodeId,
  type GraphCorpusLessonNodeId,
} from './graph-corpus-types.js';

/** The keyword node set plus the lesson→keyword edge endpoints. */
export interface KeywordBuild {
  readonly nodes: readonly GraphCorpusKeywordNode[];
  readonly edgePairs: readonly (readonly [GraphCorpusLessonNodeId, GraphCorpusKeywordNodeId])[];
}

/**
 * Builds keyword nodes and their lesson→keyword edge endpoints.
 *
 * The extractor has already deduplicated by normalised term, so each input
 * keyword mints exactly one node. The node's `frequency` is the
 * unique-lesson count (`lessonSlugs.length`) per the ratified G4b spec — the
 * extractor's own `frequency` counts occurrences and is not carried. Output
 * is id-sorted; edge pairs follow node order then lesson-slug order (the
 * extractor's `lessonSlugs` is sorted), so emission is deterministic.
 */
export function buildKeywordNodes(keywords: readonly ExtractedKeyword[]): KeywordBuild {
  const nodes = keywords
    .map(
      (keyword): GraphCorpusKeywordNode => ({
        kind: 'keyword',
        id: keywordNodeId(keyword.term),
        term: keyword.displayTerm,
        description: keyword.definition,
        frequency: keyword.lessonSlugs.length,
        firstYear: keyword.firstYear,
        subjects: keyword.subjects,
      }),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const lessonSlugsById = new Map<GraphCorpusKeywordNodeId, readonly string[]>(
    keywords.map((keyword) => [keywordNodeId(keyword.term), keyword.lessonSlugs]),
  );
  const edgePairs = nodes.flatMap((node) =>
    (lessonSlugsById.get(node.id) ?? []).map(
      (lessonSlug) => [lessonNodeId(lessonSlug), node.id] as const,
    ),
  );

  return { nodes, edgePairs };
}
