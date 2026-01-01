import type { SearchSubjectSlug } from '../../types/oak';
import type { SequenceFacetProcessingMetrics } from './sequence-facet-index';

/** Metrics entry for a single sequence facet. */
export interface SequenceFacetMetricsEntry extends SequenceFacetProcessingMetrics {
  readonly subject: SearchSubjectSlug;
}

/** Summary of all sequence facet processing metrics. */
export interface SequenceFacetMetricsSummary {
  readonly totalSequences: number;
  readonly includedSequences: number;
  readonly skippedSequences: number;
  readonly totalUnitCount: number;
  readonly totalFetchDurationMs: number;
  readonly totalExtractionDurationMs: number;
  readonly entries: readonly SequenceFacetMetricsEntry[];
}

/** Bulk operation metrics. */
export interface IngestBulkMetrics {
  readonly sequenceFacets: SequenceFacetMetricsSummary;
}

/**
 * Create a collector for sequence facet processing metrics.
 *
 * @returns A collector with record and snapshot methods
 */
export function createSequenceFacetMetricsCollector(): {
  readonly record: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void;
  readonly snapshot: () => IngestBulkMetrics;
} {
  const entries: SequenceFacetMetricsEntry[] = [];
  return {
    record(details) {
      entries.push(details);
    },
    snapshot() {
      const totalSequences = entries.length;
      const includedSequences = entries.filter((entry) => entry.included).length;
      const totalUnitCount = entries.reduce((acc, entry) => acc + entry.unitCount, 0);
      const totalFetchDurationMs = entries.reduce((acc, entry) => acc + entry.fetchDurationMs, 0);
      const totalExtractionDurationMs = entries.reduce(
        (acc, entry) => acc + entry.extractionDurationMs,
        0,
      );
      return {
        sequenceFacets: {
          totalSequences,
          includedSequences,
          skippedSequences: totalSequences - includedSequences,
          totalUnitCount,
          totalFetchDurationMs,
          totalExtractionDurationMs,
          entries,
        },
      } satisfies IngestBulkMetrics;
    },
  };
}

