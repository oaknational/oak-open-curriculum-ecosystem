/**
 * Unified benchmark CLI.
 *
 * Runs ground truth benchmarks across all search indexes by default.
 * Use --index to narrow to a specific index.
 *
 * Usage: pnpm benchmark [--index lessons|units|threads|sequences]
 *
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import { benchmarkLessons } from './benchmark-all-lessons.js';
import { benchmarkUnits } from './benchmark-all-units.js';
import { benchmarkThreads } from './benchmark-all-threads.js';
import { benchmarkSequences } from './benchmark-all-sequences.js';
import type { IndexResult } from './benchmark-all-types.js';
import { VALID_INDEXES, isValidIndex, printResults } from './benchmark-all-types.js';

// =============================================================================
// CLI
// =============================================================================

const CLI_HELP = `Usage: pnpm benchmark [--index lessons|units|threads|sequences]

By default, runs all indexes. Use --index to narrow to a specific index.

Options:
  -i, --index        Index to benchmark (lessons, units, threads, sequences)
  -h, --help         Show this help

Examples:
  pnpm benchmark                     # All indexes
  pnpm benchmark --index lessons     # Lessons only
  pnpm benchmark -i units            # Units only
`;

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      index: { type: 'string', short: 'i' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });

  if (values.help) {
    console.log(CLI_HELP);
    return;
  }

  const indexFilter = values.index;
  if (indexFilter !== undefined && !isValidIndex(indexFilter)) {
    throw new Error(`Invalid index "${indexFilter}". Valid indexes: ${VALID_INDEXES.join(', ')}`);
  }

  const indexesToRun = indexFilter ? [indexFilter] : [...VALID_INDEXES];

  console.log(`\nBenchmark: ${indexesToRun.join(', ')}`);
  console.log('='.repeat(72));

  const results: IndexResult[] = [];
  for (const index of indexesToRun) {
    results.push(await runIndexBenchmark(index));
  }

  printResults(results);
}

async function runIndexBenchmark(index: string): Promise<IndexResult> {
  switch (index) {
    case 'lessons':
      return benchmarkLessons();
    case 'units':
      return benchmarkUnits();
    case 'threads':
      return benchmarkThreads();
    case 'sequences':
      return benchmarkSequences();
    default:
      throw new Error(`Unknown index: ${index}`);
  }
}

main().catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
