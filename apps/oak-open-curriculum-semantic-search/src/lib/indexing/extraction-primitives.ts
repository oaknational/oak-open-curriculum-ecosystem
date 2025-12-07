/**
 * Primitive extraction utilities for safely extracting data from unknown sources.
 *
 * These utilities provide type-safe access to unknown data structures,
 * used throughout the document transformation pipeline.
 *
 * @module extraction-primitives
 */

type UnknownObject = Readonly<Record<string, unknown>>;

/** Type guard to check if a value is a non-null object. */
export function isUnknownObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}

/** Ensures a value is an object, throws if not. */
export function ensureRecord(value: unknown, context: string): UnknownObject {
  if (!isUnknownObject(value)) {
    throw new Error(`Invalid ${context}: expected an object`);
  }
  return value;
}

/** Safely converts a value to an array. */
export function safeArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Safely extracts a non-empty string from a value. */
export function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Plucks string values from a collection of objects by key. */
export function pluckStrings(collection: unknown, key: string): string[] {
  const results: string[] = [];
  for (const entry of safeArray(collection)) {
    if (typeof entry !== 'object' || entry === null) {
      continue;
    }
    const raw: unknown = Reflect.get(entry, key);
    const value = safeString(raw);
    if (value) {
      results.push(value);
    }
  }
  return results;
}

/** Returns undefined if array is empty, otherwise the array. */
export function optionalStrings(values: string[]): string[] | undefined {
  return values.length > 0 ? values : undefined;
}

/** Reads a field from an object. */
export function readUnknownField(record: UnknownObject, key: string): unknown {
  return record[key];
}

/** Requires a string field, throws if missing. */
export function requireStringField(record: UnknownObject, key: string, context: string): string {
  const value = safeString(readUnknownField(record, key));
  if (!value) {
    throw new Error(`Missing ${context}`);
  }
  return value;
}
