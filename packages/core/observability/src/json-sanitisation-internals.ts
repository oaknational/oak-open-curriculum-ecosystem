/**
 * Internal helpers shared by JSON sanitisation utilities.
 */

import type { JsonValue } from './types.js';

/**
 * Plain object shape accepted by the sanitiser.
 */
type PlainObjectValue =
  | JsonValue
  | Date
  | Error
  | bigint
  | WeakKey
  | readonly PlainObjectValue[]
  | undefined;

export type PlainObject = Readonly<Record<string, PlainObjectValue>>;

/**
 * Strategy for handling `undefined` values during sanitisation.
 */
type UndefinedStrategy = 'null' | 'omit';

/**
 * Shared sanitiser execution context.
 */
export interface SanitiserContext {
  readonly seen: WeakSet<WeakKey>;
  readonly undefinedStrategy: UndefinedStrategy;
}

/**
 * Function signature for a single sanitisation step.
 */
export type ValueSanitiser = (value: unknown, context: SanitiserContext) => JsonValue | undefined;

/**
 * Checks whether a value is already a primitive JSON scalar.
 *
 * @param value - Candidate value
 * @returns `true` when the value is JSON-safe without further work
 */
export function isPrimitiveJsonValue(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Checks whether a value is a plain object rather than a class instance.
 *
 * @param value - Candidate value
 * @returns `true` for plain objects and `Object.create(null)` values
 */
export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Tracks visited references to detect circular structures.
 *
 * @param candidate - Reference being inspected
 * @param context - Sanitiser execution context
 * @param onCircular - Callback for previously-seen references
 * @param whenFresh - Callback for first-time references
 * @returns Callback result
 */
export function withCircularGuard<T>(
  candidate: WeakKey,
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
