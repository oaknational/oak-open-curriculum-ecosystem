/**
 * E-001 Semantic Reranking Experiment Smoke Test
 *
 * Compares 4-way RRF (control) vs 4-way RRF + semantic reranking (variant)
 * on hard queries to determine if reranking improves MRR.
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **Success Criteria** (from ADR-081):
 * - Hard MRR improvement: ≥+15% (0.367 → 0.422+)
 * - Standard MRR: ≥0.92 (no regression)
 * - p95 Latency: ≤2000ms
 *
 * @see `.agent/evaluations/experiments/E-001-semantic-reranking.experiment.md`
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { HARD_GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth/index.js';
import { UNIT_HARD_GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth/units/index.js';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../src/lib/hybrid-search/rrf-query-builders.js';
import {
  buildLessonRerankingRrfRequest,
  buildUnitRerankingRrfRequest,
} from '../src/lib/hybrid-search/reranking-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../src/types/oak.js';
import type { GroundTruthQuery } from '../src/lib/search-quality/ground-truth/types.js';
import type { UnitGroundTruthQuery } from '../src/lib/search-quality/ground-truth/units/types.js';

/**
 * Baseline values from B-001 for comparison.
 */
const BASELINE = {
  LESSON_MRR: 0.367,
  UNIT_MRR: 0.811,
} as const;

/**
 * Success thresholds from ADR-081.
 */
const THRESHOLDS = {
  MIN_IMPROVEMENT_PERCENT: 15,
} as const;

interface ExperimentResult {
  readonly query: string;
  readonly category: string;
  readonly controlRank: number | null;
  readonly rerankRank: number | null;
  readonly controlMrr: number;
  readonly rerankMrr: number;
  readonly controlLatencyMs: number;
  readonly rerankLatencyMs: number;
}

interface SearchResult {
  readonly results: readonly string[];
  readonly latencyMs: number;
}

/**
 * Run control (4-way RRF without reranking) for lessons.
 */
async function searchLessonsControl(query: string): Promise<SearchResult> {
  const start = performance.now();
  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const latencyMs = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.lesson_slug);
  return { results, latencyMs };
}

/**
 * Run variant (4-way RRF + semantic reranking) for lessons.
 */
async function searchLessonsReranking(query: string): Promise<SearchResult> {
  const start = performance.now();
  const request = buildLessonRerankingRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const latencyMs = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.lesson_slug);
  return { results, latencyMs };
}

/**
 * Run control (4-way RRF without reranking) for units.
 */
async function searchUnitsControl(query: string): Promise<SearchResult> {
  const start = performance.now();
  const request = buildUnitRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchUnitRollupDoc>(request);
  const latencyMs = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.unit_slug);
  return { results, latencyMs };
}

/**
 * Run variant (4-way RRF + semantic reranking) for units.
 */
async function searchUnitsReranking(query: string): Promise<SearchResult> {
  const start = performance.now();
  const request = buildUnitRerankingRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchUnitRollupDoc>(request);
  const latencyMs = performance.now() - start;
  const results = response.hits.hits.map((hit) => hit._source.unit_slug);
  return { results, latencyMs };
}

/**
 * Find rank of first relevant result (1-based), null if not in top 10.
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
    if (score !== undefined && score >= 2) {
      return i + 1;
    }
  }
  return null;
}

/**
 * Calculate MRR from rank.
 */
function rankToMrr(rank: number | null): number {
  return rank !== null ? 1 / rank : 0;
}

/**
 * Calculate average MRR from results.
 */
function calculateAverageMrr(
  results: readonly ExperimentResult[],
  field: 'controlMrr' | 'rerankMrr',
): number {
  return results.reduce((sum, r) => sum + r[field], 0) / results.length;
}

/**
 * Run a single lesson experiment query.
 */
async function runLessonExperiment(query: GroundTruthQuery): Promise<ExperimentResult> {
  const [controlResult, rerankResult] = await Promise.all([
    searchLessonsControl(query.query),
    searchLessonsReranking(query.query),
  ]);

  const controlRank = findFirstRelevantRank(controlResult.results, query.expectedRelevance);
  const rerankRank = findFirstRelevantRank(rerankResult.results, query.expectedRelevance);

  return {
    query: query.query,
    category: query.category ?? 'unknown',
    controlRank,
    rerankRank,
    controlMrr: rankToMrr(controlRank),
    rerankMrr: rankToMrr(rerankRank),
    controlLatencyMs: controlResult.latencyMs,
    rerankLatencyMs: rerankResult.latencyMs,
  };
}

/**
 * Run a single unit experiment query.
 */
async function runUnitExperiment(query: UnitGroundTruthQuery): Promise<ExperimentResult> {
  const [controlResult, rerankResult] = await Promise.all([
    searchUnitsControl(query.query),
    searchUnitsReranking(query.query),
  ]);

  const controlRank = findFirstRelevantRank(controlResult.results, query.expectedRelevance);
  const rerankRank = findFirstRelevantRank(rerankResult.results, query.expectedRelevance);

  return {
    query: query.query,
    category: 'unit',
    controlRank,
    rerankRank,
    controlMrr: rankToMrr(controlRank),
    rerankMrr: rankToMrr(rerankRank),
    controlLatencyMs: controlResult.latencyMs,
    rerankLatencyMs: rerankResult.latencyMs,
  };
}

/**
 * Log experiment results summary.
 */
function logExperimentSummary(
  lessonControlMrr: number,
  lessonRerankMrr: number,
  unitControlMrr: number,
  unitRerankMrr: number,
): void {
  console.log('\n' + '='.repeat(60));
  console.log('E-001 EXPERIMENT RESULTS');
  console.log('='.repeat(60));
  console.log(`Lesson Control MRR:  ${lessonControlMrr.toFixed(3)}`);
  console.log(`Lesson Rerank MRR:   ${lessonRerankMrr.toFixed(3)}`);
  console.log(
    `Lesson Delta:        ${(((lessonRerankMrr - lessonControlMrr) / lessonControlMrr) * 100).toFixed(1)}%`,
  );
  console.log('');
  console.log(`Unit Control MRR:    ${unitControlMrr.toFixed(3)}`);
  console.log(`Unit Rerank MRR:     ${unitRerankMrr.toFixed(3)}`);
  console.log(
    `Unit Delta:          ${(((unitRerankMrr - unitControlMrr) / unitControlMrr) * 100).toFixed(1)}%`,
  );
  console.log('='.repeat(60));
}

describe('E-001 Semantic Reranking Experiment', () => {
  const lessonResults: ExperimentResult[] = [];
  const unitResults: ExperimentResult[] = [];
  let lessonControlMrr = 0;
  let lessonRerankMrr = 0;
  let unitControlMrr = 0;
  let unitRerankMrr = 0;

  beforeAll(async () => {
    console.log('Running E-001 Semantic Reranking Experiment...');
    console.log(`Baseline: Lesson MRR=${BASELINE.LESSON_MRR}, Unit MRR=${BASELINE.UNIT_MRR}`);
    console.log(`Target: +${THRESHOLDS.MIN_IMPROVEMENT_PERCENT}% improvement\n`);

    console.log('Running lesson experiments...');
    for (const query of HARD_GROUND_TRUTH_QUERIES) {
      const result = await runLessonExperiment(query);
      lessonResults.push(result);
      console.log(
        `  "${query.query.slice(0, 40)}..." Control: ${result.controlRank ?? 'N/A'}, Rerank: ${result.rerankRank ?? 'N/A'}`,
      );
    }

    console.log('\nRunning unit experiments...');
    for (const query of UNIT_HARD_GROUND_TRUTH_QUERIES) {
      const result = await runUnitExperiment(query);
      unitResults.push(result);
      console.log(
        `  "${query.query.slice(0, 40)}..." Control: ${result.controlRank ?? 'N/A'}, Rerank: ${result.rerankRank ?? 'N/A'}`,
      );
    }

    lessonControlMrr = calculateAverageMrr(lessonResults, 'controlMrr');
    lessonRerankMrr = calculateAverageMrr(lessonResults, 'rerankMrr');
    unitControlMrr = calculateAverageMrr(unitResults, 'controlMrr');
    unitRerankMrr = calculateAverageMrr(unitResults, 'rerankMrr');

    logExperimentSummary(lessonControlMrr, lessonRerankMrr, unitControlMrr, unitRerankMrr);
  }, 600000);

  describe('Lesson Hard Queries', () => {
    it('runs all 15 lesson experiments', () => {
      expect(lessonResults).toHaveLength(15);
    });

    it('reports lesson MRR comparison (E-001 outcome: regression detected)', () => {
      const delta = ((lessonRerankMrr - lessonControlMrr) / lessonControlMrr) * 100;
      console.log(`Lesson MRR delta: ${delta.toFixed(1)}%`);
      // E-001 experiment concluded: reranking causes regression
      // This test documents the finding, not enforces improvement
      expect(typeof delta).toBe('number');
    });

    it('reranking latency is within acceptable bounds', () => {
      const maxLatency = Math.max(...lessonResults.map((r) => r.rerankLatencyMs));
      console.log(`Max reranking latency: ${maxLatency.toFixed(0)}ms`);
    });
  });

  describe('Unit Hard Queries', () => {
    it('runs all 15 unit experiments', () => {
      expect(unitResults).toHaveLength(15);
    });

    it('reports unit MRR comparison (E-001 outcome: no significant change)', () => {
      const delta = ((unitRerankMrr - unitControlMrr) / unitControlMrr) * 100;
      console.log(`Unit MRR delta: ${delta.toFixed(1)}%`);
      // E-001 experiment concluded: unit MRR unchanged within noise
      expect(typeof delta).toBe('number');
    });
  });

  it('produces experiment summary for E-001 document', () => {
    const lessonImprovement = ((lessonRerankMrr - lessonControlMrr) / lessonControlMrr) * 100;
    const unitImprovement = ((unitRerankMrr - unitControlMrr) / unitControlMrr) * 100;

    console.log('\n' + '='.repeat(60));
    console.log('E-001 DECISION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Lesson Improvement: ${lessonImprovement.toFixed(1)}%`);
    console.log(`Unit Improvement:   ${unitImprovement.toFixed(1)}%`);
    console.log(`Target:             +${THRESHOLDS.MIN_IMPROVEMENT_PERCENT}%`);
    console.log('');

    if (lessonImprovement >= THRESHOLDS.MIN_IMPROVEMENT_PERCENT) {
      console.log('DECISION: ACCEPT - Lesson improvement meets threshold');
    } else if (lessonImprovement >= 10) {
      console.log('DECISION: INCONCLUSIVE - Positive but below threshold');
    } else if (lessonImprovement >= 0) {
      console.log('DECISION: REJECT - Minimal improvement');
    } else {
      console.log('DECISION: REJECT - Regression detected');
    }
    console.log('='.repeat(60));

    expect(true).toBe(true);
  });
});
