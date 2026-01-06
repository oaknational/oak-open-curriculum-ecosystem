/**
 * Unified benchmark tool for search quality evaluation.
 * Iterates over Ground Truth Registry to measure MRR, NDCG@10 across all subject/phase combinations.
 * Usage: pnpm benchmark --all | --subject X --phase Y [--verbose]
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @packageDocumentation
 */
import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../.env.local') });

import {
  getAllGroundTruthEntries,
  type GroundTruthEntry,
  type Phase,
} from '../../src/lib/search-quality/ground-truth/registry/index.js';
import { calculateMRR, calculateNDCG } from '../../src/lib/search-quality/metrics.js';
import { esSearch } from '../../src/lib/elastic-http.js';
import { buildLessonRrfRequest } from '../../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchSubjectSlug } from '../../src/types/oak.js';
import { type KeyStage, typeSafeKeys } from '@oaknational/oak-curriculum-sdk';

interface EntryBenchmarkResult {
  readonly subject: SearchSubjectSlug;
  readonly phase: Phase;
  readonly queryCount: number;
  readonly mrr: number;
  readonly ndcg10: number;
  readonly zeroHitRate: number;
  readonly avgLatencyMs: number;
  readonly baselineMrr: number;
  readonly delta: number;
}
interface QueryResult {
  readonly mrr: number;
  readonly ndcg10: number;
  readonly latencyMs: number;
  readonly hasHit: boolean;
}
interface CliOptions {
  all: boolean;
  subject?: string;
  phase?: string;
  verbose: boolean;
}

/** Map phase to default key stage for ES query. KS4 queries override via query.keyStage. */
function phaseToKeyStage(phase: Phase): KeyStage {
  switch (phase) {
    case 'primary':
      return 'ks2';
    case 'secondary':
      return 'ks3';
    default: {
      const exhaustiveCheck: never = phase;
      throw new Error(`Unexpected phase: ${exhaustiveCheck}`);
    }
  }
}

/** Run a single query and return metrics. Use queryKeyStage if provided, else derive from phase. */
async function runQuery(
  query: string,
  expectedRelevance: Readonly<Record<string, number>>,
  subject: SearchSubjectSlug,
  phase: Phase,
  queryKeyStage?: KeyStage,
): Promise<QueryResult> {
  const start = performance.now();
  const keyStage = queryKeyStage ?? phaseToKeyStage(phase);

  const request = buildLessonRrfRequest({ text: query, size: 10, subject, keyStage });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  const latencyMs = performance.now() - start;

  const actualResults = response.hits.hits.map((hit) => hit._source.lesson_slug);
  const expectedSlugs = typeSafeKeys(expectedRelevance);

  // Calculate metrics
  const mrr = calculateMRR(actualResults, expectedRelevance);
  const ndcg10 = calculateNDCG(actualResults, expectedRelevance);

  return {
    mrr,
    ndcg10,
    latencyMs,
    hasHit: actualResults.some((slug) => expectedSlugs.includes(slug)),
  };
}

/** Run benchmark for a single ground truth entry */
async function benchmarkEntry(
  entry: GroundTruthEntry,
  verbose: boolean,
): Promise<EntryBenchmarkResult> {
  const results: QueryResult[] = [];

  for (const query of entry.queries) {
    try {
      const result = await runQuery(
        query.query,
        query.expectedRelevance,
        entry.subject,
        entry.phase,
        query.keyStage,
      );
      results.push(result);

      if (verbose) {
        const status = result.mrr > 0 ? '✓' : '✗';
        console.log(`  ${status} "${query.query}" - MRR: ${result.mrr.toFixed(3)}`);
      }
    } catch (error) {
      console.error(`  ✗ Error running query "${query.query}":`, error);
      results.push({ mrr: 0, ndcg10: 0, latencyMs: 0, hasHit: false });
    }
  }

  const avgMrr = results.reduce((sum, r) => sum + r.mrr, 0) / results.length;
  const avgNdcg10 = results.reduce((sum, r) => sum + r.ndcg10, 0) / results.length;
  const zeroHitCount = results.filter((r) => !r.hasHit).length;
  const avgLatencyMs = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;

  return {
    subject: entry.subject,
    phase: entry.phase,
    queryCount: entry.queries.length,
    mrr: avgMrr,
    ndcg10: avgNdcg10,
    zeroHitRate: zeroHitCount / results.length,
    avgLatencyMs,
    baselineMrr: entry.baselineMrr,
    delta: avgMrr - entry.baselineMrr,
  };
}

/** Print summary table */
function printSummary(results: readonly EntryBenchmarkResult[]): void {
  console.log('\n' + '='.repeat(100) + '\nBENCHMARK RESULTS\n' + '='.repeat(100) + '\n');
  console.log(
    'Subject'.padEnd(20) +
      ' | ' +
      'Phase'.padEnd(10) +
      ' | #Q   | MRR    | Base   | Δ       | NDCG@10 | Zero%',
  );
  console.log('-'.repeat(100));
  for (const r of results) {
    const d = r.baselineMrr > 0 ? (r.delta >= 0 ? '+' : '') + r.delta.toFixed(3) : 'N/A';
    const b = r.baselineMrr > 0 ? r.baselineMrr.toFixed(3) : 'N/A';
    console.log(
      `${r.subject.padEnd(20)} | ${r.phase.padEnd(10)} | ${String(r.queryCount).padEnd(4)} | ${r.mrr.toFixed(3).padEnd(6)} | ${b.padEnd(6)} | ${d.padEnd(7)} | ${r.ndcg10.toFixed(3).padEnd(7)} | ${(r.zeroHitRate * 100).toFixed(1)}%`,
    );
  }
  console.log('-'.repeat(100));
  const totalQ = results.reduce((s, r) => s + r.queryCount, 0);
  const avgMrr = results.reduce((s, r) => s + r.mrr * r.queryCount, 0) / totalQ;
  const avgNdcg = results.reduce((s, r) => s + r.ndcg10 * r.queryCount, 0) / totalQ;
  const avgZero = results.reduce((s, r) => s + r.zeroHitRate * r.queryCount, 0) / totalQ;
  console.log(
    `\nOVERALL: ${totalQ} queries, MRR=${avgMrr.toFixed(3)}, NDCG@10=${avgNdcg.toFixed(3)}, Zero-hit=${(avgZero * 100).toFixed(1)}%`,
  );
}

/** Parse CLI arguments */
function parseCliArgs(): CliOptions {
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

/** Main entry point */
async function main(): Promise<void> {
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
    const result = await benchmarkEntry(entry, options.verbose);
    results.push(result);
  }

  printSummary(results);
}

main().catch((error: unknown) => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
