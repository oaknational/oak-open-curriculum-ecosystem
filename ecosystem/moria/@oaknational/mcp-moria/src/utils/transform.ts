/**
 * @fileoverview Data transformation utilities
 * @module moria/utils/transform
 *
 * Provides pure transformation functions for common data operations.
 * No external dependencies, suitable for any environment.
 */

// Object Transformations

/**
 * Map object values
 */
export const mapObject = <T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value, key);
  }
  return result;
};

/**
 * Filter object entries
 */
export const filterObject = <T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Pick specific keys from object
 */
export const pickKeys = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Omit specific keys from object
 */
export const omitKeys = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
};

/**
 * Rename object keys
 */
export const renameKeys = <T extends Record<string, unknown>>(
  obj: T,
  keyMap: Partial<Record<keyof T, string>>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const [oldKey, value] of Object.entries(obj)) {
    const newKey = keyMap[oldKey as keyof T] || oldKey;
    result[newKey] = value;
  }

  return result;
};

/**
 * Merge multiple objects
 */
export const mergeObjects = <T extends Record<string, unknown>>(
  ...objects: T[]
): T => {
  return Object.assign({}, ...objects) as T;
};

// Deep Operations

/**
 * Deep clone a value
 */
export const deepClone = <T>(value: T): T => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof Array) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }

  if (value instanceof Object) {
    const cloned = {} as T;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloned[key] = deepClone(value[key]);
      }
    }
    return cloned;
  }

  return value;
};

/**
 * Deep merge objects
 */
export const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
};

/**
 * Flatten nested object
 */
export const flattenObject = (
  obj: Record<string, unknown>,
  separator: string = '.'
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  const flatten = (current: unknown, prefix: string = '') => {
    if (current === null || current === undefined) {
      result[prefix] = current;
    } else if (typeof current === 'object') {
      if (Array.isArray(current)) {
        current.forEach((item, index) => {
          flatten(item, prefix ? `${prefix}${separator}${index}` : `${index}`);
        });
      } else {
        for (const [key, value] of Object.entries(current)) {
          flatten(value, prefix ? `${prefix}${separator}${key}` : key);
        }
      }
    } else {
      result[prefix] = current;
    }
  };

  flatten(obj);
  return result;
};

/**
 * Unflatten dot-notation object
 */
export const unflattenObject = (
  flat: Record<string, unknown>,
  separator: string = '.'
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(separator);
    let current: any = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      const isArrayIndex = /^\d+$/.test(nextPart);

      if (!(part in current)) {
        current[part] = isArrayIndex ? [] : {};
      }

      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  return result;
};

// Array Transformations

/**
 * Group array by key function
 */
export const groupBy = <T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> => {
  const result: Record<string, T[]> = {};

  for (const item of items) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
};

/**
 * Create object keyed by function result
 */
export const keyBy = <T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T> => {
  const result: Record<string, T> = {};

  for (const item of items) {
    const key = keyFn(item);
    result[key] = item;
  }

  return result;
};

/**
 * Partition array by predicate
 */
export const partition = <T>(
  items: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];

  for (const item of items) {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }

  return [pass, fail];
};

/**
 * Split array into chunks
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

/**
 * Zip arrays together
 */
export const zip = <T>(...arrays: T[][]): T[][] => {
  if (arrays.length === 0) return [];

  const minLength = Math.min(...arrays.map((arr) => arr.length));
  const result: T[][] = [];

  for (let i = 0; i < minLength; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }

  return result;
};

/**
 * Unzip array of tuples
 */
export const unzip = <T>(tuples: T[][]): T[][] => {
  if (tuples.length === 0) return [];

  const width = tuples[0].length;
  const result: T[][] = Array(width)
    .fill(null)
    .map(() => []);

  for (const tuple of tuples) {
    for (let i = 0; i < width; i++) {
      result[i].push(tuple[i]);
    }
  }

  return result;
};

/**
 * Get unique array elements
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Get unique elements by key function
 */
export const uniqueBy = <T>(array: T[], keyFn: (item: T) => unknown): T[] => {
  const seen = new Set();
  const result: T[] = [];

  for (const item of array) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};

/**
 * Get intersection of arrays
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];

  const [first, ...rest] = arrays;
  const sets = rest.map((arr) => new Set(arr));

  return first.filter((item) => sets.every((set) => set.has(item)));
};

/**
 * Get difference of arrays (items in first but not in others)
 */
export const difference = <T>(array: T[], ...others: T[][]): T[] => {
  const otherSets = others.map((arr) => new Set(arr));

  return array.filter((item) => !otherSets.some((set) => set.has(item)));
};

// Function Composition

/**
 * Pipe functions left to right
 */
export const pipe = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) => {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
};

/**
 * Compose functions right to left
 */
export const compose = <T>(...fns: Array<(arg: T) => T>): ((arg: T) => T) => {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
};

// Function Utilities

/**
 * Debounce function calls
 * Note: Requires runtime with setTimeout/clearTimeout support
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: any;
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    // Fallback for environments without setTimeout
    if (typeof globalThis !== 'undefined' && 'setTimeout' in globalThis) {
      const clear = (globalThis as any).clearTimeout;
      const set = (globalThis as any).setTimeout;

      if (clear) clear(timeoutId);
      timeoutId = set(() => fn(...args), delay);
    } else {
      // Simple time-based check without timer
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    }
  };
};

/**
 * Throttle function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Memoize function results
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Ensure function is called only once
 */
export const once = <T extends (...args: any[]) => any>(fn: T): T => {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
};

/**
 * Curry a function
 */
export const curry = <T extends (...args: any[]) => any>(
  fn: T,
  arity: number = fn.length
): any => {
  return function curried(...args: any[]): any {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
};

/**
 * Partially apply function arguments
 */
export const partial = <T extends (...args: any[]) => any>(
  fn: T,
  ...partialArgs: any[]
): ((...args: any[]) => ReturnType<T>) => {
  return (...args: any[]) => fn(...partialArgs, ...args);
};
