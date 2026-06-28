import { err, isErr, isOk, ok, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { deriveIdentity } from '../core/agent-identity/index.js';

import { createSpawnWorktree, type SpawnGitRunner } from './create.js';

const HOME = '/workspace/oak-open-curriculum-ecosystem';
const SEED = '11112222-3333-4444-5555-666677778888';

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
      generateSeed: () => SEED,
    });

    expect(isOk(result)).toBe(true);
    const worktree = unwrap(result);
    expect(worktree.branch).toBe('feat/spawn-flow');
    expect(worktree.worktreePath).toBe('/workspace/oak-spawn-flow');
    expect(worktree.base).toBe('origin/main');
    expect(worktree.resumed).toBe(false);
    // It checks for an existing worktree first (idempotent-retry support), then adds.
    expect(calls).toEqual([
      { args: ['worktree', 'list', '--porcelain'], cwd: HOME },
      {
        args: [
          'worktree',
          'add',
          '/workspace/oak-spawn-flow',
          '-b',
          'feat/spawn-flow',
          'origin/main',
        ],
        cwd: HOME,
      },
    ]);
  });

  it('resumes idempotently when the target worktree already exists on the target branch (no add, no removal)', () => {
    // A prior `agent spawn` created the worktree+branch but a later step (build)
    // failed, leaving it on disk. Retrying must RESUME (so the caller re-runs build)
    // rather than erroring — and without removing anything (never-use-git-to-remove-work).
    const { runGit, calls } = recordingGit(
      porcelainBlock('/workspace/oak-spawn-flow', 'feat/spawn-flow'),
    );

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
      generateSeed: () => SEED,
    });

    expect(isOk(result)).toBe(true);
    const worktree = unwrap(result);
    expect(worktree.worktreePath).toBe('/workspace/oak-spawn-flow');
    expect(worktree.branch).toBe('feat/spawn-flow');
    // Flagged as a resume so callers do not report it as a fresh creation from `base`
    // (the branch was cut from its original base earlier, not from this invocation's base).
    expect(worktree.resumed).toBe(true);
    // It detected the existing worktree and did NOT attempt to add (nor remove) it.
    expect(calls).toEqual([{ args: ['worktree', 'list', '--porcelain'], cwd: HOME }]);
  });

  it('returns err when the target path exists on a different branch (genuine collision, no add)', () => {
    const { runGit, calls } = recordingGit(
      porcelainBlock('/workspace/oak-spawn-flow', 'feat/something-else'),
    );

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
      generateSeed: () => SEED,
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

  it('mints the session seed and derives the display name and prefix from it', () => {
    const { runGit } = recordingGit();

    const worktree = unwrap(
      createSpawnWorktree({
        slug: 'spawn-flow',
        type: 'feat',
        base: 'origin/main',
        coordinationHome: HOME,
        runGit,
        generateSeed: () => SEED,
      }),
    );

    expect(worktree.session.seed).toBe(SEED);
    expect(worktree.session.sessionIdPrefix).toBe(SEED.slice(0, 6));
    // The display name is derived through the canonical deterministic deriver,
    // not asserted as a magic string — behaviour (derived-from-seed), not value.
    expect(worktree.session.agentName).toBe(deriveIdentity(SEED).displayName);
  });

  it('returns err on an empty slug without invoking git', () => {
    const { runGit, calls } = recordingGit();

    const result = createSpawnWorktree({
      slug: '  ',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
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
        return ok(porcelainBlock('/workspace/oak-other', 'feat/other'));
      }
      return err(new Error("fatal: a branch named 'feat/spawn-flow' already exists"));
    };

    const result = createSpawnWorktree({
      slug: 'spawn-flow',
      type: 'feat',
      base: 'origin/main',
      coordinationHome: HOME,
      runGit,
      generateSeed: () => SEED,
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
      generateSeed: () => SEED,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/feat\/spawn-flow.*origin\/main|oak-spawn-flow/u);
      // The underlying git error is preserved in the cause chain.
      expect(result.error.cause).toBeInstanceOf(Error);
    }
  });
});
