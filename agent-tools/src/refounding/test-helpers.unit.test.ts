import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { unwrapErr } from './test-helpers.js';

describe('unwrapErr — fail-loud Err narrowing', () => {
  it('returns the error of an Err result', () => {
    expect(unwrapErr(err('x'))).toBe('x');
  });

  it('fails loud on an unexpectedly-Ok result, naming the Ok payload', () => {
    expect(() => unwrapErr(ok({ a: 1 }))).toThrow(/expected Err, got Ok: \{"a":1\}/);
  });
});
