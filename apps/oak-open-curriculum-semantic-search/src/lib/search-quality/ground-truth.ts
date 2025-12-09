/**
 * Ground truth relevance judgments for search quality evaluation.
 *
 * This module defines the expected relevance of search results for evaluation queries.
 * Relevance scores follow a graded scale:
 *
 * - **3**: Highly relevant (exact match for query intent)
 * - **2**: Relevant (related and useful)
 * - **1**: Marginally relevant (tangentially related)
 * - **0**: Not relevant (implicit - unlisted results assumed 0)
 *
 * @module search-quality/ground-truth
 *
 * @example
 * ```typescript
 * import { GROUND_TRUTH_QUERIES } from './ground-truth';
 *
 * for (const { query, expectedRelevance } of GROUND_TRUTH_QUERIES) {
 *   const results = await searchLessons(query);
 *   const mrr = calculateMRR(results, expectedRelevance);
 * }
 * ```
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

/**
 * Ground truth queries for Maths KS4 search quality evaluation.
 *
 * **IMPORTANT**: The slugs must be populated from the discovery script output.
 * Run `npx tsx scripts/discover-lessons.ts` to get actual lesson slugs from ES.
 *
 * These queries cover core Maths KS4 topics and include:
 * - Representative queries for main curriculum areas
 * - Edge cases (misspellings, synonyms)
 * - Natural language queries
 *
 * @see `.agent/plans/semantic-search/reference-ir-metrics-guide.md` for judging guidance
 */
export const GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Pythagoras theorem',
    // TODO: Populate from discovery script output
    expectedRelevance: {
      // Example (replace with actual slugs):
      // 'pythagoras-theorem-6m4k2c': 3,
      // 'applying-pythagoras-8j2k1d': 3,
      // 'right-angled-triangles-abc123': 2,
    },
  },
  {
    query: 'quadratic equations',
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
  {
    query: 'trigonometry',
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
  {
    query: 'simultaneous equations',
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
  {
    query: 'expanding brackets',
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
  {
    query: 'pythagorus', // Intentional misspelling edge case
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
  {
    query: 'how to solve equations with x squared', // Natural language query
    expectedRelevance: {
      // TODO: Populate from discovery script output
    },
  },
] as const;
