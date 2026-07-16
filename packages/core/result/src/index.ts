/**
 * Result type for explicit error handling without exceptions.
 *
 * Forces handling of both success and error cases at compile time.
 *
 * @example
 * ```typescript
 * import { ok, err, type Result } from '@oaknational/result';
 *
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) {
 *     return err('Division by zero');
 *   }
 *   return ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 * if (result.ok) {
 *   console.log('Result:', result.value);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */

import type { Err, Ok, Result } from './result-type.js';

export type { Err, Ok, Result } from './result-type.js';

/**
 * Creates a successful Result.
 *
 * @param value - The success value
 * @returns Ok result containing the value
 *
 * @example
 * ```typescript
 * const result = ok(42);
 * console.log(result.value); // 42
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

/**
 * Creates an error Result.
 *
 * @param error - The error value
 * @returns Err result containing the error
 *
 * @example
 * ```typescript
 * const result = err('Something went wrong');
 * console.log(result.error); // 'Something went wrong'
 * ```
 */
export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

/**
 * Type guard to check if a Result is Ok.
 *
 * @param result - The Result to check
 * @returns True if the result is Ok
 *
 * @example
 * ```typescript
 * if (isOk(result)) {
 *   console.log(result.value); // TypeScript knows this is Ok<T>
 * }
 * ```
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

/**
 * Type guard to check if a Result is Err.
 *
 * @param result - The Result to check
 * @returns True if the result is Err
 *
 * @example
 * ```typescript
 * if (isErr(result)) {
 *   console.error(result.error); // TypeScript knows this is Err<E>
 * }
 * ```
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

export { unwrap, unwrapErr, unwrapOr, unwrapOrElse } from './unwrapping.js';

/**
 * Maps an Ok value to a new value. Err values pass through unchanged.
 *
 * @param result - The Result to map
 * @param fn - Function to transform the Ok value
 * @returns New Result with transformed value
 *
 * @example
 * ```typescript
 * const result = ok(5);
 * const doubled = map(result, x => x * 2); // Ok(10)
 * ```
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}

/**
 * Chains Results together. If the first Result is Ok, applies the function.
 * If the first Result is Err, returns it unchanged.
 *
 * @param result - The Result to chain from
 * @param fn - Function that returns a new Result
 * @returns The chained Result
 *
 * @example
 * ```typescript
 * const result = ok(5);
 * const chained = flatMap(result, x => x > 0 ? ok(x * 2) : err('negative'));
 * ```
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

/**
 * Maps an Err value to a new error. Ok values pass through unchanged.
 *
 * @param result - The Result to map
 * @param fn - Function to transform the Err value
 * @returns New Result with transformed error
 *
 * @example
 * ```typescript
 * const result = err('file not found');
 * const mapped = mapErr(result, msg => `Error: ${msg}`);
 * ```
 */
export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return result.ok ? result : err(fn(result.error));
}

/**
 * Exhaustiveness guard that returns an `Err` instead of throwing.
 *
 * Call in the `default` branch of an exhaustive `switch` (or the final `else`)
 * over a discriminated union. The `value: never` parameter makes the compiler
 * reject the call if any variant is left unhandled — compile-time exhaustiveness
 * with no runtime `throw` (ADR-088, use-result-pattern). If the branch is reached
 * at runtime because data defeated the types, `makeError` is called with the
 * stringified unexpected value so the failure is debuggable, and the result flows
 * back as the `Err` arm rather than as an exception.
 *
 * @param value - The value narrowed to `never` by exhaustive handling of every variant
 * @param makeError - Builds the domain error from the stringified unexpected value
 * @returns Err result wrapping the built error
 *
 * @example
 * ```typescript
 * // In the default branch of an exhaustive switch over a discriminated union,
 * // after every known variant has returned ok(...):
 * return assertNeverResult(shape, (got) => new UnknownShapeError(got));
 * ```
 */
export function assertNeverResult<E>(value: never, makeError: (unexpected: string) => E): Err<E> {
  return err(makeError(String(value)));
}
