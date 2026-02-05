/**
 * Filtered aggregate calculations excluding LLM-required categories.
 *
 * @packageDocumentation
 */

import type { EntryBenchmarkResult } from './benchmark-entry-runner.js';
import { calculateP95, type CategoryResult } from './benchmark-stats.js';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth-archive/types.js';

/**
 * Categories that require LLM features to function well.
 *
 * These categories test query types that our ELSER-based search cannot
 * adequately handle without query expansion or semantic understanding:
 * - natural-expression: Informal phrasing that needs synonym expansion
 *
 * We still measure these categories but report separate aggregates
 * to give a clearer picture of search performance.
 */
export const LLM_REQUIRED_CATEGORIES: readonly QueryCategory[] = ['natural-expression'] as const;

/**
 * Categories excluded from ALL aggregate statistics.
 *
 * These categories test capabilities that require Level 3-4 search features
 * not yet implemented. They are tracked separately to measure progress toward
 * future capabilities.
 * - future-intent: Requires intent classification (Level 4)
 */
export const EXCLUDED_FROM_STATS_CATEGORIES: readonly QueryCategory[] = ['future-intent'] as const;

/** Filtered aggregate result type. */
export interface FilteredAggregate {
  queryCount: number;
  mrr: number;
  ndcg10: number;
  precision3: number;
  recall10: number;
  zeroHitRate: number;
  p95LatencyMs: number;
}

/** Accumulator for weighted metric sums. */
interface MetricAccumulator {
  totalQueries: number;
  weightedMrr: number;
  weightedNdcg: number;
  weightedP3: number;
  weightedR10: number;
  weightedZero: number;
}

/** Creates empty accumulator. */
function createAccumulator(): MetricAccumulator {
  return {
    totalQueries: 0,
    weightedMrr: 0,
    weightedNdcg: 0,
    weightedP3: 0,
    weightedR10: 0,
    weightedZero: 0,
  };
}

/** Accumulates metrics from a category result. */
function accumulateCategory(acc: MetricAccumulator, cat: CategoryResult): void {
  acc.totalQueries += cat.queryCount;
  acc.weightedMrr += cat.mrr * cat.queryCount;
  acc.weightedNdcg += cat.ndcg10 * cat.queryCount;
  acc.weightedP3 += cat.precision3 * cat.queryCount;
  acc.weightedR10 += cat.recall10 * cat.queryCount;
  acc.weightedZero += cat.zeroHitRate * cat.queryCount;
}

/** Converts accumulator to final aggregate. */
function finalizeAggregate(
  acc: MetricAccumulator,
  allLatencies: readonly number[],
): FilteredAggregate {
  const { totalQueries } = acc;
  return {
    queryCount: totalQueries,
    mrr: totalQueries > 0 ? acc.weightedMrr / totalQueries : 0,
    ndcg10: totalQueries > 0 ? acc.weightedNdcg / totalQueries : 0,
    precision3: totalQueries > 0 ? acc.weightedP3 / totalQueries : 0,
    recall10: totalQueries > 0 ? acc.weightedR10 / totalQueries : 0,
    zeroHitRate: totalQueries > 0 ? acc.weightedZero / totalQueries : 0,
    p95LatencyMs: calculateP95([...allLatencies]),
  };
}

/** Calculate filtered aggregate excluding LLM-required AND excluded-from-stats categories. */
export function calculateFilteredAggregate(
  results: readonly EntryBenchmarkResult[],
): FilteredAggregate {
  const acc = createAccumulator();
  const allLatencies = results.flatMap((e) => [...e.latencies]);

  for (const entry of results) {
    for (const cat of entry.perCategory) {
      const isLlmRequired = LLM_REQUIRED_CATEGORIES.includes(cat.category);
      const isExcludedFromStats = EXCLUDED_FROM_STATS_CATEGORIES.includes(cat.category);
      if (!isLlmRequired && !isExcludedFromStats) {
        accumulateCategory(acc, cat);
      }
    }
  }

  return finalizeAggregate(acc, allLatencies);
}
