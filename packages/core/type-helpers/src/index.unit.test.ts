import { describe, it, expect } from 'vitest';

import {
  typeSafeKeys,
  typeSafeValues,
  typeSafeEntries,
  typeSafeFromEntries,
  typeSafeGet,
  typeSafeSet,
  typeSafeHas,
  typeSafeHasOwn,
  typeSafeOwnKeys,
} from './index.js';

const sample = { a: 1, b: 'two', c: true } as const;

describe('typeSafeKeys', () => {
  it('returns keys preserving literal types', () => {
    const keys = typeSafeKeys(sample);
    expect(keys).toEqual(['a', 'b', 'c']);
  });
});

describe('typeSafeValues', () => {
  it('returns values preserving types', () => {
    const values = typeSafeValues(sample);
    expect(values).toEqual([1, 'two', true]);
  });
});

describe('typeSafeEntries', () => {
  it('returns [key, value] tuples', () => {
    const entries = typeSafeEntries(sample);
    expect(entries).toEqual([
      ['a', 1],
      ['b', 'two'],
      ['c', true],
    ]);
  });
});

describe('typeSafeFromEntries', () => {
  it('reconstructs an object from entries', () => {
    const entries: readonly (readonly ['x' | 'y', number | string])[] = [
      ['x', 42],
      ['y', 'hello'],
    ];
    const result = typeSafeFromEntries(entries);
    expect(result).toEqual({ x: 42, y: 'hello' });
  });
});

describe('typeSafeGet', () => {
  it('retrieves a typed value by key', () => {
    const value = typeSafeGet(sample, 'b');
    expect(value).toBe('two');
  });
});

describe('typeSafeSet', () => {
  it('sets a value at a typed key', () => {
    const mutable = { x: 1, y: 2 };
    typeSafeSet(mutable, 'x', 10);
    expect(mutable.x).toBe(10);
  });
});

describe('typeSafeHas', () => {
  it('returns true for existing keys', () => {
    expect(typeSafeHas(sample, 'a')).toBe(true);
  });

  it('returns false for missing keys', () => {
    expect(typeSafeHas(sample, 'z')).toBe(false);
  });
});

describe('typeSafeHasOwn', () => {
  it('returns true for own properties', () => {
    expect(typeSafeHasOwn(sample, 'c')).toBe(true);
  });

  it('returns false for inherited properties', () => {
    expect(typeSafeHasOwn(sample, 'toString')).toBe(false);
  });
});

describe('typeSafeOwnKeys', () => {
  it('returns all own keys including symbols', () => {
    const keys = typeSafeOwnKeys(sample);
    expect(keys).toEqual(['a', 'b', 'c']);
  });
});
