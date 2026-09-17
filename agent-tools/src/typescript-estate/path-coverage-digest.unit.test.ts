import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { digestOrderedPaths } from './path-coverage-digest.js';

describe('digestOrderedPaths', () => {
  it('hashes the empty denominator as the domain tag alone', () => {
    expect(unwrapOrThrow(digestOrderedPaths([]))).toBe(
      '30102098f72da103224a84529b4343534f625f4e83a0d6298035e7a2a6ea098c',
    );
  });

  it('uses exact UTF-8 bytes with unsigned 64-bit big-endian length framing', () => {
    expect(unwrapOrThrow(digestOrderedPaths(['a.ts', 'é.tsx', '😀.ts']))).toBe(
      'e3e6fbf77d8ca22d6fff6acc75dbe6bb0218a25e46b87db7d03107a6ef8187e5',
    );
  });

  it('uses JavaScript UTF-16 order rather than Unicode scalar or UTF-8 byte order', () => {
    expect(unwrapOrThrow(digestOrderedPaths(['𐀀.ts', '.ts']))).toBe(
      '8acf5a838065e036f98c6632a674b2dbaa8f127a16738c98ba476fffa18038ff',
    );

    expect(unwrapErr(digestOrderedPaths(['.ts', '𐀀.ts']))).toMatchObject({
      code: 'VALIDATION_FAILED',
    });
  });

  it.each([
    { name: 'a duplicate path', paths: ['a.ts', 'a.ts'] },
    { name: 'an out-of-order path', paths: ['b.ts', 'a.ts'] },
  ])('rejects $name instead of silently changing denominator identity', ({ paths }) => {
    const error = unwrapErr(digestOrderedPaths(paths));

    expect(error).toMatchObject({ code: 'VALIDATION_FAILED' });
    expect(error.message).toContain('strict ascending UTF-16 order');
  });
});
