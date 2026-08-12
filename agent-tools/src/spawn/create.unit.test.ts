import { sep } from 'node:path';

import { err, isErr, isOk, ok, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { createSpawnWorktree, type SpawnGitRunner } from './create.js';

/**
 * The product derives the sibling worktree path with host-separator joins and
 * compares it against the caller-supplied coordination home, so the fixtures
 * are expressed in host form — the shape every real caller passes.
 */
const hostForm = (posixPath: string): string => posixPath.split('/').join(sep);

const HOME = hostForm('/workspace/oak-open-curriculum-ecosystem');
const SIBLING_WORKTREE = hostForm('/workspace/oak-spawn-flow');

interface GitCall {
  readonly args: readonly string[];
  readonly cwd: string;
}

/**
 * A recording {@link SpawnGitRunner} fake — the injected seam for these unit tests.
 *
 * `worktree list --porcelain` returns `worktrees` (default empty → no existing
 * worktree, so creation proceeds); every other git call returns ok('').
 */
function recordingGit(worktrees = ''): {
  readonly runGit: SpawnGitRunner;
  readonly calls: GitCall[];
} {
  const calls: GitCall[] = [];
  const runGit: SpawnGitRunner = (args, cwd) => {
    calls.push({ args, cwd });
    if (args[0] === 'worktree' && args[1] === 'list') {
      return ok(worktrees);
    }
    return ok('');
  };
  return { runGit, calls };
}

/** A `git worktree list --porcelain` block for `path` checked out on `branch`. */
function porcelainBlock(path: string, branch: string): string {
  return `worktree ${path}\nHEAD 0000000000000000000000000000000000000000\nbranch refs/heads/${branch}\n`;
}

describe('createSpawnWorktree', () => {
  it('creates a sibling oak-<slug> worktree on a <type>/<slug> branch off the base, run from the coordination home', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isOk(result)).toBe(true);
    const worktree = unwrap(result);
    expect(worktree.branch).toBe('feat/spawn-flow');
    expect(worktree.worktreePath).toBe(SIBLING_WORKTREE);
    expect(worktree.base).toBe('origin/main');
    expect(worktree.resumed).toBe(false);
    // It checks for an existing worktree first (idempotent-retry support), then adds.
    expect(calls).toEqual([
      { args: ['worktree', 'list', '--porcelain'], cwd: HOME },
      {
        args: ['worktree', 'add', SIBLING_WORKTREE, '-b', 'feat/spawn-flow', 'origin/main'],
        cwd: HOME,
      },
    ]);
  });

  it('resumes idempotently when the target worktree already exists on the target branch (no add, no removal)', () => {
    // A prior `agent spawn` created the worktree+branch but a later step (build)
    // failed, leaving it on disk. Retrying must RESUME (so the caller re-runs build)
    // rather than erroring — and without removing anything (never-use-git-to-remove-work).
    const { runGit, calls } = recordingGit(porcelainBlock(SIBLING_WORKTREE, 'feat/spawn-flow'));

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isOk(result)).toBe(true);
    const worktree = unwrap(result);
    expect(worktree.worktreePath).toBe(SIBLING_WORKTREE);
    expect(worktree.branch).toBe('feat/spawn-flow');
    // Flagged as a resume so callers do not report it as a fresh creation from `base`
    // (the branch was cut from its original base earlier, not from this invocation's base).
    expect(worktree.resumed).toBe(true);
    // It detected the existing worktree and did NOT attempt to add (nor remove) it.
    expect(calls).toEqual([{ args: ['worktree', 'list', '--porcelain'], cwd: HOME }]);
  });

  it('returns err when the target path exists on a different branch (genuine collision, no add)', () => {
    const { runGit, calls } = recordingGit(porcelainBlock(SIBLING_WORKTREE, 'feat/something-else'));

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toContain('already exists');
      // The actual branch is reported in short form, symmetric with the requested name —
      // not the raw `refs/heads/...` ref from porcelain.
      expect(result.error.message).toContain('feat/something-else');
      expect(result.error.message).not.toContain('refs/heads/');
    }
    // No add attempted — the collision is reported, not worked around.
    expect(calls).toEqual([{ args: ['worktree', 'list', '--porcelain'], cwd: HOME }]);
  });

  it('returns err when the computed oak-<slug> path equals the coordination home (never resume or build on the primary checkout)', () => {
    // Cursor Bugbot f4bf53df: if `oak-<slug>` resolves to the coordination home
    // itself, detectExistingWorktree would match the primary checkout's own
    // worktree-list entry and treat it as resumable — spawn would then run
    // install/build on the main checkout and exit "successfully" without ever
    // creating the intended sibling. The guard fails fast and loud BEFORE any git
    // probe, so the primary checkout is never touched. HOME basename is
    // `oak-open-curriculum-ecosystem`, so slug `open-curriculum-ecosystem` collides.
    const { runGit, calls } = recordingGit(
      // Even with the primary checkout listed on the matching branch, no resume.
      porcelainBlock(HOME, 'feat/open-curriculum-ecosystem'),
    );

    const result = createSpawnWorktree({
      slug: 'open-curriculum-ecosystem',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/coordination home|primary checkout/u);
    }
    // Fails fast: no git probe, no add — the primary checkout is never touched.
    expect(calls).toEqual([]);
  });

  it('returns err on an empty slug without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: '  ',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/slug/u);
    }
    expect(calls).toEqual([]);
  });

  it('returns err on a slug with unsafe path/branch characters without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'a/b spawn',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/slug/u);
    }
    expect(calls).toEqual([]);
  });

  it('returns err on an empty branch type without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: '   ',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/type/u);
    }
    expect(calls).toEqual([]);
  });

  it('returns err on a branch type with unsafe path/ref characters without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat/x',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/type/u);
    }
    expect(calls).toEqual([]);
  });

  it('returns err on an empty base ref without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: '',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/base/u);
    }
    expect(calls).toEqual([]);
  });

  it('returns err on a base ref starting with "-" (argument-injection guard) without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: '--upload-pack=evil',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/base/u);
    }
    expect(calls).toEqual([]);
  });

  it('falls through to a loud add-failure when a branch exists but no worktree occupies the target path', () => {
    // The idempotent-resume only triggers on an existing worktree at the target PATH.
    // A dangling branch with no worktree is NOT resumable — `worktree add` runs and
    // fails loud (branch already exists), with no removal and no silent resume.
    const calls: GitCall[] = [];
    const runGit: SpawnGitRunner = (args, cwd) => {
      calls.push({ args, cwd });
      if (args[0] === 'worktree' && args[1] === 'list') {
        // A different worktree exists; the target path is absent from the list.
        return ok(porcelainBlock(hostForm('/workspace/oak-other'), 'feat/other'));
      }
      return err(new Error("fatal: a branch named 'feat/spawn-flow' already exists"));
    };

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/feat\/spawn-flow|oak-spawn-flow/u);
    }
    // It probed for an existing worktree, found none at the target path, then attempted add.
    expect(calls.map((call) => call.args.slice(0, 2))).toEqual([
      ['worktree', 'list'],
      ['worktree', 'add'],
    ]);
  });

  it('returns err, naming the branch, base, and worktree path, when git fails', () => {
    const failing: SpawnGitRunner = () =>
      err(new Error('fatal: a branch named "feat/spawn-flow" already exists'));

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit: failing,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/feat\/spawn-flow.*origin\/main|oak-spawn-flow/u);
      // The underlying git error is preserved in the cause chain.
      expect(result.error.cause).toBeInstanceOf(Error);
    }
  });
});
