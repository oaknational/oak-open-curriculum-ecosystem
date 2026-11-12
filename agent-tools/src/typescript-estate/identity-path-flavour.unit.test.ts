import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { comparablePath, isWithin } from './identity-path-flavour.js';

// Both flavours are injected explicitly so every row is provable from any
// host: `path.posix` and `path.win32` carry their own `sep` and `normalize`.
const WIN = path.win32;
const POSIX = path.posix;

describe('comparablePath', () => {
  it.each([
    { label: 'a posix trailing separator', value: '/repo/', pathApi: POSIX, expected: '/repo' },
    {
      label: 'a run of posix trailing separators',
      value: '/repo///',
      pathApi: POSIX,
      expected: '/repo',
    },
    // Quoted escapes, not String.raw: a raw template cannot end in a single
    // backslash — it escapes the closing backtick.
    {
      label: 'a win32 trailing separator',
      value: 'C:\\repo\\',
      pathApi: WIN,
      expected: String.raw`C:\repo`,
    },
    {
      label: 'a win32 forward-slash path',
      value: 'C:/repo/',
      pathApi: WIN,
      expected: String.raw`C:\repo`,
    },
    {
      label: 'a lower-case drive letter',
      value: String.raw`c:\repo`,
      pathApi: WIN,
      expected: String.raw`C:\repo`,
    },
  ])('produces the comparison form of $label', ({ value, pathApi, expected }) => {
    expect(comparablePath(value, pathApi)).toBe(expected);
  });

  // A root's separator IS the root: trimming `C:\` leaves drive-relative `C:`
  // and `/` leaves the empty string, so roots keep their separator.
  it.each([
    { label: 'the posix root', value: '/', pathApi: POSIX, expected: '/' },
    { label: 'a win32 drive root', value: 'C:\\', pathApi: WIN, expected: 'C:\\' },
    {
      label: 'a win32 drive root in forward-slash form',
      value: 'C:/',
      pathApi: WIN,
      expected: 'C:\\',
    },
    { label: 'a lower-case win32 drive root', value: 'c:\\', pathApi: WIN, expected: 'C:\\' },
  ])('keeps $label intact', ({ value, pathApi, expected }) => {
    expect(comparablePath(value, pathApi)).toBe(expected);
  });

  it('leaves path-component case alone on win32 (only the drive letter folds)', () => {
    expect(comparablePath(String.raw`c:\Repo\Src`, WIN)).toBe(String.raw`C:\Repo\Src`);
  });

  // On POSIX a backslash is a filename character, not a separator: `/repo/a\`
  // names a different directory from `/repo/a`, so it must survive the trim.
  it('keeps a trailing backslash on posix — it is part of the name there', () => {
    expect(comparablePath('/repo/a\\', POSIX)).toBe('/repo/a\\');
  });

  // On POSIX `C:/` is a relative directory called `C:`, not a drive root, so
  // it takes the ordinary trim like any other directory.
  it('treats a drive-root shape as an ordinary directory on posix', () => {
    expect(comparablePath('C:/', POSIX)).toBe('C:');
  });
});

describe('isWithin', () => {
  // The doubled-boundary regression: a root base already ends in its
  // separator, so `base + sep` was `//` / `C:\\` and no descendant matched.
  it.each([
    {
      label: 'posix root contains a child',
      base: '/',
      candidate: '/repo/src/a.ts',
      pathApi: POSIX,
    },
    {
      label: 'win32 drive root contains a child',
      base: 'C:\\',
      candidate: String.raw`C:\repo\src\a.ts`,
      pathApi: WIN,
    },
    {
      label: 'win32 drive root in forward-slash form contains a child',
      base: 'C:/',
      candidate: 'C:/repo/src/a.ts',
      pathApi: WIN,
    },
    {
      label: 'a base with a trailing separator contains a child',
      base: '/repo/',
      candidate: '/repo/src/a.ts',
      pathApi: POSIX,
    },
    {
      label: 'a win32 base with a trailing separator contains a child',
      base: 'C:\\repo\\',
      candidate: String.raw`C:\repo\src\a.ts`,
      pathApi: WIN,
    },
    {
      label: 'a base with a trailing separator equals itself',
      base: '/repo/',
      candidate: '/repo',
      pathApi: POSIX,
    },
    { label: 'a root equals itself', base: '/', candidate: '/', pathApi: POSIX },
    {
      label: 'a win32 root equals itself across drive-letter case',
      base: 'c:\\',
      candidate: 'C:/',
      pathApi: WIN,
    },
    {
      label: 'a plain base contains a child',
      base: '/repo',
      candidate: '/repo/src/a.ts',
      pathApi: POSIX,
    },
  ])('accepts: $label', ({ base, candidate, pathApi }) => {
    expect(isWithin(base, candidate, pathApi)).toBe(true);
  });

  it.each([
    {
      label: 'a sibling sharing a prefix',
      base: '/repo',
      candidate: '/repo-other/a.ts',
      pathApi: POSIX,
    },
    {
      label: 'a sibling sharing a prefix on win32',
      base: String.raw`C:\repo`,
      candidate: String.raw`C:\repo-other\a.ts`,
      pathApi: WIN,
    },
    {
      label: 'a path outside the base',
      base: '/repo',
      candidate: '/elsewhere/a.ts',
      pathApi: POSIX,
    },
    { label: 'a different drive', base: 'C:\\', candidate: String.raw`D:\repo\a.ts`, pathApi: WIN },
    {
      label: 'a component differing only in case on win32',
      base: String.raw`C:\Repo`,
      candidate: String.raw`C:\repo\a.ts`,
      pathApi: WIN,
    },
    {
      label: 'a member of a sibling whose name lacks the base name’s trailing backslash (posix)',
      base: '/repo/a\\',
      candidate: '/repo/a/secret',
      pathApi: POSIX,
    },
  ])('refuses: $label', ({ base, candidate, pathApi }) => {
    expect(isWithin(base, candidate, pathApi)).toBe(false);
  });
});
