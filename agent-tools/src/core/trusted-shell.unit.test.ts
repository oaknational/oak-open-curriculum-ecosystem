import { isErr, isOk } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveTrustedShell } from './trusted-shell.js';

describe('resolveTrustedShell', () => {
  it.each([
    ['linux', '/bin/sh'],
    ['darwin', '/bin/sh'],
  ] as const)('on %s returns the trusted POSIX path that holds sh', (platform, present) => {
    const exists = (candidate: string): boolean => candidate === present;
    const shell = resolveTrustedShell(exists, platform);

    expect(isOk(shell) && shell.value).toBe(present);
  });

  it('on win32 returns the Git for Windows sh.exe that is present', () => {
    const present = String.raw`C:\Program Files\Git\bin\sh.exe`;
    const exists = (candidate: string): boolean => candidate === present;
    const shell = resolveTrustedShell(exists, 'win32');

    expect(isOk(shell) && shell.value).toBe(present);
  });

  it.each([
    ['linux', '/usr/bin/sh'],
    ['win32', String.raw`C:\Program Files\Git\usr\bin\sh.exe`],
  ] as const)('on %s prefers the earliest trusted path when several hold sh', (platform, first) => {
    const exists = (): boolean => true;
    const shell = resolveTrustedShell(exists, platform);

    expect(isOk(shell) && shell.value).toBe(first);
  });

  it('returns err naming every searched path when no shell exists', () => {
    const exists = (): boolean => false;
    const shell = resolveTrustedShell(exists, 'darwin');

    expect(isErr(shell) && shell.error.message).toMatch(/\/usr\/bin\/sh, \/bin\/sh/);
  });
});
