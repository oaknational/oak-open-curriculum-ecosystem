/**
 * Ground truth type definitions.
 *
 * @module search-quality/ground-truth/types
 */

/**
 * A ground truth query with expected relevance judgments.
 */
export interface GroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of lesson_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
}
