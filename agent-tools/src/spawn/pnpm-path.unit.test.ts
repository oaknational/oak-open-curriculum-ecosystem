import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolvePnpm, type PathExists } from './pnpm-path.js';

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
    );

    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe('/pnpm-home/pnpm');
  });

  it('falls back to the per-user macOS standalone location', () => {
    const result = resolvePnpm({ HOME: FAKE_HOME }, onlyExists(`${FAKE_HOME}/Library/pnpm/pnpm`));

    expect(unwrap(result)).toBe(`${FAKE_HOME}/Library/pnpm/pnpm`);
  });

  it('resolves a system location when no per-user install exists', () => {
    const result = resolvePnpm({}, onlyExists('/opt/homebrew/bin/pnpm'));

    expect(unwrap(result)).toBe('/opt/homebrew/bin/pnpm');
  });

  it('returns err naming the searched paths and the remedy when pnpm is found nowhere', () => {
    const result = resolvePnpm({ HOME: FAKE_HOME }, () => false);

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
    resolvePnpm({ PNPM_HOME: '/pnpm-home', HOME: FAKE_HOME }, (candidate) => {
      probed.push(candidate);
      return false;
    });

    expect(probed.length).toBeGreaterThan(0);
    expect(probed.every((candidate) => candidate.startsWith('/'))).toBe(true);
    expect(probed).not.toContain('pnpm');
  });
});
