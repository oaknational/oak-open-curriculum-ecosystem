/**
 * @fileoverview Result<T,E> type - functional error handling
 * @module @oak-mcp-core/errors
 *
 * Result represents the outcome of an operation that can fail.
 * Instead of throwing exceptions, operations return Result.
 * This makes errors explicit in the type system and composable.
 *
 * Inspired by Rust's Result type and functional programming patterns.
 */

/**
 * Result type - represents success (ok) or failure (err)
 * Uses discriminated union for type safety
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

/**
 * ValidationResult compatibility type
 * Used for converting from existing validation patterns
 */
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Result namespace with static methods for working with Results
 * Provides functional combinators and utilities
 */
export const Result = {
  /**
   * Create a successful Result
   *
   * @param value - The success value
   * @returns A Result with ok: true
   */
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },

  /**
   * Create an error Result
   *
   * @param error - The error value
   * @returns A Result with ok: false
   */
  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },

  /**
   * Map a function over the success value
   * If the Result is an error, passes it through unchanged
   *
   * @param result - The Result to map over
   * @param fn - Function to apply to success value
   * @returns A new Result with transformed value or same error
   */
  map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    if (result.ok) {
      return Result.ok(fn(result.value));
    }
    return result;
  },

  /**
   * FlatMap (bind) - chain operations that return Results
   * Enables sequential error handling
   *
   * @param result - The Result to flatMap over
   * @param fn - Function that returns a Result
   * @returns The Result from fn or the original error
   */
  flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    if (result.ok) {
      return fn(result.value);
    }
    return result;
  },

  /**
   * Pattern matching for Results
   * Handles both success and error cases
   *
   * @param result - The Result to match
   * @param handlers - Object with ok and err handlers
   * @returns The value returned by the matching handler
   */
  match<T, E, R>(
    result: Result<T, E>,
    handlers: {
      ok: (value: T) => R;
      err: (error: E) => R;
    },
  ): R {
    if (result.ok) {
      return handlers.ok(result.value);
    }
    return handlers.err(result.error);
  },

  /**
   * Check if a Result is successful
   *
   * @param result - The Result to check
   * @returns True if ok, false otherwise
   */
  isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
    return result.ok;
  },

  /**
   * Check if a Result is an error
   *
   * @param result - The Result to check
   * @returns True if error, false otherwise
   */
  isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
    return !result.ok;
  },

  /**
   * Unwrap the value or throw the error
   * Use sparingly - prefer match or map
   *
   * @param result - The Result to unwrap
   * @returns The success value
   * @throws The error if Result is not ok
   */
  unwrap<T, E>(result: Result<T, E>): T {
    if (result.ok) {
      return result.value;
    }
    throw new Error(`Failed to unwrap Result: ${String(result.error)}`);
  },

  /**
   * Unwrap the value or return a default
   *
   * @param result - The Result to unwrap
   * @param defaultValue - Value to return if Result is error
   * @returns The success value or default
   */
  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.ok) {
      return result.value;
    }
    return defaultValue;
  },

  /**
   * Convert from ValidationResult to Result
   * Bridges existing validation patterns
   *
   * @param validation - ValidationResult to convert
   * @returns Result with data or errors
   */
  fromValidation<T>(validation: ValidationResult<T>): Result<T, string[]> {
    if (validation.valid && validation.data !== undefined) {
      return Result.ok(validation.data);
    }
    return Result.err(validation.errors ?? ['Unknown error']);
  },

  /**
   * Convert a Promise to a Result
   * Catches exceptions and converts to Result
   *
   * @param promise - Promise to convert
   * @returns Promise of Result
   */
  async fromPromise<T>(promise: Promise<T>): Promise<Result<T>> {
    try {
      const value = await promise;
      return Result.ok(value);
    } catch (error) {
      if (error instanceof Error) {
        return Result.err(error);
      }
      return Result.err(new Error(String(error)));
    }
  },

  /**
   * Collect an array of Results into a Result of array
   * Fails on first error (fail-fast)
   *
   * @param results - Array of Results to collect
   * @returns Result with array of values or first error
   */
  collect<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];

    for (const result of results) {
      if (!result.ok) {
        return result;
      }
      values.push(result.value);
    }

    return Result.ok(values);
  },

  /**
   * Map over error value
   * If the Result is ok, passes it through unchanged
   *
   * @param result - The Result to map error
   * @param fn - Function to apply to error value
   * @returns A new Result with same value or transformed error
   */
  mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    if (!result.ok) {
      return Result.err(fn(result.error));
    }
    return result;
  },

  /**
   * Try to execute a function and return Result
   * Catches exceptions and converts to error Result
   *
   * @param fn - Function to try
   * @returns Result with return value or caught error
   */
  try<T>(fn: () => T): Result<T> {
    try {
      return Result.ok(fn());
    } catch (error) {
      if (error instanceof Error) {
        return Result.err(error);
      }
      return Result.err(new Error(String(error)));
    }
  },

  /**
   * Async version of try
   *
   * @param fn - Async function to try
   * @returns Promise of Result
   */
  async tryAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
    return Result.fromPromise(fn());
  },
};
