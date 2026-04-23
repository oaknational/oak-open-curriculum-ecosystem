/**
 * Typed own-key helpers.
 *
 * TypeScript intentionally widens `Object.keys`, `Object.values`, and
 * `Object.entries`. These wrappers recover the caller's specific string-key
 * and value types without relying on type assertions.
 */

type StringKeyOf<T> = Extract<keyof T, string>;
type ValueOf<T> = T[StringKeyOf<T>];
type EntryOf<T> = [StringKeyOf<T>, ValueOf<T>];

function isOwnStringKey<T>(obj: T, key: string): key is StringKeyOf<T> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function typeSafeKeys<T>(obj: T): StringKeyOf<T>[] {
  const keys: StringKeyOf<T>[] = [];

  for (const key in Object(obj)) {
    if (isOwnStringKey(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
}

/** Typed values for own enumerable string keys. */
export function typeSafeValues<T>(obj: T): ValueOf<T>[] {
  const values: ValueOf<T>[] = [];

  for (const key of typeSafeKeys(obj)) {
    values.push(obj[key]);
  }

  return values;
}

/** Typed entries for own enumerable string keys. */
export function typeSafeEntries<T>(obj: T): EntryOf<T>[] {
  const entries: EntryOf<T>[] = [];

  for (const key of typeSafeKeys(obj)) {
    const entry: EntryOf<T> = [key, obj[key]];
    entries.push(entry);
  }

  return entries;
}

/** Typed value access (instead of Reflect.get) */
export function typeSafeGet<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/** Typed set (instead of Reflect.set) */
export function typeSafeSet<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

/** Membership check (instead of Reflect.has) */
export function typeSafeHas<T>(obj: T, key: PropertyKey): key is keyof T {
  return key in Object(obj);
}

/** Own-key check (typed) */
export function typeSafeHasOwn<T>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
