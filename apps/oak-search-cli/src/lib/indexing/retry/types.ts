/**
 * Type definitions for Elasticsearch bulk operation retry logic.

 */
import type { BulkOperations } from '../bulk-operation-types';

/**
 * Configuration for document-level retry.
 */
export interface DocumentRetryConfig {
  /** Maximum retry attempts */
  readonly maxRetries: number;
  /** Base delay for exponential backoff in ms */
  readonly retryDelayMs: number;
  /** Base delay between chunks in ms (increases per retry attempt) */
  readonly chunkDelayMs: number;
}

/**
 * Result of the complete document retry process.
 */
export interface DocumentRetryResult {
  /** Total documents successfully indexed during retry */
  readonly successCount: number;
  /** Operations that permanently failed */
  readonly permanentlyFailed: BulkOperations;
}

/**
 * Result of a single document retry attempt.
 */
export interface RetryAttemptResult {
  /** Number of documents successfully indexed in this attempt */
  readonly successCount: number;
  /** Operations that still failed (for next retry attempt) */
  readonly failedOperations: BulkOperations;
}
