import { describe, it, expect } from 'vitest';

import {
  typeSafeKeys,
  typeSafeValues,
  typeSafeEntries,
  typeSafeGet,
  typeSafeSet,
  typeSafeHas,
  typeSafeHasOwn,
} from './index.js';

const sample: Readonly<{ a: 1; b: 'two'; c: true }> = { a: 1, b: 'two', c: true };
const hiddenKey = Symbol('hiddenKey');

interface InterfaceShapedSample {
  readonly a: 1;
  readonly b: 'two';
  readonly c: true;
  readonly [hiddenKey]: 'hidden';
}

const interfaceShapedSample: InterfaceShapedSample = {
  a: 1,
  b: 'two',
  c: true,
  [hiddenKey]: 'hidden',
};

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

  it('supports ordinary interface-shaped objects without exposing symbol keys', () => {
    const entries = typeSafeEntries(interfaceShapedSample);

    expect(entries).toEqual([
      ['a', 1],
      ['b', 'two'],
      ['c', true],
    ]);
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
