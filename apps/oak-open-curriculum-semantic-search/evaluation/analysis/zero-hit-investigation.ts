/**
 * Zero-hit query investigation script.
 *
 * Identifies queries with zero hits from ground truth and investigates
 * the causes using ES queries.
 *
 * Usage: pnpm tsx evaluation/analysis/zero-hit-investigation.ts
 *
 * @packageDocumentation
 */

import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import { esSearch } from '../../src/lib/elastic-http.js';
import type { SearchLessonsIndexDoc, SearchSubjectSlug } from '../../src/types/oak.js';
import {
  getAllGroundTruthEntries,
  type Phase,
} from '../../src/lib/search-quality/ground-truth-archive/registry/index.js';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import { buildBenchmarkRequestParams } from './benchmark-request-builder.js';
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';

const thisDir = dirname(fileURLToPath(import.meta.url));

interface ZeroHitQuery {
  readonly query: string;
  readonly subject: SearchSubjectSlug;
  readonly phase: Phase;
  readonly category: string;
  readonly expectedSlugs: readonly string[];
  readonly actualResults: readonly string[];
  readonly diagnosis: 'SEARCH_FAILURE' | 'RANKING_ISSUE';
  readonly notes: string;
}

/** Run a search and return actual results. */
async function runSearch(q: string, subject: SearchSubjectSlug, phase: Phase): Promise<string[]> {
  const params = buildBenchmarkRequestParams({ text: q, subject, phase });
  const request = buildLessonRrfRequest(params);
  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return response.hits.hits.map((hit) => hit._source.lesson_slug);
}

/** Check if any expected slugs appear in top 10 results. */
function hasHit(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.slice(0, 10).some((slug) => expected.includes(slug));
}

/** Diagnose a zero-hit query. */
function diagnose(
  actual: readonly string[],
  expected: readonly string[],
): ZeroHitQuery['diagnosis'] {
  const found = expected.filter((s) => actual.indexOf(s) >= 10);
  return found.length > 0 ? 'RANKING_ISSUE' : 'SEARCH_FAILURE';
}

/** Create notes for a zero-hit query. */
function createNotes(actual: readonly string[], expected: readonly string[]): string {
  if (actual.length === 0) {
    return 'Search returned 0 results';
  }
  const found = expected.filter((s) => actual.indexOf(s) >= 10);
  if (found.length > 0) {
    const positions = found.map((s) => `${s} @ ${actual.indexOf(s) + 1}`);
    return `Ranked poorly: ${positions.join(', ')}`;
  }
  return `Not in top ${actual.length}. Top 3: ${actual.slice(0, 3).join(', ')}`;
}

/** Process a single entry's queries. */
async function processEntry(
  entry: ReturnType<typeof getAllGroundTruthEntries>[number],
  results: ZeroHitQuery[],
): Promise<void> {
  for (const gtQuery of entry.queries) {
    const expected = typeSafeKeys(gtQuery.expectedRelevance);
    const actual = await runSearch(gtQuery.query, entry.subject, entry.phase);
    if (!hasHit(actual, expected)) {
      results.push({
        query: gtQuery.query,
        subject: entry.subject,
        phase: entry.phase,
        category: gtQuery.category,
        expectedSlugs: expected,
        actualResults: actual.slice(0, 10),
        diagnosis: diagnose(actual, expected),
        notes: createNotes(actual, expected),
      });
      console.log(`  ✗ "${gtQuery.query}" - ${diagnose(actual, expected)}`);
    }
  }
}

/** Generate markdown table rows. */
function generateTableRows(queries: readonly ZeroHitQuery[]): string {
  return queries
    .map((q) => {
      const escaped = q.query.replace(/\|/g, '\\|');
      const notes = q.notes.replace(/\|/g, '\\|');
      return `| "${escaped}" | ${q.subject} | ${q.phase} | ${q.category} | ${q.diagnosis} | ${notes} |`;
    })
    .join('\n');
}

/** Generate markdown summary. */
function generateSummary(queries: readonly ZeroHitQuery[], total: number): string {
  const byDiag = new Map<string, number>();
  const byCat = new Map<string, number>();
  for (const q of queries) {
    byDiag.set(q.diagnosis, (byDiag.get(q.diagnosis) ?? 0) + 1);
    byCat.set(q.category, (byCat.get(q.category) ?? 0) + 1);
  }

  const diagLines = [...byDiag].map(([d, c]) => `- **${d}**: ${c} queries`).join('\n');
  const catLines = [...byCat]
    .sort((a, b) => b[1] - a[1])
    .map(([cat, c]) => `- **${cat}**: ${c} queries`)
    .join('\n');

  return `# Zero-Hit Query Investigation Report

**Generated**: ${new Date().toISOString().split('T')[0]}
**Total queries**: ${total}
**Zero-hit queries**: ${queries.length} (${((queries.length / total) * 100).toFixed(1)}%)

## Summary by Diagnosis

${diagLines}

## Summary by Category

${catLines}

## Detailed Results

| Query | Subject | Phase | Category | Diagnosis | Notes |
|-------|---------|-------|----------|-----------|-------|
${generateTableRows(queries)}
`;
}

/** Main investigation. */
async function investigate(): Promise<void> {
  console.log('Zero-Hit Query Investigation\n' + '='.repeat(80) + '\n');

  const entries = getAllGroundTruthEntries();
  const results: ZeroHitQuery[] = [];
  let totalQueries = 0;

  for (const entry of entries) {
    console.log(`Checking ${entry.subject}/${entry.phase} (${entry.queries.length} queries)...`);
    totalQueries += entry.queries.length;
    await processEntry(entry, results);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nFound ${results.length} zero-hit queries out of ${totalQueries} total\n`);

  const reportPath = resolve(thisDir, '../../../../.agent/evaluations/zero-hit-investigation.md');
  writeFileSync(reportPath, generateSummary(results, totalQueries));
  console.log(`Report written to: ${reportPath}`);
}

investigate().catch((e: unknown) => {
  console.error('Failed:', e);
  process.exit(1);
});
