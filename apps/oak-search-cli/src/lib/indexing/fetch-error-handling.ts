/**
 * Helpers for graceful error handling during API fetch operations.
 * Provides consistent patterns for handling 404 and 500-series errors.
 */

import type { Logger } from '@oaknational/logger';
import type { IngestionContext, IngestionErrorCollector } from './ingestion-error-types';

/**
 * Configuration for fetch error handling.
 *
 * @typeParam T - The type of the fallback value to return on recoverable errors
 */
export interface FetchErrorConfig<T> {
  /** Value to return when a recoverable error occurs. */
  readonly fallback: T;
  /** Error collector for recording issues. */
  readonly errorCollector: IngestionErrorCollector;
  /** Logger for warning messages. */
  readonly logger: Logger;
  /** Context about what was being fetched. */
  readonly context: IngestionContext;
  /** Name of the operation (for logging/recording). */
  readonly operation: string;
  /** Whether to handle 404 errors gracefully (default: true). */
  readonly handle404?: boolean;
}

/**
 * Check if an error is a 500-series server error.
 *
 * @param error - The error to check
 * @returns true if the error message indicates a 500-series status
 */
function isServerError(error: Error): boolean {
  const msg = error.message;
  return msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504');
}

/**
 * Check if an error is a 404 not found error.
 *
 * @param error - The error to check
 * @returns true if the error message indicates a 404 status
 */
function is404Error(error: Error): boolean {
  return error.message.includes('404');
}

/**
 * Handle fetch errors with consistent 404/500 error handling.
 *
 * - 404 errors: Returns fallback if handle404 is true, otherwise re-throws
 * - 500-series errors: Logs warning, records to collector, returns fallback
 * - Other errors: Re-thrown immediately
 *
 * @typeParam T - The type of the fallback value
 * @param error - The error that occurred
 * @param config - Configuration for error handling
 * @returns The fallback value for recoverable errors
 * @throws The original error if not recoverable
 */
export function handleFetchError<T>(error: Error, config: FetchErrorConfig<T>): T {
  const { fallback, errorCollector, logger, context, operation, handle404 = true } = config;

  // 404: Return fallback if configured to handle, otherwise re-throw
  if (is404Error(error)) {
    if (handle404) {
      return fallback;
    }
    throw error;
  }

  // 500-series: Log, record, and return fallback
  if (isServerError(error)) {
    logger.warn(`${operation} failed with 500, using fallback`, {
      lessonSlug: context.lessonSlug,
      unit: context.unitSlug,
      keyStage: context.keyStage,
      subject: context.subject,
    });
    errorCollector.record500Error(context, operation);
    return fallback;
  }

  // Other errors: Re-throw
  throw error;
}
