/**
 * JSON sanitisation utilities for converting arbitrary values to JSON-safe formats
 */

import { typeSafeEntries, typeSafeValues } from '@oaknational/type-helpers';
import {
  type PlainObject,
  type SanitiserContext,
  type ValueSanitiser,
  isPlainObject,
  isPrimitiveJsonValue,
  withCircularGuard,
} from './json-sanitisation-internals.js';
import type { JsonValue, JsonObject } from './types.js';

const CIRCULAR_REFERENCE_PLACEHOLDER = '[Circular]';
const UNSERIALISABLE_PLACEHOLDER = '[unserializable]';

function buildJsonObject(entries: readonly [string, JsonValue][]): JsonObject {
  const result: Record<string, JsonValue> = {};

  for (const [key, value] of entries) {
    result[key] = value;
  }

  return result;
}

function normaliseError(error: Error): JsonObject {
  const entries: [string, JsonValue][] = [
    ['message', error.message],
    ['name', error.name],
  ];

  if (typeof error.stack === 'string') {
    entries.push(['stack', error.stack]);
  }

  return buildJsonObject(entries);
}

function collectObjectEntries(
  source: PlainObject,
  context: SanitiserContext,
): [string, JsonValue][] {
  const entries: [string, JsonValue][] = [];

  for (const [key, rawValue] of typeSafeEntries(source)) {
    if (rawValue === undefined) {
      if (context.undefinedStrategy === 'null') {
        entries.push([key, null]);
      }
      continue;
    }

    const sanitised = sanitiseUnknown(rawValue, context);
    entries.push([key, sanitised]);
  }

  return entries;
}

function sanitisePlainObjectValue(source: PlainObject, context: SanitiserContext): JsonValue {
  if (isJsonValue(source)) {
    return source;
  }

  return withCircularGuard<JsonValue>(
    source,
    context,
    () => CIRCULAR_REFERENCE_PLACEHOLDER,
    () => buildJsonObject(collectObjectEntries(source, context)),
  );
}

function sanitiseArrayValue(values: readonly unknown[], context: SanitiserContext): JsonValue {
  return withCircularGuard<JsonValue>(
    values,
    context,
    () => CIRCULAR_REFERENCE_PLACEHOLDER,
    () => values.map((item) => sanitiseUnknown(item, context)),
  );
}

function safeJsonParse(serialised: string): unknown {
  return JSON.parse(serialised);
}

function serialiseWithJson(value: unknown): JsonValue {
  try {
    const parsed = safeJsonParse(JSON.stringify(value));
    if (isJsonValue(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore serialisation errors and fall through to placeholder
  }

  return UNSERIALISABLE_PLACEHOLDER;
}

const sanitiseNullish: ValueSanitiser = (value) =>
  value === null || value === undefined ? null : undefined;

const sanitisePrimitiveValue: ValueSanitiser = (value) =>
  isPrimitiveJsonValue(value) ? value : undefined;

const sanitiseBigIntValue: ValueSanitiser = (value) =>
  typeof value === 'bigint' ? value.toString() : undefined;

const sanitiseDateValue: ValueSanitiser = (value) =>
  value instanceof Date ? value.toISOString() : undefined;

const sanitiseErrorValue: ValueSanitiser = (value) =>
  value instanceof Error ? normaliseError(value) : undefined;

const sanitiseArrayCandidate: ValueSanitiser = (value, context) =>
  Array.isArray(value) ? sanitiseArrayValue(value, context) : undefined;

const sanitisePlainObjectCandidate: ValueSanitiser = (value, context) =>
  isPlainObject(value) ? sanitisePlainObjectValue(value, context) : undefined;

const VALUE_SANITISERS: readonly ValueSanitiser[] = [
  sanitiseNullish,
  sanitisePrimitiveValue,
  sanitiseBigIntValue,
  sanitiseDateValue,
  sanitiseErrorValue,
  sanitiseArrayCandidate,
  sanitisePlainObjectCandidate,
];

function sanitiseUnknown(value: unknown, context: SanitiserContext): JsonValue {
  for (const sanitiser of VALUE_SANITISERS) {
    const result = sanitiser(value, context);
    if (result !== undefined) {
      return result;
    }
  }

  return serialiseWithJson(value);
}

function isJsonArrayValue(value: readonly unknown[], seen: WeakSet<WeakKey>): boolean {
  return withCircularGuard(
    value,
    { seen, undefinedStrategy: 'null' },
    () => false,
    () => value.every((entry) => isJsonValue(entry, seen)),
  );
}

function isJsonPlainObjectValue(value: PlainObject, seen: WeakSet<WeakKey>): boolean {
  return withCircularGuard(
    value,
    { seen, undefinedStrategy: 'null' },
    () => false,
    () => typeSafeValues(value).every((entry) => isJsonValue(entry, seen)),
  );
}

/**
 * Type guard to check if a value is JSON-safe
 * @param value - The value to check
 * @param seen - WeakSet to track seen objects during circular reference detection.
 * @returns True if the value can be safely serialised to JSON
 */
export function isJsonValue(value: unknown, seen = new WeakSet<WeakKey>()): value is JsonValue {
  if (isPrimitiveJsonValue(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return isJsonArrayValue(value, seen);
  }

  if (isPlainObject(value)) {
    return isJsonPlainObjectValue(value, seen);
  }

  return false;
}

/**
 * Converts an unknown value to a JSON-safe value.
 *
 * - Primitives pass through unchanged
 * - undefined becomes null
 * - Dates become ISO strings
 * - Errors become objects with message/stack/name
 * - Arrays/objects are recursively sanitised
 * - Unserializable values become '[unserializable]'
 *
 * @param value - The value to sanitise
 * @param seen - WeakSet for circular reference detection
 */
export function sanitiseForJson(value: unknown, seen = new WeakSet<WeakKey>()): JsonValue {
  const context: SanitiserContext = {
    seen,
    undefinedStrategy: 'null',
  };
  return sanitiseUnknown(value, context);
}

/**
 * Converts an object to a JSON-safe object or returns null when the input is not a plain object.
 * Strips undefined values and sanitises remaining values recursively.
 */
export function sanitiseObject(value: unknown): JsonObject | null {
  if (!isPlainObject(value)) {
    return null;
  }

  const context: SanitiserContext = {
    seen: new WeakSet<WeakKey>(),
    undefinedStrategy: 'omit',
  };

  context.seen.add(value);
  try {
    return buildJsonObject(collectObjectEntries(value, context));
  } finally {
    context.seen.delete(value);
  }
}
