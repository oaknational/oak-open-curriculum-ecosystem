/**
 * Ground truth quality analysis script.
 * Provides detailed breakdown of quality issues by entry.
 * Run with: pnpm ground-truth:analyze (add --verbose for query lists)
 * @packageDocumentation
 */
import { getAllGroundTruthEntries } from '../../src/lib/search-quality/ground-truth/registry/index.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';

interface QueryIssues {
  readonly uniformScores: readonly string[];
  readonly missingPriority: readonly string[];
  readonly shortQueries: readonly string[];
  readonly singleSlug: readonly string[];
  readonly noHighlyRelevant: readonly string[];
  readonly missingCategory: readonly string[];
}

interface EntryAnalysis {
  readonly entry: string;
  readonly totalQueries: number;
  readonly uniformScores: number;
  readonly missingPriority: number;
  readonly shortQueries: number;
  readonly singleSlug: number;
  readonly noHighlyRelevant: number;
  readonly missingCategory: number;
  readonly queries: QueryIssues;
}

interface OverallSummary {
  readonly totalEntries: number;
  readonly totalQueries: number;
  readonly totalSlugs: number;
  readonly uniformScores: number;
  readonly missingPriority: number;
  readonly shortQueries: number;
  readonly singleSlug: number;
  readonly noHighlyRelevant: number;
  readonly missingCategory: number;
}

interface QueryData {
  readonly query: string;
  readonly expectedRelevance: Record<string, number>;
  readonly priority?: string;
  readonly category?: string;
}

function hasUniformScores(slugs: readonly string[], scores: readonly number[]): boolean {
  return slugs.length >= 2 && new Set(scores).size === 1;
}

function checkQuery(q: QueryData): QueryIssues {
  const slugs = typeSafeKeys(q.expectedRelevance);
  const scores = slugs.map((k) => q.expectedRelevance[k]);
  const hasScore3 = scores.some((s) => s === 3);
  const truncated = q.query.slice(0, 50);
  return {
    uniformScores: hasUniformScores(slugs, scores) ? [truncated] : [],
    missingPriority: q.priority === undefined ? [truncated] : [],
    shortQueries: q.query.trim().split(/\s+/).length < 3 ? [truncated] : [],
    singleSlug: slugs.length === 1 ? [truncated] : [],
    noHighlyRelevant: slugs.length > 0 && !hasScore3 ? [truncated] : [],
    missingCategory: q.category === undefined ? [truncated] : [],
  };
}

function mergeIssues(a: QueryIssues, b: QueryIssues): QueryIssues {
  return {
    uniformScores: [...a.uniformScores, ...b.uniformScores],
    missingPriority: [...a.missingPriority, ...b.missingPriority],
    shortQueries: [...a.shortQueries, ...b.shortQueries],
    singleSlug: [...a.singleSlug, ...b.singleSlug],
    noHighlyRelevant: [...a.noHighlyRelevant, ...b.noHighlyRelevant],
    missingCategory: [...a.missingCategory, ...b.missingCategory],
  };
}

const EMPTY_ISSUES: QueryIssues = {
  uniformScores: [],
  missingPriority: [],
  shortQueries: [],
  singleSlug: [],
  noHighlyRelevant: [],
  missingCategory: [],
};

function analyzeEntry(
  subject: string,
  phase: string,
  queries: readonly QueryData[],
): EntryAnalysis {
  const allIssues = queries.map(checkQuery).reduce(mergeIssues, EMPTY_ISSUES);
  return {
    entry: `${subject}/${phase}`,
    totalQueries: queries.length,
    uniformScores: allIssues.uniformScores.length,
    missingPriority: allIssues.missingPriority.length,
    shortQueries: allIssues.shortQueries.length,
    singleSlug: allIssues.singleSlug.length,
    noHighlyRelevant: allIssues.noHighlyRelevant.length,
    missingCategory: allIssues.missingCategory.length,
    queries: allIssues,
  };
}

function computeOverallSummary(analyses: readonly EntryAnalysis[]): OverallSummary {
  const entries = getAllGroundTruthEntries();
  let totalSlugs = 0;
  for (const entry of entries) {
    for (const query of entry.queries) {
      totalSlugs += typeSafeKeys(query.expectedRelevance).length;
    }
  }
  return {
    totalEntries: analyses.length,
    totalQueries: analyses.reduce((sum, a) => sum + a.totalQueries, 0),
    totalSlugs,
    uniformScores: analyses.reduce((sum, a) => sum + a.uniformScores, 0),
    missingPriority: analyses.reduce((sum, a) => sum + a.missingPriority, 0),
    shortQueries: analyses.reduce((sum, a) => sum + a.shortQueries, 0),
    singleSlug: analyses.reduce((sum, a) => sum + a.singleSlug, 0),
    noHighlyRelevant: analyses.reduce((sum, a) => sum + a.noHighlyRelevant, 0),
    missingCategory: analyses.reduce((sum, a) => sum + a.missingCategory, 0),
  };
}

function printSummary(summary: OverallSummary): void {
  console.log('Ground Truth Quality Analysis');
  console.log('═════════════════════════════\n');
  console.log('Overall Summary');
  console.log('───────────────');
  console.log(`Total entries:        ${summary.totalEntries}`);
  console.log(`Total queries:        ${summary.totalQueries}`);
  console.log(`Total slugs:          ${summary.totalSlugs}\n`);
  console.log('Issues Found:');
  console.log(`  uniform-scores:     ${summary.uniformScores}`);
  console.log(`  missing-priority:   ${summary.missingPriority}`);
  console.log(`  short-query:        ${summary.shortQueries}`);
  console.log(`  single-slug:        ${summary.singleSlug}`);
  console.log(`  no-highly-relevant: ${summary.noHighlyRelevant}`);
  console.log(`  missing-category:   ${summary.missingCategory}\n`);
  const total =
    summary.uniformScores +
    summary.missingPriority +
    summary.shortQueries +
    summary.singleSlug +
    summary.noHighlyRelevant +
    summary.missingCategory;
  console.log(`Total issues:         ${total}\n`);
}

function getTotalIssues(a: EntryAnalysis): number {
  return (
    a.uniformScores +
    a.missingPriority +
    a.shortQueries +
    a.singleSlug +
    a.noHighlyRelevant +
    a.missingCategory
  );
}

function printTable(entriesWithIssues: readonly EntryAnalysis[]): void {
  console.log('Issues by Entry');
  console.log('───────────────\n');
  console.log(
    '| Entry                          | Uniform | Priority | Short | Single | No-3 | No-Cat |',
  );
  console.log(
    '|--------------------------------|---------|----------|-------|--------|------|--------|',
  );
  const sorted = [...entriesWithIssues].sort((a, b) => getTotalIssues(b) - getTotalIssues(a));
  for (const analysis of sorted) {
    const row = [
      `| ${analysis.entry.padEnd(30)}`,
      `${String(analysis.uniformScores).padStart(7)}`,
      `${String(analysis.missingPriority).padStart(8)}`,
      `${String(analysis.shortQueries).padStart(5)}`,
      `${String(analysis.singleSlug).padStart(6)}`,
      `${String(analysis.noHighlyRelevant).padStart(4)}`,
      `${String(analysis.missingCategory).padStart(6)} |`,
    ];
    console.log(row.join(' | '));
  }
  console.log('');
}

function printQueryList(label: string, queries: readonly string[]): void {
  if (queries.length === 0) {
    return;
  }
  console.log(`${label}:`);
  for (const q of queries) {
    console.log(`  - ${q}`);
  }
  console.log('');
}

function printVerboseDetails(entriesWithIssues: readonly EntryAnalysis[]): void {
  console.log('Detailed Query Lists');
  console.log('────────────────────\n');
  for (const analysis of entriesWithIssues) {
    if (getTotalIssues(analysis) === 0) {
      continue;
    }
    console.log(`### ${analysis.entry}\n`);
    printQueryList('uniform-scores', analysis.queries.uniformScores);
    printQueryList('missing-priority', analysis.queries.missingPriority);
    printQueryList('short-query', analysis.queries.shortQueries);
    printQueryList('single-slug', analysis.queries.singleSlug);
    printQueryList('no-highly-relevant', analysis.queries.noHighlyRelevant);
    printQueryList('missing-category', analysis.queries.missingCategory);
  }
}

function printResults(
  analyses: readonly EntryAnalysis[],
  summary: OverallSummary,
  verbose: boolean,
): void {
  printSummary(summary);
  const entriesWithIssues = analyses.filter((a) => getTotalIssues(a) > 0);
  if (entriesWithIssues.length === 0) {
    console.log('✅ All entries pass quality checks!\n');
    return;
  }
  printTable(entriesWithIssues);
  if (verbose) {
    printVerboseDetails(entriesWithIssues);
  }
}

function main(): void {
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  const entries = getAllGroundTruthEntries();
  const analyses = entries.map((entry) => analyzeEntry(entry.subject, entry.phase, entry.queries));
  const summary = computeOverallSummary(analyses);
  printResults(analyses, summary, verbose);
}

main();
