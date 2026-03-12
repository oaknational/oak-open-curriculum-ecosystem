/**
 * Thread benchmark CLI.
 *
 * Runs ground truth benchmarks against the oak_threads index via the
 * Search SDK retrieval service, ensuring benchmarks exercise the same
 * code paths as production consumers.
 *
 * Usage: pnpm benchmark:threads --all | --subject X
 *
 * @see benchmark-query-runner-threads.ts - Query runner
 * @see benchmark-adapters.ts - Ground truth adapters
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { withEvaluationSearchSdk } from './create-evaluation-search-sdk.js';
import {
  runThreadQuery,
  type ThreadSearchFunction,
  type ThreadQueryResult,
} from './benchmark-query-runner-threads.js';
import { getThreadGroundTruthEntries } from './benchmark-adapters.js';
import type { GroundTruthEntry } from './benchmark-entry-runner.js';

/** Print benchmark summary. */
function printSummary(results: readonly ThreadQueryResult[]): void {
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
  searchFn: ThreadSearchFunction,
): Promise<readonly ThreadQueryResult[]> {
  const results: ThreadQueryResult[] = [];

  if (entry.subject === undefined) {
    console.warn(`  ⚠ Skipping cross-subject entry (threads require subject)`);
    return results;
  }

  for (const query of entry.queries) {
    try {
      const result = await runThreadQuery(
        {
          query: query.query,
          expectedRelevance: query.expectedRelevance,
          subject: entry.subject,
          category: query.category,
        },
        searchFn,
      );
      results.push(result);

      const status = result.mrr > 0 ? '\u2713' : '\u2717';
      console.log(`  ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
    } catch (error) {
      console.error(`  \u2717 Error running query "${query.query}":`, error);
    }
  }

  return results;
}

interface CliOptions {
  readonly all: boolean;
  readonly subject?: string;
}

const CLI_HELP = `Usage: pnpm benchmark:threads --all | --subject X

Options:
  --all              Run all thread ground truths
  -s, --subject      Filter by subject
  -h, --help         Show this help

Examples:
  pnpm benchmark:threads --all
  pnpm benchmark:threads -s maths
`;

function parseCliArgs(): CliOptions {
  const { values } = parseArgs({
    options: {
      all: { type: 'boolean', default: false },
      subject: { type: 'string', short: 's' },
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
  };
}

function filterEntries(opts: CliOptions): readonly GroundTruthEntry[] {
  let entries = getThreadGroundTruthEntries();

  if (!opts.all && !opts.subject) {
    console.log('No filter. Use --all or --subject. Run --help for usage.');
    process.exit(1);
  }

  if (opts.subject) {
    entries = entries.filter((e) => e.subject === opts.subject);
  }

  return entries.filter((e) => e.queries.length > 0);
}

async function runBenchmark(): Promise<void> {
  const options = parseCliArgs();
  const entries = filterEntries(options);

  if (entries.length === 0) {
    console.log('No thread ground truths found. See: src/lib/search-quality/ground-truth/threads/');
    process.exit(0);
  }

  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: dirname(fileURLToPath(import.meta.url)),
  });
  if (!configResult.ok) {
    console.error('Environment validation failed:', configResult.error.message);
    process.exit(1);
  }
  await withEvaluationSearchSdk(configResult.value.env, async (retrieval) => {
    const searchFn = retrieval.searchThreads.bind(retrieval);

    console.log(`\nThread Benchmark (oak_threads index)`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Running benchmark for ${entries.length} entries...\n`);

    const allResults: ThreadQueryResult[] = [];

    for (const entry of entries) {
      console.log(`Benchmarking ${entry.subject} (${entry.queries.length} queries)...`);
      const entryResults = await runEntryQueries(entry, searchFn);
      allResults.push(...entryResults);
    }

    printSummary(allResults);
  });
}

runBenchmark().catch((error: unknown) => {
  console.error('Thread benchmark failed:', error);
  process.exit(1);
});
