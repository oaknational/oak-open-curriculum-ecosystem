import { Buffer } from 'node:buffer';

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  captureGitSnapshot,
  type GitSnapshotLimits,
  type SnapshotPathPort,
} from './git-snapshot.js';
import type { ProcessInvocation, ProcessResult } from './ports.js';
import { exactProcessPort } from './test-helpers/exact-process-port.js';

const COMMIT = 'a'.repeat(40);
const TREE = 'b'.repeat(40);
const LIMITS: GitSnapshotLimits = {
  maxTrackedPaths: 20,
  maxTreeListingBytes: 4096,
  maxGitStderrBytes: 1024,
  maxTotalSourceBytes: 4096,
  maxSourceBytesPerFile: 1024,
  maxTotalAuxiliaryBlobBytes: 4096,
  maxAuxiliaryBlobBytesPerFile: 1024,
};

const SCRUBBED_ENVIRONMENT = {
  PATH: '/bin',
  HOME: '/test-home',
  LANG: 'C.UTF-8',
  LC_ALL: 'C',
  GIT_NO_LAZY_FETCH: '1',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_CONFIG_GLOBAL: '/dev/null',
} as const;
const MINIMAL_ENVIRONMENT = {
  GIT_NO_LAZY_FETCH: '1',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_CONFIG_GLOBAL: '/dev/null',
} as const;

const DISCOVER_FROM_CALLER = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/caller',
    'rev-parse',
    '--show-toplevel',
  ],
  cwd: '/caller',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const RESOLVE_SURPRISING_COMMIT = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'rev-parse',
    '--verify',
    '--end-of-options',
    '--surprising-ref^{commit}',
  ],
  cwd: '/repo',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const RESOLVE_TREE_WITH_SCRUBBED_ENVIRONMENT = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'rev-parse',
    '--verify',
    '--end-of-options',
    `${COMMIT}^{tree}`,
  ],
  cwd: '/repo',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const LIST_TREE_WITH_SCRUBBED_ENVIRONMENT = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'ls-tree',
    '-r',
    '-z',
    '--long',
    COMMIT,
  ],
  cwd: '/repo',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const SHOW_A_WITH_SCRUBBED_ENVIRONMENT = {
  executable: '/trusted/git',
  args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'show', `${COMMIT}:a.tsx`],
  cwd: '/repo',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 1024,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const SHOW_Z_WITH_SCRUBBED_ENVIRONMENT = {
  executable: '/trusted/git',
  args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'show', `${COMMIT}:z.ts`],
  cwd: '/repo',
  env: SCRUBBED_ENVIRONMENT,
  maxStdoutBytes: 1024,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const DISCOVER_FROM_REPO = {
  executable: '/trusted/git',
  args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'rev-parse', '--show-toplevel'],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const RESOLVE_HEAD_COMMIT = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'rev-parse',
    '--verify',
    '--end-of-options',
    'HEAD^{commit}',
  ],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const RESOLVE_HEAD_TREE = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'rev-parse',
    '--verify',
    '--end-of-options',
    `${COMMIT}^{tree}`,
  ],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const LIST_HEAD_TREE = {
  executable: '/trusted/git',
  args: [
    '--no-replace-objects',
    '--no-lazy-fetch',
    '-C',
    '/repo',
    'ls-tree',
    '-r',
    '-z',
    '--long',
    COMMIT,
  ],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 4096,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const SHOW_BOM = {
  executable: '/trusted/git',
  args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'show', `${COMMIT}:bom.ts`],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 1024,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

const SHOW_ONLY = {
  executable: '/trusted/git',
  args: ['--no-replace-objects', '--no-lazy-fetch', '-C', '/repo', 'show', `${COMMIT}:only.ts`],
  cwd: '/repo',
  env: MINIMAL_ENVIRONMENT,
  maxStdoutBytes: 1024,
  maxStderrBytes: 1024,
} as const satisfies ProcessInvocation;

function success(stdout: string | Uint8Array): ProcessResult {
  return {
    status: 0,
    signal: null,
    stdout: typeof stdout === 'string' ? Buffer.from(stdout) : stdout,
    stderr: new Uint8Array(),
    error: undefined,
  };
}

function failure(message: string): ProcessResult {
  return {
    status: 128,
    signal: null,
    stdout: new Uint8Array(),
    stderr: Buffer.from(message),
    error: undefined,
  };
}

function treeEntry(
  mode: string,
  type: string,
  object: string,
  size: number | '-',
  path: string | Uint8Array,
): Uint8Array {
  return Buffer.concat([
    Buffer.from(`${mode} ${type} ${object} ${String(size)}\t`),
    typeof path === 'string' ? Buffer.from(path) : path,
    Buffer.from([0]),
  ]);
}

const pathPort: SnapshotPathPort = {
  canonicalRealpath: (value) => (value === '/repo-link' ? '/repo' : value),
};

describe('captureGitSnapshot integration', () => {
  it('uses the Git object store for a complete, ordered TypeScript source snapshot', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'z.ts'),
      treeEntry('120000', 'blob', 'd'.repeat(40), 8, 'link.tsx'),
      treeEntry('100644', 'blob', 'e'.repeat(40), 0, 'a.tsx'),
      treeEntry('100644', 'blob', 'f'.repeat(40), 4, 'notes.md'),
    ]);
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_CALLER, result: success('/repo-link\n') },
      { invocation: RESOLVE_SURPRISING_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_TREE_WITH_SCRUBBED_ENVIRONMENT, result: success(`${TREE}\n`) },
      { invocation: LIST_TREE_WITH_SCRUBBED_ENVIRONMENT, result: success(listing) },
      { invocation: SHOW_A_WITH_SCRUBBED_ENVIRONMENT, result: success(new Uint8Array()) },
      {
        invocation: SHOW_Z_WITH_SCRUBBED_ENVIRONMENT,
        result: success(Uint8Array.from([0xff])),
      },
    ]);

    const snapshot = unwrapOrThrow(
      captureGitSnapshot({
        callerCwd: '/caller',
        inputRef: '--surprising-ref',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {
          PATH: '/bin',
          HOME: '/test-home',
          LANG: 'C.UTF-8',
          LC_ALL: 'C',
          GIT_DIR: '/hostile',
          SECRET: 'hidden',
        },
        limits: LIMITS,
        process,
        paths: pathPort,
      }),
    );

    expect(snapshot.invokingGitRoot).toBe('/repo');
    expect(snapshot.record).toEqual({
      inputRef: '--surprising-ref',
      commit: COMMIT,
      tree: TREE,
      source: 'git-tree',
    });
    expect(snapshot.treeEntries.map(({ path }) => path)).toEqual([
      'a.tsx',
      'link.tsx',
      'notes.md',
      'z.ts',
    ]);
    expect(snapshot.treeEntries[2]).toMatchObject({
      path: 'notes.md',
      treeEntry: { mode: '100644', type: 'blob', size: 4 },
    });
    expect(snapshot.files.map(({ path }) => path)).toEqual(['a.tsx', 'link.tsx', 'z.ts']);
    expect(snapshot.files[0]).toMatchObject({
      path: 'a.tsx',
      extension: '.tsx',
      read: { status: 'read', byteCount: 0, lineCount: 1 },
    });
    expect(snapshot.files[1]).toMatchObject({
      path: 'link.tsx',
      read: { status: 'unsupported-mode', mode: '120000' },
    });
    expect(snapshot.files[2]).toMatchObject({
      path: 'z.ts',
      read: { status: 'invalid-utf8', byteCount: 1, lineCount: null },
    });
  });

  it('fails the complete run on malformed path bytes before any source read', () => {
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_REPO, result: success('/repo\n') },
      { invocation: RESOLVE_HEAD_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_HEAD_TREE, result: success(`${TREE}\n`) },
      {
        invocation: LIST_HEAD_TREE,
        result: success(treeEntry('100644', 'blob', 'c'.repeat(40), 1, Uint8Array.from([0xff]))),
      },
    ]);

    const error = unwrapErr(
      captureGitSnapshot({
        callerCwd: '/repo',
        inputRef: 'HEAD',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {},
        limits: LIMITS,
        process,
        paths: pathPort,
      }),
    );

    expect(error).toMatchObject({ code: 'SNAPSHOT_INVALID' });
    expect(error.message).toContain('UTF-8');
  });

  it('rejects a duplicate non-TypeScript tree path before any source read', () => {
    const duplicate = treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'notes.md');
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_REPO, result: success('/repo\n') },
      { invocation: RESOLVE_HEAD_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_HEAD_TREE, result: success(`${TREE}\n`) },
      {
        invocation: LIST_HEAD_TREE,
        result: success(Buffer.concat([duplicate, duplicate])),
      },
    ]);

    const error = unwrapErr(
      captureGitSnapshot({
        callerCwd: '/repo',
        inputRef: 'HEAD',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {},
        limits: LIMITS,
        process,
        paths: pathPort,
      }),
    );

    expect(error).toMatchObject({ code: 'SNAPSHOT_INVALID' });
    expect(error.message).toContain("duplicate tree path 'notes.md'");
  });

  it('retains a UTF-8 BOM as valid source bytes', () => {
    const source = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from('export {};\n')]);
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_REPO, result: success('/repo\n') },
      { invocation: RESOLVE_HEAD_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_HEAD_TREE, result: success(`${TREE}\n`) },
      {
        invocation: LIST_HEAD_TREE,
        result: success(treeEntry('100644', 'blob', 'c'.repeat(40), source.byteLength, 'bom.ts')),
      },
      { invocation: SHOW_BOM, result: success(source) },
    ]);

    const snapshot = unwrapOrThrow(
      captureGitSnapshot({
        callerCwd: '/repo',
        inputRef: 'HEAD',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {},
        limits: LIMITS,
        process,
        paths: pathPort,
      }),
    );

    expect(snapshot.files[0]).toMatchObject({
      path: 'bom.ts',
      read: { status: 'read', byteCount: source.byteLength, lineCount: 2 },
    });
  });

  it('preserves the Git source-read failure as a typed cause and returns no partial snapshot', () => {
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_REPO, result: success('/repo\n') },
      { invocation: RESOLVE_HEAD_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_HEAD_TREE, result: success(`${TREE}\n`) },
      {
        invocation: LIST_HEAD_TREE,
        result: success(treeEntry('100644', 'blob', 'c'.repeat(40), 4, 'only.ts')),
      },
      { invocation: SHOW_ONLY, result: failure('fatal: missing promised object') },
    ]);

    const error = unwrapErr(
      captureGitSnapshot({
        callerCwd: '/repo',
        inputRef: 'HEAD',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {},
        limits: LIMITS,
        process,
        paths: pathPort,
      }),
    );

    expect(error).toMatchObject({ code: 'SOURCE_READ_FAILED' });
    expect(error.message).toContain('only.ts');
    expect(error.cause).toBeInstanceOf(Error);
    expect(error.cause).toHaveProperty('message', 'fatal: missing promised object');
  });

  it('enforces the complete-tree path limit without truncating the denominator', () => {
    const listing = Buffer.concat([
      treeEntry('100644', 'blob', 'c'.repeat(40), 1, 'one.ts'),
      treeEntry('100644', 'blob', 'd'.repeat(40), 1, 'two.md'),
    ]);
    const process = exactProcessPort([
      { invocation: DISCOVER_FROM_REPO, result: success('/repo\n') },
      { invocation: RESOLVE_HEAD_COMMIT, result: success(`${COMMIT}\n`) },
      { invocation: RESOLVE_HEAD_TREE, result: success(`${TREE}\n`) },
      { invocation: LIST_HEAD_TREE, result: success(listing) },
    ]);

    const error = unwrapErr(
      captureGitSnapshot({
        callerCwd: '/repo',
        inputRef: 'HEAD',
        gitExecutable: '/trusted/git',
        inheritedEnvironment: {},
        limits: { ...LIMITS, maxTrackedPaths: 1 },
        process,
        paths: pathPort,
      }),
    );

    expect(error).toMatchObject({ code: 'RESOURCE_LIMIT' });
    expect(error.message).toContain('tracked-path limit');
  });
});
