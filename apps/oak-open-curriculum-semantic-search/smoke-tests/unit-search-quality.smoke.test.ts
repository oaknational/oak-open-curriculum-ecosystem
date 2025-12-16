/**
 * Unit Search Quality Smoke Tests (Phase 3, Task 3)
 *
 * Measures unit search quality metrics against ground truth relevance judgements
 * to establish baseline for two-way hybrid search (BM25 + ELSER).
 *
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to a running server (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires `pnpm dev` running in apps/oak-open-curriculum-semantic-search
 *
 * **Targets** (initial, lower than lessons due to fewer indexed units):
 * - MRR > 0.60 (first relevant result in position 1-2)
 * - NDCG@10 > 0.65 (highly relevant results near top)
 * - Zero-hit rate < 15% (most queries return results)
 * - p95 latency < 300ms (good user experience)
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { UNIT_GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth/units/index.js';
import { calculateMRR, calculateNDCG } from '../src/lib/search-quality/metrics.js';
import { HybridResponseUnits } from '../src/lib/openapi.schemas.js';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3003';

/** Metrics collected across all queries */
interface CollectedMetrics {
  readonly mrr: number[];
  readonly ndcg: number[];
  readonly latencies: number[];
  zeroHits: number;
}

/** Aggregated metrics summary */
interface MetricsSummary {
  readonly avgMRR: number;
  readonly avgNDCG: number;
  readonly zeroHitRate: number;
  readonly p95Latency: number;
}

/** Target check results */
interface TargetResults {
  readonly mrrPass: boolean;
  readonly ndcgPass: boolean;
  readonly zeroHitPass: boolean;
  readonly latencyPass: boolean;
}

/**
 * Search for units via the API.
 *
 * Uses Zod validation to ensure response matches expected schema,
 * avoiding unsafe `as` type assertions.
 *
 * @param query - Search query text
 * @returns Results array and latency
 * @throws Error if server is unavailable or returns invalid response
 */
async function searchUnits(
  query: string,
): Promise<{ results: readonly string[]; latency: number; total: number }> {
  const start = performance.now();

  const response = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: query,
      scope: 'units',
      subject: 'maths',
      keyStage: 'ks4',
      size: 10,
    }),
  });

  const latency = performance.now() - start;

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();
  const parseResult = HybridResponseUnits.safeParse(json);

  if (!parseResult.success) {
    throw new Error(`Invalid unit search response: ${parseResult.error.message}`);
  }

  const data = parseResult.data;
  const results = data.results.filter((r) => r.unit !== null).map((r) => r.unit?.unit_slug ?? '');

  return { results, latency, total: data.total };
}

/**
 * Calculate p95 latency from array of latencies.
 *
 * @param latencies - Array of latency measurements in ms
 * @returns 95th percentile latency
 */
function calculateP95(latencies: readonly number[]): number {
  if (latencies.length === 0) {
    return 0;
  }
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.95);
  const p95 = sorted[index];
  if (p95 === undefined) {
    return sorted[sorted.length - 1] ?? 0;
  }
  return p95;
}

/**
 * Calculate aggregated metrics summary from collected data.
 *
 * @param metrics - Collected metrics from all queries
 * @param queryCount - Total number of queries
 * @returns Aggregated summary
 */
function calculateMetricsSummary(metrics: CollectedMetrics, queryCount: number): MetricsSummary {
  const avgMRR = metrics.mrr.reduce((a, b) => a + b, 0) / metrics.mrr.length;
  const avgNDCG = metrics.ndcg.reduce((a, b) => a + b, 0) / metrics.ndcg.length;
  const zeroHitRate = metrics.zeroHits / queryCount;
  const p95Latency = calculateP95(metrics.latencies);

  return { avgMRR, avgNDCG, zeroHitRate, p95Latency };
}

/**
 * Check if metrics meet targets.
 *
 * @param summary - Aggregated metrics
 * @returns Target check results
 */
function checkTargets(summary: MetricsSummary): TargetResults {
  return {
    mrrPass: summary.avgMRR > 0.6,
    ndcgPass: summary.avgNDCG > 0.65,
    zeroHitPass: summary.zeroHitRate < 0.15,
    latencyPass: summary.p95Latency < 300,
  };
}

/**
 * Log the metrics summary to console.
 *
 * @param summary - Aggregated metrics
 * @param queryCount - Total number of queries
 */
function logMetricsSummary(summary: MetricsSummary, queryCount: number): void {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('UNIT SEARCH QUALITY BASELINE RESULTS');
  console.log('='.repeat(60));
  console.log(`Queries evaluated: ${queryCount}`);
  console.log(`MRR:          ${summary.avgMRR.toFixed(3)} (target: > 0.60)`);
  console.log(`NDCG@10:      ${summary.avgNDCG.toFixed(3)} (target: > 0.65)`);
  console.log(`Zero-hit:     ${(summary.zeroHitRate * 100).toFixed(1)}% (target: < 15%)`);
  console.log(`p95 Latency:  ${summary.p95Latency.toFixed(0)}ms (target: < 300ms)`);
  console.log('='.repeat(60));
}

/**
 * Log the decision guidance based on target results.
 *
 * @param summary - Aggregated metrics
 * @param targets - Target check results
 */
function logDecisionGuidance(summary: MetricsSummary, targets: TargetResults): void {
  const allPass = targets.mrrPass && targets.ndcgPass && targets.zeroHitPass && targets.latencyPass;

  console.log('\nDECISION:');
  if (allPass) {
    console.log('✓ All unit search targets met. Two-way hybrid is working for units.');
    console.log('→ Proceed with remaining Phase 3 tasks.');
  } else {
    logFailedTargets(summary, targets);
    console.log('→ Investigate unit search quality issues before proceeding.');
  }
  console.log('='.repeat(60));
}

/**
 * Log which targets failed.
 *
 * @param summary - Aggregated metrics
 * @param targets - Target check results
 */
function logFailedTargets(summary: MetricsSummary, targets: TargetResults): void {
  console.log('✗ Targets NOT met:');
  if (!targets.mrrPass) {
    console.log(`  - MRR ${summary.avgMRR.toFixed(3)} <= 0.60`);
  }
  if (!targets.ndcgPass) {
    console.log(`  - NDCG@10 ${summary.avgNDCG.toFixed(3)} <= 0.65`);
  }
  if (!targets.zeroHitPass) {
    console.log(`  - Zero-hit rate ${(summary.zeroHitRate * 100).toFixed(1)}% >= 15%`);
  }
  if (!targets.latencyPass) {
    console.log(`  - p95 latency ${summary.p95Latency.toFixed(0)}ms >= 300ms`);
  }
}

describe('Unit Search Quality Baseline (Phase 3, Task 3)', () => {
  /** Collect metrics across all query tests */
  const metrics: CollectedMetrics = {
    mrr: [],
    ndcg: [],
    latencies: [],
    zeroHits: 0,
  };

  beforeAll(async () => {
    // Fail fast with clear error if server is not available
    try {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test', scope: 'units' }),
      });

      // 404 means wrong server (e.g. streamable-http instead of semantic-search)
      if (response.status === 404) {
        throw new Error(
          `Server at ${BASE_URL} does not have /api/search endpoint. ` +
            `Ensure semantic search server is running: pnpm dev in apps/oak-open-curriculum-semantic-search`,
        );
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Cannot connect to server at ${BASE_URL}. ` +
            `Start the semantic search server: pnpm dev in apps/oak-open-curriculum-semantic-search`,
        );
      }
      throw error;
    }

    console.log(`✓ Server available at ${BASE_URL}`);
  });

  afterAll(() => {
    if (metrics.mrr.length === 0) {
      throw new Error('No metrics collected - query tests did not run');
    }

    const summary = calculateMetricsSummary(metrics, UNIT_GROUND_TRUTH_QUERIES.length);
    const targets = checkTargets(summary);

    logMetricsSummary(summary, UNIT_GROUND_TRUTH_QUERIES.length);
    logDecisionGuidance(summary, targets);
  });

  // Individual query tests
  for (const { query, expectedRelevance } of UNIT_GROUND_TRUTH_QUERIES) {
    it(`evaluates: "${query}"`, async () => {
      const { results, latency, total } = await searchUnits(query);

      metrics.latencies.push(latency);

      if (total === 0) {
        metrics.zeroHits++;
        metrics.mrr.push(0);
        metrics.ndcg.push(0);

        console.log(`Query: "${query}"`);
        console.log(`  ZERO HITS - no results returned`);
        console.log(`  Latency: ${latency.toFixed(0)}ms`);

        // Don't fail the test for zero hits, just record it
        expect(true).toBe(true);
        return;
      }

      const mrr = calculateMRR(results, expectedRelevance);
      const ndcg = calculateNDCG(results, expectedRelevance, 10);

      metrics.mrr.push(mrr);
      metrics.ndcg.push(ndcg);

      console.log(`Query: "${query}"`);
      console.log(`  Total: ${total}, MRR: ${mrr.toFixed(3)}, NDCG@10: ${ndcg.toFixed(3)}`);
      console.log(`  Latency: ${latency.toFixed(0)}ms`);
      console.log(`  Top 3: ${results.slice(0, 3).join(', ')}`);

      // Individual query assertions are informational
      // The final "meets baseline targets" test does the hard assertions
      expect(results.length).toBeGreaterThan(0);
    });
  }

  it('meets baseline targets', () => {
    // Fail fast if no metrics collected
    if (metrics.mrr.length === 0) {
      throw new Error('No metrics collected - query tests did not run');
    }

    const summary = calculateMetricsSummary(metrics, UNIT_GROUND_TRUTH_QUERIES.length);

    // Assert all targets (using lower thresholds for units)
    expect(summary.avgMRR, `MRR ${summary.avgMRR.toFixed(3)} should be > 0.60`).toBeGreaterThan(
      0.6,
    );
    expect(
      summary.avgNDCG,
      `NDCG@10 ${summary.avgNDCG.toFixed(3)} should be > 0.65`,
    ).toBeGreaterThan(0.65);
    expect(
      summary.zeroHitRate,
      `Zero-hit rate ${(summary.zeroHitRate * 100).toFixed(1)}% should be < 15%`,
    ).toBeLessThan(0.15);
    expect(
      summary.p95Latency,
      `p95 latency ${summary.p95Latency.toFixed(0)}ms should be < 300ms`,
    ).toBeLessThan(300);
  });
});
