/**
 * Shared retrieval error conversion utility.
 *
 * Converts unknown caught errors into typed `RetrievalError` values
 * for the retrieval service. Extracted from `create-retrieval-service.ts`
 * so that extracted search scope implementations (e.g. `search-threads.ts`)
 * can share the same error mapping without circular dependencies.
 */

import type { RetrievalError } from '../types/retrieval-results.js';
import { extractStatusCode } from '../admin/es-error-guards.js';

/**
 * Detects whether a caught error represents a timeout condition.
 *
 * Recognises three patterns:
 * - `AbortError` (from `AbortController` used by fetch timeout)
 * - `TimeoutError` (from `@elastic/transport` connection timeout)
 * - HTTP 408 status code on the error object
 */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return true;
    }
  }
  return extractStatusCode(error) === 408;
}

/**
 * Convert an unknown caught error into a `RetrievalError`.
 *
 * Timeout-shaped errors (AbortError, TimeoutError, HTTP 408) are mapped
 * to the `timeout` variant so callers can distinguish retryable timeouts
 * from permanent ES failures.
 *
 * @param error - The caught error value
 * @returns A typed `RetrievalError` discriminated union member
 */
export function toRetrievalError(error: unknown): RetrievalError {
  const message = error instanceof Error ? error.message : String(error);
  if (isTimeoutError(error)) {
    return { type: 'timeout', message };
  }
  const statusCode = extractStatusCode(error);
  return { type: 'es_error', message, statusCode };
}
