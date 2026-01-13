/**
 * CLI script to run hard query baseline and output structured results.
 *
 * Executes all queries against the production 4-way hybrid search
 * and outputs per-query results for baseline documentation.
 *
 * Usage: pnpm tsx src/lib/search-quality/run-baseline.ts
 *
 * @packageDocumentation
 */

import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env.local
const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../../.env.local');
dotenvConfig({ path: envLocalPath });

import { MATHS_SECONDARY_ALL_QUERIES } from './ground-truth/index.js';
import {
  processQueryResult,
  calculateCategoryMrr,
  calculateOverallMrr,
} from './baseline-runner.js';
import type { QueryBaselineResult } from './baseline-runner.js';
import type { QueryCategory } from './ground-truth/types.js';
import { esSearch } from '../elastic-http.js';
import { buildLessonRrfRequest } from '../hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc } from '../../types/oak.js';

/** All query categories for iteration */
const ALL_CATEGORIES: readonly QueryCategory[] = [
  'precise-topic',
  'natural-expression',
  'imprecise-input',
  'cross-topic',
];

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
  return {
    results: response.hits.hits.map((hit) => hit._source.lesson_slug),
    latencyMs: performance.now() - start,
  };
}

/** Run baseline for all lesson queries. */
async function runLessonBaseline(): Promise<readonly QueryBaselineResult[]> {
  const results: QueryBaselineResult[] = [];
  for (const query of MATHS_SECONDARY_ALL_QUERIES) {
    const { results: actualResults, latencyMs } = await searchLessons(query.query);
    results.push(processQueryResult(query, actualResults, latencyMs));
  }
  return results;
}

/** Output per-query table row */
function formatQueryRow(r: QueryBaselineResult): string {
  const queryStr = r.query.length > 48 ? r.query.slice(0, 45) + '...' : r.query;
  const rankStr = r.firstRelevantRank !== null ? String(r.firstRelevantRank) : 'N/A';
  return `${queryStr.padEnd(50)} | ${r.category.padEnd(12)} | ${rankStr.padEnd(6)} | ${r.mrr.toFixed(3).padEnd(8)} | ${r.ndcg10.toFixed(3)}`;
}

/** Output category table row */
function formatCategoryRow(
  results: readonly QueryBaselineResult[],
  category: QueryCategory,
): string {
  const categoryResults = results.filter((r) => r.category === category);
  if (categoryResults.length === 0) {
    return '';
  }
  const avgMrr = calculateCategoryMrr(results, category);
  return `${category.padEnd(15)} | ${String(categoryResults.length).padEnd(6)} | ${avgMrr.toFixed(3)}`;
}

/** Output formatted results table for a content type. */
function outputResultsTable(contentType: string, results: readonly QueryBaselineResult[]): void {
  console.log(
    `\n${'='.repeat(100)}\n${contentType.toUpperCase()} QUERY BASELINE\n${'='.repeat(100)}`,
  );
  console.log('\nPER-QUERY RESULTS:\n' + '-'.repeat(100));
  console.log(
    `${'Query'.padEnd(50)} | ${'Category'.padEnd(12)} | ${'Rank'.padEnd(6)} | ${'MRR'.padEnd(8)} | NDCG@10`,
  );
  console.log('-'.repeat(100));
  for (const r of results) {
    console.log(formatQueryRow(r));
  }
  console.log('-'.repeat(100));
  console.log('\nPER-CATEGORY BREAKDOWN:\n' + '-'.repeat(50));
  console.log(`${'Category'.padEnd(15)} | ${'Count'.padEnd(6)} | Avg MRR\n` + '-'.repeat(50));
  for (const cat of ALL_CATEGORIES) {
    const row = formatCategoryRow(results, cat);
    if (row) {
      console.log(row);
    }
  }
  console.log('-'.repeat(50));
  const overallMrr = calculateOverallMrr(results);
  const zeroHits = results.filter((r) => r.firstRelevantRank === null).length;
  const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;
  console.log(
    `\nOVERALL: MRR=${overallMrr.toFixed(3)}, Zero-hit=${((zeroHits / results.length) * 100).toFixed(1)}%, Latency=${avgLatency.toFixed(0)}ms`,
  );
}

/** Main entry point. */
async function main(): Promise<void> {
  console.log(
    'Running query baseline...\nConfiguration: 4-way RRF hybrid, Subject: Maths Secondary\n',
  );
  console.log('Executing lesson queries...');
  const lessonResults = await runLessonBaseline();
  outputResultsTable('Lessons', lessonResults);
  console.log(
    `\n${'='.repeat(60)}\nSUMMARY: Lesson MRR=${calculateOverallMrr(lessonResults).toFixed(3)}\n${'='.repeat(60)}`,
  );
}

main().catch((error: unknown) => {
  console.error('Baseline run failed:', error);
  process.exit(1);
});
