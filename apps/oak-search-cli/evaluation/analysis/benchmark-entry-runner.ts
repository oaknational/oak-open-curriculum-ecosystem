/**
 * Benchmark entry runner with dependency injection.
 *
 * Orchestrates running all queries in a ground truth entry and aggregating results.
 * Accepts a search function as a dependency for testability.
 *
 * @see benchmark.ts - CLI entry point that wires this up
 * @see ADR-078 Dependency Injection for Testability
 */

import type { AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';
import type { Phase } from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import type {
  QueryCategory,
  GroundTruthQuery,
} from '../../src/lib/search-quality/ground-truth-archive/types.js';
import {
  runQuery,
  type SearchFunction,
  type QueryResult,
} from './benchmark-query-runner-lessons.js';
import { aggregateByCategory, type CategoryResult } from './benchmark-stats.js';

/**
 * Ground truth entry for benchmarking.
 *
 * Uses AllSubjectSlug to support both archive (Subject) and foundational (AllSubjectSlug) ground truths.
 */
export interface GroundTruthEntry {
  /** Subject slug for this entry. */
  readonly subject: AllSubjectSlug;
  /** Phase (e.g. primary, secondary). */
  readonly phase: Phase;
  /** Ground truth queries to run for this entry. */
  readonly queries: readonly GroundTruthQuery[];
}

// Re-export SearchFunction type for test imports
export type { SearchFunction } from './benchmark-query-runner-lessons.js';

// Re-export QueryResult type for review output
export type { QueryResult } from './benchmark-query-runner-lessons.js';

/**
 * Result of benchmarking a single ground truth entry.
 *
 * Contains all IR metrics as defined in IR-METRICS.md:
 * - MRR, NDCG\@10, Precision\@3, Recall\@10, Zero-hit rate, Latency
 *
 * Also includes per-category breakdown for granular analysis.
 *
 * Note: Baselines are stored separately in baselines.json and compared
 * at the reporting layer, not here. This keeps test execution separate
 * from baseline comparison.
 */
export interface EntryBenchmarkResult {
  /** Subject slug for this entry. */
  readonly subject: AllSubjectSlug;
  /** Phase (e.g. primary, secondary). */
  readonly phase: Phase;
  /** Number of queries (excludes future-intent). */
  readonly queryCount: number;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
  /** Fraction of queries with no relevant results in top 10. */
  readonly zeroHitRate: number;
  /** Mean latency in milliseconds. */
  readonly avgLatencyMs: number;
  /** Per-query latency values. */
  readonly latencies: readonly number[];
  /** Per-category metric breakdown for granular analysis. */
  readonly perCategory: readonly CategoryResult[];
}

/**
 * Aggregate query results into entry-level metrics.
 *
 * Excludes future-intent queries from aggregate statistics but includes
 * them in perCategory for separate reporting.
 *
 * @param entry - Ground truth entry for context
 * @param results - Query results to aggregate
 * @returns Aggregated benchmark result for the entry
 */
function aggregateResults(
  entry: GroundTruthEntry,
  results: readonly QueryResult[],
): EntryBenchmarkResult {
  // Separate future-intent results from regular results
  const regularResults = results.filter((r) => r.category !== 'future-intent');
  const regularCount = regularResults.length;

  // Calculate aggregates ONLY from regular results (exclude future-intent)
  const avgMrr =
    regularCount > 0 ? regularResults.reduce((sum, r) => sum + r.mrr, 0) / regularCount : 0;
  const avgNdcg10 =
    regularCount > 0 ? regularResults.reduce((sum, r) => sum + r.ndcg10, 0) / regularCount : 0;
  const avgPrecision3 =
    regularCount > 0 ? regularResults.reduce((sum, r) => sum + r.precision3, 0) / regularCount : 0;
  const avgRecall10 =
    regularCount > 0 ? regularResults.reduce((sum, r) => sum + r.recall10, 0) / regularCount : 0;
  const zeroHitCount = regularResults.filter((r) => !r.hasHit).length;
  const latencies = regularResults.map((r) => r.latencyMs);
  const avgLatencyMs =
    latencies.length > 0 ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length : 0;

  // Calculate per-category metrics (includes future-intent for separate display)
  const perCategory = aggregateByCategory(results);

  return {
    subject: entry.subject,
    phase: entry.phase,
    queryCount: regularCount, // Only count regular queries in aggregate
    mrr: avgMrr,
    ndcg10: avgNdcg10,
    precision3: avgPrecision3,
    recall10: avgRecall10,
    zeroHitRate: regularCount > 0 ? zeroHitCount / regularCount : 0,
    avgLatencyMs,
    latencies,
    perCategory,
  };
}

/**
 * Create a zero-result QueryResult for error cases.
 *
 * @param category - Query category for the error result
 * @param expectedRelevance - Expected relevance map (defaults to empty)
 * @returns Query result with all metrics set to zero
 */
function createErrorResult(
  category: QueryCategory,
  expectedRelevance: Readonly<Record<string, number>> = {},
): QueryResult {
  return {
    category,
    mrr: 0,
    ndcg10: 0,
    precision3: 0,
    recall10: 0,
    latencyMs: 0,
    hasHit: false,
    actualResults: [],
    expectedRelevance,
  };
}

/**
 * Detailed result for review mode, pairing query with its result.
 */
export interface ReviewQueryResult {
  /** The ground truth query that was run. */
  readonly query: GroundTruthEntry['queries'][number];
  /** The query result with metrics and actual results. */
  readonly result: QueryResult;
}

/**
 * Run benchmark for a single ground truth entry.
 *
 * Shows per-query progress with MRR status.
 *
 * @param entry - Ground truth entry containing queries and expected results
 * @param searchFn - Search function (injected for testability)
 * @returns Aggregated benchmark results for the entry
 */
export async function benchmarkEntry(
  entry: GroundTruthEntry,
  searchFn: SearchFunction,
): Promise<EntryBenchmarkResult> {
  const results: QueryResult[] = [];

  for (const query of entry.queries) {
    try {
      const result = await runQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          queryKeyStage: query.keyStage,
          category: query.category,
        },
        searchFn,
      );
      results.push(result);

      const status = result.mrr > 0 ? '✓' : '✗';
      console.log(`  ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
    } catch (error) {
      console.error(`  ✗ Error running query "${query.query}":`, error);
      results.push(createErrorResult(query.category, query.expectedRelevance));
    }
  }

  return aggregateResults(entry, results);
}

/**
 * Run benchmark in review mode, returning detailed per-query results.
 *
 * Provides all metrics per query plus actual results for comparison.
 * Used by `pnpm benchmark --review` mode.
 *
 * @param entry - Ground truth entry containing queries and expected results
 * @param searchFn - Search function (injected for testability)
 * @returns Array of query-result pairs for detailed review
 */
export async function benchmarkEntryForReview(
  entry: GroundTruthEntry,
  searchFn: SearchFunction,
): Promise<readonly ReviewQueryResult[]> {
  const reviews: ReviewQueryResult[] = [];

  for (const query of entry.queries) {
    try {
      const result = await runQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          queryKeyStage: query.keyStage,
          category: query.category,
        },
        searchFn,
      );
      reviews.push({ query, result });
    } catch (error) {
      console.error(`  ✗ Error running query "${query.query}":`, error);
      reviews.push({
        query,
        result: createErrorResult(query.category, query.expectedRelevance),
      });
    }
  }

  return reviews;
}
