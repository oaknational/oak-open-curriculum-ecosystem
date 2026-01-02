/**
 * HTTP-level retry logic for Elasticsearch bulk operations.
 *
 * @remarks
 * Implements Tier 1 retry: retries entire chunk on transport errors
 * (network issues, timeouts) with exponential backoff and jitter.
 *
 * @see ./document-retry.ts for Tier 2 (document-level) retry
 * @see ADR-070 SDK Rate Limiting and Retry
 * @module retry/http-retry
 */
import type { Logger } from '@oaknational/mcp-logger';
import type { BulkOperations } from '../bulk-operation-types';
import type { BulkResponse } from '../sandbox-bulk-response';
import { BulkResponseSchema, logBulkErrors } from '../sandbox-bulk-response';
import { calculateBackoffWithJitter, createNdjson } from '../bulk-chunk-utils';
import { extractFailedOperations } from '../bulk-retry-utils';

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

/**
 * Result of uploading a single chunk to Elasticsearch.
 *
 * @remarks
 * Contains both success count and any operations that failed with
 * retryable errors (e.g., HTTP 429 from ELSER queue overflow).
 */
export interface ChunkUploadResult {
  /** Number of documents successfully indexed */
  readonly successCount: number;
  /** Operations that failed with retryable errors (action, doc pairs) */
  readonly failedOperations: BulkOperations;
  /** Raw bulk response from Elasticsearch */
  readonly response: BulkResponse;
}

/** Resolved HTTP retry configuration. */
export interface HttpRetryConfig {
  readonly maxRetries: number;
  readonly baseRetryDelayMs: number;
}

/** Sleep for a specified duration. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Counts successfully indexed documents from a bulk response. */
function countSuccesses(response: BulkResponse): number {
  let count = 0;
  for (const item of response.items) {
    const result = item.index ?? item.create;
    if (result && result.status < 400) {
      count++;
    }
  }
  return count;
}

/**
 * Attempts a single chunk upload (no retry).
 *
 * @param es - Elasticsearch transport
 * @param chunk - Bulk operations to upload
 * @param logger - Logger instance
 * @returns ChunkUploadResult with success count and failed operations
 * @throws On transport errors or invalid response format
 */
export async function attemptChunkUpload(
  es: EsTransport,
  chunk: BulkOperations,
  logger: Logger,
): Promise<ChunkUploadResult> {
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

  const successCount = countSuccesses(response);
  const failedOperations = extractFailedOperations(response, chunk);

  return { successCount, failedOperations, response };
}

/**
 * Process a single chunk upload with HTTP-level retry logic.
 *
 * @remarks
 * Retries the entire chunk on transport errors (network issues, timeouts)
 * with exponential backoff and jitter. This is Tier 1 retry.
 *
 * @param es - Elasticsearch transport
 * @param chunk - Bulk operations to upload
 * @param chunkIndex - Current chunk index (0-based)
 * @param totalChunks - Total number of chunks
 * @param logger - Logger instance
 * @param config - Retry configuration
 * @returns ChunkUploadResult with success count and failed operations
 * @throws On transport errors after all retry attempts exhausted
 */
export async function uploadChunkWithRetry(
  es: EsTransport,
  chunk: BulkOperations,
  chunkIndex: number,
  totalChunks: number,
  logger: Logger,
  config: HttpRetryConfig,
): Promise<ChunkUploadResult> {
  const chunkNum = chunkIndex + 1;
  const documentCount = Math.floor(chunk.length / 2);
  const sizeKB = Math.round(JSON.stringify(chunk).length / 1024);
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    logger.debug('Uploading chunk', {
      chunk: chunkNum,
      of: totalChunks,
      documents: documentCount,
      sizeKB,
      attempt: attempt > 0 ? attempt + 1 : undefined,
    });

    try {
      return await attemptChunkUpload(es, chunk, logger);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === config.maxRetries) {
        logger.error('Chunk upload failed after all retries', {
          chunk: chunkNum,
          attempts: attempt + 1,
          error: lastError.message,
        });
        throw lastError;
      }

      const backoffMs = calculateBackoffWithJitter(attempt, config.baseRetryDelayMs);
      logger.warn('Chunk upload failed, retrying', {
        chunk: chunkNum,
        attempt: attempt + 1,
        maxAttempts: config.maxRetries + 1,
        backoffMs,
        error: lastError.message,
      });
      await sleep(backoffMs);
    }
  }

  throw lastError ?? new Error('Unexpected retry loop exit');
}
