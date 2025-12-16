/**
 * Pure functions for analysing and formatting experiment results.
 */

import type { AccumulatedMetrics, ExperimentResult, ResultComparison } from './types';

/**
 * Calculate average values from accumulated metrics.
 *
 * @param name - Name of the experiment
 * @param metrics - Accumulated metrics from experiment run
 * @returns Experiment result with calculated averages
 */
export function calculateAverages(name: string, metrics: AccumulatedMetrics): ExperimentResult {
  const avgMRR = metrics.mrrs.reduce((a, b) => a + b, 0) / metrics.mrrs.length;
  const avgNDCG = metrics.ndcgs.reduce((a, b) => a + b, 0) / metrics.ndcgs.length;
  const avgLatency =
    metrics.latencies.length > 0
      ? metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length
      : 0;

  return {
    name,
    avgMRR,
    avgNDCG,
    avgLatency,
    errors: metrics.errors,
  };
}

/**
 * Format an experiment result as a table row.
 *
 * @param result - Experiment result to format
 * @returns Formatted string for table display
 */
export function formatResultRow(result: ExperimentResult): string {
  const mrrStr = result.avgMRR.toFixed(3);
  const ndcgStr = result.avgNDCG.toFixed(3);
  const latStr = `${result.avgLatency.toFixed(0)}ms`.padEnd(7);

  return `${result.name.padEnd(22)}| ${mrrStr} | ${ndcgStr}   | ${latStr} | ${result.errors}`;
}

/**
 * Compare two experiment results.
 *
 * @param baseline - Baseline result to compare against
 * @param variant - Variant result to compare
 * @returns Comparison showing differences
 */
export function compareResults(
  baseline: ExperimentResult,
  variant: ExperimentResult,
): ResultComparison {
  return {
    mrrDiff: variant.avgMRR - baseline.avgMRR,
    ndcgDiff: variant.avgNDCG - baseline.avgNDCG,
  };
}
