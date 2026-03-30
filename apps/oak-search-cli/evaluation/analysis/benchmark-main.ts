/**
 * Benchmark main logic with dependency injection.
 *
 * @see benchmark-lessons.ts - Production CLI (uses real ES)
 * @see ADR-078 Dependency Injection for Testability
 */

import { parseArgs } from 'node:util';
import {
  benchmarkEntry,
  benchmarkEntryForReview,
  type EntryBenchmarkResult,
  type GroundTruthEntry,
  type ReviewQueryResult,
} from './benchmark-entry-runner.js';
import type { SearchFunction } from './benchmark-query-runner-lessons.js';
import { printSummary } from './benchmark-output.js';
import { printQueryReview, printReviewSummary } from './benchmark-review-output.js';
import { generateIssuesReport, type AugmentedReview } from './benchmark-issues-report.js';
import {
  getLessonGroundTruthEntries,
  getCrossSubjectGroundTruthEntries,
} from './benchmark-adapters.js';

/**
 * CLI options parsed from command line arguments.
 *
 * @remarks
 * The `review` flag enables interactive review mode - shows per-query details
 * including expected slugs, actual results, and ALL metrics for each query.
 *
 * The `issues` flag runs all queries and generates an issues report file
 * without the verbose per-query console output of review mode.
 */
export interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
  readonly phase?: string;
  readonly category?: string;
  /** Enable review mode - shows per-query details with all metrics. */
  readonly review: boolean;
  /** Enable issues mode - runs all and generates issues report (quieter than review). */
  readonly issues: boolean;
}

const CLI_HELP = `Usage: pnpm benchmark:lessons --all | --subject X --phase Y [options]

Options:
  --all              Run all subject-phases
  -s, --subject      Filter by subject (e.g., french)
  -p, --phase        Filter by phase (primary or secondary)
  -c, --category     Filter by category (e.g., precise-topic)
  -r, --review       Review mode: show detailed per-query output with ALL metrics
  -i, --issues       Issues mode: run all and generate issues report file
  -h, --help         Show this help

Examples:
  pnpm benchmark:lessons --all                          # All subjects, aggregate output
  pnpm benchmark:lessons -s french -p primary           # Single subject-phase, aggregate
  pnpm benchmark:lessons -s french -p primary --review  # Review mode with per-query details
  pnpm benchmark:lessons -s french -p primary -c precise-topic --review  # Single category review
  pnpm benchmark:lessons --issues                       # Generate issues report for all queries
`;

interface RawCliValues {
  readonly all?: boolean;
  readonly subject?: string;
  readonly phase?: string;
  readonly category?: string;
  readonly review?: boolean;
  readonly issues?: boolean;
  readonly help?: boolean;
}

function buildCliOptions(values: RawCliValues): CliOptions {
  const issuesMode = values.issues ?? false;
  return {
    all: issuesMode || (values.all ?? false),
    subject: values.subject,
    phase: values.phase,
    category: values.category,
    review: values.review ?? false,
    issues: issuesMode,
  };
}

/** Parse CLI arguments */
export function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', default: false },
      subject: { type: 'string', short: 's' },
      phase: { type: 'string', short: 'p' },
      category: { type: 'string', short: 'c' },
      review: { type: 'boolean', short: 'r', default: false },
      issues: { type: 'boolean', short: 'i', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });
  if (values.help) {
    console.log(CLI_HELP);
    process.exit(0);
  }
  return buildCliOptions(values);
}

/**
 * Format an entry label for console output.
 *
 * @param entry - Ground truth entry
 * @returns Human-readable label like "maths/primary" or "cross-subject"
 */
function entryLabel(entry: GroundTruthEntry): string {
  if (entry.subject === undefined || entry.phase === undefined) {
    return 'cross-subject';
  }
  return `${entry.subject}/${entry.phase}`;
}

/** Filter entries based on CLI options */
function filterEntries(opts: CliOptions): readonly GroundTruthEntry[] {
  const perSubject = getLessonGroundTruthEntries();
  const crossSubject = getCrossSubjectGroundTruthEntries();
  let entries: readonly GroundTruthEntry[] = [...perSubject, ...crossSubject];

  if (!opts.all && !opts.subject && !opts.phase) {
    console.log('No filter. Use --all or --subject/--phase. Run --help for usage.');
    process.exit(1);
  }
  if (opts.subject) {
    entries = entries.filter((e) => e.subject === opts.subject);
  }
  if (opts.phase) {
    entries = entries.filter((e) => e.phase === opts.phase);
  }
  if (opts.category) {
    entries = entries.map((e) => ({
      ...e,
      queries: e.queries.filter((q) => q.category === opts.category),
    }));
  }
  return entries.filter((e) => e.queries.length > 0);
}

/**
 * Run benchmark in review mode.
 *
 * Shows detailed per-query output for ground truth review.
 */
async function runReviewMode(
  entries: readonly GroundTruthEntry[],
  searchFn: SearchFunction,
): Promise<void> {
  const allReviews: ReviewQueryResult[] = [];

  for (const entry of entries) {
    console.log(`\nReviewing ${entryLabel(entry)} (${entry.queries.length} queries)...`);
    const reviews = await benchmarkEntryForReview(entry, searchFn);

    for (const review of reviews) {
      printQueryReview(review);
      allReviews.push(review);
    }
  }

  printReviewSummary(allReviews);
}

/**
 * Run benchmark in aggregate mode (default).
 *
 * Shows per-query progress and aggregate metrics.
 */
async function runAggregateMode(
  entries: readonly GroundTruthEntry[],
  searchFn: SearchFunction,
): Promise<void> {
  console.log(`Running benchmark for ${entries.length} entries...\n`);

  const results: EntryBenchmarkResult[] = [];

  for (const entry of entries) {
    console.log(`Benchmarking ${entryLabel(entry)} (${entry.queries.length} queries)...`);
    const result = await benchmarkEntry(entry, searchFn);
    results.push(result);
  }

  printSummary(results);
}

/**
 * Run benchmark in issues mode.
 *
 * Runs all queries with minimal output and generates issues report.
 */
async function runIssuesMode(
  entries: readonly GroundTruthEntry[],
  searchFn: SearchFunction,
): Promise<void> {
  const augmentedReviews: AugmentedReview[] = [];
  let totalQueries = 0;

  console.log(`Running issues analysis for ${entries.length} entries...\n`);

  for (const entry of entries) {
    process.stdout.write(`  ${entryLabel(entry)}...`);
    const reviews = await benchmarkEntryForReview(entry, searchFn);

    for (const review of reviews) {
      augmentedReviews.push({
        review,
        subject: entry.subject ?? 'cross-subject',
        phase: entry.phase ?? 'cross-subject',
      });
      totalQueries++;
    }
    console.log(` ${reviews.length} queries`);
  }

  console.log(`\nAnalyzed ${totalQueries} queries.`);

  const reportPath = generateIssuesReport(augmentedReviews);
  console.log(`\nIssues report generated: ${reportPath}`);
}

/**
 * Main benchmark function with injected search dependency.
 *
 * @param searchFn - The search function to use (real ES or fake for testing)
 */
export async function runBenchmark(searchFn: SearchFunction): Promise<void> {
  const options = parseCliArgs();
  const entries = filterEntries(options);

  if (entries.length === 0) {
    console.log('No entries match the specified filters.');
    process.exit(1);
  }

  if (options.issues) {
    await runIssuesMode(entries, searchFn);
  } else if (options.review) {
    await runReviewMode(entries, searchFn);
  } else {
    await runAggregateMode(entries, searchFn);
  }
}
