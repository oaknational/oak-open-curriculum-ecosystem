/**
 * Statistical aggregation functions for benchmark results.
 *
 * Provides pure functions for aggregating query results by category.
 *
 * @packageDocumentation
 */

import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { QueryResult } from './benchmark-query-runner-lessons.js';

/**
 * Aggregated metrics for a single query category.
 *
 * Contains all IR metrics averaged across queries in the category,
 * plus query count and p95 latency for performance analysis.
 */
export interface CategoryResult {
  /** The query category these metrics represent. */
  readonly category: QueryCategory;
  /** Number of queries in this category. */
  readonly queryCount: number;
  /** Mean Reciprocal Rank across queries in this category. */
  readonly mrr: number;
  /** Normalized Discounted Cumulative Gain @10 across queries. */
  readonly ndcg10: number;
  /** Precision @3 across queries. */
  readonly precision3: number;
  /** Recall @10 across queries. */
  readonly recall10: number;
  /** Percentage of queries with no relevant results in top 10. */
  readonly zeroHitRate: number;
  /** 95th percentile latency in milliseconds. */
  readonly p95LatencyMs: number;
}

/**
 * Calculate p95 latency from a sorted array of latencies.
 *
 * @param latencies - Array of latency values (will be sorted)
 * @returns 95th percentile latency
 */
export function calculateP95(latencies: readonly number[]): number {
  if (latencies.length === 0) {
    return 0;
  }
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, index)] ?? 0;
}

/**
 * Group query results by category and calculate aggregate metrics.
 *
 * Pure function that takes query results and returns per-category aggregates.
 * Categories with no queries are not included in the output.
 *
 * @param results - Array of query results with category information
 * @returns Array of category results, one per category present in input
 *
 * @example
 * ```typescript
 * const results: QueryResult[] = [
 *   { category: 'precise-topic', mrr: 1.0, ... },
 *   { category: 'precise-topic', mrr: 0.5, ... },
 *   { category: 'imprecise-input', mrr: 0.8, ... },
 * ];
 * const byCategory = aggregateByCategory(results);
 * // Returns:
 * // [
 * //   { category: 'precise-topic', queryCount: 2, mrr: 0.75, ... },
 * //   { category: 'imprecise-input', queryCount: 1, mrr: 0.8, ... },
 * // ]
 * ```
 */
export function aggregateByCategory(results: readonly QueryResult[]): readonly CategoryResult[] {
  // Group results by category
  const byCategory = new Map<QueryCategory, QueryResult[]>();

  for (const result of results) {
    const existing = byCategory.get(result.category);
    if (existing) {
      existing.push(result);
    } else {
      byCategory.set(result.category, [result]);
    }
  }

  // Calculate aggregates for each category
  const categoryResults: CategoryResult[] = [];

  for (const [category, categoryQueryResults] of byCategory) {
    const count = categoryQueryResults.length;
    const avgMrr = categoryQueryResults.reduce((sum, r) => sum + r.mrr, 0) / count;
    const avgNdcg10 = categoryQueryResults.reduce((sum, r) => sum + r.ndcg10, 0) / count;
    const avgPrecision3 = categoryQueryResults.reduce((sum, r) => sum + r.precision3, 0) / count;
    const avgRecall10 = categoryQueryResults.reduce((sum, r) => sum + r.recall10, 0) / count;
    const zeroHitCount = categoryQueryResults.filter((r) => !r.hasHit).length;
    const latencies = categoryQueryResults.map((r) => r.latencyMs);

    categoryResults.push({
      category,
      queryCount: count,
      mrr: avgMrr,
      ndcg10: avgNdcg10,
      precision3: avgPrecision3,
      recall10: avgRecall10,
      zeroHitRate: zeroHitCount / count,
      p95LatencyMs: calculateP95(latencies),
    });
  }

  // Sort by category name for consistent output
  return categoryResults.sort((a, b) => a.category.localeCompare(b.category));
}
