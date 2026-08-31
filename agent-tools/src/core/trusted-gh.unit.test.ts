import { isErr, isOk, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveTrustedGh } from './trusted-gh.js';

describe('resolveTrustedGh', () => {
  it.each([['linux'], ['darwin']] as const)(
    'on %s returns ok with the trusted POSIX path that holds gh',
    (platform) => {
      // Homebrew's entry is searched before the system paths, so it wins when present.
      const result = resolveTrustedGh(
        (candidate) => candidate === '/opt/homebrew/bin/gh',
        platform,
      );
      expect(isOk(result)).toBe(true);
      expect(unwrap(result)).toBe('/opt/homebrew/bin/gh');
    },
  );

  it('on win32 returns ok with the GitHub CLI installer path when present', () => {
    const result = resolveTrustedGh(
      (candidate) => candidate === String.raw`C:\Program Files\GitHub CLI\gh.exe`,
      'win32',
    );
    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe(String.raw`C:\Program Files\GitHub CLI\gh.exe`);
  });

  it.each([
    ['linux', '/opt/homebrew/bin/gh'],
    ['win32', String.raw`C:\Program Files\GitHub CLI\gh.exe`],
  ] as const)('on %s searches in priority order, taking the first hit', (platform, first) => {
    const result = resolveTrustedGh(() => true, platform);
    expect(unwrap(result)).toBe(first);
  });

  // Cross-family candidates are never consulted (S4036): on win32 a rooted
  // POSIX path is drive-relative and lands in user-plantable space; on POSIX a
  // literal 'C:\...' is a legal relative filename. Partitioning closes both.
  it('on win32 returns err even when a POSIX-family path exists', () => {
    const result = resolveTrustedGh((candidate) => candidate === '/opt/homebrew/bin/gh', 'win32');
    expect(isErr(result)).toBe(true);
  });

  it('on linux returns err even when a Windows-family path exists', () => {
    const result = resolveTrustedGh(
      (candidate) => candidate === String.raw`C:\Program Files\GitHub CLI\gh.exe`,
      'linux',
    );
    expect(isErr(result)).toBe(true);
  });

  it.each([['linux'], ['darwin']] as const)(
    'on %s the err names only POSIX candidates and the symlink remedy',
    (platform) => {
      const error = unwrapErr(resolveTrustedGh(() => false, platform));
      expect(error.message).toMatch(/No trusted gh/u);
      expect(error.message).toMatch(/\/opt\/homebrew\/bin\/gh/u);
      expect(error.message).toMatch(/symlink it at one of those paths/u);
      expect(error.message).not.toMatch(/Program Files/u);
    },
  );

  it('on win32 the err names only Windows candidates and the system-wide install remedy', () => {
    const error = unwrapErr(resolveTrustedGh(() => false, 'win32'));
    expect(error.message).toMatch(/No trusted gh/u);
    expect(error.message).toMatch(/Program Files\\GitHub CLI\\gh\.exe/u);
    expect(error.message).toMatch(/winget install GitHub\.cli/u);
    expect(error.message).not.toMatch(/symlink/u);
    expect(error.message).not.toMatch(/\/usr\/bin/u);
  });
});
