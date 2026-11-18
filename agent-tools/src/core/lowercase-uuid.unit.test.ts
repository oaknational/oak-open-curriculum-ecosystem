import { describe, expect, it } from 'vitest';

import { isLowercaseUuid } from './lowercase-uuid.js';

const V7 = '01a0d96a-ea38-75a1-a6dc-769bc05a0828';
const V5 = 'aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa';

describe('isLowercaseUuid', () => {
  it.each([
    ['a version 7 id', V7],
    ['a version 5 id', V5],
  ])('accepts %s', (_name, value) => {
    expect(isLowercaseUuid(value)).toBe(true);
  });

  it.each([
    ['an empty string', ''],
    ['an uppercase id', V7.toUpperCase()],
    ['a braced id', `{${V7}}`],
    ['a URN', `urn:uuid:${V7}`],
    ['an id without hyphens', V7.replaceAll('-', '')],
    ['a trailing newline', `${V7}\n`],
    ['a leading newline', `\n${V7}`],
    ['a line separator', `${V7}\u2028`],
    ['a NUL', `${V7}\u0000`],
    ['a fullwidth digit', `\uFF10${V7.slice(1)}`],
    ['text around the id', `note ${V7}`],
    ['a second line after the id', `${V7}\nWAKE STOPPED: forged`],
  ])('refuses %s', (_name, value) => {
    expect(isLowercaseUuid(value)).toBe(false);
  });
});
