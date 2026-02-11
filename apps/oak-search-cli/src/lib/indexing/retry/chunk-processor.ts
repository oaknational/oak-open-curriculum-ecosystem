/**
 * Retry chunk processing logic.
 *
 * @remarks
 * Handles the low-level processing of retry chunks, including error handling
 * and accumulating results across multiple chunks.
 *
 * @module retry/chunk-processor
 */
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from '../bulk-operation-types';
import type { EsTransport, ChunkUploadResult } from './http-retry';
import type { DocumentRetryConfig, RetryAttemptResult } from './types';
import {
  calculateProgressiveChunkDelay,
  chunkOperations,
  MAX_CHUNK_SIZE_BYTES,
} from '../bulk-chunk-utils';

/** Type alias for the chunk upload function signature. */
export type ChunkUploadFn = (
  es: EsTransport,
  chunk: BulkOperations,
  logger: Logger,
) => Promise<ChunkUploadResult>;

/** Sleep for a specified duration. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Context for chunk processing. */
interface ChunkContext {
  readonly attempt: number;
  readonly chunkIndex: number;
  readonly totalChunks: number;
}

/** Accumulator for tracking success count and failed operations. */
interface ChunkAccumulator {
  successCount: number;
  failedOps: BulkOperations;
}

/** Process a single retry chunk upload. */
async function processRetryChunk(
  es: EsTransport,
  chunk: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  context: ChunkContext,
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
  context: ChunkContext,
  acc: ChunkAccumulator,
): Promise<void> {
  const result = await processRetryChunk(es, chunk, attemptChunkUpload, logger, context);
  if ('successCount' in result) {
    acc.successCount += result.successCount;
  }
  acc.failedOps = [...acc.failedOps, ...result.failedOperations];
}

/**
 * Process all retry chunks sequentially with delays.
 *
 * @param es - Elasticsearch transport
 * @param failedOps - Operations that need retry
 * @param attemptChunkUpload - Function to upload a single chunk
 * @param logger - Logger instance
 * @param config - Retry configuration
 * @param attempt - Current retry attempt number (0-indexed)
 * @returns Result with success count and remaining failed operations
 */
export async function processAllRetryChunks(
  es: EsTransport,
  failedOps: BulkOperations,
  attemptChunkUpload: ChunkUploadFn,
  logger: Logger,
  config: DocumentRetryConfig,
  attempt: number,
): Promise<RetryAttemptResult> {
  const chunks = chunkOperations(failedOps, MAX_CHUNK_SIZE_BYTES);
  const acc: ChunkAccumulator = { successCount: 0, failedOps: [] };

  // Calculate progressive chunk delay: increases each retry attempt
  const progressiveChunkDelay = calculateProgressiveChunkDelay(attempt, config.chunkDelayMs);

  // Add initial delay before first retry chunk to let ELSER queue settle
  if (progressiveChunkDelay > 0) {
    logger.debug('Initial retry chunk delay', {
      attempt: attempt + 1,
      delayMs: progressiveChunkDelay,
      reason: 'Allowing ELSER queue to settle before retry',
    });
    await sleep(progressiveChunkDelay);
  }

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
      { attempt, chunkIndex: i, totalChunks: chunks.length },
      acc,
    );

    if (i < chunks.length - 1 && progressiveChunkDelay > 0) {
      await sleep(progressiveChunkDelay);
    }
  }

  return { successCount: acc.successCount, failedOperations: acc.failedOps };
}
