/**
 * Benchmark entry runner with dependency injection.
 *
 * Orchestrates running all queries in a ground truth entry and aggregating results.
 * Accepts a search function as a dependency for testability.
 *
 * @see benchmark.ts - CLI entry point that wires this up
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import type {
  GroundTruthEntry,
  Phase,
} from '../../src/lib/search-quality/ground-truth/registry/index.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth/types.js';
import type { SearchSubjectSlug } from '../../src/types/oak.js';
import { runQuery, type SearchFunction, type QueryResult } from './benchmark-query-runner.js';
import { aggregateByCategory, type CategoryResult } from './benchmark-stats.js';

// Re-export SearchFunction type for test imports
export type { SearchFunction } from './benchmark-query-runner.js';

/**
 * Result of benchmarking a single ground truth entry.
 *
 * Contains all IR metrics as defined in IR-METRICS.md:
 * - MRR, NDCG@10, Precision@3, Recall@10, Zero-hit rate, Latency
 *
 * Also includes per-category breakdown for granular analysis.
 *
 * Note: Baselines are stored separately in baselines.json and compared
 * at the reporting layer, not here. This keeps test execution separate
 * from baseline comparison.
 */
export interface EntryBenchmarkResult {
  readonly subject: SearchSubjectSlug;
  readonly phase: Phase;
  readonly queryCount: number;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
  readonly zeroHitRate: number;
  readonly avgLatencyMs: number;
  readonly latencies: readonly number[];
  /** Per-category metric breakdown for granular analysis. */
  readonly perCategory: readonly CategoryResult[];
}

/** Aggregate query results into entry-level metrics. */
function aggregateResults(
  entry: GroundTruthEntry,
  results: readonly QueryResult[],
): EntryBenchmarkResult {
  const avgMrr = results.reduce((sum, r) => sum + r.mrr, 0) / results.length;
  const avgNdcg10 = results.reduce((sum, r) => sum + r.ndcg10, 0) / results.length;
  const avgPrecision3 = results.reduce((sum, r) => sum + r.precision3, 0) / results.length;
  const avgRecall10 = results.reduce((sum, r) => sum + r.recall10, 0) / results.length;
  const zeroHitCount = results.filter((r) => !r.hasHit).length;
  const latencies = results.map((r) => r.latencyMs);
  const avgLatencyMs = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;

  // Calculate per-category metrics
  const perCategory = aggregateByCategory(results);

  return {
    subject: entry.subject,
    phase: entry.phase,
    queryCount: entry.queries.length,
    mrr: avgMrr,
    ndcg10: avgNdcg10,
    precision3: avgPrecision3,
    recall10: avgRecall10,
    zeroHitRate: zeroHitCount / results.length,
    avgLatencyMs,
    latencies,
    perCategory,
  };
}

/** Create a zero-result QueryResult for error cases. */
function createErrorResult(category: QueryCategory): QueryResult {
  return { category, mrr: 0, ndcg10: 0, precision3: 0, recall10: 0, latencyMs: 0, hasHit: false };
}

/**
 * Runs benchmark for a single ground truth entry.
 *
 * @param entry - Ground truth entry containing queries and expected results
 * @param verbose - Whether to log per-query results
 * @param searchFn - Search function (injected for testability)
 * @returns Aggregated benchmark results for the entry
 */
export async function benchmarkEntry(
  entry: GroundTruthEntry,
  verbose: boolean,
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

      if (verbose) {
        const status = result.mrr > 0 ? '✓' : '✗';
        console.log(`  ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      }
    } catch (error) {
      console.error(`  ✗ Error running query "${query.query}":`, error);
      results.push(createErrorResult(query.category));
    }
  }

  return aggregateResults(entry, results);
}
