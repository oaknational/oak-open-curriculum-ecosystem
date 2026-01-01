/**
 * Handles uploading of bulk operations to Elasticsearch.
 *
 * @remarks
 * Includes retry with exponential backoff and jitter for transient failures,
 * rate limiting between chunks to prevent ELSER memory pressure.
 *
 * @see ./bulk-chunk-utils.ts for pure chunking utilities
 * @module bulk-chunk-uploader
 */
import type { Logger } from '@oaknational/mcp-logger';
import { BulkResponseSchema, logBulkErrors } from './sandbox-bulk-response';
import type { BulkOperations } from './bulk-operation-types';
import {
  calculateBackoffWithJitter,
  createNdjson,
  DEFAULT_CHUNK_DELAY_MS,
  MAX_RETRY_ATTEMPTS,
  BASE_RETRY_DELAY_MS,
} from './bulk-chunk-utils';

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
 * Configuration for bulk upload behaviour.
 */
export interface BulkUploadConfig {
  /** Delay between chunks in ms (default: 500ms) */
  readonly chunkDelayMs?: number;
  /** Maximum retry attempts (default: 3) */
  readonly maxRetries?: number;
  /** Base delay for exponential backoff in ms (default: 1000ms) */
  readonly baseRetryDelayMs?: number;
}

/** Resolved configuration with all defaults applied. */
type ResolvedConfig = Required<BulkUploadConfig>;

/**
 * Sleep for a specified duration.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attempts a single chunk upload (no retry).
 *
 * @returns Document count on success
 * @throws On any ES error
 */
async function attemptChunkUpload(
  es: EsTransport,
  chunk: BulkOperations,
  logger: Logger,
): Promise<number> {
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

  return Math.floor(chunk.length / 2);
}

/**
 * Process a single chunk upload with retry logic.
 *
 * @remarks
 * Retries on transient failures with exponential backoff and jitter.
 */
async function uploadChunkWithRetry(
  es: EsTransport,
  chunk: BulkOperations,
  chunkIndex: number,
  totalChunks: number,
  logger: Logger,
  config: ResolvedConfig,
): Promise<number> {
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

/**
 * Resolves upload configuration with defaults.
 */
function resolveConfig(config: BulkUploadConfig): ResolvedConfig {
  return {
    chunkDelayMs: config.chunkDelayMs ?? DEFAULT_CHUNK_DELAY_MS,
    maxRetries: config.maxRetries ?? MAX_RETRY_ATTEMPTS,
    baseRetryDelayMs: config.baseRetryDelayMs ?? BASE_RETRY_DELAY_MS,
  };
}

/**
 * Upload all chunks sequentially to Elasticsearch with rate limiting.
 *
 * @remarks
 * Includes a configurable delay between chunks to allow ELSER inference queue
 * to drain, preventing memory pressure errors.
 *
 * @param es - Elasticsearch transport
 * @param chunks - Array of operation chunks
 * @param logger - Logger instance
 * @param docCount - Total document count for progress logging
 * @param config - Upload configuration (delays, retries)
 * @returns Total documents uploaded
 */
export async function uploadAllChunks(
  es: EsTransport,
  chunks: BulkOperations[],
  logger: Logger,
  docCount: number,
  config: BulkUploadConfig = {},
): Promise<number> {
  const resolved = resolveConfig(config);
  let totalUploaded = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) {
      continue;
    }

    totalUploaded += await uploadChunkWithRetry(es, chunk, i, chunks.length, logger, resolved);
    logger.debug('Chunk uploaded', { chunk: i + 1, totalUploaded, of: docCount });

    const isNotLastChunk = i < chunks.length - 1;
    const hasDelay = resolved.chunkDelayMs > 0;
    if (isNotLastChunk && hasDelay) {
      await sleep(resolved.chunkDelayMs);
    }
  }

  return totalUploaded;
}
