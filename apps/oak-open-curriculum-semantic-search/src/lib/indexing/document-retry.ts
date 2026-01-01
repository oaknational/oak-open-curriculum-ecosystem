/**
 * Document-level retry logic for Elasticsearch bulk operations.
 *
 * @remarks
 * Implements Tier 2 retry: after ALL chunks are processed, retries
 * individual documents that failed with transient errors (HTTP 429, 502, 503, 504).
 *
 * @see ./bulk-chunk-uploader.ts for Tier 1 (HTTP-level) retry
 * @see ADR-096 ES Bulk Retry Strategy
 * @module document-retry
 */
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from './bulk-operation-types';
import type { EsTransport, ChunkUploadResult } from './http-retry';
import {
  calculateBackoffWithJitter,
  chunkOperations,
  MAX_CHUNK_SIZE_BYTES,
} from './bulk-chunk-utils';

/**
 * Result of a single document retry attempt.
 */
interface RetryAttemptResult {
  /** Number of documents successfully indexed in this attempt */
  readonly successCount: number;
  /** Operations that still failed (for next retry attempt) */
  readonly failedOperations: BulkOperations;
}

/**
 * Configuration for document-level retry.
 */
export interface DocumentRetryConfig {
  /** Maximum retry attempts */
  readonly maxRetries: number;
  /** Base delay for exponential backoff in ms */
  readonly retryDelayMs: number;
  /** Delay between chunks in ms */
  readonly chunkDelayMs: number;
}

/**
 * Result of the complete document retry process.
 */
export interface DocumentRetryResult {
  /** Total documents successfully indexed during retry */
  readonly successCount: number;
  /** Operations that permanently failed */
  readonly permanentlyFailed: BulkOperations;
}

/** Sleep for a specified duration. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Type alias for the chunk upload function signature. */
type ChunkUploadFn = (
  es: EsTransport,
  chunk: BulkOperations,
  logger: Logger,
) => Promise<ChunkUploadResult>;

/** Process a single retry chunk upload. */
async function processRetryChunk(
  es: EsTransport,
  chunk: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  context: { attempt: number; chunkIndex: number; totalChunks: number },
): Promise<ChunkUploadResult | { failedOperations: BulkOperations }> {
  try {
    const result = await attemptChunkUpload(es, chunk, logger);
    logger.debug('Retry chunk uploaded', {
      attempt: context.attempt + 1,
      retryChunk: context.chunkIndex + 1,
      of: context.totalChunks,
      succeeded: result.successCount,
      stillFailed: Math.floor(result.failedOperations.length / 2),
    });
    return result;
  } catch (error) {
    logger.warn('Retry chunk failed with transport error', {
      attempt: context.attempt + 1,
      retryChunk: context.chunkIndex + 1,
      error: error instanceof Error ? error.message : String(error),
    });
    return { failedOperations: chunk };
  }
}

/** Process a chunk and accumulate results. */
async function processAndAccumulate(
  es: EsTransport,
  chunk: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  context: { attempt: number; chunkIndex: number; totalChunks: number },
  acc: { successCount: number; failedOps: BulkOperations },
): Promise<void> {
  const result = await processRetryChunk(es, chunk, attemptChunkUpload, logger, context);
  if ('successCount' in result) {
    acc.successCount += result.successCount;
  }
  acc.failedOps = [...acc.failedOps, ...result.failedOperations];
}

/** Process all retry chunks sequentially with delays. */
/** Accumulator for tracking success count and failed operations. */
interface ChunkAccumulator {
  successCount: number;
  failedOps: BulkOperations;
}

async function processAllRetryChunks(
  es: EsTransport,
  chunks: BulkOperations[],
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  config: DocumentRetryConfig,
  attempt: number,
): Promise<RetryAttemptResult> {
  const acc: ChunkAccumulator = { successCount: 0, failedOps: [] };

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) {
      continue;
    }

    await processAndAccumulate(
      es,
      chunk,
      attemptChunkUpload,
      logger,
      {
        attempt,
        chunkIndex: i,
        totalChunks: chunks.length,
      },
      acc,
    );

    if (i < chunks.length - 1 && config.chunkDelayMs > 0) {
      await sleep(config.chunkDelayMs);
    }
  }

  return { successCount: acc.successCount, failedOperations: acc.failedOps };
}

/** Execute a single document retry attempt. */
async function executeRetryAttempt(
  es: EsTransport,
  failedOps: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  config: DocumentRetryConfig,
  attempt: number,
): Promise<RetryAttemptResult> {
  const backoffMs = calculateBackoffWithJitter(attempt, config.retryDelayMs);
  logger.debug('Waiting before document retry', {
    attempt: attempt + 1,
    maxAttempts: config.maxRetries,
    backoffMs,
    documentsToRetry: Math.floor(failedOps.length / 2),
  });
  await sleep(backoffMs);

  const retryChunks = chunkOperations(failedOps, MAX_CHUNK_SIZE_BYTES);
  const result = await processAllRetryChunks(
    es,
    retryChunks,
    attemptChunkUpload,
    logger,
    config,
    attempt,
  );

  logger.info('Document retry attempt completed', {
    attempt: attempt + 1,
    maxAttempts: config.maxRetries,
    succeeded: result.successCount,
    remainingFailed: Math.floor(result.failedOperations.length / 2),
  });

  return result;
}

/**
 * Execute document-level retry for failed operations.
 *
 * @remarks
 * This is Tier 2 retry: after all initial chunks are uploaded, retries
 * documents that failed with transient errors. Uses exponential backoff
 * between attempts to allow ELSER queue to drain.
 *
 * @param es - Elasticsearch transport
 * @param failedOperations - Operations that failed in initial upload
 * @param attemptChunkUpload - Function to upload a single chunk (injected for testability)
 * @param logger - Logger instance
 * @param config - Retry configuration
 * @returns Total successes and permanently failed operations
 *
 * @see ADR-096 ES Bulk Retry Strategy
 */
export async function executeDocumentRetry(
  es: EsTransport,
  failedOperations: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  config: DocumentRetryConfig,
): Promise<DocumentRetryResult> {
  logger.info('Starting document-level retry for failed operations', {
    failedDocuments: Math.floor(failedOperations.length / 2),
    maxRetries: config.maxRetries,
  });

  let currentFailedOps = failedOperations;
  let totalSuccessCount = 0;

  for (let attempt = 0; attempt < config.maxRetries && currentFailedOps.length > 0; attempt++) {
    const result = await executeRetryAttempt(
      es,
      currentFailedOps,
      attemptChunkUpload,
      logger,
      config,
      attempt,
    );
    totalSuccessCount += result.successCount;
    currentFailedOps = result.failedOperations;
  }

  // Log final status
  if (currentFailedOps.length > 0) {
    logger.error('Some documents failed after all retry attempts', {
      permanentlyFailed: Math.floor(currentFailedOps.length / 2),
      totalSucceeded: totalSuccessCount,
    });
  }

  return {
    successCount: totalSuccessCount,
    permanentlyFailed: currentFailedOps,
  };
}
