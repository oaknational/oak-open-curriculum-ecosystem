import { describe, expect, it } from 'vitest';
import { trimToUndefined } from './trim-to-undefined.js';

describe('trimToUndefined', () => {
  it('returns undefined when the value is undefined', () => {
    expect(trimToUndefined(undefined)).toBeUndefined();
  });

  it('returns undefined when trim yields an empty string', () => {
    expect(trimToUndefined('')).toBeUndefined();
    expect(trimToUndefined('   ')).toBeUndefined();
  });

  it('returns trimmed non-empty content', () => {
    expect(trimToUndefined('  acme  ')).toBe('acme');
  });
});
