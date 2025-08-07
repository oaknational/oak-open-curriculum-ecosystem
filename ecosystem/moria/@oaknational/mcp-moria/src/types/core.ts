/**
 * @fileoverview Core type definitions for Moria
 * @module moria/types/core
 *
 * Fundamental types with zero dependencies.
 * These types establish patterns for type safety and functional programming.
 */

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Async version of Result
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Optional type (value or undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Nullable type (value or null)
 */
export type Nullable<T> = T | null;

/**
 * Maybe type (value, null, or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<K, DeepReadonly<V>>
      : T extends Set<infer S>
        ? ReadonlySet<DeepReadonly<S>>
        : T extends object
          ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
          : T;

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends Map<infer K, infer V>
      ? Map<K, DeepPartial<V>>
      : T extends Set<infer S>
        ? Set<DeepPartial<S>>
        : T extends object
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : T;

/**
 * Primitive types
 */
export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;

/**
 * JSON value types
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

/**
 * JSON object type
 */
export type JsonObject = {
  [key: string]: JsonValue;
};

/**
 * JSON array type
 */
export type JsonArray = JsonValue[];

/**
 * Brand type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Tagged union helper
 */
export type Tagged<Tag extends string, T = {}> = T & { _tag: Tag };

/**
 * Opaque type for hiding implementation
 */
export type Opaque<T, Token> = T & { __opaque: Token };

/**
 * Extract keys of type T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Pick properties by value type
 */
export type PickByType<T, V> = Pick<T, KeysOfType<T, V>>;

/**
 * Omit properties by value type
 */
export type OmitByType<T, V> = Omit<T, KeysOfType<T, V>>;

/**
 * Required keys
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Optional keys
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Function type
 */
export type Fn<TArgs extends any[] = any[], TReturn = any> = (
  ...args: TArgs
) => TReturn;

/**
 * Async function type
 */
export type AsyncFn<TArgs extends any[] = any[], TReturn = any> = (
  ...args: TArgs
) => Promise<TReturn>;

/**
 * Constructor type
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

/**
 * Mixin type
 */
export type Mixin<T extends Constructor> = <TBase extends Constructor>(
  Base: TBase
) => TBase & T;

/**
 * Union to intersection
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Tuple to union
 */
export type TupleToUnion<T extends readonly any[]> = T[number];

/**
 * Last element of tuple
 */
export type Last<T extends readonly any[]> = T extends readonly [
  ...any[],
  infer L,
]
  ? L
  : never;

/**
 * Length of tuple
 */
export type Length<T extends readonly any[]> = T['length'];

/**
 * Tail of tuple (all but first)
 */
export type Tail<T extends readonly any[]> = T extends readonly [
  any,
  ...infer Rest,
]
  ? Rest
  : [];

/**
 * Head of tuple (first element)
 */
export type Head<T extends readonly any[]> = T extends readonly [
  infer H,
  ...any[],
]
  ? H
  : never;

/**
 * Strict type (no excess properties)
 */
export type Strict<T> = T & { [K in keyof T]: T[K] };

/**
 * Promisify a value
 */
export type Promisify<T> = T extends Promise<infer U> ? Promise<U> : Promise<T>;

/**
 * Awaited type (unwrap promises recursively)
 */
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

/**
 * Path type for nested object access
 */
export type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? K | `${K}.${Path<T[K], keyof T[K]>}`
    : K
  : never;

/**
 * Path value type
 */
export type PathValue<
  T,
  P extends Path<T>,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;
