/**
 * Unit tests for the pure halves of the repository's own record, over literal
 * inputs, literal spawn results and literal git outputs (tests never use or
 * create IO: `testing-strategy.md` §Philosophy). The one IO call, `spawnSync`,
 * has no test: its behaviour against a real scratch repository was observed
 * once, when the runner was built, and recorded in the pull request that
 * added it.
 */
import { describe, expect, it } from 'vitest';

import {
  describeGitReadFailure,
  gitUnavailable,
  parseTrackedFiles,
  toGitRunOutput,
  withImpliedDirectories,
} from './repository-paths.js';
import { TrustedGitResolutionError } from './trusted-git.js';

describe('withImpliedDirectories', () => {
  it('adds every ancestor directory of a tracked file', () => {
    expect(withImpliedDirectories(['.agent/state/collaboration/.gitignore'])).toStrictEqual(
      new Set([
        '.agent/state/collaboration/.gitignore',
        '.agent/state/collaboration',
        '.agent/state',
        '.agent',
      ]),
    );
  });

  it('adds no entry for the repository root', () => {
    expect(withImpliedDirectories(['README.md', 'package.json'])).toStrictEqual(
      new Set(['README.md', 'package.json']),
    );
  });

  it('keeps one entry for a directory shared by several files', () => {
    expect(withImpliedDirectories(['docs/a.md', 'docs/b.md'])).toStrictEqual(
      new Set(['docs/a.md', 'docs/b.md', 'docs']),
    );
  });

  it('adds each missing intermediate directory when files share only a higher ancestor', () => {
    expect(withImpliedDirectories(['docs/a.md', 'docs/guides/deep/b.md'])).toStrictEqual(
      new Set(['docs/a.md', 'docs', 'docs/guides/deep/b.md', 'docs/guides/deep', 'docs/guides']),
    );
  });

  it('gives an empty set for no tracked files', () => {
    expect(withImpliedDirectories([])).toStrictEqual(new Set());
  });
});

describe('toGitRunOutput', () => {
  it('passes a clean run through', () => {
    expect(
      toGitRunOutput({ status: 0, signal: null, stdout: 'README.md\u0000', stderr: '' }),
    ).toStrictEqual({ status: 0, stdout: 'README.md\u0000', stderr: '' });
  });

  it('reads a git that never started as no status, with the reason as its standard error', () => {
    expect(
      toGitRunOutput({ status: null, signal: null, error: new Error('spawnSync git ENOENT') }),
    ).toStrictEqual({ status: null, stdout: '', stderr: 'spawnSync git ENOENT' });
  });

  it('keeps what a killed git wrote to standard error and names the signal', () => {
    const output = toGitRunOutput({
      status: null,
      signal: 'SIGTERM',
      stdout: '',
      stderr: 'warning: slow read\n',
    });
    expect(output.stderr).toContain('warning: slow read');
    expect(output.stderr).toContain('SIGTERM');
  });

  it('reads a run Node reports an error for as no status, whatever status it carries', () => {
    expect(
      toGitRunOutput({
        status: 0,
        signal: null,
        error: new Error('spawnSync git ENOBUFS'),
        stdout: 'README.md\u0000docs/trunc',
        stderr: '',
      }).status,
    ).toBeNull();
  });

  it('keeps both reasons when Node reports an error and the signal it killed git with', () => {
    const output = toGitRunOutput({
      status: null,
      signal: 'SIGTERM',
      error: new Error('spawnSync git ENOBUFS'),
      stdout: 'README.md\u0000docs/trunc',
      stderr: '',
    });
    expect(output.status).toBeNull();
    expect(output.stderr).toContain('spawnSync git ENOBUFS');
    expect(output.stderr).toContain('SIGTERM');
  });
});

describe('parseTrackedFiles', () => {
  it('reads a NUL-separated listing, keeping a space or a newline inside a path', () => {
    expect(
      parseTrackedFiles({
        status: 0,
        stdout: 'README.md\u0000docs/a b.md\u0000docs/odd\nname.md\u0000',
        stderr: '',
      }),
    ).toStrictEqual({ ok: true, value: ['README.md', 'docs/a b.md', 'docs/odd\nname.md'] });
  });

  it("refuses a listing git failed, carrying git's own standard error", () => {
    const stderr = 'fatal: not a git repository (or any of the parent directories): .git\n';
    expect(parseTrackedFiles({ status: 128, stdout: '', stderr })).toStrictEqual({
      ok: false,
      error: { kind: 'git-failed', status: 128, stderr },
    });
  });

  it('refuses a listing from a git that exited without a status', () => {
    const stderr = 'git was killed by SIGTERM';
    expect(parseTrackedFiles({ status: null, stdout: 'README.md\u0000', stderr })).toStrictEqual({
      ok: false,
      error: { kind: 'git-failed', status: null, stderr },
    });
  });

  it('refuses a successful listing that names no file, since every checkout tracks files', () => {
    expect(parseTrackedFiles({ status: 0, stdout: '', stderr: '' })).toStrictEqual({
      ok: false,
      error: { kind: 'empty-listing' },
    });
  });
});

describe('gitUnavailable', () => {
  it("carries the resolver's own message, without the error's class name", () => {
    const refusal = new TrustedGitResolutionError(
      'No trusted git binary found. Searched: /usr/bin/git, /bin/git',
    );

    expect(gitUnavailable(refusal)).toStrictEqual({
      kind: 'git-unavailable',
      message: 'No trusted git binary found. Searched: /usr/bin/git, /bin/git',
    });
  });
});

describe('describeGitReadFailure', () => {
  it("carries git's exit status and its own standard error to the operator, on one line", () => {
    const line = describeGitReadFailure({
      kind: 'git-failed',
      status: 128,
      stderr: 'fatal: not a git repository: .git\nhint: run it inside a checkout\n',
    });
    expect(line).toContain('128');
    expect(line).toContain('fatal: not a git repository: .git');
    expect(line).toContain('hint: run it inside a checkout');
    expect(line).not.toContain('\n');
  });

  it("carries the git resolver's own refusal, unchanged", () => {
    const message = 'No trusted git binary found. Searched: /usr/bin/git, /bin/git';
    expect(describeGitReadFailure({ kind: 'git-unavailable', message })).toContain(message);
  });

  it('says a git that gave no exit status did so, with its standard error', () => {
    const line = describeGitReadFailure({
      kind: 'git-failed',
      status: null,
      stderr: 'spawnSync git ENOENT',
    });
    expect(line).toContain('no exit status');
    expect(line).toContain('spawnSync git ENOENT');
  });

  it('says so when git failed with nothing on standard error', () => {
    expect(describeGitReadFailure({ kind: 'git-failed', status: 128, stderr: '' })).toContain(
      '(no standard error)',
    );
  });

  it('says an empty listing named no tracked files', () => {
    expect(describeGitReadFailure({ kind: 'empty-listing' })).toContain('no tracked files');
  });

  it("ends without a full stop, so the caller's own sentence closes it", () => {
    const line = describeGitReadFailure({
      kind: 'git-unavailable',
      message: 'No trusted git binary found. Symlink git at one of those paths.',
    });
    expect(line.endsWith('.')).toBe(false);
  });
});
