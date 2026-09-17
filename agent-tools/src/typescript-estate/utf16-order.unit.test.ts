import { describe, expect, it } from 'vitest';

import { compareUtf16 } from './utf16-order.js';

describe('UTF-16 ordering', () => {
  it('orders by JavaScript code units without locale or Unicode-scalar normalisation', () => {
    const astral = '\u{10000}';
    const laterBmp = '\uE000';

    expect([laterBmp, 'b', astral, 'aa', 'a'].sort(compareUtf16)).toEqual([
      'a',
      'aa',
      'b',
      astral,
      laterBmp,
    ]);
    expect(compareUtf16('same', 'same')).toBe(0);
    expect(compareUtf16('a', 'b')).toBe(-1);
    expect(compareUtf16('b', 'a')).toBe(1);
  });

  it.each([
    { left: '', right: '\u0000' },
    { left: '\u0000', right: 'a' },
    { left: 'a', right: 'aa' },
    { left: 'aa', right: '\u{10000}' },
    { left: '\u{10000}', right: '\uE000' },
    { left: '\uE000', right: '\uFFFF' },
  ])('is antisymmetric for the boundary pair $left / $right', ({ left, right }) => {
    expect(compareUtf16(left, right)).toBe(-1);
    expect(compareUtf16(right, left)).toBe(1);
  });

  it.each([
    { left: '', middle: 'a', right: 'aa' },
    { left: '\u0000', middle: 'aa', right: '\u{10000}' },
    { left: 'a', middle: '\u{10000}', right: '\uE000' },
    { left: 'aa', middle: '\uE000', right: '\uFFFF' },
  ])('is transitive for $left / $middle / $right', ({ left, middle, right }) => {
    expect(compareUtf16(left, middle)).toBe(-1);
    expect(compareUtf16(middle, right)).toBe(-1);
    expect(compareUtf16(left, right)).toBe(-1);
  });
});
