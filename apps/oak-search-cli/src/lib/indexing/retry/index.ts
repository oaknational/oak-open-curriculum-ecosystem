/**
 * Elasticsearch bulk operation retry logic.
 *
 * @remarks
 * This module provides a two-tier retry strategy for bulk operations:
 *
 * - **Tier 1 (HTTP-level)**: Retries entire chunks on transport errors
 *   (network issues, timeouts) with exponential backoff.
 *
 * - **Tier 2 (Document-level)**: After all chunks are processed, retries
 *   individual documents that failed with transient errors (HTTP 429, 502, 503, 504).
 *
 * @example
 * ```typescript
 * import { executeDocumentRetry, attemptChunkUpload } from './retry';
 *
 * const result = await executeDocumentRetry(
 *   es, failedOps, attemptChunkUpload, logger,
 *   { maxRetries: 4, retryDelayMs: 5000, chunkDelayMs: 2000 }
 * );
 * ```
 *
 * @see ADR-070 SDK Rate Limiting and Retry
 * @see ADR-096 ES Bulk Retry Strategy
 */

// HTTP-level retry (Tier 1)
export type { EsTransport } from './http-retry';
export { attemptChunkUpload, uploadChunkWithRetry } from './http-retry';

// Document-level retry (Tier 2)
export { executeDocumentRetry } from './document-retry';
