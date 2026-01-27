/**
 * Benchmark output formatting.
 *
 * Pure functions for formatting benchmark results with status indicators.
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import type { EntryBenchmarkResult } from './benchmark-entry-runner.js';
import { calculateP95 } from './benchmark-stats.js';
import { determineStatus, formatStatusSymbol, type MetricThresholds } from './benchmark-status.js';
import { calculateFilteredAggregate } from './benchmark-filtered.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

/**
 * Zod schema for metric thresholds.
 */
const MetricThresholdsSchema = z.object({
  excellent: z.number(),
  good: z.number(),
  fair: z.number(),
  target: z.number(),
});

/**
 * Zod schema for reference values.
 */
const ReferenceValuesSchema = z.object({
  mrr: MetricThresholdsSchema,
  ndcg10: MetricThresholdsSchema,
  zeroHitRate: MetricThresholdsSchema,
  precision3: MetricThresholdsSchema,
  recall10: MetricThresholdsSchema,
  p95LatencyMs: MetricThresholdsSchema,
});

/**
 * Zod schema for baselines JSON.
 */
const BaselinesJsonSchema = z.object({
  referenceValues: ReferenceValuesSchema,
});

/**
 * Reference thresholds from baselines.json.
 */
export type ReferenceValues = z.infer<typeof ReferenceValuesSchema>;

/**
 * Load reference values from baselines.json.
 */
export function loadReferenceValues(): ReferenceValues {
  const baselinesPath = resolve(thisDir, '../baselines/baselines.json');
  const content = readFileSync(baselinesPath, 'utf-8');
  const parsed: unknown = JSON.parse(content);
  const validated = BaselinesJsonSchema.parse(parsed);
  return validated.referenceValues;
}

/**
 * Format a metric value with its status symbol.
 */
export function formatWithStatus(
  value: number,
  thresholds: MetricThresholds,
  direction: 'higher' | 'lower',
  decimals = 3,
): string {
  const status = determineStatus(value, thresholds, direction);
  const symbol = formatStatusSymbol(status);
  return `${value.toFixed(decimals)}${symbol}`;
}

/**
 * Print detailed per-category results for each entry.
 */
function printDetailedResults(
  results: readonly EntryBenchmarkResult[],
  refs: ReferenceValues,
): void {
  console.log(
    '\n' + '='.repeat(130) + '\nDETAILED PER-CATEGORY RESULTS\n' + '='.repeat(130) + '\n',
  );
  console.log('Status: ✓✓=EXCELLENT  ✓=GOOD  ~=ACCEPTABLE  ✗=BAD\n');
  console.log(
    'Subject'.padEnd(14) +
      ' | Phase'.padEnd(11) +
      ' | Category'.padEnd(22) +
      ' | #Q   | MRR      | NDCG     | P@3      | R@10     | Zero%    | p95ms',
  );
  console.log('-'.repeat(130));

  for (const r of results) {
    printEntryCategories(r, refs);
  }
}

/**
 * Print category rows for a single entry.
 * NOTE: future-intent categories are marked as "(excluded)" since they
 * test capabilities requiring Level 3-4 features not yet implemented.
 */
function printEntryCategories(r: EntryBenchmarkResult, refs: ReferenceValues): void {
  for (const cat of r.perCategory) {
    const row = formatMetricRow(
      cat.mrr,
      cat.ndcg10,
      cat.precision3,
      cat.recall10,
      cat.zeroHitRate,
      cat.p95LatencyMs,
      refs,
    );
    // Mark future-intent queries as excluded from stats
    const categoryLabel = cat.category === 'future-intent' ? 'future-intent (excl)' : cat.category;
    console.log(
      `${r.subject.padEnd(14)} | ${r.phase.padEnd(9)} | ${categoryLabel.padEnd(20)} | ${String(cat.queryCount).padEnd(4)} | ${row}`,
    );
  }
  const p95 = calculateP95(r.latencies);
  const row = formatMetricRow(r.mrr, r.ndcg10, r.precision3, r.recall10, r.zeroHitRate, p95, refs);
  console.log(
    `${r.subject.padEnd(14)} | ${r.phase.padEnd(9)} | ${'AGGREGATE'.padEnd(20)} | ${String(r.queryCount).padEnd(4)} | ${row}`,
  );
  console.log('-'.repeat(130));
}

/**
 * Format a row of metrics with status indicators.
 */
function formatMetricRow(
  mrr: number,
  ndcg: number,
  p3: number,
  r10: number,
  zero: number,
  lat: number,
  refs: ReferenceValues,
): string {
  const mrrStr = formatWithStatus(mrr, refs.mrr, 'higher').padEnd(8);
  const ndcgStr = formatWithStatus(ndcg, refs.ndcg10, 'higher').padEnd(8);
  const p3Str = formatWithStatus(p3, refs.precision3, 'higher').padEnd(8);
  const r10Str = formatWithStatus(r10, refs.recall10, 'higher').padEnd(8);
  const zeroStr = formatWithStatus(zero, refs.zeroHitRate, 'lower').padEnd(8);
  const latStr = formatWithStatus(lat, refs.p95LatencyMs, 'lower', 0);
  return `${mrrStr} | ${ndcgStr} | ${p3Str} | ${r10Str} | ${zeroStr} | ${latStr}`;
}

/**
 * Print aggregate summary table.
 */
function printAggregateSummary(
  results: readonly EntryBenchmarkResult[],
  refs: ReferenceValues,
): void {
  console.log('\n' + '='.repeat(120) + '\nAGGREGATE SUMMARY\n' + '='.repeat(120) + '\n');
  console.log(
    'Subject'.padEnd(20) +
      ' | Phase'.padEnd(12) +
      ' | #Q   | MRR      | NDCG     | P@3      | R@10     | Zero%    | p95ms',
  );
  console.log('-'.repeat(120));
  for (const r of results) {
    const p95 = calculateP95(r.latencies);
    const row = formatMetricRow(
      r.mrr,
      r.ndcg10,
      r.precision3,
      r.recall10,
      r.zeroHitRate,
      p95,
      refs,
    );
    console.log(
      `${r.subject.padEnd(20)} | ${r.phase.padEnd(10)} | ${String(r.queryCount).padEnd(4)} | ${row}`,
    );
  }
  console.log('-'.repeat(120));
}

/**
 * Print overall totals.
 */
function printOverallTotals(results: readonly EntryBenchmarkResult[], refs: ReferenceValues): void {
  const totalQ = results.reduce((s, r) => s + r.queryCount, 0);
  const avgMrr = results.reduce((s, r) => s + r.mrr * r.queryCount, 0) / totalQ;
  const avgNdcg = results.reduce((s, r) => s + r.ndcg10 * r.queryCount, 0) / totalQ;
  const avgP3 = results.reduce((s, r) => s + r.precision3 * r.queryCount, 0) / totalQ;
  const avgR10 = results.reduce((s, r) => s + r.recall10 * r.queryCount, 0) / totalQ;
  const avgZero = results.reduce((s, r) => s + r.zeroHitRate * r.queryCount, 0) / totalQ;
  const allLatencies = results.flatMap((r) => [...r.latencies]);
  const overallP95 = calculateP95(allLatencies);

  const mrrStatus = formatWithStatus(avgMrr, refs.mrr, 'higher');
  const ndcgStatus = formatWithStatus(avgNdcg, refs.ndcg10, 'higher');
  const p3Status = formatWithStatus(avgP3, refs.precision3, 'higher');
  const r10Status = formatWithStatus(avgR10, refs.recall10, 'higher');
  const zeroStatus = formatWithStatus(avgZero, refs.zeroHitRate, 'lower');
  const latStatus = formatWithStatus(overallP95, refs.p95LatencyMs, 'lower', 0);

  console.log(
    `\nOVERALL: ${totalQ} queries | MRR=${mrrStatus} | NDCG=${ndcgStatus} | P@3=${p3Status} | R@10=${r10Status} | Zero=${zeroStatus} | p95=${latStatus}ms`,
  );
}

/** Print filtered aggregate excluding LLM-required categories. */
function printFilteredAggregate(
  results: readonly EntryBenchmarkResult[],
  refs: ReferenceValues,
): void {
  const filtered = calculateFilteredAggregate(results);

  const mrrStatus = formatWithStatus(filtered.mrr, refs.mrr, 'higher');
  const ndcgStatus = formatWithStatus(filtered.ndcg10, refs.ndcg10, 'higher');
  const p3Status = formatWithStatus(filtered.precision3, refs.precision3, 'higher');
  const r10Status = formatWithStatus(filtered.recall10, refs.recall10, 'higher');
  const zeroStatus = formatWithStatus(filtered.zeroHitRate, refs.zeroHitRate, 'lower');
  const latStatus = formatWithStatus(filtered.p95LatencyMs, refs.p95LatencyMs, 'lower', 0);

  console.log(
    `FILTERED (excl. natural-expression): ${filtered.queryCount} queries | MRR=${mrrStatus} | NDCG=${ndcgStatus} | P@3=${p3Status} | R@10=${r10Status} | Zero=${zeroStatus} | p95=${latStatus}ms`,
  );
}

/**
 * Print complete benchmark summary with status indicators.
 */
export function printSummary(results: readonly EntryBenchmarkResult[]): void {
  const refs = loadReferenceValues();
  printDetailedResults(results, refs);
  printAggregateSummary(results, refs);
  printOverallTotals(results, refs);
  printFilteredAggregate(results, refs);
}
