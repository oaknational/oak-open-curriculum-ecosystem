/**
 * Unit tests for the pure outbound-payload token-estimation helpers.
 *
 * These helpers feed the outbound token health metric: every value is a
 * size or estimate (numbers only), and both functions are total — a
 * metrics helper must never throw on a response path.
 */

import { describe, it, expect } from 'vitest';
import { estimateTokensFromChars, safeJsonChars } from './token-estimate.js';

describe('estimateTokensFromChars', () => {
  it('estimates ceil(chars / 4)', () => {
    expect(estimateTokensFromChars(1)).toBe(1);
    expect(estimateTokensFromChars(4)).toBe(1);
    expect(estimateTokensFromChars(5)).toBe(2);
    expect(estimateTokensFromChars(8000)).toBe(2000);
  });

  it('maps zero to zero', () => {
    expect(estimateTokensFromChars(0)).toBe(0);
  });

  it('returns zero for negative or non-finite character counts', () => {
    expect(estimateTokensFromChars(-12)).toBe(0);
    expect(estimateTokensFromChars(Number.NaN)).toBe(0);
    expect(estimateTokensFromChars(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('safeJsonChars', () => {
  it('returns the serialised JSON length of a value', () => {
    expect(safeJsonChars({ a: 1 })).toBe('{"a":1}'.length);
    expect(safeJsonChars('text')).toBe('"text"'.length);
    expect(safeJsonChars([1, 2, 3])).toBe('[1,2,3]'.length);
  });

  it('returns undefined for undefined input', () => {
    expect(safeJsonChars(undefined)).toBeUndefined();
  });

  it('returns undefined, never throwing, for unstringifiable input', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(safeJsonChars(circular)).toBeUndefined();
    expect(safeJsonChars(10n)).toBeUndefined();
  });
});
