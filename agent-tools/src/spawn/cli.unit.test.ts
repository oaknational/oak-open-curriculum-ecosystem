import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { runSpawnCli, type SpawnCliInput } from './cli.js';
import type { CreateSpawnWorktreeOptions, SpawnedWorktree } from './create.js';

const HOME = '/workspace/oak-open-curriculum-ecosystem';
const PR_URL = 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/999';

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
    openPr: () => ok(PR_URL),
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

  it('reports the created worktree path, branch, base, minted session, and the draft PR URL on stdout', () => {
    const cap = capture();
    const exitCode = runSpawnCli({ ...baseInput(), stdout: cap.out, stderr: cap.err });

    expect(exitCode).toBe(0);
    const text = cap.text();
    expect(text).toContain('/workspace/oak-spawn-flow');
    expect(text).toContain('feat/spawn-flow');
    expect(text).toContain('origin/main');
    expect(text).toContain('Test Agent Name');
    expect(text).toContain('seed-v');
    expect(text).toContain('draft PR');
    expect(text).toContain(PR_URL);
  });

  it('opens a draft PR at spawn-end on a fresh (no-commit) branch, passing the worktree, branch, base, and slug', () => {
    // The outcome 1C delivers: after create + build, a draft PR exists for the
    // freshly-spawned lane (worktree-hygiene rule 1). The empty-commit mechanism
    // lives in openDraftPr; here we pin that the CLI invokes it on a fresh spawn
    // with the lane's coordinates and surfaces the resulting PR.
    let received: { worktreePath: string; branch: string; base: string; slug: string } | undefined;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput({ args: ['--slug', 'spawn-flow', '--base', 'origin/main'] }),
      openPr: (opts) => {
        received = opts;
        return ok(PR_URL);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    expect(received).toEqual({
      worktreePath: '/workspace/oak-spawn-flow',
      branch: 'feat/spawn-flow',
      base: 'origin/main',
      slug: 'spawn-flow',
    });
    expect(cap.text()).toContain(PR_URL);
  });

  it('normalises --base and --slug at the parse boundary so openDraftPr never receives untrimmed whitespace', () => {
    // Bugbot finding: createSpawnWorktree trims --base for `git worktree add`, but the
    // raw parsed base reached openDraftPr, so baseBranchOf / `gh pr create --base` could
    // see a trailing space and fail or target the wrong base. Trimming once at the parse
    // boundary keeps the value consistent across both consumers (create + open-pr).
    let received: { worktreePath: string; branch: string; base: string; slug: string } | undefined;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput({ args: ['--slug', 'spawn-flow ', '--base', 'origin/main '] }),
      openPr: (opts) => {
        received = opts;
        return ok(PR_URL);
      },
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(0);
    expect(received?.base).toBe('origin/main');
    expect(received?.slug).toBe('spawn-flow');
  });

  it('exits non-zero with the error on stderr when opening the draft PR fails', () => {
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      openPr: () =>
        err(new Error("spawn: failed to open the draft PR for 'feat/spawn-flow'. boom")),
      stdout: cap.out,
      stderr: cap.err,
    });

    expect(exitCode).toBe(2);
    expect(cap.errText()).toMatch(/draft PR/u);
  });

  it('reports a resumed worktree honestly and does NOT re-open a PR (no double marker commit / PR collision)', () => {
    let openPrCalled = false;
    const cap = capture();
    const exitCode = runSpawnCli({
      ...baseInput(),
      // A retry after a prior build failure: the creator resumed the existing worktree.
      createWorktree: () => ok({ ...STUB_WORKTREE, resumed: true }),
      openPr: () => {
        openPrCalled = true;
        return ok(PR_URL);
      },
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
    // A resume is a build-retry: it must NOT re-open the PR, and prints no PR line.
    expect(openPrCalled).toBe(false);
    expect(text).not.toContain('draft PR');
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
