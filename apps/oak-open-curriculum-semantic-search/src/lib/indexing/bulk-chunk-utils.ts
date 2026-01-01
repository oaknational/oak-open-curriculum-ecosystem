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

/**
 * Maximum chunk size in bytes for bulk uploads.
 *
 * @remarks
 * Reduced from 50MB to 20MB to prevent ELSER inference memory pressure.
 * Smaller chunks allow the ELSER queue to drain between uploads.
 */
export const MAX_CHUNK_SIZE_BYTES = 20 * 1024 * 1024;

/** Default delay between chunks in milliseconds (allows ELSER queue to drain). */
export const DEFAULT_CHUNK_DELAY_MS = 500;

/** Maximum number of retry attempts for transient failures. */
export const MAX_RETRY_ATTEMPTS = 3;

/** Base delay for exponential backoff in milliseconds. */
export const BASE_RETRY_DELAY_MS = 1000;

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

