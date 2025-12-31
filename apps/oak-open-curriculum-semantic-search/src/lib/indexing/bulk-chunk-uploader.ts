/**
 * Handles chunking and uploading of bulk operations to Elasticsearch.
 *
 * @module bulk-chunk-uploader
 */
import type { Logger } from '@oaknational/mcp-logger';
import { BulkResponseSchema, logBulkErrors } from './sandbox-bulk-response';
import type { BulkOperations } from './bulk-operation-types';

/**
 * Serialises a bulk operation array into NDJSON suitable for the Elasticsearch bulk API.
 */
export function createNdjson(operations: BulkOperations): string {
  return operations.map((entry) => JSON.stringify(entry)).join('\n') + '\n';
}

/**
 * Minimal Elasticsearch transport interface for bulk operations.
 */
export interface EsTransport {
  readonly transport: {
    request(
      params: { method: string; path: string; body: string },
      options?: unknown,
    ): Promise<unknown>;
  };
}

/** Maximum chunk size in bytes for bulk uploads (50MB to stay under ES limit). */
export const MAX_CHUNK_SIZE_BYTES = 50 * 1024 * 1024;

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
export function chunkOperations(
  operations: BulkOperations,
  maxSizeBytes: number,
): BulkOperations[] {
  const chunks: BulkOperations[] = [];
  let currentChunk: BulkOperations = [];
  let currentSize = 0;

  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    const doc = operations[i + 1];
    if (action === undefined || doc === undefined) {
      continue;
    }

    const pairSize = JSON.stringify(action).length + JSON.stringify(doc).length + 2;

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

/** Process a single chunk upload */
async function uploadChunk(
  es: EsTransport,
  chunk: BulkOperations,
  index: number,
  total: number,
  logger: Logger,
): Promise<number> {
  const chunkDocs = Math.floor(chunk.length / 2);
  logger.debug('Uploading chunk', {
    chunk: index + 1,
    of: total,
    documents: chunkDocs,
    sizeKB: Math.round(JSON.stringify(chunk).length / 1024),
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
  if (parseResult.data.errors) {
    logBulkErrors(parseResult.data, logger);
  }
  return chunkDocs;
}

/**
 * Upload all chunks sequentially to Elasticsearch.
 *
 * @param es - Elasticsearch transport
 * @param chunks - Array of operation chunks
 * @param logger - Logger instance
 * @param docCount - Total document count for progress logging
 * @returns Total documents uploaded
 */
export async function uploadAllChunks(
  es: EsTransport,
  chunks: BulkOperations[],
  logger: Logger,
  docCount: number,
): Promise<number> {
  let totalUploaded = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk) {
      totalUploaded += await uploadChunk(es, chunk, i, chunks.length, logger);
      logger.debug('Chunk uploaded', { chunk: i + 1, totalUploaded, of: docCount });
    }
  }
  return totalUploaded;
}
