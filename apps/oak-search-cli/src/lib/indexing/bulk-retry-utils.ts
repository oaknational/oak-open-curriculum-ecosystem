/**
 * Pure utility functions for bulk operation retry logic.
 *
 * @remarks
 * These functions determine which failed operations should be retried
 * and extract them from bulk responses.
 *
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
import type { BulkOperationEntry, BulkOperations } from './bulk-operation-types';

/**
 * Represents a bulk response item from Elasticsearch.
 */
interface BulkResponseItem {
  readonly index?: {
    readonly _index: string;
    readonly _id?: string;
    readonly status: number;
    readonly error?: {
      readonly type: string;
      readonly reason: string;
    };
  };
  readonly create?: {
    readonly _index: string;
    readonly _id?: string;
    readonly status: number;
    readonly error?: {
      readonly type: string;
      readonly reason: string;
    };
  };
}

/**
 * Represents a bulk response from Elasticsearch.
 */
interface BulkResponse {
  readonly errors: boolean;
  readonly items: readonly BulkResponseItem[];
}

/**
 * Determines if an error is retryable based on HTTP status and error type.
 *
 * @remarks
 * **Retryable errors** are transient failures that may succeed on retry:
 * - HTTP 429: Rate limit / queue overflow (e.g., ELSER `inference_exception`)
 * - HTTP 502: Bad gateway (proxy/load balancer issues)
 * - HTTP 503: Service unavailable (ES overloaded)
 * - HTTP 504: Gateway timeout (request took too long)
 *
 * **Non-retryable errors** are permanent failures that won't succeed on retry:
 * - HTTP 400: Bad request (mapping errors, validation errors)
 * - HTTP 409: Conflict (version conflicts, document already exists)
 * - HTTP 404: Not found (index doesn't exist)
 *
 * @param status - HTTP status code from bulk response item
 * @param errorType - Error type string from ES error object (for logging/debugging)
 * @returns true if the error should be retried, false otherwise
 *
 * @example
 * ```typescript
 * // ELSER queue overflow - retryable
 * isRetryableError(429, 'inference_exception') // true
 *
 * // Mapping error - not retryable
 * isRetryableError(400, 'mapper_parsing_exception') // false
 * ```
 *
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
export function isRetryableError(status: number, errorType: string): boolean {
  void errorType; // Available for logging/debugging, not used in decision
  // Transient errors that may succeed on retry
  return status === 429 || status === 502 || status === 503 || status === 504;
}

/**
 * Gets the result object from a bulk response item.
 */
function getItemResult(item: BulkResponseItem): BulkResponseItem['index'] | undefined {
  return item.index ?? item.create;
}

/**
 * Checks if a bulk response item represents a retryable failure.
 */
function isRetryableFailure(item: BulkResponseItem): boolean {
  const result = getItemResult(item);
  if (!result || result.status < 400) {
    return false;
  }
  return isRetryableError(result.status, result.error?.type ?? 'unknown');
}

/**
 * Extracts operations that failed with retryable errors from a bulk response.
 *
 * @remarks
 * This function matches bulk response items to their original operations
 * and returns only those that failed with retryable errors (e.g., 429, 503).
 * Non-retryable errors (400, 409) are NOT included as they won't succeed on retry.
 *
 * @param response - Bulk response from Elasticsearch
 * @param originalOps - Original bulk operations array (action, doc, action, doc, ...)
 * @returns Array of operations to retry (action, doc pairs for failed items)
 *
 * @example
 * ```typescript
 * const failed = extractFailedOperations(response, originalOps);
 * if (failed.length > 0) {
 *   const retryChunks = chunkOperations(failed, MAX_CHUNK_SIZE_BYTES);
 *   await uploadChunks(retryChunks);
 * }
 * ```
 *
 * @see isRetryableError
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
export function extractFailedOperations(
  response: BulkResponse,
  originalOps: BulkOperations,
): BulkOperations {
  const failedOps: BulkOperationEntry[] = [];

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i];
    if (!item || !isRetryableFailure(item)) {
      continue;
    }

    const actionIndex = i * 2;
    const action = originalOps[actionIndex];
    const doc = originalOps[actionIndex + 1];

    if (action !== undefined && doc !== undefined) {
      failedOps.push(action, doc);
    }
  }

  return failedOps;
}
