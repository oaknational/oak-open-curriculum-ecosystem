/**
 * Statistical functions for benchmark analysis.
 *
 * Pure functions for calculating aggregate statistics from benchmark results.
 *
 * @packageDocumentation
 */

/**
 * Calculate the 95th percentile of a latency distribution.
 *
 * The 95th percentile (p95) indicates that 95% of queries complete
 * within this time. It's more useful than average because it excludes
 * the slowest 5% of outliers while still capturing the tail.
 *
 * @param latencies - Array of latency values in milliseconds
 * @returns The p95 latency value, or 0 for empty input
 *
 * @example
 * ```typescript
 * // 100 queries with varying latencies
 * const latencies = [100, 150, 120, 500, 110, ...];
 * const p95 = calculateP95(latencies);
 * console.log(`95% of queries complete within ${p95}ms`);
 * ```
 */
export function calculateP95(latencies: readonly number[]): number {
  if (latencies.length === 0) {
    return 0;
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * 0.95);
  const clampedIndex = Math.min(index, sorted.length - 1);
  const result = sorted[clampedIndex];

  // Type guard: sorted array access should always return a number
  if (result === undefined) {
    return 0;
  }

  return result;
}
