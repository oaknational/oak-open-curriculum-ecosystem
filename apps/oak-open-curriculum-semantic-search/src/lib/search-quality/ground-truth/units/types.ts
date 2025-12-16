/**
 * Ground truth type definitions for unit search.
 *
 */

/**
 * A ground truth query for unit search with expected relevance judgments.
 *
 * Uses the same structure as lesson ground truth for consistency.
 */
export interface UnitGroundTruthQuery {
  /** The search query text */
  readonly query: string;
  /** Map of unit_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
}
