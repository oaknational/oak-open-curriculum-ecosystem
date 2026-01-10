/**
 * Ground truth type definitions for unit search (Secondary Maths).
 *
 * @packageDocumentation
 */

import type { QueryCategory, QueryPriority } from '../../../types';

/**
 * A ground truth query for unit search with expected relevance judgments.
 *
 * Uses the same structure as lesson ground truth for consistency.
 * All fields that are required in GroundTruthQuery are also required here.
 */
export interface UnitGroundTruthQuery {
  /** The search query text (3-10 words, realistic teacher phrasing) */
  readonly query: string;
  /** Map of unit_slug → relevance score (3/2/1, unlisted = 0) */
  readonly expectedRelevance: Readonly<Record<string, number>>;
  /**
   * Category of user scenario this query represents. REQUIRED.
   */
  readonly category: QueryCategory;
  /**
   * What this test scenario reveals/validates about system behavior. REQUIRED.
   */
  readonly description: string;
  /**
   * Relative importance for current system priorities. REQUIRED.
   */
  readonly priority: QueryPriority;
}
