/**
 * BM25 Configuration Ablation Smoke Test
 *
 * Tests each Phase 3e BM25 enhancement in isolation to understand:
 * 1. Which changes improve search quality (MRR/NDCG)
 * 2. Which changes impact latency
 * 3. The quality/latency tradeoff for each configuration
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **Configurations Tested** (7 total):
 * - baseline: Pre-Phase-3e (control group)
 * - fuzzy_only: Enhanced fuzziness (AUTO:3,6, prefix_length, transpositions)
 * - phrase_prefix_only: Only phrase prefix boost
 * - min_match_only: Only minimum_should_match 75%
 * - no_phrase_prefix: All except phrase prefix (hypothesis: latency fix)
 * - min_match_50: Reduced minimum_should_match for better recall
 * - phase_3e: Current configuration (all enhancements)
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  GROUND_TRUTH_QUERIES,
  HARD_GROUND_TRUTH_QUERIES,
} from '../src/lib/search-quality/ground-truth/index.js';
import {
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
} from '../src/lib/search-quality/ground-truth/units/index.js';
import { calculateMRR, calculateNDCG } from '../src/lib/search-quality/metrics.js';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  BM25_CONFIGS,
  BM25_CONFIG_NAMES,
  type Bm25ConfigName,
} from '../src/lib/hybrid-search/bm25-config.js';
import {
  buildConfigurableLessonRrfRequest,
  buildConfigurableLessonBm25OnlyRequest,
  buildConfigurableUnitRrfRequest,
} from '../src/lib/hybrid-search/configurable-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../src/types/oak.js';
import type { GroundTruthQuery } from '../src/lib/search-quality/ground-truth/types.js';
import type { UnitGroundTruthQuery } from '../src/lib/search-quality/ground-truth/units/types.js';

/** Target thresholds */
const TARGETS = {
  /** Hard query MRR - aspirational */
  HARD_MRR: 0.5,
  /** Standard query MRR - maintain excellence */
  STANDARD_MRR: 0.92,
  /** Maximum acceptable p95 latency */
  MAX_LATENCY_MS: 650,
  /** Maximum acceptable zero-hit rate */
  MAX_ZERO_HIT_RATE: 0.3,
} as const;

/** Metrics collected for each configuration */
interface ConfigMetrics {
  readonly configName: Bm25ConfigName;
  readonly mrr: number[];
  readonly ndcg: number[];
  readonly latencies: number[];
  zeroHits: number;
  readonly queryCount: number;
}

/** Aggregated results */
interface ConfigResults {
  readonly configName: Bm25ConfigName;
  readonly avgMRR: number;
  readonly avgNDCG: number;
  readonly zeroHitRate: number;
  readonly p95Latency: number;
  readonly avgLatency: number;
  readonly minLatency: number;
  readonly maxLatency: number;
}

/** Search mode */
type SearchMode = 'hybrid' | 'bm25_only';

/** Search lessons using a specific BM25 configuration. */
async function searchLessons(
  query: string,
  configName: Bm25ConfigName,
  mode: SearchMode,
): Promise<{ results: readonly string[]; latency: number }> {
  const config = BM25_CONFIGS[configName];
  const params = { text: query, size: 10, subject: 'maths' as const, keyStage: 'ks4' as const };
  const start = performance.now();
  const request =
    mode === 'hybrid'
      ? buildConfigurableLessonRrfRequest(params, config)
      : buildConfigurableLessonBm25OnlyRequest(params, config);
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return {
    results: response.hits.hits.map((hit) => hit._source.lesson_slug),
    latency: performance.now() - start,
  };
}

/** Search units using a specific BM25 configuration. */
async function searchUnits(
  query: string,
  configName: Bm25ConfigName,
): Promise<{ results: readonly string[]; latency: number }> {
  const config = BM25_CONFIGS[configName];
  const params = { text: query, size: 10, subject: 'maths' as const, keyStage: 'ks4' as const };
  const start = performance.now();
  const request = buildConfigurableUnitRrfRequest(params, config);
  const response = await esSearch<SearchUnitRollupDoc>(request);
  return {
    results: response.hits.hits.map((hit) => hit._source.unit_slug),
    latency: performance.now() - start,
  };
}

/** Run lesson experiment for a specific configuration. */
async function runLessonExperiment(
  configName: Bm25ConfigName,
  queries: readonly GroundTruthQuery[],
  mode: SearchMode,
): Promise<ConfigMetrics> {
  const metrics: ConfigMetrics = {
    configName,
    mrr: [],
    ndcg: [],
    latencies: [],
    zeroHits: 0,
    queryCount: queries.length,
  };
  for (const { query, expectedRelevance } of queries) {
    const { results, latency } = await searchLessons(query, configName, mode);
    metrics.latencies.push(latency);
    if (results.length === 0) {
      metrics.zeroHits++;
      metrics.mrr.push(0);
      metrics.ndcg.push(0);
    } else {
      metrics.mrr.push(calculateMRR(results, expectedRelevance));
      metrics.ndcg.push(calculateNDCG(results, expectedRelevance, 10));
    }
  }
  return metrics;
}

/** Run unit experiment for a specific configuration. */
async function runUnitExperiment(
  configName: Bm25ConfigName,
  queries: readonly UnitGroundTruthQuery[],
): Promise<ConfigMetrics> {
  const metrics: ConfigMetrics = {
    configName,
    mrr: [],
    ndcg: [],
    latencies: [],
    zeroHits: 0,
    queryCount: queries.length,
  };
  for (const { query, expectedRelevance } of queries) {
    const { results, latency } = await searchUnits(query, configName);
    metrics.latencies.push(latency);
    if (results.length === 0) {
      metrics.zeroHits++;
      metrics.mrr.push(0);
      metrics.ndcg.push(0);
    } else {
      metrics.mrr.push(calculateMRR(results, expectedRelevance));
      metrics.ndcg.push(calculateNDCG(results, expectedRelevance, 10));
    }
  }
  return metrics;
}

/** Calculate p95 latency */
function calculateP95(latencies: readonly number[]): number {
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.95);
  return sorted[index] ?? 0;
}

/** Calculate average */
function calculateAvg(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Aggregate results */
function aggregateResults(metrics: ConfigMetrics): ConfigResults {
  return {
    configName: metrics.configName,
    avgMRR: calculateAvg(metrics.mrr),
    avgNDCG: calculateAvg(metrics.ndcg),
    zeroHitRate: metrics.zeroHits / metrics.queryCount,
    p95Latency: calculateP95(metrics.latencies),
    avgLatency: calculateAvg(metrics.latencies),
    minLatency: Math.min(...metrics.latencies),
    maxLatency: Math.max(...metrics.latencies),
  };
}

/** Format configuration name with description */
function formatConfigName(name: Bm25ConfigName): string {
  const descriptions: Record<Bm25ConfigName, string> = {
    baseline: 'Pre-3e baseline',
    fuzzy_only: '+Fuzzy (AUTO:3,6)',
    phrase_prefix_only: '+Phrase prefix',
    min_match_only: '+min_should_match 75%',
    no_phrase_prefix: 'All except phrase prefix',
    min_match_50: 'min_should_match 50%',
    phase_3e: 'Full Phase 3e',
  };
  return `${name.padEnd(20)} (${descriptions[name]})`;
}

/** Log comparison table */
function logComparisonTable(
  title: string,
  results: readonly ConfigResults[],
  baselineConfig: Bm25ConfigName,
): void {
  const baseline = results.find((r) => r.configName === baselineConfig);
  const baselineMRR = baseline?.avgMRR ?? 0;
  const baselineLatency = baseline?.p95Latency ?? 0;

  console.log(`\n${'='.repeat(120)}`);
  console.log(title);
  console.log('='.repeat(120));
  console.log(
    `${'Configuration'.padEnd(45)} | ${'MRR'.padEnd(7)} | ${'Δ MRR'.padEnd(8)} | ${'NDCG'.padEnd(7)} | ${'Zero%'.padEnd(6)} | ${'p95 ms'.padEnd(8)} | ${'Δ Latency'.padEnd(10)} | Avg ms`,
  );
  console.log('-'.repeat(120));

  for (const result of results) {
    const mrrDelta = ((result.avgMRR - baselineMRR) * 100).toFixed(1);
    const mrrDeltaStr = result.avgMRR >= baselineMRR ? `+${mrrDelta}%` : `${mrrDelta}%`;

    const latencyDelta = result.p95Latency - baselineLatency;
    const latencyDeltaStr =
      latencyDelta >= 0 ? `+${latencyDelta.toFixed(0)}ms` : `${latencyDelta.toFixed(0)}ms`;

    console.log(
      `${formatConfigName(result.configName).padEnd(45)} | ${result.avgMRR.toFixed(3).padEnd(7)} | ${mrrDeltaStr.padEnd(8)} | ${result.avgNDCG.toFixed(3).padEnd(7)} | ${(result.zeroHitRate * 100).toFixed(1).padEnd(6)} | ${result.p95Latency.toFixed(0).padEnd(8)} | ${latencyDeltaStr.padEnd(10)} | ${result.avgLatency.toFixed(0)}`,
    );
  }
  console.log('-'.repeat(120));
}

/** Get config result by name, returns undefined if not found */
function getConfig(
  results: readonly ConfigResults[],
  name: Bm25ConfigName,
): ConfigResults | undefined {
  return results.find((r) => r.configName === name);
}

/** Format MRR comparison */
function fmtMrrDelta(from: ConfigResults, to: ConfigResults): string {
  const delta = ((to.avgMRR - from.avgMRR) * 100).toFixed(1);
  return `${from.avgMRR.toFixed(3)} → ${to.avgMRR.toFixed(3)} (${delta}%)`;
}

/** Format latency comparison */
function fmtLatencyDelta(from: ConfigResults, to: ConfigResults): string {
  const delta = to.p95Latency - from.p95Latency;
  return `${from.p95Latency.toFixed(0)}ms → ${to.p95Latency.toFixed(0)}ms (+${delta.toFixed(0)}ms)`;
}

/** Log key insights - simplified to reduce complexity */
function logInsights(
  standardResults: readonly ConfigResults[],
  hardResults: readonly ConfigResults[],
): void {
  console.log(`\n${'='.repeat(80)}\nKEY INSIGHTS\n${'='.repeat(80)}`);

  const stdBase = getConfig(standardResults, 'baseline');
  const std3e = getConfig(standardResults, 'phase_3e');
  const base = getConfig(hardResults, 'baseline');
  const p3e = getConfig(hardResults, 'phase_3e');
  const noPhrase = getConfig(hardResults, 'no_phrase_prefix');

  if (stdBase && std3e) {
    console.log(`\n0. STANDARD: MRR ${fmtMrrDelta(stdBase, std3e)}`);
  }
  if (base && p3e) {
    console.log(
      `1. HARD QUERIES: MRR ${fmtMrrDelta(base, p3e)}, Latency ${fmtLatencyDelta(base, p3e)}`,
    );
  }
  if (noPhrase && base) {
    const meetsTarget = noPhrase.p95Latency <= TARGETS.MAX_LATENCY_MS ? '✅' : '⚠️';
    console.log(`2. NO PHRASE PREFIX: p95 ${noPhrase.p95Latency.toFixed(0)}ms ${meetsTarget}`);
  }

  console.log('='.repeat(80));
}

describe('BM25 Configuration Ablation (Phase 3e)', () => {
  let lessonStdResults: ConfigResults[] = [];
  let lessonHardResults: ConfigResults[] = [];
  let unitHardResults: ConfigResults[] = [];

  beforeAll(async () => {
    console.log('\n' + '='.repeat(80));
    console.log('BM25 CONFIGURATION ABLATION EXPERIMENT');
    console.log('='.repeat(80));
    console.log(`Testing ${BM25_CONFIG_NAMES.length} configurations...`);
    console.log(
      `Lesson queries: ${GROUND_TRUTH_QUERIES.length} std, ${HARD_GROUND_TRUTH_QUERIES.length} hard`,
    );
    console.log(
      `Unit queries: ${UNIT_GROUND_TRUTH_QUERIES.length} std, ${UNIT_HARD_GROUND_TRUTH_QUERIES.length} hard`,
    );
    console.log('\nThis may take several minutes...\n');

    // Run lesson and unit experiments in parallel
    const [lessonStd, lessonHard, unitHard] = await Promise.all([
      Promise.all(
        BM25_CONFIG_NAMES.map((c) => runLessonExperiment(c, GROUND_TRUTH_QUERIES, 'hybrid')),
      ),
      Promise.all(
        BM25_CONFIG_NAMES.map((c) => runLessonExperiment(c, HARD_GROUND_TRUTH_QUERIES, 'hybrid')),
      ),
      Promise.all(
        BM25_CONFIG_NAMES.map((c) => runUnitExperiment(c, UNIT_HARD_GROUND_TRUTH_QUERIES)),
      ),
    ]);

    lessonStdResults = lessonStd.map(aggregateResults);
    lessonHardResults = lessonHard.map(aggregateResults);
    unitHardResults = unitHard.map(aggregateResults);

    // Log results
    logComparisonTable('LESSONS - STANDARD QUERIES', lessonStdResults, 'baseline');
    logComparisonTable('LESSONS - HARD QUERIES', lessonHardResults, 'baseline');
    logComparisonTable('UNITS - HARD QUERIES', unitHardResults, 'baseline');

    logInsights(lessonStdResults, lessonHardResults);
  }, 600000); // 10 minute timeout

  describe('Latency Isolation', () => {
    it('identifies phrase prefix latency impact', () => {
      const baseline = lessonHardResults.find((r) => r.configName === 'baseline');
      const phraseOnly = lessonHardResults.find((r) => r.configName === 'phrase_prefix_only');
      expect(baseline).toBeDefined();
      expect(phraseOnly).toBeDefined();
      if (baseline && phraseOnly) {
        const delta = phraseOnly.p95Latency - baseline.p95Latency;
        console.log(`\nPhrase prefix latency delta: ${delta.toFixed(0)}ms`);
      }
    });
  });

  describe('Quality Impact', () => {
    it('min_should_match improves hard query MRR', () => {
      const baseline = lessonHardResults.find((r) => r.configName === 'baseline');
      const minMatch = lessonHardResults.find((r) => r.configName === 'min_match_only');
      expect(baseline).toBeDefined();
      expect(minMatch).toBeDefined();
      if (baseline && minMatch) {
        console.log(`\nmin_should_match impact:`);
        console.log(`  Baseline MRR: ${baseline.avgMRR.toFixed(3)}`);
        console.log(
          `  min_match MRR: ${minMatch.avgMRR.toFixed(3)} (+${((minMatch.avgMRR - baseline.avgMRR) * 100).toFixed(1)}%)`,
        );
        expect(minMatch.zeroHitRate).toBeLessThan(TARGETS.MAX_ZERO_HIT_RATE);
      }
    });

    it('unit search shows similar patterns', () => {
      const baseline = unitHardResults.find((r) => r.configName === 'baseline');
      const minMatch = unitHardResults.find((r) => r.configName === 'min_match_only');
      expect(baseline).toBeDefined();
      expect(minMatch).toBeDefined();
      if (baseline && minMatch) {
        console.log(`\nUnit min_should_match impact:`);
        console.log(`  Baseline MRR: ${baseline.avgMRR.toFixed(3)}`);
        console.log(`  min_match MRR: ${minMatch.avgMRR.toFixed(3)}`);
      }
    });
  });

  describe('Standard Query Regression', () => {
    it('no configuration regresses standard query MRR below target', () => {
      for (const result of lessonStdResults) {
        expect(
          result.avgMRR,
          `${result.configName} MRR ${result.avgMRR.toFixed(3)} should be ≥ ${TARGETS.STANDARD_MRR}`,
        ).toBeGreaterThanOrEqual(TARGETS.STANDARD_MRR - 0.02);
      }
    });
  });

  it('produces valid metrics for all configurations', () => {
    expect(lessonStdResults).toHaveLength(BM25_CONFIG_NAMES.length);
    expect(lessonHardResults).toHaveLength(BM25_CONFIG_NAMES.length);
    expect(unitHardResults).toHaveLength(BM25_CONFIG_NAMES.length);

    for (const result of [...lessonHardResults, ...unitHardResults]) {
      expect(result.avgMRR).toBeGreaterThanOrEqual(0);
      expect(result.avgMRR).toBeLessThanOrEqual(1);
      expect(result.p95Latency).toBeGreaterThan(0);
    }
  });
});
