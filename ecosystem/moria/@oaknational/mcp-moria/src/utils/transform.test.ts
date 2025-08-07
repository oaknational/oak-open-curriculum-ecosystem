/**
 * @fileoverview Tests for transformation utilities
 * @module moria/utils/transform.test
 */

import { describe, it, expect } from 'vitest';
import {
  mapObject,
  filterObject,
  pickKeys,
  omitKeys,
  renameKeys,
  mergeObjects,
  deepClone,
  deepMerge,
  flattenObject,
  unflattenObject,
  groupBy,
  keyBy,
  partition,
  chunk,
  zip,
  unzip,
  unique,
  uniqueBy,
  intersection,
  difference,
  pipe,
  compose,
  debounce,
  throttle,
  memoize,
  once,
  curry,
  partial,
} from './transform';

describe('Object Transformations', () => {
  describe('mapObject', () => {
    it('should map object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapObject(obj, (value) => value * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should provide key to mapper function', () => {
      const obj = { a: 1, b: 2 };
      const result = mapObject(obj, (value, key) => `${key}:${value}`);
      expect(result).toEqual({ a: 'a:1', b: 'b:2' });
    });

    it('should handle empty objects', () => {
      const result = mapObject({}, (v) => v);
      expect(result).toEqual({});
    });
  });

  describe('filterObject', () => {
    it('should filter object entries', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = filterObject(obj, (value) => value > 2);
      expect(result).toEqual({ c: 3, d: 4 });
    });

    it('should provide key to predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterObject(obj, (_, key) => key !== 'b');
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('pickKeys', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = pickKeys(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should ignore non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      const result = pickKeys(obj, ['a', 'c' as keyof typeof obj]);
      expect(result).toEqual({ a: 1 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2 };
      const result = pickKeys(obj, []);
      expect(result).toEqual({});
    });
  });

  describe('omitKeys', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omitKeys(obj, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      const result = omitKeys(obj, ['c' as keyof typeof obj]);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('renameKeys', () => {
    it('should rename object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = renameKeys(obj, { a: 'x', b: 'y' });
      expect(result).toEqual({ x: 1, y: 2, c: 3 });
    });

    it('should handle overlapping renames', () => {
      const obj = { a: 1, b: 2 };
      const result = renameKeys(obj, { a: 'b', b: 'a' });
      expect(result).toEqual({ a: 2, b: 1 });
    });
  });

  describe('mergeObjects', () => {
    it('should merge multiple objects', () => {
      const result = mergeObjects(
        { a: 1, b: 2 },
        { b: 3, c: 4 },
        { c: 5, d: 6 }
      );
      expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
    });

    it('should handle empty arguments', () => {
      const result = mergeObjects();
      expect(result).toEqual({});
    });

    it('should preserve later values', () => {
      const result = mergeObjects({ a: 1 }, { a: 2 }, { a: 3 });
      expect(result).toEqual({ a: 3 });
    });
  });
});

describe('Deep Operations', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone arrays deeply', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2, d: [3, 4] } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });

    it('should handle dates', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });

  describe('deepMerge', () => {
    it('should merge nested objects', () => {
      const obj1 = { a: 1, b: { c: 2, d: 3 } };
      const obj2 = { b: { d: 4, e: 5 }, f: 6 };
      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 4, e: 5 },
        f: 6,
      });
    });

    it('should merge arrays by replacement', () => {
      const obj1 = { arr: [1, 2] };
      const obj2 = { arr: [3, 4, 5] };
      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({ arr: [3, 4, 5] });
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested objects', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };
      const result = flattenObject(obj);
      expect(result).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });

    it('should handle arrays', () => {
      const obj = {
        a: [1, 2, 3],
        b: { c: [4, 5] },
      };
      const result = flattenObject(obj);
      expect(result).toEqual({
        'a.0': 1,
        'a.1': 2,
        'a.2': 3,
        'b.c.0': 4,
        'b.c.1': 5,
      });
    });

    it('should use custom separator', () => {
      const obj = { a: { b: 1 } };
      const result = flattenObject(obj, '/');
      expect(result).toEqual({ 'a/b': 1 });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten dot-notation keys', () => {
      const flat = {
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      };
      const result = unflattenObject(flat);
      expect(result).toEqual({
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      });
    });

    it('should handle array indices', () => {
      const flat = {
        'arr.0': 1,
        'arr.1': 2,
        'arr.2': 3,
      };
      const result = unflattenObject(flat);
      expect(result).toEqual({
        arr: [1, 2, 3],
      });
    });

    it('should use custom separator', () => {
      const flat = { 'a/b': 1 };
      const result = unflattenObject(flat, '/');
      expect(result).toEqual({ a: { b: 1 } });
    });
  });
});

describe('Array Transformations', () => {
  describe('groupBy', () => {
    it('should group array by key function', () => {
      const items = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const result = groupBy(items, (item) => item.type);
      expect(result).toEqual({
        a: [
          { type: 'a', value: 1 },
          { type: 'a', value: 3 },
        ],
        b: [{ type: 'b', value: 2 }],
      });
    });

    it('should handle empty arrays', () => {
      const result = groupBy([], () => 'key');
      expect(result).toEqual({});
    });
  });

  describe('keyBy', () => {
    it('should create object keyed by function result', () => {
      const items = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
      ];
      const result = keyBy(items, (item) => item.id);
      expect(result).toEqual({
        a: { id: 'a', value: 1 },
        b: { id: 'b', value: 2 },
      });
    });

    it('should overwrite duplicate keys', () => {
      const items = [
        { id: 'a', value: 1 },
        { id: 'a', value: 2 },
      ];
      const result = keyBy(items, (item) => item.id);
      expect(result).toEqual({
        a: { id: 'a', value: 2 },
      });
    });
  });

  describe('partition', () => {
    it('should partition array by predicate', () => {
      const numbers = [1, 2, 3, 4, 5];
      const [evens, odds] = partition(numbers, (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });

    it('should handle empty arrays', () => {
      const [pass, fail] = partition([], () => true);
      expect(pass).toEqual([]);
      expect(fail).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const result = chunk(arr, 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });

    it('should handle empty arrays', () => {
      const result = chunk([], 3);
      expect(result).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      const result = chunk([1, 2], 5);
      expect(result).toEqual([[1, 2]]);
    });
  });

  describe('zip', () => {
    it('should zip arrays together', () => {
      const result = zip([1, 2, 3], ['a', 'b', 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ]);
    });

    it('should handle different lengths', () => {
      const result = zip([1, 2], ['a', 'b', 'c']);
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
      ]);
    });

    it('should handle multiple arrays', () => {
      const result = zip([1, 2], ['a', 'b'], [true, false]);
      expect(result).toEqual([
        [1, 'a', true],
        [2, 'b', false],
      ]);
    });
  });

  describe('unzip', () => {
    it('should unzip array of tuples', () => {
      const tuples: Array<[number, string]> = [
        [1, 'a'],
        [2, 'b'],
        [3, 'c'],
      ];
      const result = unzip(tuples);
      expect(result).toEqual([
        [1, 2, 3],
        ['a', 'b', 'c'],
      ]);
    });

    it('should handle empty arrays', () => {
      const result = unzip([]);
      expect(result).toEqual([]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      const result = unique([1, 2, 2, 3, 1, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should preserve order', () => {
      const result = unique(['a', 'b', 'a', 'c']);
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key function', () => {
      const items = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const result = uniqueBy(items, (item) => item.id);
      expect(result).toEqual([
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ]);
    });
  });

  describe('intersection', () => {
    it('should find common elements', () => {
      const result = intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
      expect(result).toEqual([3]);
    });

    it('should handle empty arrays', () => {
      const result = intersection([1, 2], []);
      expect(result).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should find elements not in other arrays', () => {
      const result = difference([1, 2, 3, 4], [2, 4], [3]);
      expect(result).toEqual([1]);
    });

    it('should handle empty arrays', () => {
      const result = difference([1, 2], []);
      expect(result).toEqual([1, 2]);
    });
  });
});

describe('Function Composition', () => {
  describe('pipe', () => {
    it('should compose functions left to right', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const subtract = (x: number) => x - 3;

      const piped = pipe(add, multiply, subtract);
      expect(piped(5)).toBe(9); // ((5 + 1) * 2) - 3 = 9
    });
  });

  describe('compose', () => {
    it('should compose functions right to left', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const subtract = (x: number) => x - 3;

      const composed = compose(subtract, multiply, add);
      expect(composed(5)).toBe(9); // ((5 + 1) * 2) - 3 = 9
    });
  });
});

describe('Function Utilities', () => {
  describe('memoize', () => {
    it('should cache function results', () => {
      let callCount = 0;
      const expensive = (n: number) => {
        callCount++;
        return n * 2;
      };

      const memoized = memoize(expensive);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);

      expect(memoized(3)).toBe(6);
      expect(callCount).toBe(2);
    });

    it('should handle multiple arguments', () => {
      const fn = (a: number, b: number) => a + b;
      const memoized = memoize(fn);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(2, 1)).toBe(3);
      expect(memoized(1, 2)).toBe(3); // Should use cache
    });
  });

  describe('once', () => {
    it('should call function only once', () => {
      let callCount = 0;
      const fn = () => {
        callCount++;
        return 'result';
      };

      const onced = once(fn);

      expect(onced()).toBe('result');
      expect(onced()).toBe('result');
      expect(onced()).toBe('result');
      expect(callCount).toBe(1);
    });
  });

  describe('curry', () => {
    it('should curry function arguments', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curried = curry(add);

      expect(curried(1)(2)(3)).toBe(6);
      expect(curried(1, 2)(3)).toBe(6);
      expect(curried(1)(2, 3)).toBe(6);
      expect(curried(1, 2, 3)).toBe(6);
    });
  });

  describe('partial', () => {
    it('should partially apply arguments', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const add5 = partial(add, 5);

      expect(add5(2, 3)).toBe(10);

      const add5and2 = partial(add, 5, 2);
      expect(add5and2(3)).toBe(10);
    });
  });
});

describe('Async Utilities', () => {
  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;

      const debounced = debounce(fn, 10);

      debounced();
      debounced();
      debounced();

      expect(callCount).toBe(0);

      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(callCount).toBe(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;

      const throttled = throttle(fn, 10);

      throttled();
      expect(callCount).toBe(1);

      throttled();
      throttled();
      expect(callCount).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 20));
      throttled();
      expect(callCount).toBe(2);
    });
  });
});
