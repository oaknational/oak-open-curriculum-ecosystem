/**
 * Result-to-value unwrapping helpers — the package's escape hatches from
 * the Result world into plain values and, for the throwing pair, into
 * exceptions at a single sanctioned edge.
 */

import type { Result } from './result-type.js';

/**
 * The package's single sanctioned Result-to-exception edge (ADR-088
 * boundary translation). Every unwrapping failure funnels through this one
 * `throw`, so the escape hatch stays consolidated while each caller keeps
 * a first-class failure message.
 */
function raise(message: string): never {
  throw new Error(message);
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
  return raise(`Called unwrap on Err: ${String(result.error)}`);
}

/**
 * Unwraps an Err's error value or throws — `unwrap`'s inverse, for
 * asserting on an expected failure without a conditional branch around
 * the assertions.
 *
 * @remarks
 * The failure message renders the unexpected Ok value with
 * `JSON.stringify`, not the `String` that `unwrap` uses: an Ok payload is
 * typically structured data that `String` would flatten to
 * `[object Object]`, while an Err payload is typically an `Error`, which
 * `JSON.stringify` would flatten to `{}`.
 *
 * @param result - The Result expected to be an Err
 * @returns The error value
 * @throws Error if the result is Ok — fails loud instead of letting the
 * assertions that follow be skipped
 *
 * @example
 * ```typescript
 * const error = unwrapErr(parseArgs(['--bogus'])); // Throws if parsing succeeded
 * ```
 */
export function unwrapErr<T, E>(result: Result<T, E>): E {
  if (!result.ok) {
    return result.error;
  }
  return raise(`Called unwrapErr on Ok: ${JSON.stringify(result.value)}`);
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
