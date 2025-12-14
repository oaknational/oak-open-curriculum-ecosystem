/* eslint-disable max-lines -- File length is inherent to the sanitisation pipeline */
/**
 * JSON sanitisation utilities for converting arbitrary values to JSON-safe formats
 *
 * This module handles circular reference detection using WeakSet<object>.
 * The `object` type constraint is inherent to WeakSet - it requires reference types
 * (non-primitives) because it tracks object identity for cycle detection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
 */

import type { JsonValue, JsonObject } from './types.js';

const CIRCULAR_REFERENCE_PLACEHOLDER = '[Circular]';
const UNSERIALISABLE_PLACEHOLDER = '[unserializable]';

/**
 * Represents any value that could potentially be converted to JSON.
 * The `object` type here is intentionally broad to accept any non-primitive
 * that might need sanitisation before JSON serialisation.
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- Intentionally broad: accepts any non-primitive for sanitisation
type JsonLike = JsonValue | Date | Error | object | undefined;

/**
 * A plain object with string keys and JSON-like values.
 */
type PlainObject = Record<string, JsonLike>;

type UndefinedStrategy = 'null' | 'omit';

/**
 * Context for the sanitisation process.
 *
 * The `seen` WeakSet uses `object` type constraint because WeakSet requires
 * reference types for identity-based tracking. This is fundamental to
 * circular reference detection - we need to track which exact object instances
 * have been visited, not their values.
 */
interface SanitiserContext {
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
  readonly seen: WeakSet<object>;
  readonly undefinedStrategy: UndefinedStrategy;
}

type ValueSanitiser = (value: unknown, context: SanitiserContext) => JsonValue | undefined;

function isPrimitiveJsonValue(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Guards against circular references by tracking visited objects.
 * The `object` type for `candidate` is required because we need reference
 * identity comparison - primitives would always compare by value.
 */
function withCircularGuard<T>(
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- Required: reference identity for cycle detection
  candidate: object,
  context: SanitiserContext,
  onCircular: () => T,
  whenFresh: () => T,
): T {
  if (context.seen.has(candidate)) {
    return onCircular();
  }

  context.seen.add(candidate);
  try {
    return whenFresh();
  } finally {
    context.seen.delete(candidate);
  }
}

function normaliseError(error: Error): JsonObject {
  const entries: [string, JsonValue][] = [
    ['message', error.message],
    ['name', error.name],
  ];

  if (typeof error.stack === 'string') {
    entries.push(['stack', error.stack]);
  }

  return Object.fromEntries(entries);
}

function collectObjectEntries(
  source: PlainObject,
  context: SanitiserContext,
): [string, JsonValue][] {
  const entries: [string, JsonValue][] = [];

  // Object.entries on PlainObject (Record<string, JsonLike>) preserves type information
  // eslint-disable-next-line no-restricted-properties -- Legitimate: iterating plain object for sanitisation
  for (const [key, rawValue] of Object.entries(source)) {
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
    () => Object.fromEntries(collectObjectEntries(source, context)),
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

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
function isJsonArrayValue(value: readonly unknown[], seen: WeakSet<object>): boolean {
  return withCircularGuard(
    value,
    { seen, undefinedStrategy: 'null' },
    () => false,
    () => value.every((entry) => isJsonValue(entry, seen)),
  );
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
function isJsonPlainObjectValue(value: PlainObject, seen: WeakSet<object>): boolean {
  return withCircularGuard(
    value,
    { seen, undefinedStrategy: 'null' },
    () => false,
    // Object.values on PlainObject preserves type information for validation
    // eslint-disable-next-line no-restricted-properties -- Legitimate: iterating plain object values
    () => Object.values(value).every((entry) => isJsonValue(entry, seen)),
  );
}

/**
 * Type guard to check if a value is JSON-safe
 * @param value - The value to check
 * @param seen - WeakSet to track seen objects (for circular reference detection).
 *               Uses `object` type because WeakSet requires reference types for identity tracking.
 * @returns True if the value can be safely serialised to JSON
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
export function isJsonValue(value: unknown, seen = new WeakSet<object>()): value is JsonValue {
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
 * @param seen - WeakSet for circular reference detection (uses `object` type for identity tracking)
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
export function sanitiseForJson(value: unknown, seen = new WeakSet<object>()): JsonValue {
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
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- WeakSet requires object type for reference identity tracking
    seen: new WeakSet<object>(),
    undefinedStrategy: 'omit',
  };

  context.seen.add(value);
  try {
    return Object.fromEntries(collectObjectEntries(value, context));
  } finally {
    context.seen.delete(value);
  }
}
