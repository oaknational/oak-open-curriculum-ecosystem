import { describe, expect, it } from 'vitest';

import { type GitRunner, resolveCoordinationHome } from './coordination-home.js';

const PRIMARY = '/Users/dev/oak';
const LINKED = '/Users/dev/oak-worktrees/feature';

// `git worktree list --porcelain` lists the main worktree FIRST, then each
// linked worktree, regardless of which worktree the command runs from.
function porcelain(...roots: readonly string[]): string {
  return roots
    .map((root, i) => `worktree ${root}\nHEAD ${'0'.repeat(40)}\nbranch refs/heads/wt-${i}\n`)
    .join('\n');
}

const gitReturning =
  (output: string): GitRunner =>
  () =>
    output;

describe('resolveCoordinationHome', () => {
  it('returns the primary checkout for a single-worktree repo', () => {
    expect(resolveCoordinationHome(PRIMARY, { runGit: gitReturning(porcelain(PRIMARY)) })).toBe(
      PRIMARY,
    );
  });

  it('resolves the PRIMARY checkout from inside a linked worktree (the shared home)', () => {
    // The F-41-dissolving behaviour: an agent in a linked worktree must resolve
    // the same shared home as every other worktree — the primary, never its own
    // local copy. git lists the primary first whatever cwd we pass.
    expect(
      resolveCoordinationHome(LINKED, { runGit: gitReturning(porcelain(PRIMARY, LINKED)) }),
    ).toBe(PRIMARY);
  });

  it('throws loudly when cwd is not inside a git working tree (F-41 stale/worktree cwd)', () => {
    const gitFails: GitRunner = () => {
      throw new Error('fatal: not a git repository');
    };
    expect(() => resolveCoordinationHome('/tmp/elsewhere', { runGit: gitFails })).toThrow(
      /Unable to resolve the collaboration home/u,
    );
    expect(() => resolveCoordinationHome('/tmp/elsewhere', { runGit: gitFails })).toThrow(
      /\/tmp\/elsewhere/u,
    );
  });

  it('throws when git reports no worktree at all', () => {
    expect(() => resolveCoordinationHome(PRIMARY, { runGit: gitReturning('') })).toThrow(
      /returned no worktree/u,
    );
  });
});
