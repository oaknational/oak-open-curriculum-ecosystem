/**
 * Benchmark main logic with dependency injection.
 *
 * This module contains the core benchmark logic that can be called with
 * any search function, enabling both production use and testing.
 *
 * Output shows measured values with status indicators:
 * - ✓✓ EXCELLENT: At or above excellent threshold
 * - ✓  GOOD: At or above good threshold
 * - ~  ACCEPTABLE: At or above fair threshold
 * - ✗  BAD: Below fair threshold
 *
 * @see benchmark.ts - Production CLI (uses real ES)
 * @see benchmark-test-harness.ts - Test CLI (uses fake)
 * @see ADR-078 Dependency Injection for Testability
 * @packageDocumentation
 */

import { parseArgs } from 'node:util';
import {
  getAllGroundTruthEntries,
  type GroundTruthEntry,
} from '../../src/lib/search-quality/ground-truth/registry/index.js';
import {
  benchmarkEntry,
  benchmarkEntryForReview,
  type EntryBenchmarkResult,
  type ReviewQueryResult,
} from './benchmark-entry-runner.js';
import type { SearchFunction } from './benchmark-query-runner.js';
import { printSummary } from './benchmark-output.js';
import { printQueryReview, printReviewSummary } from './benchmark-review-output.js';

/**
 * CLI options parsed from command line arguments.
 *
 * @remarks
 * The `verbose` flag ONLY enables per-query diagnostic output during execution.
 * It does NOT change the output granularity - per-category metrics are always shown.
 *
 * The `review` flag enables interactive review mode - shows per-query details
 * including expected slugs, actual results, and ALL metrics for each query.
 */
export interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
  readonly phase?: string;
  readonly category?: string;
  /** Enable per-query diagnostic output. Does NOT change result granularity. */
  readonly verbose: boolean;
  /** Enable review mode - shows per-query details with all metrics. */
  readonly review: boolean;
}

/** Parse CLI arguments */
export function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', default: false },
      subject: { type: 'string', short: 's' },
      phase: { type: 'string', short: 'p' },
      category: { type: 'string', short: 'c' },
      verbose: { type: 'boolean', short: 'v', default: false },
      review: { type: 'boolean', short: 'r', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });
  if (values.help) {
    console.log(`Usage: pnpm benchmark --all | --subject X --phase Y [options]

Options:
  --all              Run all subject-phases
  -s, --subject      Filter by subject (e.g., french)
  -p, --phase        Filter by phase (primary or secondary)
  -c, --category     Filter by category (e.g., precise-topic)
  -v, --verbose      Show per-query output during execution
  -r, --review       Review mode: show per-query details with ALL metrics
  -h, --help         Show this help

Examples:
  pnpm benchmark --all                          # All subjects, aggregate output
  pnpm benchmark -s french -p primary           # Single subject-phase, aggregate
  pnpm benchmark -s french -p primary --review  # Review mode with per-query details
  pnpm benchmark -s french -p primary -c precise-topic --review  # Single category review
`);
    process.exit(0);
  }
  return {
    all: values.all ?? false,
    subject: values.subject,
    phase: values.phase,
    category: values.category,
    verbose: values.verbose ?? false,
    review: values.review ?? false,
  };
}

/** Filter entries based on CLI options */
function filterEntries(opts: CliOptions): readonly GroundTruthEntry[] {
  let entries = getAllGroundTruthEntries();
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
  // Filter queries by category if specified
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
    console.log(`\nReviewing ${entry.subject}/${entry.phase} (${entry.queries.length} queries)...`);
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
 * Shows per-category and overall aggregate metrics.
 */
async function runAggregateMode(
  entries: readonly GroundTruthEntry[],
  options: CliOptions,
  searchFn: SearchFunction,
): Promise<void> {
  console.log(`Running benchmark for ${entries.length} entries...\n`);

  const results: EntryBenchmarkResult[] = [];

  for (const entry of entries) {
    console.log(
      `Benchmarking ${entry.subject}/${entry.phase} (${entry.queries.length} queries)...`,
    );
    const result = await benchmarkEntry(entry, options.verbose, searchFn);
    results.push(result);
  }

  printSummary(results);
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

  if (options.review) {
    await runReviewMode(entries, searchFn);
  } else {
    await runAggregateMode(entries, options, searchFn);
  }
}
