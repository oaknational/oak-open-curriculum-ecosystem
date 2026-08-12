import { describe, expect, it } from 'vitest';

import { resolveTrustedGit, TrustedGitResolutionError } from './trusted-git.js';

describe('resolveTrustedGit', () => {
  it.each([
    ['linux', '/opt/homebrew/bin/git'],
    ['darwin', '/opt/homebrew/bin/git'],
  ] as const)('on %s returns the trusted POSIX path that holds git', (platform, present) => {
    const exists = (candidate: string): boolean => candidate === present;

    expect(resolveTrustedGit(exists, platform)).toBe(present);
  });

  it('on win32 returns the Git for Windows cmd entry point when present', () => {
    const exists = (candidate: string): boolean =>
      candidate === String.raw`C:\Program Files\Git\cmd\git.exe`;

    expect(resolveTrustedGit(exists, 'win32')).toBe(String.raw`C:\Program Files\Git\cmd\git.exe`);
  });

  it('on win32 falls through to the mingw64 binary when the cmd shim is absent', () => {
    const exists = (candidate: string): boolean =>
      candidate === String.raw`C:\Program Files\Git\mingw64\bin\git.exe`;

    expect(resolveTrustedGit(exists, 'win32')).toBe(
      String.raw`C:\Program Files\Git\mingw64\bin\git.exe`,
    );
  });

  it.each([
    ['linux', '/usr/bin/git'],
    ['darwin', '/usr/bin/git'],
    ['win32', String.raw`C:\Program Files\Git\cmd\git.exe`],
  ] as const)(
    'on %s prefers the earliest trusted path when several hold git',
    (platform, first) => {
      const exists = (): boolean => true;

      expect(resolveTrustedGit(exists, platform)).toBe(first);
    },
  );

  // The load-bearing security invariant (S4036): a candidate from the OTHER
  // platform's family is never consulted, even when a file exists at that
  // path. On win32 a rooted-but-drive-relative '/usr/bin/git' resolves against
  // the process's current drive into user-plantable space (C:\usr\bin\git);
  // on POSIX a literal 'C:\...' is a legal relative FILENAME. Partitioning,
  // not path-shape filtering, is what closes both.
  it('on win32 refuses a POSIX-family path even when a file exists there', () => {
    const exists = (candidate: string): boolean => candidate === '/usr/bin/git';

    expect(() => resolveTrustedGit(exists, 'win32')).toThrow(/No trusted git binary found/);
  });

  it('on linux refuses a Windows-family path even when a file exists there', () => {
    const exists = (candidate: string): boolean =>
      candidate === String.raw`C:\Program Files\Git\cmd\git.exe`;

    expect(() => resolveTrustedGit(exists, 'linux')).toThrow(/No trusted git binary found/);
  });

  it.each([['linux'], ['darwin']] as const)(
    'on %s the refusal names only POSIX candidates and the symlink remedy',
    (platform) => {
      const exists = (): boolean => false;

      // Fail loud: never return an unverified path that would surface
      // downstream as an opaque ENOENT (the commit-msg hook blocking every
      // commit).
      expect(() => resolveTrustedGit(exists, platform)).toThrow(
        /No trusted git binary found\. Searched: /,
      );
      expect(() => resolveTrustedGit(exists, platform)).toThrow(/\/usr\/bin\/git/);
      expect(() => resolveTrustedGit(exists, platform)).toThrow(/symlink it at one of those paths/);
      expect(() => resolveTrustedGit(exists, platform)).not.toThrow(/Program Files/);
    },
  );

  it('on win32 the refusal names only Windows candidates and the system-wide install remedy', () => {
    const exists = (): boolean => false;

    expect(() => resolveTrustedGit(exists, 'win32')).toThrow(
      /No trusted git binary found\. Searched: /,
    );
    expect(() => resolveTrustedGit(exists, 'win32')).toThrow(/Program Files\\Git\\cmd\\git\.exe/);
    expect(() => resolveTrustedGit(exists, 'win32')).toThrow(/winget install Git\.Git/);
    // A symlink remedy is un-actionable on Windows (creation needs admin or
    // Developer Mode) and harmful if followed under elevation; and POSIX
    // paths must not be suggested as search locations.
    expect(() => resolveTrustedGit(exists, 'win32')).not.toThrow(/symlink/);
    expect(() => resolveTrustedGit(exists, 'win32')).not.toThrow(/\/usr\/bin/);
  });

  it.each([['linux'], ['win32']] as const)(
    'on %s the refusal is the typed TrustedGitResolutionError',
    (platform) => {
      const exists = (): boolean => false;

      // Callers that translate git-EXECUTION failures (e.g. into "not inside
      // a git working tree") discriminate on this type so a RESOLUTION
      // failure passes through as its own diagnosis.
      expect(() => resolveTrustedGit(exists, platform)).toThrow(TrustedGitResolutionError);
    },
  );
});
