/**
 * Type safe object helpers
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

/**
 * Narrow unknown to a plain object (non-null, non-array)
 */
export function isPlainObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Get own string property if present and a string
 */
export function getOwnString(obj: unknown, key: PropertyKey): string | undefined {
  if (!isPlainObject(obj)) {
    return undefined;
  }
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return typeof desc?.value === 'string' ? desc.value : undefined;
}

/**
 * Get own boolean property if present and a boolean
 */
export function getOwnBoolean(obj: unknown, key: PropertyKey): boolean | undefined {
  if (!isPlainObject(obj)) {
    return undefined;
  }
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return typeof desc?.value === 'boolean' ? desc.value : undefined;
}

/**
 * Get the length of an own array property, if present
 */
export function getOwnArrayLength(obj: unknown, key: PropertyKey): number | undefined {
  if (!isPlainObject(obj)) {
    return undefined;
  }
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return Array.isArray(desc?.value) ? desc.value.length : undefined;
}

/**
 * Get an own property value (untyped)
 */
export function getOwnValue(obj: unknown, key: PropertyKey): unknown {
  if (!isPlainObject(obj)) {
    return undefined;
  }
  const desc = Object.getOwnPropertyDescriptor(obj, key);
  return desc?.value;
}
