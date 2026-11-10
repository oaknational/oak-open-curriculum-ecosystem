import { describe, expect, it } from 'vitest';

import { resolveInvokingGitRoot } from '../src/commit-queue/git-root';

/** A runner that fails as the real one does on a non-zero exit: by throwing `failure`. */
function gitFailingWith(failure: Error): () => string {
  return () => {
    throw failure;
  };
}

/**
 * Unit-scale description of the F-138 invoking-git-root resolver through its
 * injected git-runner seam. The two states that matter: a resolvable cwd
 * yields the worktree top level verbatim (trimmed), and an unresolvable cwd
 * is a LOUD refusal that names the cwd and the no-fallback contract — never
 * a silent fall-through to the coordination home.
 */
describe('resolveInvokingGitRoot', () => {
  it('returns the trimmed worktree top level reported by git', () => {
    const calls: { args: readonly string[]; cwd: string }[] = [];
    const root = resolveInvokingGitRoot('/repo-worktrees/lane/sub/dir', (args, cwd) => {
      calls.push({ args, cwd });
      return '/repo-worktrees/lane\n';
    });

    expect(root).toBe('/repo-worktrees/lane');
    expect(calls).toStrictEqual([
      { args: ['rev-parse', '--show-toplevel'], cwd: '/repo-worktrees/lane/sub/dir' },
    ]);
  });

  it('refuses loudly, naming the cwd and the no-fallback contract, when git cannot resolve a worktree', () => {
    const gitFailure = new Error('fatal: not a git repository');
    const failingGit = gitFailingWith(gitFailure);

    expect(() => resolveInvokingGitRoot('/not-a-repo', failingGit)).toThrow(
      /git could not resolve a working tree from '\/not-a-repo' \(fatal: not a git repository\).*no fallback to the coordination home/s,
    );
    // git's own words are captured, not printed, so the cause is where they survive.
    expect(() => resolveInvokingGitRoot('/not-a-repo', failingGit)).toThrow(
      expect.objectContaining({ cause: gitFailure }),
    );
  });

  it("carries git's own reason, which is not always a missing repository", () => {
    // git's stderr is captured, so the tool's message is the only place it
    // can reach the operator: a dubious-ownership refusal names its own cure.
    const dubious = Object.assign(new Error('Command failed: git rev-parse --show-toplevel'), {
      stderr: "fatal: detected dubious ownership in repository at '/repo'\n",
    });

    expect(() => resolveInvokingGitRoot('/repo', gitFailingWith(dubious))).toThrow(
      /\(fatal: detected dubious ownership in repository at '\/repo'\)/,
    );
  });

  it('refuses loudly when git reports an empty top level rather than treating it as a root', () => {
    expect(() => resolveInvokingGitRoot('/somewhere', () => '\n')).toThrow(
      /returned.*nothing for '\/somewhere'.*no fallback to the coordination home/s,
    );
  });
});
