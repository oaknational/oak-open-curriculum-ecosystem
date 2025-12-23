import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables
const thisDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(thisDir, '../.env.local') });
dotenvConfig({ path: resolve(thisDir, '../../../.env') });

import {
  SYNONYM_DIAGNOSTIC_QUERIES,
  MULTI_CONCEPT_DIAGNOSTIC_QUERIES,
} from '../../src/lib/search-quality/ground-truth/diagnostic-queries';
import {
  processQueryResult,
  type QueryBaselineResult,
} from '../../src/lib/search-quality/baseline-runner';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth/types';
import { esSearch } from '../../src/lib/elastic-http';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders';
import type { SearchLessonsIndexDoc } from '../../src/types/oak';

/** Grouped result with query and result */
interface PatternEntry {
  readonly result: QueryBaselineResult;
  readonly query: GroundTruthQuery;
}

/** Pattern statistics for output */
interface PatternStats {
  readonly mrr: number;
  readonly successRate: number;
  readonly notInTop10: number;
}

console.log('Running diagnostic query analysis...');
console.log('This will take ~30 seconds...\n');

async function runDiagnosticAnalysis() {
  const synonymResults: QueryBaselineResult[] = [];
  const multiConceptResults: QueryBaselineResult[] = [];

  // Run synonym diagnostic queries
  for (const query of SYNONYM_DIAGNOSTIC_QUERIES) {
    const request = buildLessonRrfRequest({
      text: query.query,
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    const response = await esSearch<SearchLessonsIndexDoc>(request);
    const slugs = response.hits.hits.map((hit) => hit._source.lesson_slug);
    const result = processQueryResult(query, slugs, response.took);
    synonymResults.push(result);
  }

  // Run multi-concept diagnostic queries
  for (const query of MULTI_CONCEPT_DIAGNOSTIC_QUERIES) {
    const request = buildLessonRrfRequest({
      text: query.query,
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    const response = await esSearch<SearchLessonsIndexDoc>(request);
    const slugs = response.hits.hits.map((hit) => hit._source.lesson_slug);
    const result = processQueryResult(query, slugs, response.took);
    multiConceptResults.push(result);
  }

  return { synonymResults, multiConceptResults };
}

/**
 * Groups results by pattern extracted from query description.
 */
function groupByPattern(
  results: readonly QueryBaselineResult[],
  queries: readonly GroundTruthQuery[],
): Map<string, readonly PatternEntry[]> {
  const patterns = new Map<string, PatternEntry[]>();

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const query = queries[i];
    if (!result || !query) {
      continue;
    }

    const pattern = query.description?.split(':')[0] ?? 'unknown';
    const entries = patterns.get(pattern) ?? [];
    entries.push({ result, query });
    patterns.set(pattern, entries);
  }

  return patterns;
}

/**
 * Calculates statistics for a pattern's results.
 */
function calculatePatternStats(results: readonly QueryBaselineResult[]): PatternStats {
  const totalMrr = results.reduce((sum, r) => sum + r.mrr, 0);
  const mrr = results.length > 0 ? totalMrr / results.length : 0;
  const successCount = results.filter(
    (r) => r.firstRelevantRank && r.firstRelevantRank <= 3,
  ).length;
  const successRate = results.length > 0 ? successCount / results.length : 0;
  const notInTop10 = results.filter((r) => !r.firstRelevantRank).length;

  return { mrr, successRate, notInTop10 };
}

/**
 * Prints results for a single query.
 */
function printQueryResult(entry: PatternEntry): void {
  const { result, query } = entry;
  const status = !result.firstRelevantRank ? '❌' : result.firstRelevantRank <= 3 ? '✅' : '⚠️';
  const rankStr = result.firstRelevantRank ? `Rank ${result.firstRelevantRank}` : 'Not in top 10';

  console.log(`  ${status} "${query.query}" - ${rankStr} (MRR: ${result.mrr.toFixed(3)})`);

  const shouldShowTop = !result.firstRelevantRank || result.firstRelevantRank > 3;
  if (shouldShowTop && result.actualTop10.length > 0) {
    console.log(`     Top 3: ${result.actualTop10.slice(0, 3).join(', ')}`);
  }
}

/**
 * Prints analysis for a single pattern.
 */
function printPatternAnalysis(pattern: string, entries: readonly PatternEntry[]): void {
  const results = entries.map((e) => e.result);
  const stats = calculatePatternStats(results);

  console.log(`\n### ${pattern}`);
  console.log(
    `Count: ${entries.length} | MRR: ${stats.mrr.toFixed(3)} | ` +
      `Success: ${(stats.successRate * 100).toFixed(0)}% | Not in top 10: ${stats.notInTop10}`,
  );

  entries.forEach(printQueryResult);
}

/**
 * Analyzes and prints patterns for a category of diagnostic queries.
 */
function analyzePatterns(
  results: readonly QueryBaselineResult[],
  queries: readonly GroundTruthQuery[],
  category: string,
): void {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${category.toUpperCase()} DIAGNOSTIC ANALYSIS`);
  console.log('='.repeat(70));

  const patterns = groupByPattern(results, queries);

  for (const [pattern, entries] of patterns) {
    printPatternAnalysis(pattern, entries);
  }
}

function printSummary(
  synonymResults: QueryBaselineResult[],
  multiConceptResults: QueryBaselineResult[],
) {
  console.log(`\n${'='.repeat(70)}`);
  console.log('DIAGNOSTIC SUMMARY');
  console.log('='.repeat(70));

  const synonymMrr = synonymResults.reduce((sum, r) => sum + r.mrr, 0) / synonymResults.length;
  const multiConceptMrr =
    multiConceptResults.reduce((sum, r) => sum + r.mrr, 0) / multiConceptResults.length;

  console.log(
    `\nSynonym Diagnostic MRR: ${synonymMrr.toFixed(3)} (${SYNONYM_DIAGNOSTIC_QUERIES.length} queries)`,
  );
  console.log(
    `Multi-Concept Diagnostic MRR: ${multiConceptMrr.toFixed(3)} (${MULTI_CONCEPT_DIAGNOSTIC_QUERIES.length} queries)`,
  );

  console.log('\n### Key Insights\n');
  console.log('Compare patterns within each category to identify:');
  console.log('- Which synonym patterns work well vs fail');
  console.log('- Whether position/density matters for synonyms');
  console.log('- Which multi-concept patterns succeed');
  console.log('- Whether concept density affects scoring');
  console.log('\nUse this analysis to guide B.5 phrase query enhancement.');
}

// Run analysis
const { synonymResults, multiConceptResults } = await runDiagnosticAnalysis();
analyzePatterns(synonymResults, SYNONYM_DIAGNOSTIC_QUERIES, 'Synonym');
analyzePatterns(multiConceptResults, MULTI_CONCEPT_DIAGNOSTIC_QUERIES, 'Multi-Concept');
printSummary(synonymResults, multiConceptResults);

console.log('\n✅ Diagnostic analysis complete.\n');
