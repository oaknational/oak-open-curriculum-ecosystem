/**
 * Example: Maybe<T> Type Implementation
 * 
 * Shared by: Marple
 * Date: 2025-01-08
 * 
 * This demonstrates a potential Maybe<T> type that could be added to the shared
 * abstractions package. It complements the Result<T,E> type for handling nullable
 * values in a functional way.
 * 
 * This example answers Poirot's question about including Maybe<T>/Option<T>.
 */

/**
 * Maybe type - represents a value that may or may not exist
 * Similar to Option<T> in Rust or Maybe<T> in Haskell
 */
export type Maybe<T> = { some: true; value: T } | { some: false };

/**
 * Helper to create a Some variant
 */
export const Some = <T>(value: T): Maybe<T> => ({
  some: true,
  value,
});

/**
 * Helper to create a None variant
 */
export const None = <T = never>(): Maybe<T> => ({
  some: false,
});

/**
 * Type guard to check if a Maybe has a value
 */
export const isSome = <T>(maybe: Maybe<T>): maybe is { some: true; value: T } => 
  maybe.some;

/**
 * Type guard to check if a Maybe is None
 */
export const isNone = <T>(maybe: Maybe<T>): maybe is { some: false } => 
  !maybe.some;

/**
 * Map a function over a Maybe
 */
export const mapMaybe = <T, U>(
  maybe: Maybe<T>,
  fn: (value: T) => U
): Maybe<U> => {
  if (isSome(maybe)) {
    return Some(fn(maybe.value));
  }
  return None();
};

/**
 * FlatMap for Maybe (also known as bind or chain)
 */
export const flatMapMaybe = <T, U>(
  maybe: Maybe<T>,
  fn: (value: T) => Maybe<U>
): Maybe<U> => {
  if (isSome(maybe)) {
    return fn(maybe.value);
  }
  return None();
};

/**
 * Get the value or a default
 */
export const unwrapOrMaybe = <T>(maybe: Maybe<T>, defaultValue: T): T => {
  if (isSome(maybe)) {
    return maybe.value;
  }
  return defaultValue;
};

/**
 * Convert nullable value to Maybe
 */
export const fromNullable = <T>(value: T | null | undefined): Maybe<T> => {
  if (value !== null && value !== undefined) {
    return Some(value);
  }
  return None();
};

/**
 * Convert Maybe to nullable
 */
export const toNullable = <T>(maybe: Maybe<T>): T | null => {
  if (isSome(maybe)) {
    return maybe.value;
  }
  return null;
};

/**
 * Combine with Result for powerful error handling
 * Example: Maybe<Result<T, E>> for optional operations that can fail
 */
export type MaybeResult<T, E = Error> = Maybe<Result<T, E>>;

// Result type (imported from existing implementation)
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Example usage combining Maybe and Result
 */
export const tryParseOptionalNumber = (
  value: string | undefined
): MaybeResult<number, string> => {
  if (value === undefined) {
    return None();
  }
  
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return Some({ ok: false, error: 'Invalid number format' });
  }
  
  return Some({ ok: true, value: parsed });
};

/**
 * Example: Async operations with Maybe
 * Addresses Poirot's question about async variants
 */
export const asyncMapMaybe = async <T, U>(
  maybe: Maybe<T>,
  fn: (value: T) => Promise<U>
): Promise<Maybe<U>> => {
  if (isSome(maybe)) {
    const result = await fn(maybe.value);
    return Some(result);
  }
  return None();
};

/**
 * Example: Combining multiple Maybes (similar to Promise.all)
 */
export const sequenceMaybes = <T>(maybes: Maybe<T>[]): Maybe<T[]> => {
  const values: T[] = [];
  
  for (const maybe of maybes) {
    if (isSome(maybe)) {
      values.push(maybe.value);
    } else {
      return None();
    }
  }
  
  return Some(values);
};