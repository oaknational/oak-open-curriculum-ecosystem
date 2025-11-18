/**
 * Context merging utilities for logger metadata
 */

import type { JsonObject } from './types.js';
import { sanitiseObject, sanitiseForJson } from './json-sanitisation.js';

/**
 * Merges base context with additional context
 * Strips undefined values and sanitises all values to ensure JSON-safe output
 * @param base - Base context object
 * @param context - Additional context to merge (can be any value)
 * @returns Merged JSON-safe context object
 *
 * @example
 * ```typescript
 * mergeLogContext({ app: 'test' }, { userId: '123' })
 * // Returns: { app: 'test', userId: '123' }
 *
 * mergeLogContext({ app: 'test' }, { timestamp: new Date() })
 * // Returns: { app: 'test', timestamp: '2025-01-01T00:00:00.000Z' }
 * ```
 */
export function mergeLogContext(base: JsonObject, context?: unknown): JsonObject {
  if (context === undefined) {
    return base;
  }

  const jsonSafe = sanitiseObject(context);
  if (jsonSafe) {
    return { ...base, ...jsonSafe };
  }

  return { ...base, value: sanitiseForJson(context) };
}
