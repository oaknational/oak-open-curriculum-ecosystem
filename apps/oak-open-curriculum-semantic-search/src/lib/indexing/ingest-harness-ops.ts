import type { Logger } from '@oaknational/mcp-logger';
import type { SearchIndexKind, SearchIndexTarget } from '../search-index-target';
import { ingestLogger } from '../logger';
import {
  hasDataIntegrityIssues,
  getDataIntegritySummary,
  type DataIntegrityReport,
} from './data-integrity-report';
import { BulkResponseSchema, logBulkErrors } from './sandbox-bulk-response';
import type { BulkOperations } from './bulk-operation-types';
import { isBulkIndexAction } from './bulk-operation-types';

/**
 * Minimal Elasticsearch transport interface for bulk operations.
 * Defines only the request method needed for bulk uploads.
 */
export interface EsTransport {
  readonly transport: {
    request(
      params: { method: string; path: string; body: string },
      options?: unknown,
    ): Promise<unknown>;
  };
}

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
 * Serialises a bulk operation array into NDJSON suitable for the Elasticsearch bulk API.
 */
export function createNdjson(operations: BulkOperations): string {
  return operations.map((entry) => JSON.stringify(entry)).join('\n') + '\n';
}

/** Maximum chunk size in bytes for bulk uploads (50MB to stay under ES limit). */
const MAX_CHUNK_SIZE_BYTES = 50 * 1024 * 1024;

/**
 * Splits bulk operations into chunks that don't exceed the size limit.
 *
 * @remarks
 * Each operation pair (action + document) is kept together. Chunks are split
 * based on estimated serialized size to stay under ES HTTP body limits.
 *
 * @param operations - Full list of bulk operations
 * @param maxSizeBytes - Maximum chunk size in bytes
 * @returns Array of operation chunks
 */
function chunkOperations(operations: BulkOperations, maxSizeBytes: number): BulkOperations[] {
  const chunks: BulkOperations[] = [];
  let currentChunk: BulkOperations = [];
  let currentSize = 0;

  // Process in pairs (action + document)
  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    const doc = operations[i + 1];
    if (action === undefined || doc === undefined) {
      continue;
    }

    const pairSize = JSON.stringify(action).length + JSON.stringify(doc).length + 2; // +2 for newlines

    if (currentSize + pairSize > maxSizeBytes && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentSize = 0;
    }

    currentChunk.push(action, doc);
    currentSize += pairSize;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Dispatches the prepared NDJSON payload against the provided Elasticsearch transport.
 * Automatically chunks large payloads to stay under ES HTTP body limits.
 * Logs progress before/after upload and errors if any bulk operations fail.
 */
export async function dispatchBulk(
  es: EsTransport,
  operations: BulkOperations,
  logger: Logger = ingestLogger,
): Promise<void> {
  const docCount = Math.floor(operations.length / 2);
  const sizeKB = Math.round(JSON.stringify(operations).length / 1024);
  const sizeMB = (sizeKB / 1024).toFixed(1);

  logger.info('Starting bulk upload to Elasticsearch', {
    documents: docCount,
    operations: operations.length,
    estimatedSizeMB: sizeMB,
  });

  const chunks = chunkOperations(operations, MAX_CHUNK_SIZE_BYTES);
  logger.info('Bulk upload chunked', {
    chunks: chunks.length,
    maxChunkSizeMB: MAX_CHUNK_SIZE_BYTES / 1024 / 1024,
  });

  const startTime = Date.now();
  let totalUploaded = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk === undefined) {
      continue;
    }
    const chunkDocs = Math.floor(chunk.length / 2);
    const chunkSizeKB = Math.round(JSON.stringify(chunk).length / 1024);

    logger.debug('Uploading chunk', {
      chunk: i + 1,
      of: chunks.length,
      documents: chunkDocs,
      sizeKB: chunkSizeKB,
    });

    const ndjson = createNdjson(chunk);
    const rawResponse = await es.transport.request(
      { method: 'POST', path: '/_bulk', body: ndjson },
      { headers: { 'content-type': 'application/x-ndjson' } },
    );
    const parseResult = BulkResponseSchema.safeParse(rawResponse);
    if (!parseResult.success) {
      throw new Error(`Invalid bulk response from Elasticsearch: ${parseResult.error.message}`);
    }
    const response = parseResult.data;

    if (response.errors) {
      logBulkErrors(response, logger);
    }

    totalUploaded += chunkDocs;
    logger.debug('Chunk uploaded', { chunk: i + 1, totalUploaded, of: docCount });
  }

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
