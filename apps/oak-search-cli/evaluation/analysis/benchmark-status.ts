/**
 * Status determination for benchmark metrics.
 *
 * Pure functions that compare measured values against reference thresholds
 * to determine status indicators (EXCELLENT/GOOD/ACCEPTABLE/BAD).
 */

/**
 * Reference thresholds for a metric.
 *
 * These define the boundaries for status classification.
 */
export interface MetricThresholds {
  /** Threshold for EXCELLENT status */
  readonly excellent: number;
  /** Threshold for GOOD status */
  readonly good: number;
  /** Threshold for ACCEPTABLE status (fair) */
  readonly fair: number;
}

/**
 * Status classification for a metric value.
 *
 * Used to indicate at-a-glance whether a measurement meets targets.
 */
export type MetricStatus = 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'BAD';

/**
 * Direction of metric comparison.
 *
 * - `higher`: Higher values are better (MRR, NDCG, Precision, Recall)
 * - `lower`: Lower values are better (Zero-hit rate, Latency)
 */
export type ComparisonDirection = 'higher' | 'lower';

/**
 * Determine status for a metric value based on thresholds.
 *
 * Pure function that classifies a measured value into one of four statuses
 * based on comparison to reference thresholds.
 *
 * @param value - The measured metric value
 * @param thresholds - Reference thresholds (excellent, good, fair)
 * @param direction - Whether higher or lower values are better
 * @returns Status classification
 *
 * @example
 * ```typescript
 * // Higher-is-better metric (MRR)
 * determineStatus(0.85, { excellent: 0.9, good: 0.7, fair: 0.5 }, 'higher');
 * // Returns: 'GOOD'
 *
 * // Lower-is-better metric (zero-hit rate)
 * determineStatus(0.15, { excellent: 0.05, good: 0.1, fair: 0.2 }, 'lower');
 * // Returns: 'ACCEPTABLE'
 * ```
 */
export function determineStatus(
  value: number,
  thresholds: MetricThresholds,
  direction: ComparisonDirection,
): MetricStatus {
  if (direction === 'higher') {
    if (value >= thresholds.excellent) {
      return 'EXCELLENT';
    }
    if (value >= thresholds.good) {
      return 'GOOD';
    }
    if (value >= thresholds.fair) {
      return 'ACCEPTABLE';
    }
    return 'BAD';
  }

  // Lower is better
  if (value <= thresholds.excellent) {
    return 'EXCELLENT';
  }
  if (value <= thresholds.good) {
    return 'GOOD';
  }
  if (value <= thresholds.fair) {
    return 'ACCEPTABLE';
  }
  return 'BAD';
}

/**
 * Status symbol mapping for compact display.
 */
const STATUS_SYMBOLS: Readonly<Record<MetricStatus, string>> = {
  EXCELLENT: '✓✓',
  GOOD: '✓',
  ACCEPTABLE: '~',
  BAD: '✗',
} as const;

/**
 * Format status as a symbol for compact display.
 *
 * @param status - The status to format
 * @returns Single-character symbol representation
 */
export function formatStatusSymbol(status: MetricStatus): string {
  return STATUS_SYMBOLS[status];
}
