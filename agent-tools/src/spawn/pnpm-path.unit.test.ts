import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type PathExists } from '../core/path-exists.js';

import { resolvePnpm } from './pnpm-path.js';

const FAKE_HOME = '/Users/<user>';

/** A {@link PathExists} fake that reports only `target` as present. */
const onlyExists =
  (target: string): PathExists =>
  (candidate) =>
    candidate === target;

describe('resolvePnpm', () => {
  it('prefers $PNPM_HOME/pnpm when it exists', () => {
    const result = resolvePnpm(
      { PNPM_HOME: '/pnpm-home', HOME: FAKE_HOME },
      onlyExists('/pnpm-home/pnpm'),
      'linux',
    );

    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toEqual({ file: '/pnpm-home/pnpm', leadingArgs: [] });
  });

  it('falls back to the per-user macOS standalone location', () => {
    const result = resolvePnpm(
      { HOME: FAKE_HOME },
      onlyExists(`${FAKE_HOME}/Library/pnpm/pnpm`),
      'darwin',
    );

    expect(unwrap(result).file).toBe(`${FAKE_HOME}/Library/pnpm/pnpm`);
  });

  it('resolves a system location when no per-user install exists', () => {
    const result = resolvePnpm({}, onlyExists('/opt/homebrew/bin/pnpm'), 'linux');

    expect(unwrap(result).file).toBe('/opt/homebrew/bin/pnpm');
  });

  it('returns err naming the searched paths and the remedy when pnpm is found nowhere', () => {
    const result = resolvePnpm({ HOME: FAKE_HOME }, () => false, 'linux');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/pnpm not found/u);
      expect(result.error.message).toContain('PNPM_HOME');
    }
  });

  it('skips a non-absolute PNPM_HOME so a relative candidate never passes resolution', () => {
    const probed: string[] = [];
    const result = resolvePnpm(
      { PNPM_HOME: 'relative/pnpm-home', HOME: FAKE_HOME },
      (candidate) => {
        probed.push(candidate);
        // The relative candidate "would" exist when probed against the process cwd...
        return candidate === 'relative/pnpm-home/pnpm';
      },
      'linux',
    );

    // ...but execFileSync resolves a relative executable against the worktree cwd, so a
    // relative PNPM_HOME that passes existsSync would run the wrong binary (or none). It
    // must never become a candidate — only absolute paths are probed, so it never resolves.
    expect(probed).not.toContain('relative/pnpm-home/pnpm');
    expect(probed.every((candidate) => candidate.startsWith('/'))).toBe(true);
    expect(isErr(result)).toBe(true);
  });

  it('never consults PATH — every probed candidate is an absolute path, never bare "pnpm"', () => {
    const probed: string[] = [];
    resolvePnpm(
      { PNPM_HOME: '/pnpm-home', HOME: FAKE_HOME },
      (candidate) => {
        probed.push(candidate);
        return false;
      },
      'linux',
    );

    expect(probed.length).toBeGreaterThan(0);
    expect(probed.every((candidate) => candidate.startsWith('/'))).toBe(true);
    expect(probed).not.toContain('pnpm');
  });
});

/**
 * Regression: `$PNPM_HOME/bin/pnpm`.
 *
 * pnpm's installer treats `PNPM_HOME` as the global bin directory, but some
 * installations place the launcher one level down. Observed 2026-08-04 on a
 * machine with `PNPM_HOME=~/Library/pnpm` and the binary at
 * `~/Library/pnpm/bin/pnpm`: none of the previous candidates existed, so every
 * commit failed, and the pre-commit hook reported the resolver error as
 * "formatting issues found" — sending two agents after a formatting problem
 * that did not exist.
 */
describe('resolvePnpm — PNPM_HOME/bin layout (2026-08-04 regression)', () => {
  it('finds the binary under $PNPM_HOME/bin when it is not directly in $PNPM_HOME', () => {
    const result = resolvePnpm(
      { PNPM_HOME: '/pnpm-home', HOME: '/home-dir' },
      (path) => path === '/pnpm-home/bin/pnpm',
      'linux',
    );

    expect(result.ok).toBe(true);
    expect(result.ok && result.value.file).toBe('/pnpm-home/bin/pnpm');
  });

  it('still prefers $PNPM_HOME/pnpm when both layouts exist', () => {
    const result = resolvePnpm(
      { PNPM_HOME: '/pnpm-home', HOME: '/home-dir' },
      (path) => path === '/pnpm-home/pnpm' || path === '/pnpm-home/bin/pnpm',
      'linux',
    );

    expect(result.ok && result.value.file).toBe('/pnpm-home/pnpm');
  });

  it('finds the Linux standalone per-user bin layout with no PNPM_HOME set', () => {
    const result = resolvePnpm(
      { HOME: '/home-dir' },
      (path) => path === '/home-dir/.local/share/pnpm/bin/pnpm',
      'linux',
    );

    expect(result.ok && result.value.file).toBe('/home-dir/.local/share/pnpm/bin/pnpm');
  });

  // The macOS sibling of the case above. This is the layout that actually broke —
  // the observed machine had the launcher under `Library/pnpm/bin/` — so without
  // this case the candidate that fixes the real defect could be deleted or
  // mistyped and the suite would stay green.
  it('finds the macOS standalone per-user bin layout with no PNPM_HOME set', () => {
    const result = resolvePnpm(
      { HOME: '/home-dir' },
      (path) => path === '/home-dir/Library/pnpm/bin/pnpm',
      'darwin',
    );

    expect(result.ok && result.value.file).toBe('/home-dir/Library/pnpm/bin/pnpm');
  });

  it('names every searched path when pnpm is absent, so the remedy is actionable', () => {
    const probed: string[] = [];
    const result = resolvePnpm(
      { PNPM_HOME: '/pnpm-home', HOME: '/home-dir' },
      (candidate) => {
        probed.push(candidate);
        return false;
      },
      'linux',
    );

    expect(result.ok).toBe(false);
    expect(probed.length).toBeGreaterThan(0);

    // "Every" is the promise in this test's name, so assert against the set the
    // resolver actually probed rather than a hand-listed subset — otherwise a new
    // candidate can be added without ever appearing in the error a user reads.
    // Checking the probe set keeps the assertion true as the candidate list grows.
    const message = result.ok ? '' : result.error.message;
    for (const candidate of probed) {
      expect(message).toContain(candidate);
    }
  });

  it('never admits a relative candidate, keeping the absolute-only invariant', () => {
    const result = resolvePnpm(
      { PNPM_HOME: 'relative/pnpm', HOME: '/home-dir' },
      (path) => path.startsWith('relative/'),
      'linux',
    );

    expect(result.ok).toBe(false);
  });
});

describe('resolvePnpm — win32', () => {
  const COREPACK = String.raw`C:\Program Files\nodejs\node_modules\corepack\dist\pnpm.js`;

  it('resolves the fixed corepack launcher via the running Node when present', () => {
    const result = resolvePnpm({}, onlyExists(COREPACK), 'win32');

    expect(result.ok).toBe(true);
    // A .js entry cannot be executed directly; it launches via the current
    // process's own Node binary — a fixed absolute path by definition.
    expect(result.ok && result.value.file).toBe(process.execPath);
    expect(result.ok && result.value.leadingArgs).toEqual([COREPACK]);
  });

  // Fixture env values use fully qualified non-user drives: a realistic
  // C:\Users\<name> shape would trip the machine-local-paths validator (a
  // username in a committed path is the PII class it guards against), and
  // the candidate composition under test is root-agnostic.
  it('prefers the corepack launcher over env-derived locations when both exist', () => {
    const result = resolvePnpm({ PNPM_HOME: String.raw`D:\pnpm-home` }, () => true, 'win32');

    expect(result.ok && result.value.leadingArgs).toEqual([COREPACK]);
  });

  it('resolves the standalone pnpm.exe under PNPM_HOME as a direct launch', () => {
    const result = resolvePnpm(
      { PNPM_HOME: String.raw`D:\pnpm-home` },
      onlyExists(String.raw`D:\pnpm-home\pnpm.exe`),
      'win32',
    );

    expect(result.ok && result.value).toEqual({
      file: String.raw`D:\pnpm-home\pnpm.exe`,
      leadingArgs: [],
    });
  });

  // The win32 sibling of the POSIX `$PNPM_HOME/bin` layout: pnpm's installer
  // treats PNPM_HOME as the global bin directory, but some installations
  // place the launcher one level down.
  it(
    String.raw`finds the standalone binary under PNPM_HOME\bin when it is not directly in PNPM_HOME`,
    () => {
      const result = resolvePnpm(
        { PNPM_HOME: String.raw`D:\pnpm-home` },
        onlyExists(String.raw`D:\pnpm-home\bin\pnpm.exe`),
        'win32',
      );

      expect(result.ok && result.value).toEqual({
        file: String.raw`D:\pnpm-home\bin\pnpm.exe`,
        leadingArgs: [],
      });
    },
  );

  it('composes cleanly from a PNPM_HOME carrying a trailing backslash', () => {
    const result = resolvePnpm(
      { PNPM_HOME: 'D:\\pnpm-home\\' },
      onlyExists(String.raw`D:\pnpm-home\pnpm.exe`),
      'win32',
    );

    expect(result.ok && result.value.file).toBe(String.raw`D:\pnpm-home\pnpm.exe`);
  });

  it('resolves the standalone default home from LOCALAPPDATA with no PNPM_HOME set', () => {
    const result = resolvePnpm(
      { LOCALAPPDATA: String.raw`D:\local-app-data` },
      onlyExists(String.raw`D:\local-app-data\pnpm\pnpm.exe`),
      'win32',
    );

    expect(result.ok && result.value.file).toBe(String.raw`D:\local-app-data\pnpm\pnpm.exe`);
  });

  it('resolves the npm-global module entry via the running Node', () => {
    const cjs = String.raw`D:\roaming\npm\node_modules\pnpm\bin\pnpm.cjs`;
    const result = resolvePnpm({ APPDATA: String.raw`D:\roaming` }, onlyExists(cjs), 'win32');

    expect(result.ok && result.value.file).toBe(process.execPath);
    expect(result.ok && result.value.leadingArgs).toEqual([cjs]);
  });

  // On win32, path.isAbsolute is not the invariant: a rooted-but-driveless
  // PNPM_HOME ('/pnpm-home') is DRIVE-RELATIVE — it resolves against the
  // process's current drive into caller-influenced space — and a UNC path is
  // a network location, not a fixed local install. Neither may become a
  // candidate.
  it('never probes a drive-relative PNPM_HOME', () => {
    const probed: string[] = [];
    const result = resolvePnpm(
      { PNPM_HOME: '/pnpm-home' },
      (candidate) => {
        probed.push(candidate);
        return candidate === String.raw`/pnpm-home\pnpm.exe`;
      },
      'win32',
    );

    expect(probed).not.toContain(String.raw`/pnpm-home\pnpm.exe`);
    expect(result.ok).toBe(false);
  });

  it('never probes a UNC PNPM_HOME', () => {
    const probed: string[] = [];
    resolvePnpm(
      { PNPM_HOME: String.raw`\\attacker-host\share` },
      (candidate) => {
        probed.push(candidate);
        return false;
      },
      'win32',
    );

    expect(probed.every((candidate) => !candidate.startsWith('\\\\'))).toBe(true);
  });

  it('errs with the Windows remedy when pnpm is found nowhere', () => {
    const result = resolvePnpm({}, () => false, 'win32');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/pnpm not found/u);
      expect(result.error.message).toContain(COREPACK);
      expect(result.error.message).toMatch(/Install Node\.js system-wide/u);
    }
  });
});
