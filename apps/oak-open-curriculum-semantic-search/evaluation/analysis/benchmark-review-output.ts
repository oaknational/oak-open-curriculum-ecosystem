/**
 * Review mode output for benchmark CLI.
 *
 * Provides detailed per-query output for ground truth review:
 * - Expected slugs with relevance scores
 * - Actual search results (top 10)
 * - Which expected slugs were found and at what position
 * - ALL 4 metrics (MRR, NDCG@10, P@3, R@10) per query
 *
 * Usage: `pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review`
 *
 * @packageDocumentation
 */

import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import type { ReviewQueryResult } from './benchmark-entry-runner.js';
import { loadReferenceValues, formatWithStatus, type ReferenceValues } from './benchmark-output.js';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth-archive/types.js';
import type { QueryResult } from './benchmark-query-runner.js';

// Re-export the type for convenience
export type { ReviewQueryResult } from './benchmark-entry-runner.js';

/** Print query header with category, query text, and description. */
function printQueryHeader(query: GroundTruthQuery): void {
  console.log(`\n${'='.repeat(100)}`);
  console.log(`CATEGORY: ${query.category}`);
  console.log(`QUERY: "${query.query}"`);
  console.log(`DESCRIPTION: ${query.description}`);
  console.log(`${'-'.repeat(100)}`);
}

/** Print expected slugs with their relevance scores. */
function printExpectedSlugs(query: GroundTruthQuery): readonly string[] {
  const expectedSlugs = typeSafeKeys(query.expectedRelevance);
  console.log('\nEXPECTED SLUGS:');
  for (const slug of expectedSlugs) {
    console.log(`  [${query.expectedRelevance[slug]}] ${slug}`);
  }
  return expectedSlugs;
}

/** Print actual results with expected slug markers. */
function printActualResults(
  result: QueryResult,
  expectedSlugs: readonly string[],
  expectedRelevance: Readonly<Record<string, number>>,
): void {
  console.log(`\n${'-'.repeat(100)}`);
  console.log(`RESULTS: ${result.actualResults.length} results (${result.latencyMs.toFixed(0)}ms)`);
  console.log(`${'-'.repeat(100)}`);

  if (result.actualResults.length === 0) {
    console.log('*** NO RESULTS ***');
    return;
  }
  for (let i = 0; i < result.actualResults.length; i++) {
    const slug = result.actualResults[i];
    if (slug === undefined) {
      continue;
    }
    const isExpected = expectedSlugs.includes(slug);
    const marker = isExpected ? ` <- EXPECTED [${expectedRelevance[slug]}]` : '';
    console.log(`${String(i + 1).padStart(2)}. ${slug}${marker}`);
  }
}

/** Print summary of found/missing expected slugs. */
function printSlugSummary(result: QueryResult, expectedSlugs: readonly string[]): void {
  const found = expectedSlugs.filter((s) => result.actualResults.includes(s));
  const missing = expectedSlugs.filter((s) => !result.actualResults.includes(s));

  console.log(`\n${'-'.repeat(100)}`);
  console.log(`SUMMARY: Found ${found.length}/${expectedSlugs.length} expected slugs`);
  if (found.length > 0) {
    const foundPositions = found.map((s) => `${s} (#${result.actualResults.indexOf(s) + 1})`);
    console.log(`  Found: ${foundPositions.join(', ')}`);
  }
  if (missing.length > 0) {
    console.log(`  Missing: ${missing.join(', ')}`);
  }
}

/** Print all 4 metrics with status indicators and diagnostics. */
function printMetricsWithDiagnostics(result: QueryResult, refs: ReferenceValues): void {
  console.log(`\n${'-'.repeat(100)}`);
  console.log('METRICS (all 4 required for ground truth review):');
  console.log(`  MRR:      ${formatWithStatus(result.mrr, refs.mrr, 'higher')}`);
  console.log(`  NDCG@10:  ${formatWithStatus(result.ndcg10, refs.ndcg10, 'higher')}`);
  console.log(`  P@3:      ${formatWithStatus(result.precision3, refs.precision3, 'higher')}`);
  console.log(`  R@10:     ${formatWithStatus(result.recall10, refs.recall10, 'higher')}`);

  if (result.recall10 > 0.5 && result.mrr < 0.5) {
    console.log(
      '\n  DIAGNOSTIC: High R@10 + Low MRR = results found but poorly ranked (search issue)',
    );
  }
  if (result.recall10 < 0.5) {
    console.log('\n  DIAGNOSTIC: Low R@10 = expected slugs may be wrong (GT issue) — investigate!');
  }
}

/**
 * Print detailed review output for a single query.
 */
export function printQueryReview(review: ReviewQueryResult): void {
  const { query, result } = review;
  const refs = loadReferenceValues();

  printQueryHeader(query);
  const expectedSlugs = printExpectedSlugs(query);
  printActualResults(result, expectedSlugs, query.expectedRelevance);
  printSlugSummary(result, expectedSlugs);
  printMetricsWithDiagnostics(result, refs);
}

/** Print summary table header. */
function printSummaryTableHeader(): void {
  console.log(`\n${'='.repeat(100)}`);
  console.log('REVIEW SUMMARY');
  console.log(`${'='.repeat(100)}\n`);
  console.log('Query'.padEnd(50) + ' | MRR      | NDCG     | P@3      | R@10');
  console.log('-'.repeat(100));
}

/** Format a single row in the summary table. */
function formatSummaryRow(
  query: GroundTruthQuery,
  result: QueryResult,
  refs: ReferenceValues,
): string {
  // Mark future-intent queries as excluded in the query text display
  const isFutureIntent = query.category === 'future-intent';
  const suffix = isFutureIntent ? ' (excl)' : '';
  const maxLen = isFutureIntent ? 41 : 47; // Shorter to accommodate suffix
  const queryText =
    query.query.length > maxLen
      ? query.query.substring(0, maxLen) + '...' + suffix
      : (query.query + suffix).padEnd(50);

  const mrrStr = formatWithStatus(result.mrr, refs.mrr, 'higher').padEnd(8);
  const ndcgStr = formatWithStatus(result.ndcg10, refs.ndcg10, 'higher').padEnd(8);
  const p3Str = formatWithStatus(result.precision3, refs.precision3, 'higher').padEnd(8);
  const r10Str = formatWithStatus(result.recall10, refs.recall10, 'higher');
  return `${queryText} | ${mrrStr} | ${ndcgStr} | ${p3Str} | ${r10Str}`;
}

/** Print aggregate row and next steps. */
function printAggregateAndNextSteps(
  totals: { mrr: number; ndcg: number; p3: number; r10: number },
  count: number,
  refs: ReferenceValues,
): void {
  if (count === 0) {
    return;
  }

  console.log('-'.repeat(100));
  const avgMrr = totals.mrr / count;
  const avgNdcg = totals.ndcg / count;
  const avgP3 = totals.p3 / count;
  const avgR10 = totals.r10 / count;

  const aggregateRow = `${'AGGREGATE'.padEnd(50)} | ${formatWithStatus(avgMrr, refs.mrr, 'higher').padEnd(8)} | ${formatWithStatus(avgNdcg, refs.ndcg10, 'higher').padEnd(8)} | ${formatWithStatus(avgP3, refs.precision3, 'higher').padEnd(8)} | ${formatWithStatus(avgR10, refs.recall10, 'higher')}`;
  console.log(aggregateRow);

  console.log(`\n${'='.repeat(100)}`);
  console.log('REVIEW COMPLETE');
  console.log(`${'='.repeat(100)}\n`);
  console.log('Next steps:');
  console.log('1. Use MCP tools to explore lesson summaries (get-lessons-summary)');
  console.log('2. Determine if expected slugs are better than returned results');
  console.log('3. Key question: Are ACTUAL results BETTER or WORSE than expected slugs?');
  console.log('4. If actual results are better → UPDATE ground truth');
  console.log('5. If expected slugs are better → note as search quality gap');
}

/**
 * Print review summary after all queries.
 *
 * NOTE: future-intent queries are EXCLUDED from aggregate statistics
 * but still shown in the individual query list.
 */
export function printReviewSummary(reviews: readonly ReviewQueryResult[]): void {
  const refs = loadReferenceValues();
  printSummaryTableHeader();

  const totals = { mrr: 0, ndcg: 0, p3: 0, r10: 0 };
  let regularCount = 0;

  for (const { query, result } of reviews) {
    console.log(formatSummaryRow(query, result, refs));
    // Exclude future-intent from aggregate stats
    if (query.category !== 'future-intent') {
      totals.mrr += result.mrr;
      totals.ndcg += result.ndcg10;
      totals.p3 += result.precision3;
      totals.r10 += result.recall10;
      regularCount++;
    }
  }

  printAggregateAndNextSteps(totals, regularCount, refs);
}
