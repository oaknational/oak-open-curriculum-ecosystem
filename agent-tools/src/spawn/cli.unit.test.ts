import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { runSpawnCli, type SpawnCliInput } from './cli.js';
import type { CreateSpawnWorktreeOptions, SpawnedWorktree } from './create.js';

const HOME = '/workspace/oak-open-curriculum-ecosystem';

function capture(): {
  readonly out: { write: (s: string) => boolean };
  readonly err: { write: (s: string) => boolean };
  text: () => string;
  errText: () => string;
} {
  const outChunks: string[] = [];
  const errChunks: string[] = [];
  return {
    out: {
      write: (s) => {
        outChunks.push(s);
        return true;
      },
    },
    err: {
      write: (s) => {
        errChunks.push(s);
        return true;
      },
    },
    text: () => outChunks.join(''),
    errText: () => errChunks.join(''),
  };
}

const STUB_WORKTREE: SpawnedWorktree = {
  worktreePath: '/workspace/oak-spawn-flow',
  branch: 'feat/spawn-flow',
  base: 'origin/main',
  session: { seed: 'seed-value', agentName: 'Test Agent Name', sessionIdPrefix: 'seed-v' },
  resumed: false,
};

function baseInput(overrides: Partial<SpawnCliInput> = {}): SpawnCliInput {
  return {
    args: ['--slug', 'spawn-flow'],
    cwd: '/workspace/oak-spawn-flow',
    resolveHome: () => ok(HOME),
    createWorktree: () => ok(STUB_WORKTREE),
    build: () => ok(undefined),
    ...overrides,
  };
}

describe('runSpawnCli', () => {
  it('passes the parsed slug, default type (feat) and default base (origin/main) plus the resolved home to the creator', () => {
    let received: CreateSpawnWorktreeOptions | undefined;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      createWorktree: (opts) => {
        received = opts;
        return ok(STUB_WORKTREE);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    expect(received).toMatchObject({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
    });
  });

  it('honours explicit --type and --base', () => {
    let received: CreateSpawnWorktreeOptions | undefined;
    const cap = capture();
    runSpawnCli({
      ...baseInput({ args: ['--slug', 'fix-thing', '--type', 'fix', '--base', 'origin/release'] }),
      createWorktree: (opts) => {
        received = opts;
        return ok({ ...STUB_WORKTREE, branch: 'fix/fix-thing', base: 'origin/release' });
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(received).toMatchObject({ slug: 'fix-thing', type: 'fix', base: 'origin/release' });
  });

  it('reports the created worktree path, branch, base, and minted session on stdout', () => {
    const cap = capture();
    const exitCode = runSpawnCli({ ...baseInput(), stdout: cap.out, stderr: cap.err });

    expect(exitCode).toBe(0);
    const text = cap.text();
    expect(text).toContain('/workspace/oak-spawn-flow');
    expect(text).toContain('feat/spawn-flow');
    expect(text).toContain('origin/main');
    expect(text).toContain('Test Agent Name');
    expect(text).toContain('seed-v');
  });

  it('reports a resumed worktree honestly — no "Created" and no fresh "(from <base>)" claim', () => {
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      // A retry after a prior build failure: the creator resumed the existing worktree.
      createWorktree: () => ok({ ...STUB_WORKTREE, resumed: true }),
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    const text = cap.text();
    expect(text).toContain('Resumed existing worktree');
    expect(text).toContain('feat/spawn-flow');
    // The dishonest fresh-creation claim must NOT appear on a resume.
    expect(text).not.toContain('Created worktree');
    expect(text).not.toContain('(from ');
  });

  it('exits non-zero with the error on stderr when --slug is missing', () => {
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput({ args: [] }),
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(2);
    expect(cap.errText()).toMatch(/slug/u);
  });

  it('exits non-zero with the error on stderr when the coordination home cannot be resolved', () => {
    let created = false;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      resolveHome: () => err(new Error('not inside a git working tree')),
      createWorktree: () => {
        created = true;
        return ok(STUB_WORKTREE);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(2);
    expect(cap.errText()).toMatch(/git working tree/u);
    // home-resolution failure short-circuits before any worktree is created.
    expect(created).toBe(false);
  });

  it('builds the created worktree (build-at-spawn) at the created path', () => {
    let builtPath: string | undefined;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      build: (opts) => {
        builtPath = opts.worktreePath;
        return ok(undefined);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    expect(builtPath).toBe('/workspace/oak-spawn-flow');
  });

  it('exits non-zero with the error on stderr when the build fails', () => {
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      build: () =>
        err(new Error("spawn: 'pnpm install' failed in '/workspace/oak-spawn-flow'. boom")),
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(2);
    expect(cap.errText()).toMatch(/pnpm install.*failed/u);
  });

  it('exits non-zero with the error on stderr when the creator returns err', () => {
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      createWorktree: () => err(new Error('spawn: failed to create worktree ... already exists')),
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(2);
    expect(cap.errText()).toMatch(/already exists/u);
  });

  it('prints usage and exits 0 on --help without resolving the home or creating anything', () => {
    let resolvedHome = false;
    let created = false;
    const cap = capture();
    const exitCode = runSpawnCli({
      args: ['--help'],
      cwd: '/workspace/oak-spawn-flow',
      resolveHome: () => {
        resolvedHome = true;
        return ok(HOME);
      },
      createWorktree: () => {
        created = true;
        return ok(STUB_WORKTREE);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    expect(resolvedHome).toBe(false);
    expect(created).toBe(false);
    expect(cap.text()).toMatch(/spawn/u);
  });
});
