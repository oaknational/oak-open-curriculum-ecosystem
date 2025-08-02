/**
 * @fileoverview JSON sanitization for safe logging
 * @module @oak-mcp-core/logging/formatters/json
 */

import { serializeError } from './error-serializer.js';

/**
 * Sanitizes a value for JSON output
 * Handles circular references and special cases
 */
export function sanitizeJsonEntry(
  value: unknown,
  sensitiveKeys: string[] = [],
  seen = new WeakSet(),
): unknown {
  // Handle primitives
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  // Handle circular references
  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  // Handle errors
  if (value instanceof Error) {
    return serializeError(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeJsonEntry(item, sensitiveKeys, seen));
  }

  // Handle objects
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (sensitiveKeys.includes(key)) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = sanitizeJsonEntry(val, sensitiveKeys, seen);
    }
  }

  return result;
}
