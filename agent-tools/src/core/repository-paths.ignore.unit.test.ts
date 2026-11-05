/**
 * Unit tests for the pure halves of the ignore probe, over literal candidates
 * and literal git outputs (tests never use or create IO: `testing-strategy.md`
 * §Philosophy). What git itself lists, reading the index, was observed once
 * against a real scratch repository and recorded in the pull request that
 * added the probe.
 */
import { describe, expect, it } from 'vitest';

import { ignoreProbeInput, parseIgnoredPaths } from './repository-paths.js';

describe('ignoreProbeInput', () => {
  it('sends each candidate exactly as written, a directory with its trailing slash, each record NUL-terminated', () => {
    expect(ignoreProbeInput(['comms/', 'a b.json', 'odd\nname.json'])).toBe(
      'comms/\u0000a b.json\u0000odd\nname.json\u0000',
    );
  });
});

describe('parseIgnoredPaths', () => {
  it('reads as ignored exactly the candidates git lists, and none it leaves out', () => {
    expect(
      parseIgnoredPaths(['active-claims.json', 'README.md', 'forced.json', 'comms/'], {
        status: 0,
        stdout: 'active-claims.json\u0000comms/\u0000',
        stderr: '',
      }),
    ).toStrictEqual({ ok: true, value: new Set(['active-claims.json', 'comms/']) });
  });

  it('matches a candidate only by its exact string, never by a listed path that extends it', () => {
    expect(
      parseIgnoredPaths(['comms', 'state/', 'ignored.json'], {
        status: 0,
        stdout: 'comms/a.json\u0000state/a.json\u0000ignored.json\u0000',
        stderr: '',
      }),
    ).toStrictEqual({ ok: true, value: new Set(['ignored.json']) });
  });

  it('reads no candidate as ignored when git exits 1', () => {
    expect(
      parseIgnoredPaths(['README.md', 'docs/'], { status: 1, stdout: '', stderr: '' }),
    ).toStrictEqual({ ok: true, value: new Set() });
  });

  it("refuses a probe git failed, carrying git's own standard error", () => {
    const stderr = 'fatal: not a git repository (or any of the parent directories): .git\n';
    expect(parseIgnoredPaths(['README.md'], { status: 128, stdout: '', stderr })).toStrictEqual({
      ok: false,
      error: { kind: 'git-failed', status: 128, stderr },
    });
  });

  it('refuses a probe whose exit 0 lists none of the candidates sent', () => {
    expect(parseIgnoredPaths(['README.md'], { status: 0, stdout: '', stderr: '' })).toStrictEqual({
      ok: false,
      error: { kind: 'git-failed', status: 0, stderr: '' },
    });
    expect(
      parseIgnoredPaths(['README.md'], { status: 0, stdout: 'other.json\u0000', stderr: '' }),
    ).toStrictEqual({ ok: false, error: { kind: 'git-failed', status: 0, stderr: '' } });
  });

  it('refuses a probe from a git that exited without a status', () => {
    const stderr = 'spawnSync git ENOENT';
    expect(parseIgnoredPaths(['README.md'], { status: null, stdout: '', stderr })).toStrictEqual({
      ok: false,
      error: { kind: 'git-failed', status: null, stderr },
    });
  });

  it('keeps a listed path with a space or a newline whole', () => {
    expect(
      parseIgnoredPaths(['a b.json', 'a', 'odd\nname.json', 'odd'], {
        status: 0,
        stdout: 'a b.json\u0000odd\nname.json\u0000',
        stderr: '',
      }),
    ).toStrictEqual({ ok: true, value: new Set(['a b.json', 'odd\nname.json']) });
  });
});
