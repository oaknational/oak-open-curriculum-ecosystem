/**
 * Comprehensive evaluation script for all search scenarios.
 *
 * Measures MRR for lessons and units across standard and hard query sets.
 *
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(thisDir, '../../.env.local') });
dotenvConfig({ path: resolve(thisDir, '../../../../.env') });

import {
  GROUND_TRUTH_QUERIES,
  HARD_GROUND_TRUTH_QUERIES,
} from '../../src/lib/search-quality/ground-truth/index';
import {
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
} from '../../src/lib/search-quality/ground-truth/units/index';
import {
  processQueryResult,
  calculateOverallMrr,
  type QueryBaselineResult,
} from '../../src/lib/search-quality/baseline-runner';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth/types';
import { esSearch } from '../../src/lib/elastic-http';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../../src/lib/hybrid-search/rrf-query-builders';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../../src/types/oak';

const HARD_CATEGORIES = [
  'naturalistic',
  'misspelling',
  'synonym',
  'multi-concept',
  'colloquial',
  'intent-based',
] as const;

/** Search lessons using 4-way hybrid RRF. */
async function searchLessons(query: string): Promise<readonly string[]> {
  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return response.hits.hits.map((hit) => hit._source.lesson_slug);
}

/** Search units using 4-way hybrid RRF. */
async function searchUnits(query: string): Promise<readonly string[]> {
  const request = buildUnitRrfRequest({ text: query, size: 10, subject: 'maths', keyStage: 'ks4' });
  const response = await esSearch<SearchUnitRollupDoc>(request);
  return response.hits.hits.map((hit) => hit._source.unit_slug);
}

/** Run lesson queries and calculate MRR. */
async function runLessonQueries(
  queries: readonly GroundTruthQuery[],
): Promise<{ mrr: number; results: readonly QueryBaselineResult[] }> {
  const results: QueryBaselineResult[] = [];
  for (const q of queries) {
    const actual = await searchLessons(q.query);
    results.push(processQueryResult(q, actual, 0));
  }
  return { mrr: calculateOverallMrr(results), results };
}

/** Run unit queries and calculate MRR. */
async function runUnitQueries(
  queries: readonly { query: string; expectedRelevance: Record<string, number> }[],
): Promise<{ mrr: number }> {
  const results: QueryBaselineResult[] = [];
  for (const q of queries) {
    const standardQuery: GroundTruthQuery = {
      query: q.query,
      expectedRelevance: q.expectedRelevance,
      category: 'naturalistic',
      priority: 'medium',
    };
    const actual = await searchUnits(q.query);
    results.push(processQueryResult(standardQuery, actual, 0));
  }
  return { mrr: calculateOverallMrr(results) };
}

/** Print lesson search metrics. */
async function printLessonMetrics(): Promise<{ stdMrr: number; hardMrr: number }> {
  console.log('LESSON SEARCH');
  console.log('-'.repeat(70));

  const lessonStd = await runLessonQueries(GROUND_TRUTH_QUERIES);
  console.log(`  Standard (${GROUND_TRUTH_QUERIES.length}): MRR = ${lessonStd.mrr.toFixed(3)}`);

  const lessonHard = await runLessonQueries(HARD_GROUND_TRUTH_QUERIES);
  console.log(
    `  Hard (${HARD_GROUND_TRUTH_QUERIES.length}):     MRR = ${lessonHard.mrr.toFixed(3)}`,
  );

  console.log('\n  Hard by Category:');
  for (const cat of HARD_CATEGORIES) {
    const catQueries = HARD_GROUND_TRUTH_QUERIES.filter((q) => q.category === cat);
    if (catQueries.length > 0) {
      const catResult = await runLessonQueries(catQueries);
      const status = catResult.mrr >= 0.5 ? '✅' : catResult.mrr >= 0.25 ? '⚠️' : '❌';
      console.log(
        `    ${cat.padEnd(14)}: ${catResult.mrr.toFixed(3)} (${catQueries.length}) ${status}`,
      );
    }
  }

  return { stdMrr: lessonStd.mrr, hardMrr: lessonHard.mrr };
}

/** Print unit search metrics. */
async function printUnitMetrics(): Promise<{ stdMrr: number; hardMrr: number }> {
  console.log('\nUNIT SEARCH');
  console.log('-'.repeat(70));

  const unitStd = await runUnitQueries(UNIT_GROUND_TRUTH_QUERIES);
  console.log(`  Standard (${UNIT_GROUND_TRUTH_QUERIES.length}): MRR = ${unitStd.mrr.toFixed(3)}`);

  const unitHard = await runUnitQueries(UNIT_HARD_GROUND_TRUTH_QUERIES);
  console.log(
    `  Hard (${UNIT_HARD_GROUND_TRUTH_QUERIES.length}):     MRR = ${unitHard.mrr.toFixed(3)}`,
  );

  return { stdMrr: unitStd.mrr, hardMrr: unitHard.mrr };
}

/** Print summary table. */
function printSummary(
  lesson: { stdMrr: number; hardMrr: number },
  unit: { stdMrr: number; hardMrr: number },
): void {
  console.log('\n' + '='.repeat(70));
  console.log(
    'SUMMARY: Lesson Std=' + lesson.stdMrr.toFixed(3) + ', Hard=' + lesson.hardMrr.toFixed(3),
  );
  console.log('         Unit Std=' + unit.stdMrr.toFixed(3) + ', Hard=' + unit.hardMrr.toFixed(3));
  console.log('Targets: Std ≥ 0.92, Hard ≥ 0.45');
  console.log('='.repeat(70));
}

/** Main entry point. */
async function main(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('COMPREHENSIVE SEARCH METRICS BREAKDOWN');
  console.log('Measured: ' + new Date().toISOString());
  console.log('='.repeat(70) + '\n');

  const lesson = await printLessonMetrics();
  const unit = await printUnitMetrics();
  printSummary(lesson, unit);
}

main().catch(console.error);
