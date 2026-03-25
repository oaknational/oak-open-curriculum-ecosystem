import { describe, it, expect } from 'vitest';
import { validateLeaseTtl } from './lifecycle-lease.js';

describe('validateLeaseTtl', () => {
  it('rejects non-finite or too-small values', () => {
    expect(validateLeaseTtl(Number.NaN).ok).toBe(false);
    expect(validateLeaseTtl(1_000).ok).toBe(false);
  });

  it('accepts valid values', () => {
    expect(validateLeaseTtl(60_000).ok).toBe(true);
  });
});
