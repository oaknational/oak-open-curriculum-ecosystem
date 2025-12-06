/**
 * @module result
 * @description Result type for explicit error handling without exceptions.
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

/**
 * Result type representing either success (Ok) or failure (Err).
 * Forces explicit handling of both cases.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Successful result containing a value.
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * Error result containing an error value.
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

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

/**
 * Unwraps an Ok value or throws an error.
 * Use with caution - prefer explicit error handling with isOk/isErr.
 *
 * @param result - The Result to unwrap
 * @returns The Ok value
 * @throws Error if the result is Err
 *
 * @example
 * ```typescript
 * const value = unwrap(result); // Throws if result is Err
 * ```
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw new Error(`Called unwrap on Err: ${String(result.error)}`);
}

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
 * Returns the Ok value or a default value if Err.
 *
 * @param result - The Result to unwrap
 * @param defaultValue - Value to return if result is Err
 * @returns The Ok value or the default
 *
 * @example
 * ```typescript
 * const value = unwrapOr(result, 0); // Returns 0 if result is Err
 * ```
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue;
}

/**
 * Returns the Ok value or computes a default from the error.
 *
 * @param result - The Result to unwrap
 * @param fn - Function to compute default from error
 * @returns The Ok value or the computed default
 *
 * @example
 * ```typescript
 * const value = unwrapOrElse(result, err => err.length);
 * ```
 */
export function unwrapOrElse<T, E>(result: Result<T, E>, fn: (error: E) => T): T {
  return result.ok ? result.value : fn(result.error);
}

