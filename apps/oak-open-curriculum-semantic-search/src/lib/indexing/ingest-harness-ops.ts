import type { Logger } from '@oaknational/mcp-logger';
import type { SearchIndexKind, SearchIndexTarget } from '../search-index-target';
import { ingestLogger } from '../logger';
import {
  hasDataIntegrityIssues,
  getDataIntegritySummary,
  type DataIntegrityReport,
} from './data-integrity-report';
import type { BulkOperations } from './bulk-operation-types';
import { isBulkIndexAction } from './bulk-operation-types';
import { chunkOperations, MAX_CHUNK_SIZE_BYTES } from './bulk-chunk-utils';
import { uploadAllChunks, type EsTransport, type BulkUploadConfig } from './bulk-chunk-uploader';

export type { EsTransport, BulkUploadConfig } from './bulk-chunk-uploader';
export { createNdjson } from './bulk-chunk-utils';

const KIND_BY_INDEX = new Map<string, SearchIndexKind>([
  ['oak_lessons', 'lessons'],
  ['oak_unit_rollup', 'unit_rollup'],
  ['oak_units', 'units'],
  ['oak_sequences', 'sequences'],
  ['oak_sequence_facets', 'sequence_facets'],
  ['oak_threads', 'threads'],
]);

const SANDBOX_KIND_BY_INDEX: Record<string, SearchIndexKind> = {
  oak_lessons_sandbox: 'lessons',
  oak_unit_rollup_sandbox: 'unit_rollup',
  oak_units_sandbox: 'units',
  oak_sequences_sandbox: 'sequences',
  oak_sequence_facets_sandbox: 'sequence_facets',
  oak_threads_sandbox: 'threads',
};

/**
 * Determines the search index kind for a bulk target, covering canonical and sandbox names.
 */
export function inferKindFromIndex(indexName: string): SearchIndexKind | null {
  if (KIND_BY_INDEX.has(indexName)) {
    return KIND_BY_INDEX.get(indexName) ?? null;
  }
  return SANDBOX_KIND_BY_INDEX[indexName] ?? null;
}

/**
 * Reduces a bulk operation list into per-index counts and total document volume.
 */
export function summariseOperations(
  operations: BulkOperations,
  target: SearchIndexTarget,
): { target: SearchIndexTarget; totalDocs: number; counts: Record<SearchIndexKind, number> } {
  const counts: Record<SearchIndexKind, number> = {
    lessons: 0,
    unit_rollup: 0,
    units: 0,
    sequences: 0,
    sequence_facets: 0,
    threads: 0,
  };

  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    if (!isBulkIndexAction(action)) {
      continue;
    }
    const kind = inferKindFromIndex(action.index._index);
    if (kind) {
      counts[kind] += 1;
    }
  }

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const totalDocs = Object.values(counts).reduce((acc, value) => acc + value, 0);
  return { target, totalDocs, counts };
}

/**
 * Dispatches the prepared NDJSON payload against the provided Elasticsearch transport.
 * Automatically chunks large payloads to stay under ES HTTP body limits.
 *
 * @param es - Elasticsearch transport
 * @param operations - Bulk operations to dispatch
 * @param logger - Logger instance
 * @param config - Optional upload configuration (retry settings, delays)
 *
 * @see uploadAllChunks for retry behavior
 * @see BulkUploadConfig for configuration options
 */
export async function dispatchBulk(
  es: EsTransport,
  operations: BulkOperations,
  logger: Logger = ingestLogger,
  config: BulkUploadConfig = {},
): Promise<void> {
  const docCount = Math.floor(operations.length / 2);
  // Estimate size by sampling first 100 operations to avoid stringifying entire array
  const sampleSize = Math.min(100, operations.length);
  const sampleBytes = operations
    .slice(0, sampleSize)
    .reduce((acc, op) => acc + JSON.stringify(op).length, 0);
  const estimatedTotalBytes = (sampleBytes / sampleSize) * operations.length;
  logger.info('Starting bulk upload to Elasticsearch', {
    documents: docCount,
    operations: operations.length,
    estimatedSizeMB: (estimatedTotalBytes / 1024 / 1024).toFixed(1),
    retryConfig: {
      documentRetryEnabled: config.documentRetryEnabled ?? true,
      documentMaxRetries: config.documentMaxRetries,
      documentRetryDelayMs: config.documentRetryDelayMs,
    },
  });
  const chunks = chunkOperations(operations, MAX_CHUNK_SIZE_BYTES);
  logger.info('Bulk upload chunked', {
    chunks: chunks.length,
    maxChunkSizeMB: MAX_CHUNK_SIZE_BYTES / 1024 / 1024,
  });
  const startTime = Date.now();
  const totalUploaded = await uploadAllChunks(es, chunks, logger, docCount, config);
  const durationMs = Date.now() - startTime;
  logger.info('Bulk upload completed successfully', {
    documents: totalUploaded,
    chunks: chunks.length,
    durationMs,
    durationSeconds: (durationMs / 1000).toFixed(1),
  });
}

/**
 * Emits a structured summary of the bulk operation outcome to the provided logger.
 */
export function logSummary(
  logger: Logger,
  event: string,
  target: SearchIndexTarget,
  summary: { totalDocs: number; counts: Record<SearchIndexKind, number> },
  dryRun: boolean,
  metrics?: unknown,
): void {
  logger.info(event, {
    target,
    totalDocs: summary.totalDocs,
    counts: summary.counts,
    dryRun,
    metrics,
  });
}

/**
 * Emits a verbose preview of the first few lines in the NDJSON payload.
 */
export function logPreview(
  logger: Logger,
  target: SearchIndexTarget,
  operations: BulkOperations,
): void {
  if (operations.length === 0) {
    return;
  }
  logger.debug('ingest.preview', {
    target,
    preview: operations.slice(0, 4).map((entry) => JSON.stringify(entry)),
  });
}

/** Logs data integrity issues if any were detected during ingestion. */
export function logDataIntegrityIssues(
  logger: Logger,
  report: DataIntegrityReport | undefined,
): void {
  if (!report || !hasDataIntegrityIssues(report)) {
    return;
  }
  const summary = getDataIntegritySummary(report);
  logger.warn('Data integrity issues detected during ingestion', {
    totalSkippedUnits: summary.totalSkippedUnits,
    totalSkippedLessons: summary.totalSkippedLessons,
    affectedSubjects: Array.from(summary.affectedSubjects),
    affectedKeyStages: Array.from(summary.affectedKeyStages),
    skippedUnits: report.skippedUnits,
    skippedLessonGroups: report.skippedLessonGroups,
  });
}
