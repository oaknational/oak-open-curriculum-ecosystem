import { describe, it, expect } from 'vitest';
import { sortObjectKeys, createSortedEntries } from './typegen-helpers';

describe('sortObjectKeys', () => {
  it('should sort object keys alphabetically', () => {
    const input = { zebra: 1, apple: 2, banana: 3 };
    const result = sortObjectKeys(input);
    expect(result).toEqual(['apple', 'banana', 'zebra']);
  });

  it('should handle empty object', () => {
    const input = {};
    const result = sortObjectKeys(input);
    expect(result).toEqual([]);
  });
});

describe('createSortedEntries', () => {
  it('should create sorted entries from group object', () => {
    const group = {
      b: { path: '/b', paramsKey: 'bKey' },
      a: { path: '/a', paramsKey: 'aKey', params: 'string' },
      c: { path: '/c', paramsKey: 'cKey' },
    };

    const result = createSortedEntries(group);

    expect(Object.keys(result)).toEqual(['a', 'b', 'c']);
    expect(result.a).toEqual({ path: '/a', paramsKey: 'aKey', params: 'string' });
    expect(result.b).toEqual({ path: '/b', paramsKey: 'bKey' });
    expect(result.c).toEqual({ path: '/c', paramsKey: 'cKey' });
  });

  it('should handle empty group', () => {
    const result = createSortedEntries({});
    expect(result).toEqual({});
  });
});
