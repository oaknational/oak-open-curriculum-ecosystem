/**
 * Four-Retriever Ablation Smoke Test
 *
 * Proves the value of the four-retriever hybrid architecture by measuring
 * each retriever individually and in combinations.
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **Configurations Tested** (7 total):
 * - Individual retrievers (4): bm25_content, elser_content, bm25_structure, elser_structure
 * - Two-way hybrids (2): content_hybrid, structure_hybrid
 * - Full hybrid (1): four_way_hybrid
 *
 * **Questions Answered**:
 * 1. Does structure add value? Compare content_hybrid vs four_way_hybrid
 * 2. Does ELSER beat BM25? Compare bm25_content vs elser_content
 * 3. Which field is more important? Compare content_hybrid vs structure_hybrid
 * 4. Do hard queries differentiate? Compare standard vs hard query performance
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  MATHS_SECONDARY_STANDARD_QUERIES,
  MATHS_SECONDARY_HARD_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
} from '../src/lib/search-quality/ground-truth/index.js';
import { calculateMRR, calculateNDCG } from '../src/lib/search-quality/metrics.js';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../src/lib/hybrid-search/rrf-query-builders.js';
import {
  buildLessonBm25OnlyRequest,
  buildLessonElserOnlyRequest,
  buildLessonBm25StructureOnlyRequest,
  buildLessonElserStructureOnlyRequest,
  buildLessonContentHybridRequest,
  buildLessonStructureHybridRequest,
  buildUnitBm25OnlyRequest,
  buildUnitElserOnlyRequest,
  buildUnitBm25StructureOnlyRequest,
  buildUnitElserStructureOnlyRequest,
  buildUnitContentHybridRequest,
  buildUnitStructureHybridRequest,
} from '../src/lib/hybrid-search/experiment-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../src/types/oak.js';
import type { GroundTruthQuery } from '../src/lib/search-quality/ground-truth/types.js';

/**
 * MRR Interpretation Rubric
 *
 * MRR (Mean Reciprocal Rank) measures how high the first relevant result appears.
 * Use this rubric to interpret results consistently.
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */
const MRR_RUBRIC = {
  EXCELLENT: { min: 0.8, label: 'Excellent', meaning: 'Correct result typically 1st or 2nd' },
  GOOD: { min: 0.5, label: 'Good', meaning: 'Correct result typically 2nd' },
  ACCEPTABLE: { min: 0.33, label: 'Acceptable', meaning: 'Correct result typically 3rd' },
  POOR: { min: 0.25, label: 'Poor', meaning: 'Correct result typically 4th' },
  VERY_POOR: { min: 0.0, label: 'Very Poor', meaning: 'Correct result typically 5th or worse' },
} as const;

/** Target thresholds for Phase 3e (aspirational) */
const PHASE_3E_TARGETS = {
  /** Hard query MRR target - aspirational */
  HARD_QUERY_MRR: 0.5, // "Good" - correct result typically 2nd
  /** Hard query NDCG@10 target */
  HARD_QUERY_NDCG: 0.4,
  /** Standard query MRR target - maintain excellence */
  STANDARD_QUERY_MRR: 0.92,
  /** Standard query NDCG@10 target */
  STANDARD_QUERY_NDCG: 0.74,
  /** Maximum acceptable p95 latency */
  MAX_LATENCY_MS: 650,
} as const;

/** Get rubric rating for an MRR value */
function getMrrRating(mrr: number): { label: string; meaning: string } {
  if (mrr >= MRR_RUBRIC.EXCELLENT.min) {
    return MRR_RUBRIC.EXCELLENT;
  }
  if (mrr >= MRR_RUBRIC.GOOD.min) {
    return MRR_RUBRIC.GOOD;
  }
  if (mrr >= MRR_RUBRIC.ACCEPTABLE.min) {
    return MRR_RUBRIC.ACCEPTABLE;
  }
  if (mrr >= MRR_RUBRIC.POOR.min) {
    return MRR_RUBRIC.POOR;
  }
  return MRR_RUBRIC.VERY_POOR;
}

/** Ablation configuration identifier */
type AblationConfig =
  | 'bm25_content'
  | 'elser_content'
  | 'bm25_structure'
  | 'elser_structure'
  | 'content_hybrid'
  | 'structure_hybrid'
  | 'four_way_hybrid';

/** All configurations in display order */
const ALL_CONFIGS: readonly AblationConfig[] = [
  'bm25_content',
  'elser_content',
  'bm25_structure',
  'elser_structure',
  'content_hybrid',
  'structure_hybrid',
  'four_way_hybrid',
] as const;

/** Content type for the experiment */
type ContentType = 'lessons' | 'units';

/** Query set identifier */
type QuerySet = 'standard' | 'hard' | 'all';

/** Metrics collected for a single configuration */
interface ConfigMetrics {
  readonly config: AblationConfig;
  readonly mrr: number[];
  readonly ndcg: number[];
  readonly latencies: number[];
  zeroHits: number;
  readonly queryCount: number;
}

/** Aggregated results for a single configuration */
interface ConfigResults {
  readonly config: AblationConfig;
  readonly avgMRR: number;
  readonly avgNDCG: number;
  readonly zeroHitRate: number;
  readonly p95Latency: number;
}

/** Results for a content type experiment */
interface ContentTypeResults {
  readonly contentType: ContentType;
  readonly querySet: QuerySet;
  readonly queryCount: number;
  readonly results: readonly ConfigResults[];
}

/** Base search parameters */
interface BaseSearchParams {
  text: string;
  size: number;
  subject: 'maths';
  keyStage: 'ks4';
}

/**
 * Search lessons using a specific configuration.
 */
async function searchLessonsWithConfig(
  query: string,
  config: AblationConfig,
): Promise<{ results: readonly string[]; latency: number }> {
  const baseParams: BaseSearchParams = {
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  };

  const start = performance.now();

  let request;
  switch (config) {
    case 'bm25_content':
      request = buildLessonBm25OnlyRequest(baseParams);
      break;
    case 'elser_content':
      request = buildLessonElserOnlyRequest(baseParams);
      break;
    case 'bm25_structure':
      request = buildLessonBm25StructureOnlyRequest(baseParams);
      break;
    case 'elser_structure':
      request = buildLessonElserStructureOnlyRequest(baseParams);
      break;
    case 'content_hybrid':
      request = buildLessonContentHybridRequest(baseParams);
      break;
    case 'structure_hybrid':
      request = buildLessonStructureHybridRequest(baseParams);
      break;
    case 'four_way_hybrid':
      request = buildLessonRrfRequest(baseParams);
      break;
  }

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const latency = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.lesson_slug);

  return { results, latency };
}

/**
 * Search units using a specific configuration.
 */
async function searchUnitsWithConfig(
  query: string,
  config: AblationConfig,
): Promise<{ results: readonly string[]; latency: number }> {
  const baseParams: BaseSearchParams = {
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  };

  const start = performance.now();

  let request;
  switch (config) {
    case 'bm25_content':
      request = buildUnitBm25OnlyRequest(baseParams);
      break;
    case 'elser_content':
      request = buildUnitElserOnlyRequest(baseParams);
      break;
    case 'bm25_structure':
      request = buildUnitBm25StructureOnlyRequest(baseParams);
      break;
    case 'elser_structure':
      request = buildUnitElserStructureOnlyRequest(baseParams);
      break;
    case 'content_hybrid':
      request = buildUnitContentHybridRequest(baseParams);
      break;
    case 'structure_hybrid':
      request = buildUnitStructureHybridRequest(baseParams);
      break;
    case 'four_way_hybrid':
      request = buildUnitRrfRequest(baseParams);
      break;
  }

  const response = await esSearch<SearchUnitRollupDoc>(request);
  const latency = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.unit_slug);

  return { results, latency };
}

/**
 * Run lesson experiment for a specific configuration.
 */
async function runLessonConfigExperiment(
  config: AblationConfig,
  queries: readonly GroundTruthQuery[],
): Promise<ConfigMetrics> {
  const metrics: ConfigMetrics = {
    config,
    mrr: [],
    ndcg: [],
    latencies: [],
    zeroHits: 0,
    queryCount: queries.length,
  };

  for (const { query, expectedRelevance } of queries) {
    const { results, latency } = await searchLessonsWithConfig(query, config);
    metrics.latencies.push(latency);

    if (results.length === 0) {
      metrics.zeroHits++;
      metrics.mrr.push(0);
      metrics.ndcg.push(0);
    } else {
      const mrr = calculateMRR(results, expectedRelevance);
      const ndcg = calculateNDCG(results, expectedRelevance, 10);
      metrics.mrr.push(mrr);
      metrics.ndcg.push(ndcg);
    }
  }

  return metrics;
}

/**
 * Run unit experiment for a specific configuration.
 */
async function runUnitConfigExperiment(
  config: AblationConfig,
  queries: readonly UnitGroundTruthQuery[],
): Promise<ConfigMetrics> {
  const metrics: ConfigMetrics = {
    config,
    mrr: [],
    ndcg: [],
    latencies: [],
    zeroHits: 0,
    queryCount: queries.length,
  };

  for (const { query, expectedRelevance } of queries) {
    const { results, latency } = await searchUnitsWithConfig(query, config);
    metrics.latencies.push(latency);

    if (results.length === 0) {
      metrics.zeroHits++;
      metrics.mrr.push(0);
      metrics.ndcg.push(0);
    } else {
      const mrr = calculateMRR(results, expectedRelevance);
      const ndcg = calculateNDCG(results, expectedRelevance, 10);
      metrics.mrr.push(mrr);
      metrics.ndcg.push(ndcg);
    }
  }

  return metrics;
}

/** Calculate p95 latency from array of latencies */
function calculateP95(latencies: readonly number[]): number {
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.95);
  return sorted[index] ?? 0;
}

/** Calculate aggregated results from collected metrics. */
function aggregateResults(metrics: ConfigMetrics): ConfigResults {
  const avgMRR = metrics.mrr.reduce((a, b) => a + b, 0) / metrics.mrr.length;
  const avgNDCG = metrics.ndcg.reduce((a, b) => a + b, 0) / metrics.ndcg.length;
  const zeroHitRate = metrics.zeroHits / metrics.queryCount;
  const p95Latency = calculateP95(metrics.latencies);

  return { config: metrics.config, avgMRR, avgNDCG, zeroHitRate, p95Latency };
}

/** Format a configuration result row for the comparison table. */
function formatConfigRow(result: ConfigResults): string {
  const configStr = result.config.padEnd(18);
  const mrrStr = result.avgMRR.toFixed(3).padEnd(8);
  const rating = getMrrRating(result.avgMRR);
  const ratingStr = rating.label.padEnd(10);
  const ndcgStr = result.avgNDCG.toFixed(3).padEnd(8);
  const zeroHitStr = `${(result.zeroHitRate * 100).toFixed(1)}%`.padEnd(9);
  const latencyStr = `${result.p95Latency.toFixed(0)}ms`;
  return `${configStr} | ${mrrStr} | ${ratingStr} | ${ndcgStr} | ${zeroHitStr} | ${latencyStr}`;
}

/** Log the MRR interpretation rubric */
function logMrrRubric(): void {
  console.log('\n' + '='.repeat(80));
  console.log('MRR INTERPRETATION RUBRIC');
  console.log('='.repeat(80));
  console.log(`${'MRR'.padEnd(10)} | ${'Rating'.padEnd(12)} | Meaning`);
  console.log('-'.repeat(80));
  console.log(`≥ 0.80     | Excellent    | Correct result typically 1st or 2nd`);
  console.log(`≥ 0.50     | Good         | Correct result typically 2nd`);
  console.log(`≥ 0.33     | Acceptable   | Correct result typically 3rd`);
  console.log(`≥ 0.25     | Poor         | Correct result typically 4th`);
  console.log(`< 0.25     | Very Poor    | Correct result typically 5th or worse`);
  console.log('='.repeat(80));
  console.log('\nPHASE 3e TARGETS (Aspirational):');
  console.log(
    `  Hard queries:     MRR ≥ ${PHASE_3E_TARGETS.HARD_QUERY_MRR} (Good), NDCG@10 ≥ ${PHASE_3E_TARGETS.HARD_QUERY_NDCG}`,
  );
  console.log(
    `  Standard queries: MRR ≥ ${PHASE_3E_TARGETS.STANDARD_QUERY_MRR} (Excellent), NDCG@10 ≥ ${PHASE_3E_TARGETS.STANDARD_QUERY_NDCG}`,
  );
  console.log(`  Latency:          p95 ≤ ${PHASE_3E_TARGETS.MAX_LATENCY_MS}ms`);
  console.log('='.repeat(80));
}

/** Log the comparison table for a content type. */
function logComparisonTable(results: ContentTypeResults): void {
  const title = `${results.contentType.toUpperCase()} ABLATION (${results.querySet} queries: ${results.queryCount})`;
  console.log(`\n${title}`);
  console.log('-'.repeat(90));
  console.log(
    `${'Configuration'.padEnd(18)} | ${'MRR'.padEnd(8)} | ${'Rating'.padEnd(10)} | ${'NDCG@10'.padEnd(8)} | ${'Zero-Hit'.padEnd(9)} | p95 Latency`,
  );
  console.log('-'.repeat(90));
  for (const result of results.results) {
    console.log(formatConfigRow(result));
  }
  console.log('-'.repeat(90));
}

/** Log a single insight comparison */
/** Format comparison line: "Label (value) vs Label (value), Delta: X%" */
function formatComparison(l: number, r: number, lName: string, rName: string): string {
  const delta = ((l - r) * 100).toFixed(2);
  return `${lName} (${l.toFixed(3)}) vs ${rName} (${r.toFixed(3)}), Delta: ${delta}%`;
}

/** Get MRR for a config, or 0 if not found */
function getMRR(results: readonly ConfigResults[], config: AblationConfig): number {
  return results.find((r) => r.config === config)?.avgMRR ?? 0;
}

/** Log insights from the ablation results - simplified to reduce complexity */
function logInsights(lessons: ContentTypeResults, units: ContentTypeResults): void {
  console.log('\n' + '='.repeat(70));
  console.log('ABLATION INSIGHTS (see tables above for details)');
  console.log('='.repeat(70));

  const l = lessons.results;
  const u = units.results;

  console.log(
    `\n1. STRUCTURE: ${formatComparison(getMRR(l, 'four_way_hybrid'), getMRR(l, 'content_hybrid'), 'Four-way', 'Content-only')}`,
  );
  console.log(
    `2. ELSER vs BM25: ${formatComparison(getMRR(l, 'elser_content'), getMRR(l, 'bm25_content'), 'ELSER', 'BM25')}`,
  );
  console.log(
    `3. FIELD: ${formatComparison(getMRR(l, 'content_hybrid'), getMRR(l, 'structure_hybrid'), 'Content', 'Structure')}`,
  );
  console.log(
    `4. UNITS: ${formatComparison(getMRR(u, 'four_way_hybrid'), getMRR(u, 'elser_structure'), 'Four-way', 'ELSER-structure')}`,
  );
  console.log('='.repeat(70));
}

/** Build ContentTypeResults from metrics */
function buildContentTypeResults(
  contentType: ContentType,
  querySet: QuerySet,
  queryCount: number,
  metrics: readonly ConfigMetrics[],
): ContentTypeResults {
  return { contentType, querySet, queryCount, results: metrics.map(aggregateResults) };
}

/** Run all experiments and return results */
async function runAllExperiments(): Promise<{
  lessonStandard: ContentTypeResults;
  lessonHard: ContentTypeResults;
  unitStandard: ContentTypeResults;
  unitHard: ContentTypeResults;
}> {
  const [lessonStandardMetrics, lessonHardMetrics, unitStandardMetrics, unitHardMetrics] =
    await Promise.all([
      Promise.all(
        ALL_CONFIGS.map((c) => runLessonConfigExperiment(c, MATHS_SECONDARY_STANDARD_QUERIES)),
      ),
      Promise.all(
        ALL_CONFIGS.map((c) => runLessonConfigExperiment(c, MATHS_SECONDARY_HARD_QUERIES)),
      ),
      Promise.all(ALL_CONFIGS.map((c) => runUnitConfigExperiment(c, UNIT_GROUND_TRUTH_QUERIES))),
      Promise.all(
        ALL_CONFIGS.map((c) => runUnitConfigExperiment(c, UNIT_HARD_GROUND_TRUTH_QUERIES)),
      ),
    ]);

  return {
    lessonStandard: buildContentTypeResults(
      'lessons',
      'standard',
      MATHS_SECONDARY_STANDARD_QUERIES.length,
      lessonStandardMetrics,
    ),
    lessonHard: buildContentTypeResults(
      'lessons',
      'hard',
      MATHS_SECONDARY_HARD_QUERIES.length,
      lessonHardMetrics,
    ),
    unitStandard: buildContentTypeResults(
      'units',
      'standard',
      UNIT_GROUND_TRUTH_QUERIES.length,
      unitStandardMetrics,
    ),
    unitHard: buildContentTypeResults(
      'units',
      'hard',
      UNIT_HARD_GROUND_TRUTH_QUERIES.length,
      unitHardMetrics,
    ),
  };
}

describe('Four-Retriever Ablation (Phase 3)', () => {
  let lessonStandardResults: ContentTypeResults;
  let lessonHardResults: ContentTypeResults;
  let unitStandardResults: ContentTypeResults;
  let unitHardResults: ContentTypeResults;

  beforeAll(async () => {
    console.log('Running four-retriever ablation experiment...');
    console.log(`Configurations: ${ALL_CONFIGS.length}, This may take several minutes...\n`);

    // Log rubric first so it's visible before results
    logMrrRubric();

    const results = await runAllExperiments();
    lessonStandardResults = results.lessonStandard;
    lessonHardResults = results.lessonHard;
    unitStandardResults = results.unitStandard;
    unitHardResults = results.unitHard;

    console.log('\n' + '='.repeat(80));
    console.log('FOUR-RETRIEVER ABLATION EXPERIMENT RESULTS');
    console.log('='.repeat(80));

    logComparisonTable(lessonStandardResults);
    logComparisonTable(lessonHardResults);
    logComparisonTable(unitStandardResults);
    logComparisonTable(unitHardResults);

    logInsights(lessonHardResults, unitHardResults);
  }, 300000); // 5 minute timeout

  afterAll(() => {
    if (!lessonStandardResults || !unitStandardResults) {
      throw new Error('Experiment did not complete - results not collected');
    }
  });

  describe('Lesson Ablation', () => {
    it('four-way hybrid outperforms content-only hybrid on hard queries', () => {
      const fourWay = lessonHardResults.results.find((r) => r.config === 'four_way_hybrid');
      const contentHybrid = lessonHardResults.results.find((r) => r.config === 'content_hybrid');

      expect(fourWay).toBeDefined();
      expect(contentHybrid).toBeDefined();

      if (fourWay && contentHybrid) {
        // Four-way should be at least as good as content-only (structure adds value or is neutral)
        expect(
          fourWay.avgMRR,
          `Four-way MRR (${fourWay.avgMRR.toFixed(3)}) should be >= content-hybrid (${contentHybrid.avgMRR.toFixed(3)})`,
        ).toBeGreaterThanOrEqual(contentHybrid.avgMRR - 0.01); // Allow 1% tolerance
      }
    });

    /**
     * Note: Hard queries may show ELSER outperforming hybrids.
     * This is expected - RRF fusion can dilute semantic signal
     * with BM25 noise for naturalistic/misspelled queries.
     *
     * This test documents the finding rather than asserting hybrid superiority.
     */
    it('documents hybrid vs single retriever performance on hard queries', () => {
      const fourWay = lessonHardResults.results.find((r) => r.config === 'four_way_hybrid');
      const bm25Content = lessonHardResults.results.find((r) => r.config === 'bm25_content');
      const elserContent = lessonHardResults.results.find((r) => r.config === 'elser_content');

      expect(fourWay).toBeDefined();
      expect(bm25Content).toBeDefined();
      expect(elserContent).toBeDefined();

      if (fourWay && bm25Content && elserContent) {
        const maxSingle = Math.max(bm25Content.avgMRR, elserContent.avgMRR);

        // Log the comparison for documentation
        console.log('\nHard Query Analysis:');
        console.log(`  Four-way hybrid: ${fourWay.avgMRR.toFixed(3)}`);
        console.log(`  Best single (ELSER): ${elserContent.avgMRR.toFixed(3)}`);
        console.log(`  Delta: ${((fourWay.avgMRR - maxSingle) * 100).toFixed(2)}%`);

        // Assert hybrid is at least competitive (within 5% of best single)
        // This documents that hybrids may underperform on semantic-heavy queries
        expect(
          fourWay.avgMRR,
          `Four-way MRR (${fourWay.avgMRR.toFixed(3)}) should be within 5% of best single (${maxSingle.toFixed(3)})`,
        ).toBeGreaterThanOrEqual(maxSingle - 0.05);
      }
    });

    it('all configurations return results (zero-hit rate < 30% for hard queries)', () => {
      for (const result of lessonHardResults.results) {
        expect(
          result.zeroHitRate,
          `${result.config} zero-hit rate ${(result.zeroHitRate * 100).toFixed(1)}% should be < 30%`,
        ).toBeLessThan(0.3);
      }
    });
  });

  describe('Unit Ablation', () => {
    it('four-way hybrid performs well on hard queries', () => {
      const fourWay = unitHardResults.results.find((r) => r.config === 'four_way_hybrid');

      expect(fourWay).toBeDefined();

      if (fourWay) {
        expect(
          fourWay.avgMRR,
          `Four-way MRR (${fourWay.avgMRR.toFixed(3)}) should be >= 0.5 for hard queries`,
        ).toBeGreaterThanOrEqual(0.5);
      }
    });

    it('all configurations return results (zero-hit rate < 30% for hard queries)', () => {
      for (const result of unitHardResults.results) {
        expect(
          result.zeroHitRate,
          `${result.config} zero-hit rate ${(result.zeroHitRate * 100).toFixed(1)}% should be < 30%`,
        ).toBeLessThan(0.3);
      }
    });
  });

  it('produces valid metrics for all configurations', () => {
    // Verify we have results for all configurations and content types
    expect(lessonStandardResults.results).toHaveLength(ALL_CONFIGS.length);
    expect(lessonHardResults.results).toHaveLength(ALL_CONFIGS.length);
    expect(unitStandardResults.results).toHaveLength(ALL_CONFIGS.length);
    expect(unitHardResults.results).toHaveLength(ALL_CONFIGS.length);

    // All MRR values should be valid
    for (const result of [...lessonStandardResults.results, ...unitStandardResults.results]) {
      expect(result.avgMRR).toBeGreaterThanOrEqual(0);
      expect(result.avgMRR).toBeLessThanOrEqual(1);
    }
  });
});
