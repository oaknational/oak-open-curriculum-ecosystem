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
 * Convert an unknown caught error into a `RetrievalError`.
 *
 * @param error - The caught error value
 * @returns A typed `RetrievalError` discriminated union member
 */
export function toRetrievalError(error: unknown): RetrievalError {
  const message = error instanceof Error ? error.message : String(error);
  const statusCode = extractStatusCode(error);
  return { type: 'es_error', message, statusCode };
}
