/* eslint-disable no-restricted-properties */

/**
 * Type safe object helpers
 *
 * These are last resort helpers, wherever possible refactor the code to use the more specific helpers.
 */

export function typeSafeKeys<T extends object>(obj: T): Extract<keyof T, string>[] {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  return Object.keys(obj) as Extract<keyof T, string>[];
}

/** Typed values (Object.values) */
export function typeSafeValues<T extends object>(obj: T): T[keyof T][] {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  return Object.values(obj) as T[keyof T][];
}

/** Typed entries (Object.entries) */
export function typeSafeEntries<T extends object>(
  obj: T,
): [Extract<keyof T, string>, T[Extract<keyof T, string>]][] {
  type K = Extract<keyof T, string>;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  return Object.entries(obj) as [K, T[K]][];
}

/** Typed fromEntries (Object.fromEntries) */
export function typeSafeFromEntries<K extends PropertyKey, V>(
  iter: Iterable<readonly [K, V]>,
): Record<K, V> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  return Object.fromEntries(iter) as Record<K, V>;
}

/** Typed value access (instead of Reflect.get) */
export function typeSafeGet<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/** Typed set (instead of Reflect.set) */
export function typeSafeSet<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
): void {
  obj[key] = value;
}

/** Membership check (instead of Reflect.has) */
export function typeSafeHas<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

/** Own-key check (typed) */
export function typeSafeHasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(obj, key);
}

/** All own keys (instead of Reflect.ownKeys) */
export function typeSafeOwnKeys<T extends object>(obj: T): (keyof T)[] {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  const names = Object.getOwnPropertyNames(obj) as Extract<keyof T, string>[];
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  const symbols = Object.getOwnPropertySymbols(obj) as Extract<keyof T, symbol>[];
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vetted for this helper
  return [...names, ...symbols] as (keyof T)[];
}
