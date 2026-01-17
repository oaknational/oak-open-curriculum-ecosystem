/**
 * Ground Truth Review CLI.
 *
 * Interactive tool for reviewing and validating ground truth queries.
 * Shows current ground truth, runs the query, and displays results for comparison.
 *
 * Usage:
 *   pnpm gt-review --subject french --phase primary
 *   pnpm gt-review --subject french --phase primary --category precise-topic
 *
 * @see ground-truth-review-checklist.md for the review process
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
import { esSearch } from '../../src/lib/elastic-http.js';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchSubjectSlug } from '../../src/types/oak.js';
import {
  getGroundTruthEntry,
  type Phase,
} from '../../src/lib/search-quality/ground-truth/registry/index.js';
import type {
  GroundTruthQuery,
  QueryCategory,
} from '../../src/lib/search-quality/ground-truth/types.js';

const VALID_CATEGORIES: readonly QueryCategory[] = [
  'precise-topic',
  'natural-expression',
  'imprecise-input',
  'cross-topic',
];
const VALID_SUBJECTS: readonly string[] = [
  'art',
  'citizenship',
  'computing',
  'cooking-nutrition',
  'design-technology',
  'english',
  'french',
  'geography',
  'german',
  'history',
  'maths',
  'music',
  'physical-education',
  'religious-education',
  'science',
  'spanish',
];

interface CliOptions {
  readonly subject: string;
  readonly phase: string;
  readonly category?: string;
}

function parseCliOptions(): CliOptions {
  const { values } = parseArgs({
    options: {
      subject: { type: 'string', short: 's' },
      phase: { type: 'string', short: 'p' },
      category: { type: 'string', short: 'c' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });
  if (values.help) {
    printHelp();
    process.exit(0);
  }
  if (!values.subject || !values.phase) {
    console.error('Error: --subject and --phase are required\n');
    printHelp();
    process.exit(1);
  }
  return { subject: values.subject, phase: values.phase, category: values.category };
}

function printHelp(): void {
  console.log(
    `\nGround Truth Review CLI\n\nUsage: pnpm gt-review --subject <subject> --phase <phase> [--category <category>]\n\nOptions:\n  -s, --subject   Subject slug (required)\n  -p, --phase     Phase: primary or secondary (required)\n  -c, --category  Category filter (optional)\n  -h, --help      Show this help\n`,
  );
}

function isValidSubject(s: string): s is SearchSubjectSlug {
  return VALID_SUBJECTS.includes(s);
}
function isValidPhase(p: string): p is Phase {
  return p === 'primary' || p === 'secondary';
}
function isValidCategory(c: string): c is QueryCategory {
  const categories: readonly string[] = VALID_CATEGORIES;
  return categories.includes(c);
}

function printExpectedSlugs(query: GroundTruthQuery): readonly string[] {
  const slugs = typeSafeKeys(query.expectedRelevance);
  console.log('\nEXPECTED SLUGS:');
  for (const slug of slugs) {
    console.log(`  [${query.expectedRelevance[slug]}] ${slug}`);
  }
  return slugs;
}

function printResults(
  hits: readonly { _source: SearchLessonsIndexDoc }[],
  expected: readonly string[],
  rel: Readonly<Record<string, number>>,
): readonly string[] {
  if (hits.length === 0) {
    console.log('*** NO RESULTS ***');
    return [];
  }
  const returned: string[] = [];
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    if (!hit) {
      continue;
    }
    const slug = hit._source.lesson_slug;
    returned.push(slug);
    const isExp = expected.includes(slug);
    console.log(
      `${String(i + 1).padStart(2)}. ${slug}${isExp ? ` <- EXPECTED [${rel[slug]}]` : ''}`,
    );
    console.log(`    Title: ${hit._source.lesson_title}`);
  }
  return returned;
}

function printSummary(expected: readonly string[], returned: readonly string[]): void {
  const found = expected.filter((s) => returned.includes(s));
  const missing = expected.filter((s) => !returned.includes(s));
  console.log(
    `\n${'-'.repeat(80)}\nSUMMARY: Found ${found.length}/${expected.length} expected slugs`,
  );
  if (found.length > 0) {
    console.log(`  Found: ${found.join(', ')}`);
  }
  if (missing.length > 0) {
    console.log(`  Missing: ${missing.join(', ')}`);
  }
  const rank = returned.findIndex((s) => expected.includes(s));
  console.log(`  MRR: ${rank >= 0 ? (1 / (rank + 1)).toFixed(3) : '0.000'}`);
}

async function reviewQuery(
  q: GroundTruthQuery,
  subject: SearchSubjectSlug,
  phase: Phase,
): Promise<void> {
  console.log(
    `\n${'='.repeat(80)}\nCATEGORY: ${q.category}\nQUERY: "${q.query}"\nPRIORITY: ${q.priority}\nDESCRIPTION: ${q.description}\n${'-'.repeat(80)}`,
  );
  const expected = printExpectedSlugs(q);
  console.log(`\n${'-'.repeat(80)}\nRUNNING QUERY...`);
  const start = performance.now();
  const res = await esSearch<SearchLessonsIndexDoc>(
    buildLessonRrfRequest({ text: q.query, size: 10, subject, phase }),
  );
  console.log(
    `\nRESULTS: ${res.hits.total.value} total hits (${(performance.now() - start).toFixed(0)}ms)\n${'-'.repeat(80)}`,
  );
  printSummary(expected, printResults(res.hits.hits, expected, q.expectedRelevance));
}

function validateAndGetEntry(opts: CliOptions): {
  subject: SearchSubjectSlug;
  phase: Phase;
  queries: readonly GroundTruthQuery[];
} {
  if (!isValidSubject(opts.subject)) {
    console.error(`Invalid subject: ${opts.subject}`);
    process.exit(1);
  }
  if (!isValidPhase(opts.phase)) {
    console.error(`Invalid phase: ${opts.phase}`);
    process.exit(1);
  }
  const entry = getGroundTruthEntry(opts.subject, opts.phase);
  if (!entry) {
    console.error(`No ground truth entry for ${opts.subject}/${opts.phase}`);
    process.exit(1);
  }
  let queries = entry.queries;
  if (opts.category) {
    if (!isValidCategory(opts.category)) {
      console.error(`Invalid category: ${opts.category}`);
      process.exit(1);
    }
    queries = queries.filter((q) => q.category === opts.category);
  }
  if (queries.length === 0) {
    console.error(`No queries found`);
    process.exit(1);
  }
  return { subject: entry.subject, phase: entry.phase, queries };
}

async function main(): Promise<void> {
  const opts = parseCliOptions();
  const { subject, phase, queries } = validateAndGetEntry(opts);
  console.log(`\nGround Truth Review: ${subject}/${phase}\nReviewing ${queries.length} queries\n`);
  for (const q of queries) {
    await reviewQuery(q, subject, phase);
  }
  console.log(
    `\n${'='.repeat(80)}\nREVIEW COMPLETE\n${'='.repeat(80)}\n\nNext steps:\n1. Use MCP tools to explore lesson summaries\n2. Determine if expected slugs are better than returned\n3. Update ground truth file if needed\n4. File: src/lib/search-quality/ground-truth/${subject}/${phase}/`,
  );
}

main().catch((e: unknown) => {
  console.error('Review failed:', e);
  process.exit(1);
});
