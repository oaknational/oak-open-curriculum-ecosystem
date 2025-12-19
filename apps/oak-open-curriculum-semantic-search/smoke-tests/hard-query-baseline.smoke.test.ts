/**
 * Hard Query Baseline Verification Smoke Test
 *
 * Verifies that hard query MRR values remain within expected range.
 * Fails if MRR regresses more than 5% from documented baseline.
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to Elasticsearch (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **Baseline Values** (from B-001, 2025-12-19):
 * - Lesson Hard Query MRR: 0.367
 * - Unit Hard Query MRR: 0.811
 *
 * @see `.agent/evaluations/experiments/B-001-hard-query-baseline.experiment.md`
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { HARD_GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth/index.js';
import { UNIT_HARD_GROUND_TRUTH_QUERIES } from '../src/lib/search-quality/ground-truth/units/index.js';
import {
  processQueryResult,
  calculateOverallMrr,
  type QueryBaselineResult,
} from '../src/lib/search-quality/baseline-runner.js';
import type { GroundTruthQuery } from '../src/lib/search-quality/ground-truth/types.js';
import { esSearch } from '../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../src/types/oak.js';

/**
 * Documented baseline values from B-001 (2025-12-19).
 *
 * These values serve as regression detection thresholds.
 */
const BASELINE = {
  /** Lesson hard query MRR baseline */
  LESSON_MRR: 0.367,
  /** Unit hard query MRR baseline */
  UNIT_MRR: 0.811,
  /** Acceptable regression percentage (5%) */
  REGRESSION_THRESHOLD: 0.05,
} as const;

/**
 * Search lessons using 4-way hybrid.
 */
async function searchLessons(
  query: string,
): Promise<{ results: readonly string[]; latencyMs: number }> {
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
 * Search units using 4-way hybrid.
 */
async function searchUnits(
  query: string,
): Promise<{ results: readonly string[]; latencyMs: number }> {
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
 * Run baseline for all lesson hard queries.
 */
async function runLessonBaseline(): Promise<readonly QueryBaselineResult[]> {
  const results: QueryBaselineResult[] = [];

  for (const query of HARD_GROUND_TRUTH_QUERIES) {
    const { results: actualResults, latencyMs } = await searchLessons(query.query);
    const result = processQueryResult(query, actualResults, latencyMs);
    results.push(result);
  }

  return results;
}

/**
 * Run baseline for all unit hard queries.
 */
async function runUnitBaseline(): Promise<readonly QueryBaselineResult[]> {
  const results: QueryBaselineResult[] = [];

  for (const query of UNIT_HARD_GROUND_TRUTH_QUERIES) {
    // Convert unit query to standard format with detected category
    const standardQuery: GroundTruthQuery = {
      query: query.query,
      expectedRelevance: query.expectedRelevance,
      category: 'naturalistic', // Default, category detection not critical for MRR
      priority: 'medium',
    };

    const { results: actualResults, latencyMs } = await searchUnits(query.query);
    const result = processQueryResult(standardQuery, actualResults, latencyMs);
    results.push(result);
  }

  return results;
}

describe('Hard Query Baseline Verification', () => {
  let lessonResults: readonly QueryBaselineResult[];
  let unitResults: readonly QueryBaselineResult[];
  let lessonMrr: number;
  let unitMrr: number;

  beforeAll(async () => {
    console.log('Running hard query baseline verification...');
    console.log(
      `Baseline values: Lesson MRR=${BASELINE.LESSON_MRR}, Unit MRR=${BASELINE.UNIT_MRR}`,
    );
    console.log(`Regression threshold: ${BASELINE.REGRESSION_THRESHOLD * 100}%\n`);

    lessonResults = await runLessonBaseline();
    unitResults = await runUnitBaseline();

    lessonMrr = calculateOverallMrr(lessonResults);
    unitMrr = calculateOverallMrr(unitResults);

    console.log(`\nResults:`);
    console.log(`  Lesson Hard MRR: ${lessonMrr.toFixed(3)} (baseline: ${BASELINE.LESSON_MRR})`);
    console.log(`  Unit Hard MRR:   ${unitMrr.toFixed(3)} (baseline: ${BASELINE.UNIT_MRR})`);
  }, 120000); // 2 minute timeout

  describe('Lesson Hard Queries', () => {
    it('MRR does not regress more than 5% from baseline', () => {
      const minAcceptable = BASELINE.LESSON_MRR * (1 - BASELINE.REGRESSION_THRESHOLD);

      expect(
        lessonMrr,
        `Lesson Hard MRR (${lessonMrr.toFixed(3)}) regressed below ${minAcceptable.toFixed(3)} (5% below baseline ${BASELINE.LESSON_MRR})`,
      ).toBeGreaterThanOrEqual(minAcceptable);
    });

    it('runs all 15 queries', () => {
      expect(lessonResults).toHaveLength(15);
    });

    it('all queries return valid results structure', () => {
      for (const result of lessonResults) {
        expect(result.mrr).toBeGreaterThanOrEqual(0);
        expect(result.mrr).toBeLessThanOrEqual(1);
        expect(result.actualTop10.length).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('Unit Hard Queries', () => {
    it('MRR does not regress more than 5% from baseline', () => {
      const minAcceptable = BASELINE.UNIT_MRR * (1 - BASELINE.REGRESSION_THRESHOLD);

      expect(
        unitMrr,
        `Unit Hard MRR (${unitMrr.toFixed(3)}) regressed below ${minAcceptable.toFixed(3)} (5% below baseline ${BASELINE.UNIT_MRR})`,
      ).toBeGreaterThanOrEqual(minAcceptable);
    });

    it('runs all 15 queries', () => {
      expect(unitResults).toHaveLength(15);
    });

    it('all queries return valid results structure', () => {
      for (const result of unitResults) {
        expect(result.mrr).toBeGreaterThanOrEqual(0);
        expect(result.mrr).toBeLessThanOrEqual(1);
        expect(result.actualTop10.length).toBeLessThanOrEqual(10);
      }
    });
  });

  it('produces summary metrics', () => {
    console.log('\n' + '='.repeat(60));
    console.log('HARD QUERY BASELINE VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Lesson Hard MRR: ${lessonMrr.toFixed(3)} (baseline: ${BASELINE.LESSON_MRR})`);
    console.log(`Unit Hard MRR:   ${unitMrr.toFixed(3)} (baseline: ${BASELINE.UNIT_MRR})`);
    console.log('='.repeat(60));

    // This test always passes - it's just for logging
    expect(true).toBe(true);
  });
});
