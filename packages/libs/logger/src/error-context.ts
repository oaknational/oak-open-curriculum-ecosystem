/**
 * Error context enrichment utilities.
 *
 * Provides functionality to enrich Error objects with additional context
 * such as correlation IDs, timing information, and request/tool metadata.
 * This enables better debugging and tracing in production environments.
 */

import type { Duration } from './timing';

/**
 * Context information that can be attached to errors for debugging.
 *
 * All fields are optional to allow partial context enrichment based on
 * what information is available at the point of error handling.
 *
 * @public
 */
export interface ErrorContext {
  /**
   * Correlation ID for request tracing across the system.
   * Format: `req_{timestamp}_{randomHex}` (e.g., "req_1699123456789_a3f2c9")
   */
  readonly correlationId?: string;

  /**
   * Duration/timing information captured when the error occurred.
   * Includes milliseconds and human-readable formatted string.
   */
  readonly duration?: Duration;

  /**
   * HTTP request method (for HTTP server errors).
   * Examples: "GET", "POST", "PUT", "DELETE"
   */
  readonly requestMethod?: string;

  /**
   * HTTP request path (for HTTP server errors).
   * Example: "/api/tools"
   */
  readonly requestPath?: string;

  /**
   * MCP tool name (for stdio server errors).
   * Examples: "searchLessons", "getLessonPlan"
   */
  readonly toolName?: string;
}

/**
 * Enriches an Error object with additional context for debugging.
 *
 * The context is attached as a non-enumerable property to preserve
 * JSON serialization behavior while making it accessible for logging
 * and debugging purposes.
 *
 * This function:
 * - Preserves the original error message and stack trace
 * - Maintains the error prototype chain (works with custom error classes)
 * - Returns the same error instance (mutates in place)
 * - Makes context accessible via a non-enumerable property
 *
 * @param error - The Error object to enrich
 * @param context - Context information to attach to the error
 * @returns The same Error object with context attached
 *
 * @example
 * ```typescript
 * const error = new Error('Request failed');
 * const timer = startTimer();
 * // ... operation ...
 * const duration = timer.end();
 *
 * const enriched = enrichError(error, {
 *   correlationId: 'req_1699123456789_a3f2c9',
 *   duration,
 *   requestMethod: 'POST',
 *   requestPath: '/api/search',
 * });
 *
 * // Access context for logging
 * const ctx = (enriched as Error & { context?: ErrorContext }).context;
 * logger.error('Request failed', {
 *   message: enriched.message,
 *   correlationId: ctx?.correlationId,
 *   duration: ctx?.duration,
 * });
 * ```
 *
 * @public
 */
export function enrichError(error: Error, context: ErrorContext): Error {
  // Define the context property as non-enumerable to avoid affecting
  // JSON.stringify and other enumeration operations
  Object.defineProperty(error, 'context', {
    value: context,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return error;
}
