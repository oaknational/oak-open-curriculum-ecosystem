import { describe, expect, it } from 'vitest';

import { unwrap, unwrapErr } from '@oaknational/result';

import { resolveTrustedGit } from '../core/trusted-git.js';
import {
  buildScrubbedGitEnv,
  makeGitByteSource,
  type GitSpawner,
  type GitSpawnResult,
} from './refound-window-sample-git.js';
import { type ByteSource } from './refound-window-sample-universe.js';

/**
 * In-process behaviours of the git-backed byte source through the injected
 * spawner seam (ADR-078 — no process is ever spawned here): arg-vector
 * construction for both invocations (forwarding IS the seam's contract),
 * NUL/tab listing parsing, the non-regular-mode and malformed-entry
 * refusals, non-zero-exit and spawn-error mapping, the UTF-8 round-trip
 * refusal, and the environment scrub the production spawner applies.
 */

const BASE = 'ab'.repeat(20);
const REPO_ROOT = '/repo';

/**
 * With an all-true probe the trusted allowlist resolves its first entry for
 * the running platform (the entry itself is proven per-platform in
 * `core/trusted-git.unit.test.ts`); what THIS suite proves is that the byte
 * source forwards that resolved binary to the spawner unchanged.
 */
const TRUSTED_GIT = resolveTrustedGit(() => true);

interface RecordedCall {
  readonly file: string;
  readonly args: readonly string[];
}

function scriptedSpawner(respond: (args: readonly string[]) => GitSpawnResult): {
  readonly calls: RecordedCall[];
  readonly spawn: GitSpawner;
} {
  const calls: RecordedCall[] = [];
  return {
    calls,
    spawn: (file, args) => {
      calls.push({ file, args });
      return respond(args);
    },
  };
}

const okSpawn = (stdout: Buffer | string): GitSpawnResult => ({
  status: 0,
  stdout: typeof stdout === 'string' ? Buffer.from(stdout, 'utf8') : stdout,
  stderr: Buffer.alloc(0),
});

function sourceWith(respond: (args: readonly string[]) => GitSpawnResult): {
  readonly calls: RecordedCall[];
  readonly source: ByteSource;
} {
  const { calls, spawn } = scriptedSpawner(respond);
  const source = unwrap(makeGitByteSource(REPO_ROOT, BASE, { spawn, exists: () => true }));
  return { calls, source };
}

describe('makeGitByteSource — the spawner forwarding contract', () => {
  it('invokes ls-tree with --no-replace-objects, -C <repoRoot>, -r, -z, and the base sha', () => {
    const { calls, source } = sourceWith(() => okSpawn(''));
    expect(source.listPaths().ok).toBe(true);
    expect(calls).toEqual([
      {
        file: TRUSTED_GIT,
        args: ['--no-replace-objects', '-C', REPO_ROOT, 'ls-tree', '-r', '-z', BASE],
      },
    ]);
  });

  it('invokes show with --no-replace-objects, -C <repoRoot>, and <base>:<path>, returning raw bytes', () => {
    const bytes = Buffer.from([0x00, 0x01, 0xff]);
    const { calls, source } = sourceWith(() => okSpawn(bytes));
    const read = source.readBytes('.agent/prompts/a b.md');
    expect(Buffer.from(unwrap(read)).equals(bytes)).toBe(true);
    expect(calls).toEqual([
      {
        file: TRUSTED_GIT,
        args: ['--no-replace-objects', '-C', REPO_ROOT, 'show', `${BASE}:.agent/prompts/a b.md`],
      },
    ]);
  });

  it('refuses up front when no trusted git binary exists', () => {
    const made = makeGitByteSource(REPO_ROOT, BASE, {
      spawn: () => okSpawn(''),
      exists: () => false,
    });
    expect(unwrapErr(made).message).toContain('No trusted git binary found');
  });
});

describe('makeGitByteSource — NUL-delimited listing parsing', () => {
  it('parses NUL-terminated mode/type/object-tab-path entries, keeping special-character paths', () => {
    const listing =
      '100644 blob aaaa\t.agent/prompts/a.md\0' + '100755 blob bbbb\t.agent/prompts/run me.md\0';
    const { source } = sourceWith(() => okSpawn(listing));
    expect(unwrap(source.listPaths())).toEqual(['.agent/prompts/a.md', '.agent/prompts/run me.md']);
  });

  it('refuses a symlink entry loudly, naming the path and mode', () => {
    const listing = '120000 blob cccc\t.agent/prompts/link.md\0';
    const { source } = sourceWith(() => okSpawn(listing));
    const error = unwrapErr(source.listPaths());
    expect(error.message).toContain('.agent/prompts/link.md');
    expect(error.message).toContain('mode 120000');
  });

  it('refuses a gitlink entry loudly, naming the path and mode', () => {
    const listing = '160000 commit dddd\tvendor/sub\0';
    const { source } = sourceWith(() => okSpawn(listing));
    const error = unwrapErr(source.listPaths());
    expect(error.message).toContain('vendor/sub');
    expect(error.message).toContain('mode 160000');
  });

  it('refuses a malformed entry with no tab separator', () => {
    const { source } = sourceWith(() => okSpawn('garbage-without-a-tab\0'));
    expect(unwrapErr(source.listPaths()).message).toContain('no tab separator');
  });

  it('refuses a listing that does not round-trip as UTF-8', () => {
    const listing = Buffer.concat([
      Buffer.from('100644 blob aaaa\t.agent/prompts/', 'utf8'),
      Buffer.from([0xff, 0xfe]),
      Buffer.from('.md\0', 'utf8'),
    ]);
    const { source } = sourceWith(() => okSpawn(listing));
    expect(unwrapErr(source.listPaths()).message).toContain('round-trip as UTF-8');
  });
});

describe('makeGitByteSource — failure mapping', () => {
  it('maps a non-zero exit to an error carrying the status and stderr', () => {
    const { source } = sourceWith(() => ({
      status: 128,
      stdout: Buffer.alloc(0),
      stderr: Buffer.from('fatal: bad object deadbeef', 'utf8'),
    }));
    const error = unwrapErr(source.listPaths());
    expect(error.message).toContain('exited 128');
    expect(error.message).toContain('bad object deadbeef');
  });

  it('maps a spawn-level failure to an error carrying its cause', () => {
    const { source } = sourceWith(() => ({
      error: new Error('spawn EACCES'),
      status: null,
      stdout: Buffer.alloc(0),
      stderr: Buffer.alloc(0),
    }));
    const error = unwrapErr(source.readBytes('.agent/prompts/a.md'));
    expect(error.message).toContain('cannot run git');
    expect(error.message).toContain('spawn EACCES');
  });
});

describe('buildScrubbedGitEnv — the spawn environment scrub', () => {
  it('keeps only PATH, HOME, LANG, and LC_*, dropping every GIT_* variable', () => {
    const scrubbed = buildScrubbedGitEnv({
      PATH: '/usr/bin',
      HOME: '<home>',
      LANG: 'en_GB.UTF-8',
      LC_ALL: 'C',
      LC_CTYPE: 'UTF-8',
      GIT_DIR: '/evil/.git',
      GIT_OBJECT_DIRECTORY: '/evil/objects',
      GIT_ALTERNATE_OBJECT_DIRECTORIES: '/evil/alt',
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'core.fsmonitor',
      GIT_CONFIG_VALUE_0: '/evil/hook',
      SOME_TOKEN: 'not-forwarded',
      DROPPED_UNDEFINED: undefined,
    });
    expect(scrubbed).toEqual({
      PATH: '/usr/bin',
      HOME: '<home>',
      LANG: 'en_GB.UTF-8',
      LC_ALL: 'C',
      LC_CTYPE: 'UTF-8',
    });
    expect(Object.keys(scrubbed).some((key) => key.startsWith('GIT_'))).toBe(false);
  });
});
