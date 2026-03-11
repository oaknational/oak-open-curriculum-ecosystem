/**
 * Unit benchmark CLI.
 *
 * Uses the Search SDK retrieval service for all queries, ensuring
 * benchmarks exercise the same code paths as production consumers.
 *
 * Usage: pnpm benchmark:units --all | --subject X --phase Y
 *
 * @see benchmark-query-runner-units.ts - Query runner
 * @see benchmark-adapters.ts - Ground truth adapters
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { withEvaluationSearchSdk } from './create-evaluation-search-sdk.js';
import {
  runUnitQuery,
  type UnitSearchFunction,
  type UnitQueryResult,
} from './benchmark-query-runner-units.js';
import { getUnitGroundTruthEntries } from './benchmark-adapters.js';
import type { GroundTruthEntry } from './benchmark-entry-runner.js';

/** Print benchmark summary. */
function printSummary(results: readonly UnitQueryResult[]): void {
  if (results.length === 0) {
    return;
  }

  const avgMrr = results.reduce((sum, r) => sum + r.mrr, 0) / results.length;
  const avgNdcg = results.reduce((sum, r) => sum + r.ndcg10, 0) / results.length;
  const avgP3 = results.reduce((sum, r) => sum + r.precision3, 0) / results.length;
  const avgR10 = results.reduce((sum, r) => sum + r.recall10, 0) / results.length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Summary (${results.length} queries)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`MRR:        ${avgMrr.toFixed(3)}`);
  console.log(`NDCG@10:    ${avgNdcg.toFixed(3)}`);
  console.log(`P@3:        ${avgP3.toFixed(3)}`);
  console.log(`R@10:       ${avgR10.toFixed(3)}`);
}

/** Run queries for a single entry. */
async function runEntryQueries(
  entry: GroundTruthEntry,
  searchFn: UnitSearchFunction,
): Promise<readonly UnitQueryResult[]> {
  const results: UnitQueryResult[] = [];

  if (entry.subject === undefined || entry.phase === undefined) {
    console.warn(`  ⚠ Skipping cross-subject entry (units require subject + phase)`);
    return results;
  }

  for (const query of entry.queries) {
    try {
      const result = await runUnitQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          phase: entry.phase,
          queryKeyStage: query.keyStage,
          category: query.category,
        },
        searchFn,
      );
      results.push(result);

      const status = result.mrr > 0 ? '✓' : '✗';
      console.log(`  ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
    } catch (error) {
      console.error(`  ✗ Error running query "${query.query}":`, error);
    }
  }

  return results;
}

interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
  readonly phase?: string;
}

const CLI_HELP = `Usage: pnpm benchmark:units --all | --subject X --phase Y

Options:
  --all              Run all unit ground truths
  -s, --subject      Filter by subject
  -p, --phase        Filter by phase (primary or secondary)
  -h, --help         Show this help

Examples:
  pnpm benchmark:units --all
  pnpm benchmark:units -s maths -p primary
`;

function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', default: false },
      subject: { type: 'string', short: 's' },
      phase: { type: 'string', short: 'p' },
      help: { type: 'boolean', short: 'h', default: false },
    },
    strict: true,
  });

  if (values.help) {
    console.log(CLI_HELP);
    process.exit(0);
  }

  return {
    all: values.all ?? false,
    subject: values.subject,
    phase: values.phase,
  };
}

function filterEntries(opts: CliOptions): readonly GroundTruthEntry[] {
  let entries = getUnitGroundTruthEntries();

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

async function runBenchmark(): Promise<void> {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    console.error('Environment validation failed:', configResult.error.message);
    process.exit(1);
  }
  const noEntries = await withEvaluationSearchSdk(configResult.value.env, async (sdk) => {
    const searchFn = sdk.retrieval.searchUnits.bind(sdk.retrieval);
    const options = parseCliArgs();
    const entries = filterEntries(options);

    if (entries.length === 0) {
      console.log('No unit ground truths found. See: src/lib/search-quality/ground-truth/units/');
      return true;
    }

    console.log(`\nUnit Benchmark (oak_unit_rollup index)`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Running benchmark for ${entries.length} entries...\n`);

    const allResults: UnitQueryResult[] = [];

    for (const entry of entries) {
      console.log(
        `Benchmarking ${entry.subject}/${entry.phase} (${entry.queries.length} queries)...`,
      );
      const entryResults = await runEntryQueries(entry, searchFn);
      allResults.push(...entryResults);
    }

    printSummary(allResults);
    return false;
  });
  if (noEntries) {
    process.exit(0);
  }
}

runBenchmark().catch((error: unknown) => {
  console.error('Unit benchmark failed:', error);
  process.exit(1);
});
