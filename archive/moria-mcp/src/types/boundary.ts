/**
 * @fileoverview Boundary pattern type definitions
 * @module moria/types/boundary
 *
 * Provides type markers for functional core / imperative shell pattern.
 * These types help distinguish between pure and effectful code.
 */

/**
 * Marker type for pure functions/values
 * Pure code has no side effects and is deterministic
 */
export type Pure<T> = T;

/**
 * Marker type for effectful operations
 * Effects are typically asynchronous and may have side effects
 */
export type Effect<T> = Promise<T>;

/**
 * Boundary between pure and effectful code
 * Useful for organizing code following functional core / imperative shell pattern
 */
export interface Boundary<TPure, TEffect> {
  /**
   * The pure, functional core
   */
  pure: Pure<TPure>;

  /**
   * The effectful, imperative shell
   */
  effect: Effect<TEffect>;
}

/**
 * Function that transforms pure values
 */
export type PureTransform<TInput, TOutput> = (input: Pure<TInput>) => Pure<TOutput>;

/**
 * Function that performs effects
 */
export type EffectfulOperation<TInput, TOutput> = (input: TInput) => Effect<TOutput>;

/**
 * Adapter from pure to effectful
 */
export type PureToEffect<T> = (value: Pure<T>) => Effect<T>;

/**
 * Adapter from effectful to pure (requires awaiting)
 */
export type EffectToPure<T> = (effect: Effect<T>) => Promise<Pure<T>>;

/**
 * Command in command-query separation
 * Commands change state but return nothing
 */
export type Command<TInput> = (input: TInput) => Effect<void>;

/**
 * Query in command-query separation
 * Queries return data but don't change state
 */
export type Query<TInput, TOutput> = (input: TInput) => Pure<TOutput>;

/**
 * Async query that doesn't change state
 */
export type AsyncQuery<TInput, TOutput> = (input: TInput) => Effect<TOutput>;

/**
 * IO boundary marker
 * All IO operations should be marked with this type
 */
export type IO<T> = Effect<T>;

/**
 * Computation that can be pure or effectful
 */
export type Computation<T> = Pure<T> | Effect<T>;

/**
 * Helper to check if a computation is pure
 */
export const isPure = <T>(computation: Computation<T>): computation is Pure<T> => {
  return !(computation instanceof Promise);
};

/**
 * Helper to check if a computation is effectful
 */
export const isEffect = <T>(computation: Computation<T>): computation is Effect<T> => {
  return computation instanceof Promise;
};

/**
 * Lift a pure value into an effect
 */
export const liftPure = <T>(value: Pure<T>): Effect<T> => {
  return Promise.resolve(value);
};

/**
 * Map over an effect
 */
export const mapEffect = <T, U>(effect: Effect<T>, fn: (value: T) => U): Effect<U> => {
  return effect.then(fn);
};

/**
 * Chain effects
 */
export const chainEffect = <T, U>(effect: Effect<T>, fn: (value: T) => Effect<U>): Effect<U> => {
  return effect.then(fn);
};

/**
 * Combine multiple effects into one
 */
export const combineEffects = <T>(effects: Effect<T>[]): Effect<T[]> => {
  return Promise.all(effects);
};

/**
 * Sequence effects to run one after another
 */
export const sequenceEffects = async <T>(effects: (() => Effect<T>)[]): Promise<T[]> => {
  const results: T[] = [];
  for (const effect of effects) {
    results.push(await effect());
  }
  return results;
};
