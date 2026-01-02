/**
 * Orchestrates uploading of bulk operations to Elasticsearch.
 *
 * @remarks
 * Implements a two-tier retry strategy aligned with ADR-070:
 * - **Tier 1** (HTTP-level): Retries entire chunk on transport errors
 * - **Tier 2** (document-level): Retries individual documents that fail with
 *   transient errors (e.g., HTTP 429 from ELSER queue overflow)
 *
 * Rate limiting between chunks prevents ELSER memory pressure.
 *
 * @see ./retry for retry logic
 * @see ADR-070 SDK Rate Limiting and Retry
 * @module bulk-chunk-uploader
 */
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from './bulk-operation-types';
import {
  DEFAULT_CHUNK_DELAY_MS,
  HTTP_MAX_RETRY_ATTEMPTS,
  HTTP_BASE_RETRY_DELAY_MS,
} from './bulk-chunk-utils';
import {
  executeDocumentRetry,
  attemptChunkUpload,
  uploadChunkWithRetry,
  type EsTransport,
} from './retry';

// Re-export for consumers
export type { EsTransport, ChunkUploadResult } from './retry';

/**
 * Result of a bulk upload operation.
 *
 * @remarks
 * Preserves information about both successes and failures so callers can:
 * 1. Report accurate success counts
 * 2. Access failed documents for targeted retry or reporting
 *
 * The `permanentlyFailed` field contains the raw bulk operations that failed
 * after all retry attempts. Use `extractDocumentIds` to get human-readable IDs.
 */
export interface BulkUploadResult {
  /** Number of documents successfully indexed */
  readonly successCount: number;
  /** Operations that permanently failed after all retries */
  readonly permanentlyFailed: BulkOperations;
}

/**
 * Configuration for bulk upload behaviour.
 *
 * @remarks
 * Supports two levels of retry:
 * - HTTP-level retry (maxRetries): Retries entire chunk on transport errors
 * - Document-level retry (documentRetryEnabled): Retries failed documents
 *   after all chunks are processed
 *
 * @example
 * ```typescript
 * const config: BulkUploadConfig = {
 *   chunkDelayMs: 2000,        // Delay between chunks
 *   documentRetryEnabled: true, // Enable document-level retry
 *   documentMaxRetries: 3,      // Retry failed documents up to 3 times
 *   documentRetryDelayMs: 5000, // Base delay for document retries
 * };
 * ```
 *
 * @see ADR-070 SDK Rate Limiting and Retry
 */
export interface BulkUploadConfig {
  /** Delay between chunks in ms (default: 4000ms) */
  readonly chunkDelayMs?: number;
  /** Maximum HTTP-level retry attempts per chunk (default: 3) */
  readonly maxRetries?: number;
  /** Base delay for HTTP-level exponential backoff in ms (default: 1000ms) */
  readonly baseRetryDelayMs?: number;
  /** Enable document-level retry for transient failures (default: true) */
  readonly documentRetryEnabled?: boolean;
  /** Maximum document-level retry attempts (default: 3) */
  readonly documentMaxRetries?: number;
  /** Base delay for document-level exponential backoff in ms (default: 5000ms) */
  readonly documentRetryDelayMs?: number;
}

/** Default delay for document-level retries in milliseconds. */
const DEFAULT_DOCUMENT_RETRY_DELAY_MS = 5000;

/** Default number of document-level retry attempts. */
const DEFAULT_DOCUMENT_MAX_RETRIES = 4;

/** Resolved configuration with all defaults applied. */
interface ResolvedConfig {
  readonly chunkDelayMs: number;
  readonly maxRetries: number;
  readonly baseRetryDelayMs: number;
  readonly documentRetryEnabled: boolean;
  readonly documentMaxRetries: number;
  readonly documentRetryDelayMs: number;
}

/** Sleep for a specified duration. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolves upload configuration with defaults. */
function resolveConfig(config: BulkUploadConfig): ResolvedConfig {
  return {
    chunkDelayMs: config.chunkDelayMs ?? DEFAULT_CHUNK_DELAY_MS,
    maxRetries: config.maxRetries ?? HTTP_MAX_RETRY_ATTEMPTS,
    baseRetryDelayMs: config.baseRetryDelayMs ?? HTTP_BASE_RETRY_DELAY_MS,
    documentRetryEnabled: config.documentRetryEnabled ?? true,
    documentMaxRetries: config.documentMaxRetries ?? DEFAULT_DOCUMENT_MAX_RETRIES,
    documentRetryDelayMs: config.documentRetryDelayMs ?? DEFAULT_DOCUMENT_RETRY_DELAY_MS,
  };
}

/** Upload initial chunks and collect failed operations. */
async function uploadInitialChunks(
  es: EsTransport,
  chunks: BulkOperations[],
  logger: Logger,
  docCount: number,
  config: ResolvedConfig,
): Promise<{ totalUploaded: number; allFailedOperations: BulkOperations }> {
  let totalUploaded = 0;
  let allFailedOperations: BulkOperations = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) {
      continue;
    }

    const result = await uploadChunkWithRetry(es, chunk, i, chunks.length, logger, config);
    totalUploaded += result.successCount;

    if (result.failedOperations.length > 0) {
      allFailedOperations = [...allFailedOperations, ...result.failedOperations];
    }

    logger.debug('Chunk uploaded', {
      chunk: i + 1,
      totalUploaded,
      of: docCount,
      failedInChunk: Math.floor(result.failedOperations.length / 2),
    });

    if (i < chunks.length - 1 && config.chunkDelayMs > 0) {
      await sleep(config.chunkDelayMs);
    }
  }

  return { totalUploaded, allFailedOperations };
}

/**
 * Upload all chunks sequentially to Elasticsearch with rate limiting and retry.
 *
 * @remarks
 * Implements a two-tier retry strategy:
 *
 * **Tier 1 (HTTP-level)**: Each chunk upload retries on transport errors
 * (network issues, timeouts) with exponential backoff.
 *
 * **Tier 2 (document-level)**: After ALL chunks are processed, any documents
 * that failed with retryable errors (HTTP 429 from ELSER queue overflow,
 * 502, 503, 504) are collected and re-uploaded in batches.
 *
 * @param es - Elasticsearch transport
 * @param chunks - Array of operation chunks
 * @param logger - Logger instance
 * @param docCount - Total document count for progress logging
 * @param config - Upload configuration (delays, retries)
 * @returns Result containing success count and any permanently failed operations
 *
 * @example
 * ```typescript
 * const result = await uploadAllChunks(es, chunks, logger, 1000, {
 *   chunkDelayMs: 2000,
 *   documentRetryEnabled: true,
 *   documentMaxRetries: 3,
 * });
 * console.log(`Uploaded: ${result.successCount}`);
 * if (result.permanentlyFailed.length > 0) {
 *   // Handle or report failures
 * }
 * ```
 *
 * @see uploadChunkWithRetry for Tier 1 retry
 * @see executeDocumentRetry for Tier 2 retry
 * @see ADR-070 SDK Rate Limiting and Retry
 */
export async function uploadAllChunks(
  es: EsTransport,
  chunks: BulkOperations[],
  logger: Logger,
  docCount: number,
  config: BulkUploadConfig = {},
): Promise<BulkUploadResult> {
  const resolved = resolveConfig(config);

  // Phase 1: Upload initial chunks with HTTP-level retry
  const { totalUploaded, allFailedOperations } = await uploadInitialChunks(
    es,
    chunks,
    logger,
    docCount,
    resolved,
  );

  // Phase 2: Document-level retry for transient failures
  if (!resolved.documentRetryEnabled || allFailedOperations.length === 0) {
    if (allFailedOperations.length > 0) {
      logger.warn('Document-level retry disabled, some documents not indexed', {
        failedDocuments: Math.floor(allFailedOperations.length / 2),
      });
    }
    return { successCount: totalUploaded, permanentlyFailed: allFailedOperations };
  }

  const retryResult = await executeDocumentRetry(
    es,
    allFailedOperations,
    attemptChunkUpload,
    logger,
    {
      maxRetries: resolved.documentMaxRetries,
      retryDelayMs: resolved.documentRetryDelayMs,
      chunkDelayMs: resolved.chunkDelayMs,
    },
  );

  return {
    successCount: totalUploaded + retryResult.successCount,
    permanentlyFailed: retryResult.permanentlyFailed,
  };
}
