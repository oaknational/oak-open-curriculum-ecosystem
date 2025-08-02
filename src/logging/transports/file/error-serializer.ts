/**
 * @fileoverview Error serialization utilities
 * @module @oak-mcp-core/logging
 *
 * Pure functions for converting various error types to strings
 */

/**
 * Serialize an unknown error value to string
 * Pure function - no side effects
 */
export function serializeError(error: unknown, includeStackTrace = true): string {
  if (error === undefined || error === null) {
    return '';
  }

  if (error instanceof Error) {
    if (includeStackTrace && error.stack) {
      return error.stack;
    }
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'number' || typeof error === 'boolean') {
    return String(error);
  }

  if (typeof error === 'object') {
    // For non-Error objects, stringify to preserve structure
    try {
      return JSON.stringify(error);
    } catch {
      // Handle circular references
      return '[object with circular reference]';
    }
  }

  // Handle symbols, functions, and other non-serializable types
  return '[unknown error type]';
}

/**
 * Extract error message only (no stack trace)
 * Pure function for simple error formatting
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return serializeError(error, false);
}
