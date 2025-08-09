/**
 * @fileoverview Result type utilities for functional error handling
 * @module moria/types/result
 *
 * Provides utilities for working with Result types in a functional way.
 * These utilities make it easier to chain operations and handle errors as data.
 */

import type { Result } from './core';

/**
 * Creates a success Result
 */
export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

/**
 * Creates an error Result
 */
export const Err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

/**
 * Type guard for success Results
 */
export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => result.ok;

/**
 * Type guard for error Results
 */
export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => !result.ok;

/**
 * Maps a Result's success value to a new value
 */
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  if (isOk(result)) {
    return Ok(fn(result.value));
  }
  return result;
};

/**
 * Chains Result-returning operations (flatMap/bind)
 */
export const flatMapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => {
  if (isOk(result)) {
    return fn(result.value);
  }
  return result;
};

/**
 * Unwraps a Result, providing a default value for errors
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isOk(result)) {
    return result.value;
  }
  return defaultValue;
};

/**
 * Unwraps a Result, using a function to provide default for errors
 */
export const unwrapOrElse = <T, E>(result: Result<T, E>, fn: (error: E) => T): T => {
  if (isOk(result)) {
    return result.value;
  }
  return fn(result.error);
};

/**
 * Maps the error of a Result to a new error
 */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  if (isErr(result)) {
    return Err(fn(result.error));
  }
  return result;
};

/**
 * Combines multiple Results into a single Result
 * If all are Ok, returns Ok with array of values
 * If any are Err, returns the first Err
 */
export const combineResults = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const values: T[] = [];

  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    values.push(result.value);
  }

  return Ok(values);
};

/**
 * Tries to execute a function and wraps the result/error in a Result
 */
export const tryCatch = <T, E = Error>(
  fn: () => T,
  onError?: (error: unknown) => E,
): Result<T, E> => {
  try {
    return Ok(fn());
  } catch (error) {
    if (onError) {
      return Err(onError(error));
    }
    return Err(error as E);
  }
};

/**
 * Async version of tryCatch
 */
export const tryCatchAsync = async <T, E = Error>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => E,
): Promise<Result<T, E>> => {
  try {
    const value = await fn();
    return Ok(value);
  } catch (error) {
    if (onError) {
      return Err(onError(error));
    }
    return Err(error as E);
  }
};
