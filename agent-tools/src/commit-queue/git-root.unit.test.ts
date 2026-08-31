import { describe, expect, it } from 'vitest';

import { type GitRunner } from '../collaboration-state/coordination-home.js';
import { TrustedGitResolutionError } from '../core/trusted-git.js';

import { resolveInvokingGitRoot } from './git-root.js';

describe('resolveInvokingGitRoot', () => {
  it('returns the trimmed toplevel of the invoking worktree', () => {
    const runGit: GitRunner = () => '/workspace/oak-worktrees/feature\n';

    expect(resolveInvokingGitRoot('/workspace/oak-worktrees/feature/sub', runGit)).toBe(
      '/workspace/oak-worktrees/feature',
    );
  });

  it('translates a git-execution failure into the F-138 fail-loud guard', () => {
    const gitFails: GitRunner = () => {
      throw new Error('fatal: not a git repository');
    };

    expect(() => resolveInvokingGitRoot('/tmp/elsewhere', gitFails)).toThrow(
      /not inside a git working tree/u,
    );
  });

  it('lets a trusted-git RESOLUTION refusal pass through as its own diagnosis', () => {
    // git never ran — rebranding the refusal as not-inside-a-working-tree
    // would be the misleading-error class this repository has hit three times.
    const resolverRefuses: GitRunner = () => {
      throw new TrustedGitResolutionError('No trusted git binary found. Searched: …');
    };

    expect(() => resolveInvokingGitRoot('/workspace/oak', resolverRefuses)).toThrow(
      /No trusted git binary found/u,
    );
    expect(() => resolveInvokingGitRoot('/workspace/oak', resolverRefuses)).not.toThrow(
      /not inside a git working tree/u,
    );
  });

  it('throws on an empty toplevel report rather than returning an unusable root', () => {
    const runGit: GitRunner = () => '  \n';

    expect(() => resolveInvokingGitRoot('/workspace/oak', runGit)).toThrow(/returned\s+nothing/u);
  });
});
