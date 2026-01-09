/**
 * Benchmark main logic with dependency injection.
 *
 * This module contains the core benchmark logic that can be called with
 * any search function, enabling both production use and testing.
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
import { calculateP95 } from './benchmark-stats.js';

/** CLI options parsed from command line arguments. */
export interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
  readonly phase?: string;
  readonly verbose: boolean;
}

/**
 * Print summary table with all IR metrics.
 *
 * Note: Baselines are stored separately in baselines.json.
 * This output shows current metrics only. Compare to baselines manually
 * or use the smoke test for regression detection.
 */
function printSummary(results: readonly EntryBenchmarkResult[]): void {
  console.log('\n' + '='.repeat(110) + '\nBENCHMARK RESULTS\n' + '='.repeat(110) + '\n');
  console.log(
    'Subject'.padEnd(20) +
      ' | ' +
      'Phase'.padEnd(10) +
      ' | #Q   | MRR    | NDCG   | P@10   | R@10   | Zero%  | p95ms',
  );
  console.log('-'.repeat(110));
  for (const r of results) {
    const p95 = calculateP95(r.latencies);
    console.log(
      `${r.subject.padEnd(20)} | ${r.phase.padEnd(10)} | ${String(r.queryCount).padEnd(4)} | ${r.mrr.toFixed(3).padEnd(6)} | ${r.ndcg10.toFixed(3).padEnd(6)} | ${r.precision10.toFixed(3).padEnd(6)} | ${r.recall10.toFixed(3).padEnd(6)} | ${(r.zeroHitRate * 100).toFixed(1).padEnd(6)}% | ${p95.toFixed(0)}`,
    );
  }
  console.log('-'.repeat(110));

  // Aggregate all metrics
  const totalQ = results.reduce((s, r) => s + r.queryCount, 0);
  const avgMrr = results.reduce((s, r) => s + r.mrr * r.queryCount, 0) / totalQ;
  const avgNdcg = results.reduce((s, r) => s + r.ndcg10 * r.queryCount, 0) / totalQ;
  const avgP10 = results.reduce((s, r) => s + r.precision10 * r.queryCount, 0) / totalQ;
  const avgR10 = results.reduce((s, r) => s + r.recall10 * r.queryCount, 0) / totalQ;
  const avgZero = results.reduce((s, r) => s + r.zeroHitRate * r.queryCount, 0) / totalQ;
  const allLatencies = results.flatMap((r) => [...r.latencies]);
  const overallP95 = calculateP95(allLatencies);

  console.log(
    `\nOVERALL: ${totalQ} queries | MRR=${avgMrr.toFixed(3)} | NDCG=${avgNdcg.toFixed(3)} | P@10=${avgP10.toFixed(3)} | R@10=${avgR10.toFixed(3)} | Zero=${(avgZero * 100).toFixed(1)}% | p95=${overallP95.toFixed(0)}ms`,
  );
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
