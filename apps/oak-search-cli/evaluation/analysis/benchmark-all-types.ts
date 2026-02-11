/**
 * Shared types and utilities for the unified benchmark CLI.
 */

export interface BenchmarkMetrics {
  readonly mrr: number;
  readonly ndcg10: number;
  readonly precision3: number;
  readonly recall10: number;
}

export interface IndexResult {
  readonly index: string;
  readonly queries: number;
  readonly metrics: BenchmarkMetrics;
}

export const VALID_INDEXES = ['lessons', 'units', 'threads', 'sequences'] as const;
export type IndexName = (typeof VALID_INDEXES)[number];

export function isValidIndex(value: string): value is IndexName {
  return VALID_INDEXES.some((v) => v === value);
}

/** Compute average metrics from a collection of per-query metrics. */
export function averageMetrics(results: readonly BenchmarkMetrics[]): BenchmarkMetrics {
  if (results.length === 0) {
    return { mrr: 0, ndcg10: 0, precision3: 0, recall10: 0 };
  }
  const n = results.length;
  return {
    mrr: results.reduce((sum, r) => sum + r.mrr, 0) / n,
    ndcg10: results.reduce((sum, r) => sum + r.ndcg10, 0) / n,
    precision3: results.reduce((sum, r) => sum + r.precision3, 0) / n,
    recall10: results.reduce((sum, r) => sum + r.recall10, 0) / n,
  };
}

/** Format a metric value with fixed precision. */
function fmt(value: number): string {
  return value.toFixed(3).padEnd(9);
}

/** Print a summary table of benchmark results across all indexes. */
export function printResults(results: readonly IndexResult[]): void {
  const sep = '='.repeat(72);
  console.log(`\n${sep}`);
  console.log('Benchmark Results');
  console.log(sep);

  const header = 'Index        | Queries | MRR      | NDCG@10  | P@3      | R@10';
  console.log(header);
  console.log('-'.repeat(header.length));

  for (const r of results) {
    printIndexRow(r);
  }

  console.log('-'.repeat(header.length));
  printOverallRow(results);
  console.log('');
}

function printIndexRow(r: IndexResult): void {
  if (r.queries === 0) {
    console.log(`${r.index.padEnd(13)}| ${String(r.queries).padEnd(8)}| (no ground truths)`);
    return;
  }
  const m = r.metrics;
  console.log(
    `${r.index.padEnd(13)}| ${String(r.queries).padEnd(8)}| ${fmt(m.mrr)}| ${fmt(m.ndcg10)}| ${fmt(m.precision3)}| ${m.recall10.toFixed(3)}`,
  );
}

function printOverallRow(results: readonly IndexResult[]): void {
  const withQueries = results.filter((r) => r.queries > 0);
  if (withQueries.length <= 1) {
    return;
  }

  const totalQueries = withQueries.reduce((sum, r) => sum + r.queries, 0);
  const weighted = averageMetrics(
    withQueries.flatMap((r) => Array.from({ length: r.queries }, () => r.metrics)),
  );

  console.log(
    `${'OVERALL'.padEnd(13)}| ${String(totalQueries).padEnd(8)}| ${fmt(weighted.mrr)}| ${fmt(weighted.ndcg10)}| ${fmt(weighted.precision3)}| ${weighted.recall10.toFixed(3)}`,
  );
}
