import { describe, expect, it } from 'vitest';

import { compareStrings } from '../src/workspace-census/compare.js';

describe('artefact ordering — locale-independent string comparison', () => {
  it('orders by UTF-16 code units, uppercase before lowercase, independent of host locale', () => {
    expect(['b', 'A', 'a', 'B'].toSorted(compareStrings)).toEqual(['A', 'B', 'a', 'b']);
  });

  it('returns zero only for identical strings and a signed verdict otherwise', () => {
    expect(compareStrings('same', 'same')).toBe(0);
    expect(compareStrings('alpha', 'beta')).toBeLessThan(0);
    expect(compareStrings('beta', 'alpha')).toBeGreaterThan(0);
  });
});
