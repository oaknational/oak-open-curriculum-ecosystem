/**
 * Batch processing logic for ingestion harness.
 *
 * Handles batch-by-batch ingestion with incremental dispatch to Elasticsearch.
 */

import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from './bulk-operation-types';
import type { DataIntegrityReport } from './data-integrity-report';
import { createDataIntegrityCollector } from './data-integrity-report';
import {
  rewriteBulkOperations,
  type SearchIndexTarget,
  type SearchIndexKind,
} from '../search-index-target';
import { filterOperationsByIndex } from './ingest-harness-filtering';
import {
  dispatchBulk,
  logDataIntegrityIssues,
  logPreview,
  logSummary,
  summariseOperations,
  type EsTransport,
} from './ingest-harness-ops';
import {
  createSequenceFacetMetricsCollector,
  type IngestBulkMetrics,
} from './ingest-harness-metrics';
import {
  generateIndexBatches,
  type BatchGranularity,
  type IngestionBatch,
} from '../index-batch-generator';
import type { OakClient } from '../../adapters/oak-adapter';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';

// ============================================================================
// Types
// ============================================================================

/** Context for batch ingestion operations. */
export interface BatchIngestionContext {
  readonly client: OakClient;
  readonly keyStages: readonly KeyStage[];
  readonly subjects: readonly SearchSubjectSlug[];
  readonly indexes: readonly SearchIndexKind[];
  readonly target: SearchIndexTarget;
  readonly es: EsTransport;
  readonly logger: Logger;
  readonly granularity: BatchGranularity;
}

/** Options for ingestion. */
export interface IngestionOptions {
  readonly dryRun?: boolean;
  readonly verbose?: boolean;
}

/** State accumulated during batch processing. */
interface BatchProcessingState {
  readonly allOps: BulkOperations;
  readonly dataIntegrityReport: DataIntegrityReport;
  batchCount: number;
  dispatchedDocs: number;
}

/** Result of a bulk ingestion. */
export interface BulkIngestionResult {
  readonly operations: BulkOperations;
  readonly summary: {
    readonly target: SearchIndexTarget;
    readonly totalDocs: number;
    readonly counts: Record<SearchIndexKind, number>;
  };
  readonly metrics?: IngestBulkMetrics;
  readonly dataIntegrityReport?: DataIntegrityReport;
}

// ============================================================================
// Batch Processing
// ============================================================================

/**
 * Merges data integrity reports from batches into a collector.
 */
export function mergeDataIntegrityReport(
  target: DataIntegrityReport,
  source: DataIntegrityReport,
): void {
  target.skippedUnits.push(...source.skippedUnits);
  target.skippedLessonGroups.push(...source.skippedLessonGroups);
  target.skippedLessons.push(...source.skippedLessons);
}

/**
 * Formats a human-readable label for a batch.
 */
export function formatBatchLabel(batch: IngestionBatch): string {
  if (batch.kind === 'threads') {
    return 'threads';
  }
  if (batch.subject && batch.keyStage) {
    return `${batch.subject}/${batch.keyStage}`;
  }
  if (batch.subject) {
    return batch.subject;
  }
  return 'all';
}

/**
 * Process a single batch: filter, dispatch, and update state.
 */
export async function processSingleBatch(
  batch: IngestionBatch,
  context: BatchIngestionContext,
  state: BatchProcessingState,
  dryRun: boolean,
): Promise<void> {
  state.batchCount++;
  const targetedOps = rewriteBulkOperations(batch.operations, context.target);
  const filteredOps = filterOperationsByIndex(targetedOps, context.indexes);
  state.allOps.push(...filteredOps);

  if (batch.kind === 'curriculum') {
    mergeDataIntegrityReport(state.dataIntegrityReport, batch.dataIntegrityReport);
  }

  const batchLabel = formatBatchLabel(batch);
  const batchDocCount = filteredOps.length / 2;
  context.logger.info(`BATCH ${state.batchCount}: ${batchLabel} | docs=${batchDocCount}`);

  if (!dryRun && filteredOps.length > 0) {
    await dispatchBulk(context.es, filteredOps, context.logger);
    state.dispatchedDocs += batchDocCount;
    context.logger.info(
      `BATCH ${state.batchCount}: ${batchLabel} | COMMITTED | cumulative=${state.dispatchedDocs}`,
    );
  }
}

/**
 * Creates initial batch processing state.
 */
export function createBatchProcessingState(): BatchProcessingState {
  return {
    allOps: [],
    dataIntegrityReport: createDataIntegrityCollector(),
    batchCount: 0,
    dispatchedDocs: 0,
  };
}

/**
 * Builds the final ingestion result and logs summary.
 */
export function buildIngestionResult(
  context: BatchIngestionContext,
  state: BatchProcessingState,
  metrics: IngestBulkMetrics,
  dryRun: boolean,
  verbose: boolean,
): BulkIngestionResult {
  const summary = summariseOperations(state.allOps, context.target);
  const result: BulkIngestionResult = {
    operations: state.allOps,
    summary,
    metrics,
    dataIntegrityReport: state.dataIntegrityReport,
  };

  logSummary(
    context.logger,
    dryRun ? 'ingest.prepared' : 'ingest.completed',
    context.target,
    summary,
    dryRun,
    result.metrics,
  );

  if (verbose) {
    logPreview(context.logger, context.target, state.allOps);
  }

  return result;
}

/**
 * Runs batch-by-batch ingestion.
 */
export async function runBatchIngestion(
  context: BatchIngestionContext,
  options: IngestionOptions = {},
): Promise<BulkIngestionResult> {
  const dryRun = options.dryRun ?? false;
  const verbose = options.verbose ?? false;
  const metricsCollector = createSequenceFacetMetricsCollector();
  const state = createBatchProcessingState();

  try {
    for await (const batch of generateIndexBatches({
      client: context.client,
      subjects: context.subjects,
      keyStages: context.keyStages,
      granularity: context.granularity,
      onSequenceFacetProcessed: metricsCollector.record,
    })) {
      await processSingleBatch(batch, context, state, dryRun);
    }

    return buildIngestionResult(context, state, metricsCollector.snapshot(), dryRun, verbose);
  } finally {
    logDataIntegrityIssues(context.logger, state.dataIntegrityReport);
  }
}
