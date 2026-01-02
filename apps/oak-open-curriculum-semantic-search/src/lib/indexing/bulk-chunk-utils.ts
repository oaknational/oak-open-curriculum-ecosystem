/**
 * Pure utility functions for bulk operation chunking.
 *
 * @remarks
 * These are stateless, side-effect-free functions for preparing
 * bulk operations before upload to Elasticsearch.
 *
 * @module bulk-chunk-utils
 */
import type { BulkOperationEntry, BulkOperations } from './bulk-operation-types';

// =============================================================================
// CHUNK CONFIGURATION
// =============================================================================

/**
 * Maximum chunk size in bytes for bulk uploads.
 *
 * @remarks
 * Set to 8MB based on ELSER characterisation testing (2026-01-02).
 * Smaller chunks reduce queue pressure and allow better retry granularity.
 *
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
export const MAX_CHUNK_SIZE_BYTES = 8 * 1024 * 1024;

// =============================================================================
// HTTP-LEVEL RETRY CONSTANTS (Tier 1)
// These apply to transport-level errors: network failures, timeouts, etc.
// =============================================================================

/**
 * Maximum number of retry attempts for HTTP transport failures.
 *
 * @remarks
 * Used when the entire HTTP request fails (network error, timeout, etc.).
 * Each retry uses exponential backoff with jitter.
 */
export const HTTP_MAX_RETRY_ATTEMPTS = 3;

/**
 * Base delay for HTTP retry exponential backoff in milliseconds.
 *
 * @remarks
 * The actual delay uses full jitter: random(0, base * 2^attempt).
 * This spreads retry attempts to avoid thundering herd.
 */
export const HTTP_BASE_RETRY_DELAY_MS = 1000;

// =============================================================================
// DOCUMENT-LEVEL RETRY CONSTANTS (Tier 2)
// These apply to individual document failures within successful bulk responses,
// primarily ELSER inference_exception due to queue overflow.
// =============================================================================

/**
 * Default delay between chunks in milliseconds for document-level retries.
 *
 * @remarks
 * Set to 6500ms based on full ingestion optimisation (2026-01-02).
 * Allows ELSER inference queue to drain between chunk uploads, reducing
 * queue overflow errors (HTTP 429 inference_exception).
 *
 * @see .agent/plans/semantic-search/active/elser-retry-robustness.md
 */
export const DEFAULT_CHUNK_DELAY_MS = 6500;

/**
 * Represents an action-document pair in Elasticsearch bulk format.
 */
export interface OperationPair {
  readonly action: BulkOperationEntry;
  readonly document: BulkOperationEntry;
}

/**
 * Extracts complete action-document pairs from a flat bulk operations array.
 *
 * @remarks
 * ES bulk format alternates action and document: [action, doc, action, doc, ...].
 * This function converts to an array of explicit pairs, ignoring incomplete pairs.
 *
 * @param operations - Flat array of bulk operations
 * @returns Array of complete action-document pairs
 */
export function extractOperationPairs(operations: BulkOperations): readonly OperationPair[] {
  const pairs: OperationPair[] = [];
  const pairCount = Math.floor(operations.length / 2);

  for (let i = 0; i < pairCount; i++) {
    const action = operations[i * 2];
    const document = operations[i * 2 + 1];
    if (action !== undefined && document !== undefined) {
      pairs.push({ action, document });
    }
  }

  return pairs;
}

/**
 * Calculates the serialized size of an operation pair in bytes.
 */
export function calculatePairSize(pair: OperationPair): number {
  return JSON.stringify(pair.action).length + JSON.stringify(pair.document).length + 2;
}

/**
 * Flattens operation pairs back to ES bulk format.
 */
export function flattenPairs(pairs: readonly OperationPair[]): BulkOperations {
  const result: BulkOperations = [];
  for (const pair of pairs) {
    result.push(pair.action, pair.document);
  }
  return result;
}

/**
 * Splits bulk operations into chunks that don't exceed the size limit.
 *
 * @remarks
 * Each operation pair (action + document) is kept together. Chunks are split
 * based on estimated serialized size to stay under ES HTTP body limits.
 *
 * @param operations - Full list of bulk operations
 * @param maxSizeBytes - Maximum chunk size in bytes
 * @returns Array of operation chunks
 */
export function chunkOperations(
  operations: BulkOperations,
  maxSizeBytes: number,
): BulkOperations[] {
  const pairs = extractOperationPairs(operations);
  if (pairs.length === 0) {
    return [];
  }

  const chunks: BulkOperations[] = [];
  let currentPairs: OperationPair[] = [];
  let currentSize = 0;

  for (const pair of pairs) {
    const pairSize = calculatePairSize(pair);

    if (currentSize + pairSize > maxSizeBytes && currentPairs.length > 0) {
      chunks.push(flattenPairs(currentPairs));
      currentPairs = [];
      currentSize = 0;
    }

    currentPairs.push(pair);
    currentSize += pairSize;
  }

  if (currentPairs.length > 0) {
    chunks.push(flattenPairs(currentPairs));
  }

  return chunks;
}

/**
 * Serialises a bulk operation array into NDJSON suitable for the Elasticsearch bulk API.
 */
export function createNdjson(operations: BulkOperations): string {
  return operations.map((entry) => JSON.stringify(entry)).join('\n') + '\n';
}

/**
 * Calculate delay with exponential backoff and jitter.
 *
 * @remarks
 * Uses full jitter strategy: delay = random(0, base * 2^attempt).
 * This spreads retry attempts to avoid thundering herd.
 *
 * @param attempt - Current retry attempt (0-indexed)
 * @param baseDelayMs - Base delay in milliseconds
 * @returns Delay in milliseconds with jitter applied
 */
export function calculateBackoffWithJitter(attempt: number, baseDelayMs: number): number {
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * exponentialDelay;
  return Math.floor(jitter);
}

/**
 * Multiplier for progressive chunk delay increase per document retry attempt.
 *
 * @remarks
 * Part of the document-level (Tier 2) retry system. Each retry attempt
 * multiplies the chunk delay by this factor to give ELSER more time to
 * drain its queue on subsequent retries.
 *
 * Example with DEFAULT_CHUNK_DELAY_MS=5000 and multiplier=1.5:
 * - Attempt 0: 5000ms
 * - Attempt 1: 7500ms
 * - Attempt 2: 11250ms
 * - Attempt 3: 16875ms
 */
export const DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER = 1.5;

/**
 * Calculates the progressive chunk delay for a given retry attempt.
 *
 * @remarks
 * Each retry attempt increases the chunk delay by `DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER`
 * to give ELSER more time to drain its queue on subsequent retries.
 *
 * Formula: `baseDelay * DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER^attempt`
 *
 * - Attempt 0: baseDelay (no increase)
 * - Attempt N: baseDelay * multiplier^N
 *
 * @param attempt - Current retry attempt (0-indexed)
 * @param baseDelayMs - Base chunk delay in milliseconds
 * @returns Progressive chunk delay for this attempt
 */
export function calculateProgressiveChunkDelay(attempt: number, baseDelayMs: number): number {
  return Math.floor(baseDelayMs * Math.pow(DOCUMENT_RETRY_CHUNK_DELAY_MULTIPLIER, attempt));
}

// Re-export retry utilities for backwards compatibility
export { isRetryableError, extractFailedOperations } from './bulk-retry-utils';
