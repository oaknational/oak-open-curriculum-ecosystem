/**
 * Document-level retry orchestration for Elasticsearch bulk operations.
 *
 * @remarks
 * Implements Tier 2 retry: after ALL chunks are processed, retries
 * individual documents that failed with transient errors (HTTP 429, 502, 503, 504).
 *
 * @see ../bulk-chunk-uploader.ts for Tier 1 (HTTP-level) retry
 * @see ADR-096 ES Bulk Retry Strategy
 */
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from '../bulk-operation-types';
import { extractDocumentIds } from '../bulk-operation-types';
import type { EsTransport } from './http-retry';
import type { DocumentRetryConfig, DocumentRetryResult, RetryAttemptResult } from './types';
import { type ChunkUploadFn, processAllRetryChunks, sleep } from './chunk-processor';
import { calculateBackoffWithJitter } from '../bulk-chunk-utils';

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

  const result = await processAllRetryChunks(
    es,
    failedOps,
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

  // Log final status including failed document IDs
  if (currentFailedOps.length > 0) {
    const failedDocumentIds = extractDocumentIds(currentFailedOps);
    logger.error('Some documents failed after all retry attempts', {
      permanentlyFailed: Math.floor(currentFailedOps.length / 2),
      totalSucceeded: totalSuccessCount,
      failedDocumentIds,
    });
  }

  return {
    successCount: totalSuccessCount,
    permanentlyFailed: currentFailedOps,
  };
}
