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

/** A recording {@link SpawnGitRunner} fake — the injected seam for these unit tests. */
function recordingGit(): { readonly runGit: SpawnGitRunner; readonly calls: GitCall[] } {
  const calls: GitCall[] = [];
  const runGit: SpawnGitRunner = (args, cwd) => {
    calls.push({ args, cwd });
    return ok('');
  };
  return { runGit, calls };
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
    expect(calls).toEqual([
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
