/**
 * @fileoverview JSON sanitization for safe logging
 * @module @oak-mcp-core/logging/formatters/json
 */

import { serializeError } from './error-serializer.js';

/**
 * Check if a value needs object sanitization
 */
function needsObjectSanitization(value: unknown): value is object {
  return value !== null && value !== undefined && typeof value === 'object';
}

/**
 * Sanitize an array recursively
 */
function sanitizeArray(arr: unknown[], sensitiveKeys: string[], seen: WeakSet<object>): unknown[] {
  return arr.map((item) => sanitizeJsonEntry(item, sensitiveKeys, seen));
}

/**
 * Sanitize object properties with sensitive key handling
 */
function sanitizeObject(
  obj: object,
  sensitiveKeys: string[],
  seen: WeakSet<object>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(obj)) {
    result[key] = sensitiveKeys.includes(key)
      ? '[REDACTED]'
      : sanitizeJsonEntry(val, sensitiveKeys, seen);
  }

  return result;
}

/**
 * Sanitizes a value for JSON output
 * Handles circular references and special cases
 */
export function sanitizeJsonEntry(
  value: unknown,
  sensitiveKeys: string[] = [],
  seen = new WeakSet(),
): unknown {
  // Primitives pass through unchanged
  if (!needsObjectSanitization(value)) {
    return value;
  }

  // Check circular references
  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  // Handle special object types
  if (value instanceof Error) {
    return serializeError(value);
  }

  if (Array.isArray(value)) {
    return sanitizeArray(value, sensitiveKeys, seen);
  }

  // Handle plain objects
  return sanitizeObject(value, sensitiveKeys, seen);
}
