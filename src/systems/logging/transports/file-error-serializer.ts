/**
 * @fileoverview Error serialization utilities for file transport
 * @module @oak-mcp-core/logging/transports
 *
 * Pure functions for converting various error types to string representations
 * suitable for file logging. Handles Error instances, primitives, and objects.
 */

// =============================================================================
// PRIVATE UTILITIES
// =============================================================================

/**
 * Convert Error instance to string representation
 */
function errorToString(error: Error, includeStackTrace: boolean): string {
  if (includeStackTrace && error.stack) {
    return error.stack;
  }
  return error.message;
}

/**
 * Convert primitive values to string
 */
function primitiveToString(value: unknown): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

/**
 * Convert object to string with JSON fallback
 */
function objectToString(obj: object): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '[object with circular reference]';
  }
}

// =============================================================================
// PUBLIC FUNCTIONS
// =============================================================================

/**
 * Serialize an unknown error value to string
 * Pure function - no side effects
 */
export function serializeError(error: unknown, includeStackTrace = true): string {
  // Handle Error instances
  if (error instanceof Error) {
    return errorToString(error, includeStackTrace);
  }

  // Try primitive conversion
  const primitiveResult = primitiveToString(error);
  if (primitiveResult !== null) {
    return primitiveResult;
  }

  // Handle objects
  if (typeof error === 'object' && error !== null) {
    return objectToString(error);
  }

  // Handle non-serializable types
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
