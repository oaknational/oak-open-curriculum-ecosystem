/**
 * Baseline runner for hard query evaluation.
 *
 * Provides pure functions to process ground truth query results and
 * calculate per-query metrics for baseline documentation.
 *
 * @packageDocumentation
 */

import { calculateMRR, calculateNDCG } from './metrics.js';
import type { GroundTruthQuery, QueryCategory, QueryPriority } from './ground-truth/types.js';

/**
 * Result of running a single ground truth query against the search system.
 */
export interface QueryBaselineResult {
  /** The original query text */
  readonly query: string;
  /** Query category for analysis grouping */
  readonly category: QueryCategory;
  /** Query priority for triage */
  readonly priority: QueryPriority;
  /** Expected relevant lesson/unit slugs */
  readonly expectedSlugs: readonly string[];
  /** Actual top 10 results from search */
  readonly actualTop10: readonly string[];
  /** Rank of first relevant result (1-based), null if not in top 10 */
  readonly firstRelevantRank: number | null;
  /** Mean Reciprocal Rank for this query */
  readonly mrr: number;
  /** Normalised DCG at 10 for this query */
  readonly ndcg10: number;
  /** Query latency in milliseconds */
  readonly latencyMs: number;
}

/** Default category when not specified in ground truth */
const DEFAULT_CATEGORY: QueryCategory = 'naturalistic';

/** Default priority when not specified in ground truth */
const DEFAULT_PRIORITY: QueryPriority = 'medium';

/** Minimum relevance score to count as "relevant" for rank calculation */
const RELEVANCE_THRESHOLD = 2;

/**
 * Process a single query result and calculate metrics.
 *
 * Pure function that takes query definition and actual results,
 * returns structured baseline result with all metrics.
 *
 * @param query - Ground truth query definition
 * @param actualResults - Actual result slugs from search (in order)
 * @param latencyMs - Query execution time in milliseconds
 * @returns Structured baseline result
 */
export function processQueryResult(
  query: GroundTruthQuery,
  actualResults: readonly string[],
  latencyMs: number,
): QueryBaselineResult {
  const expectedSlugs = extractExpectedSlugs(query.expectedRelevance);
  const actualTop10 = actualResults.slice(0, 10);

  const firstRelevantRank = findFirstRelevantRank(actualTop10, query.expectedRelevance);
  const mrr = calculateMRR(actualTop10, query.expectedRelevance);
  const ndcg10 = calculateNDCG(actualTop10, query.expectedRelevance, 10);

  return {
    query: query.query,
    category: query.category ?? DEFAULT_CATEGORY,
    priority: query.priority ?? DEFAULT_PRIORITY,
    expectedSlugs,
    actualTop10,
    firstRelevantRank,
    mrr,
    ndcg10,
    latencyMs,
  };
}

/**
 * Calculate average MRR for a specific category.
 *
 * @param results - All baseline results
 * @param category - Category to filter by
 * @returns Average MRR for the category, or 0 if no results
 */
export function calculateCategoryMrr(
  results: readonly QueryBaselineResult[],
  category: QueryCategory,
): number {
  const categoryResults = results.filter((r) => r.category === category);

  if (categoryResults.length === 0) {
    return 0;
  }

  const totalMrr = categoryResults.reduce((sum, r) => sum + r.mrr, 0);
  return totalMrr / categoryResults.length;
}

/**
 * Calculate overall MRR across all results.
 *
 * @param results - All baseline results
 * @returns Average MRR across all queries
 */
export function calculateOverallMrr(results: readonly QueryBaselineResult[]): number {
  if (results.length === 0) {
    return 0;
  }

  const totalMrr = results.reduce((sum, r) => sum + r.mrr, 0);
  return totalMrr / results.length;
}

/**
 * Extract expected slugs from relevance map.
 */
function extractExpectedSlugs(
  expectedRelevance: Readonly<Record<string, number>>,
): readonly string[] {
  const entries: [string, number][] = [];

  for (const slug in expectedRelevance) {
    const score = expectedRelevance[slug];
    if (score !== undefined) {
      entries.push([slug, score]);
    }
  }

  // Sort by relevance score descending
  entries.sort((a, b) => b[1] - a[1]);

  return entries.map(([slug]) => slug);
}

/**
 * Find rank of first relevant result (1-based).
 *
 * @returns Rank (1-10) or null if not found
 */
function findFirstRelevantRank(
  results: readonly string[],
  expectedRelevance: Readonly<Record<string, number>>,
): number | null {
  for (let i = 0; i < results.length; i++) {
    const slug = results[i];
    if (slug === undefined) {
      continue;
    }

    const score = expectedRelevance[slug];
    if (score !== undefined && score >= RELEVANCE_THRESHOLD) {
      return i + 1; // 1-based rank
    }
  }

  return null;
}
