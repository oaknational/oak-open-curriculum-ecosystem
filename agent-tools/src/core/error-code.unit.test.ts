import { describe, expect, it } from 'vitest';

import { errorCodeOf } from './error-code.js';

/**
 * Which codes cross from an error to a caller: an error-code identifier
 * only, so no path or message can ride in on a code.
 */

const MESSAGE = "ELOOP: too many symbolic links encountered, open '/srv/estate/logs/x.jsonl'";

function codedError(code: unknown): Error {
  return Object.assign(new Error(MESSAGE), { code });
}

describe('errorCodeOf', () => {
  it.each([
    { label: 'an errno code', code: 'ELOOP' },
    { label: 'a Node error code', code: 'ERR_INVALID_URL' },
    { label: "libuv's own UNKNOWN", code: 'UNKNOWN' },
  ])('gives $label as it is', ({ code }) => {
    expect(errorCodeOf(codedError(code))).toBe(code);
  });

  it.each([
    { label: 'a code followed by a path', code: "EACCES '/srv/estate/x.jsonl'" },
    { label: 'a path followed by a code', code: '/srv/estate/x.jsonl: EACCES' },
    { label: 'a lower-case code', code: 'eloop' },
    { label: 'a code that is not a string, though it reads as one', code: ['ELOOP'] },
  ])('gives nothing for $label, so no path can ride in on it', ({ code }) => {
    expect(errorCodeOf(codedError(code))).toBeUndefined();
  });

  it('gives nothing for an error without a code, never its message', () => {
    expect(errorCodeOf(new Error(MESSAGE))).toBeUndefined();
  });
});
