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
import { benchmarkEntry, type EntryBenchmarkResult } from './benchmark-entry-runner.js';
import type { SearchFunction } from './benchmark-query-runner.js';
import { printSummary } from './benchmark-output.js';

/**
 * CLI options parsed from command line arguments.
 *
 * @remarks
 * The `verbose` flag ONLY enables per-query diagnostic output during execution.
 * It does NOT change the output granularity - per-category metrics are always shown.
 */
export interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
  readonly phase?: string;
  /** Enable per-query diagnostic output. Does NOT change result granularity. */
  readonly verbose: boolean;
}

/** Parse CLI arguments */
export function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', default: false },
      subject: { type: 'string' },
      phase: { type: 'string' },
      verbose: { type: 'boolean', short: 'v', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });
  if (values.help) {
    console.log('Usage: pnpm benchmark --all | --subject X --phase Y [--verbose]');
    process.exit(0);
  }
  return {
    all: values.all ?? false,
    subject: values.subject,
    phase: values.phase,
    verbose: values.verbose ?? false,
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
  return entries.filter((e) => e.queries.length > 0);
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
