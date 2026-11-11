import { describe, expect, it } from 'vitest';

import { type GitRunner } from '../collaboration-state/coordination-home.js';

import { resolveInvokingGitRoot } from './git-root.js';

/** A git runner whose toplevel query reports the feature worktree, trailing newline included. */
const gitWithFeatureToplevel: GitRunner = () => '/workspace/oak-worktrees/feature\n';

/** A git runner that fails as git does when run outside a working tree. */
const gitFails: GitRunner = () => {
  throw new Error('fatal: not a git repository');
};

/** A git runner whose toplevel query reports only whitespace. */
const gitWithBlankToplevel: GitRunner = () => '  \n';

describe('resolveInvokingGitRoot', () => {
  it('returns the trimmed toplevel of the invoking worktree', () => {
    expect(
      resolveInvokingGitRoot('/workspace/oak-worktrees/feature/sub', gitWithFeatureToplevel),
    ).toBe('/workspace/oak-worktrees/feature');
  });

  it("translates a git-execution failure into the F-138 fail-loud guard, carrying git's reason", () => {
    expect(() => resolveInvokingGitRoot('/tmp/elsewhere', gitFails)).toThrow(
      /git could not resolve a working tree from '\/tmp\/elsewhere' \(fatal: not a git repository\)/u,
    );
  });

  it('throws on an empty toplevel report rather than returning an unusable root', () => {
    expect(() => resolveInvokingGitRoot('/workspace/oak', gitWithBlankToplevel)).toThrow(
      /returned\s+nothing/u,
    );
  });
});
