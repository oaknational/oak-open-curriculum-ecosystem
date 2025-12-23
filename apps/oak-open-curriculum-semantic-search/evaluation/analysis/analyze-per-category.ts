/**
 * Per-category analysis script for hard query baseline.
 *
 * Runs all hard queries and generates per-category MRR breakdown.
 * Used to update baseline documentation after index changes.
 *
 * **Classification**: ANALYSIS SCRIPT (not a test)
 */

// Load environment variables
import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '../../../.env.local');
const repoRootEnv = resolve(thisDir, '../../../../../.env');

dotenvConfig({ path: envLocalPath });
dotenvConfig({ path: repoRootEnv });

import { HARD_GROUND_TRUTH_QUERIES } from '../../src/lib/search-quality/ground-truth/index';
import {
  processQueryResult,
  calculateOverallMrr,
  calculateCategoryMrr,
  type QueryBaselineResult,
} from '../../src/lib/search-quality/baseline-runner';
import type { QueryCategory } from '../../src/lib/search-quality/ground-truth/types';
import { esSearch } from '../../src/lib/elastic-http';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders';
import type { SearchLessonsIndexDoc } from '../../src/types/oak';

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
 * All possible categories
 */
const CATEGORIES: readonly QueryCategory[] = [
  'naturalistic',
  'misspelling',
  'synonym',
  'multi-concept',
  'colloquial',
  'intent-based',
] as const;

/** Status and notes based on MRR value */
interface MrrStatusInfo {
  readonly status: string;
  readonly notes: string;
}

/**
 * Determines status and notes for a given MRR value.
 */
function getMrrStatus(mrr: number): MrrStatusInfo {
  if (mrr < 0.3) {
    return { status: '❌ Poor', notes: 'High priority fix' };
  }
  if (mrr < 0.5) {
    return { status: '⚠️ Acceptable', notes: 'Improvement needed' };
  }
  if (mrr < 0.8) {
    return { status: '✅ Good', notes: '' };
  }
  return { status: '✅ Excellent', notes: '' };
}

/**
 * Prints a single category row in the report table.
 */
function printCategoryRow(category: QueryCategory, results: readonly QueryBaselineResult[]): void {
  const categoryResults = results.filter((r) => r.category === category);
  const count = categoryResults.length;
  if (count === 0) {
    return;
  }

  const mrr = calculateCategoryMrr(results, category);
  const { status, notes } = getMrrStatus(mrr);

  console.log(
    `| ${category.padEnd(14)} | ${count}     | ${mrr.toFixed(3)} | ${status.padEnd(12)} | ${notes.padEnd(5)} |`,
  );
}

/**
 * Generate per-category breakdown report.
 */
function generateCategoryReport(results: readonly QueryBaselineResult[]): void {
  console.log('\n' + '='.repeat(70));
  console.log('PER-CATEGORY MRR BREAKDOWN (Lesson Hard Queries)');
  console.log('='.repeat(70));
  console.log();
  console.log('| Category       | Count | MRR   | Status       | Notes |');
  console.log('|----------------|-------|-------|--------------|-------|');

  for (const category of CATEGORIES) {
    printCategoryRow(category, results);
  }

  console.log();
  console.log('Overall MRR: ' + calculateOverallMrr(results).toFixed(3));
  console.log('='.repeat(70));
  console.log();
}

/**
 * Prints details for a single query result.
 */
function printQueryDetails(result: QueryBaselineResult): void {
  const found = result.firstRelevantRank !== null;
  const status = found ? `Rank ${result.firstRelevantRank}` : 'Not in top 10';
  const symbol = found ? (result.firstRelevantRank === 1 ? '✅' : '⚠️') : '❌';

  console.log(`${symbol} "${result.query}"`);
  console.log(`   Status: ${status}, MRR: ${result.mrr.toFixed(3)}`);

  const needsDetail = result.firstRelevantRank === null || result.firstRelevantRank > 3;
  if (needsDetail) {
    console.log(`   Expected: ${result.expectedSlugs.slice(0, 2).join(', ')}`);
    console.log(`   Top results: ${result.actualTop10.slice(0, 3).join(', ')}`);
  }

  console.log();
}

/**
 * Prints all results for a category.
 */
function printCategoryBreakdown(
  category: QueryCategory,
  results: readonly QueryBaselineResult[],
): void {
  const categoryResults = results.filter((r) => r.category === category);
  if (categoryResults.length === 0) {
    return;
  }

  console.log(`\n### ${category.toUpperCase()}`);
  console.log();

  categoryResults.forEach(printQueryDetails);
}

/**
 * Generate detailed query-by-query breakdown.
 */
function generateQueryBreakdown(results: readonly QueryBaselineResult[]): void {
  console.log('\n' + '='.repeat(70));
  console.log('QUERY-BY-QUERY BREAKDOWN');
  console.log('='.repeat(70));
  console.log();

  for (const category of CATEGORIES) {
    printCategoryBreakdown(category, results);
  }

  console.log('='.repeat(70));
}

/**
 * Main analysis function.
 */
async function main(): Promise<void> {
  console.log('Running per-category baseline analysis...');
  console.log('This will take ~30 seconds...\n');

  const results = await runLessonBaseline();

  generateCategoryReport(results);
  generateQueryBreakdown(results);

  console.log('\nAnalysis complete. Copy the tables above to update baseline documentation.');
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1] ?? '')) {
  main().catch(console.error);
}
