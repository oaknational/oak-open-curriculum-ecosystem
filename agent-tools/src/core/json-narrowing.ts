/**
 * Pure narrowing primitives for values decoded from an external JSON boundary.
 *
 * @remarks
 * After `JSON.parse`, a value is `unknown`. These helpers narrow it to the
 * exact expected primitive shape with explicit guards — no type assertions and
 * no widening to `Record<string, unknown>`. To narrow to a specific object
 * shape, a consumer declares an interface whose fields are optional `unknown`
 * and wraps {@link isPlainObject} in its own typed predicate, e.g.
 *
 * ```ts
 * interface Payload { readonly id?: unknown; }
 * const isPayload = (value: unknown): value is Payload => isPlainObject(value);
 * ```
 *
 * The wrap is sound because every field is optional `unknown`: any non-null,
 * non-array object satisfies the shape. This is the pattern already used by
 * `core/json-parsing.ts`.
 *
 * @packageDocumentation
 */

/**
 * Whether the value is a non-null, non-array object.
 *
 * @remarks
 * Wrap this in a typed predicate (`value is YourShape`) at the call site to
 * narrow an `unknown` to an interface of optional `unknown` fields.
 */
export function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Narrow an unknown value to a trimmed, non-empty string, or `undefined`.
 *
 * @returns The trimmed string when the value is a string with non-whitespace
 *   content; otherwise `undefined`.
 */
export function nonBlankString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}
