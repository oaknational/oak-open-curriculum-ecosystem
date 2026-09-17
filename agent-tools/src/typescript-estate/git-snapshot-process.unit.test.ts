import { unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { buildGitInvocation, gitEnvironment, runGit } from './git-snapshot-process.js';

describe('buildGitInvocation', () => {
  it('binds the trusted executable, defensive Git options, root, limits, and scrubbed environment', () => {
    const invocation = buildGitInvocation(
      {
        executable: '/trusted/git',
        cwd: '/repo',
        root: '/repo',
        env: { LANG: 'C.UTF-8', GIT_NO_LAZY_FETCH: '1' },
        stderrLimit: 1024,
        process: {
          run: () => ({
            status: null,
            signal: null,
            stdout: new Uint8Array(),
            stderr: new Uint8Array(),
            error: new Error('process must not run while constructing an invocation'),
          }),
        },
      },
      ['-C', '/repo', 'show', 'abc:path.ts'],
      4096,
    );

    expect(invocation).toEqual({
      executable: '/trusted/git',
      args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'show', 'abc:path.ts'],
      cwd: '/repo',
      env: { LANG: 'C.UTF-8', GIT_NO_LAZY_FETCH: '1' },
      maxStdoutBytes: 4096,
      maxStderrBytes: 1024,
    });
  });
});

describe('gitEnvironment', () => {
  it('admits exactly the allowlisted names and forces the pinned-read controls', () => {
    const scrubbed = gitEnvironment({
      PATH: '/usr/bin',
      HOME: '/Users/<user>',
      LANG: 'C.UTF-8',
      LC_ALL: 'C',
      GIT_DIR: '/evil/.git',
      GIT_CONFIG_GLOBAL: '/evil/gitconfig',
      GIT_ALTERNATE_OBJECT_DIRECTORIES: '/evil/objects',
      GIT_EXTERNAL_DIFF: '/evil/diff',
      LD_PRELOAD: '/evil/preload.so',
      NODE_OPTIONS: '--inspect',
      GIT_NO_LAZY_FETCH: '0',
    });

    expect(scrubbed).toEqual({
      PATH: '/usr/bin',
      HOME: '/Users/<user>',
      LANG: 'C.UTF-8',
      LC_ALL: 'C',
      GIT_NO_LAZY_FETCH: '1',
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_GLOBAL: '/dev/null',
    });
  });
});

describe('runGit', () => {
  it('refuses stdout over the byte bound as a resource limit', () => {
    const context = {
      executable: '/trusted/git',
      cwd: '/repo',
      root: '/repo',
      env: { GIT_NO_LAZY_FETCH: '1' },
      stderrLimit: 1024,
      process: {
        run: () => ({
          status: 0,
          signal: null,
          stdout: new Uint8Array(8),
          stderr: new Uint8Array(),
          error: undefined,
        }),
      },
    };

    const outcome = runGit(
      context,
      ['cat-file', 'blob', 'abc:f'],
      4,
      'SOURCE_READ_FAILED',
      'probe',
    );

    expect(unwrapErr(outcome)).toMatchObject({
      code: 'RESOURCE_LIMIT',
      message: 'probe exceeded its byte limit',
    });
  });
});
