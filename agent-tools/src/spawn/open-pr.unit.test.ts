import { err, isErr, isOk, ok, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type CommandRunner } from '../core/command-runner.js';

import { openDraftPr } from './open-pr.js';

const WORKTREE = '/workspace/oak-spawn-flow';
const BRANCH = 'feat/spawn-flow';
const SLUG = 'spawn-flow';
const PR_URL = 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/999';

interface Call {
  readonly args: readonly string[];
  readonly cwd: string;
}

/** Recording git + gh seams that succeed; gh returns the PR URL on stdout (with a trailing newline). */
function recording(): {
  readonly gitCalls: Call[];
  readonly ghCalls: Call[];
  readonly runGit: CommandRunner<string>;
  readonly runGh: CommandRunner<string>;
} {
  const gitCalls: Call[] = [];
  const ghCalls: Call[] = [];
  const runGit: CommandRunner<string> = (args, cwd) => {
    gitCalls.push({ args, cwd });
    return ok('');
  };
  const runGh: CommandRunner<string> = (args, cwd) => {
    ghCalls.push({ args, cwd });
    return ok(`${PR_URL}\n`);
  };
  return { gitCalls, ghCalls, runGit, runGh };
}

describe('openDraftPr', () => {
  it('opens a draft PR on a no-commit branch: empty marker commit, then push, then gh pr create --draft', () => {
    const { gitCalls, ghCalls, runGit, runGh } = recording();

    const result = openDraftPr({
      worktreePath: WORKTREE,
      branch: BRANCH,
      base: 'origin/main',
      slug: SLUG,
      runGit,
      runGh,
    });

    // OUTCOME: the draft PR exists (its URL is returned, trimmed).
    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe(PR_URL);

    // The empty marker commit is the cure for "no commits between base and head" —
    // it gives the freshly-spawned branch a head so a draft PR can open.
    expect(gitCalls[0]).toEqual({
      args: ['commit', '--allow-empty', '-m', 'chore: open spawn-flow lane (spawn-flow)'],
      cwd: WORKTREE,
    });
    // Then the branch is pushed (gh pr create needs a head on origin).
    expect(gitCalls[1]).toEqual({ args: ['push', '-u', 'origin', BRANCH], cwd: WORKTREE });
    // Then the draft PR opens against the base BRANCH (remote prefix stripped), from the lane branch.
    const gh = ghCalls[0];
    expect(gh.cwd).toBe(WORKTREE);
    expect(gh.args.slice(0, 3)).toEqual(['pr', 'create', '--draft']);
    expect(gh.args).toContain('--base');
    expect(gh.args[gh.args.indexOf('--base') + 1]).toBe('main');
    expect(gh.args).toContain('--head');
    expect(gh.args[gh.args.indexOf('--head') + 1]).toBe(BRANCH);
    // No --admin: the code-owner gate is respected.
    expect(gh.args).not.toContain('--admin');
  });

  it('returns err naming the step and branch when gh pr create fails (loud-fail, no swallow)', () => {
    const { gitCalls } = recording();
    const runGit: CommandRunner<string> = (args, cwd) => {
      gitCalls.push({ args, cwd });
      return ok('');
    };
    const runGh: CommandRunner<string> = () => err(new Error('gh: pull request failed to create'));

    const result = openDraftPr({
      worktreePath: WORKTREE,
      branch: BRANCH,
      base: 'origin/main',
      slug: SLUG,
      runGit,
      runGh,
    });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/draft PR/u);
      expect(result.error.message).toContain(BRANCH);
      expect(result.error.cause).toBeInstanceOf(Error);
    }
  });

  it('fails fast if the empty marker commit fails — no push, no PR attempted', () => {
    const gitCalls: Call[] = [];
    const ghCalls: Call[] = [];
    const runGit: CommandRunner<string> = (args, cwd) => {
      gitCalls.push({ args, cwd });
      return args[0] === 'commit' ? err(new Error('git commit failed')) : ok('');
    };
    const runGh: CommandRunner<string> = (args, cwd) => {
      ghCalls.push({ args, cwd });
      return ok(PR_URL);
    };

    const result = openDraftPr({
      worktreePath: WORKTREE,
      branch: BRANCH,
      base: 'origin/main',
      slug: SLUG,
      runGit,
      runGh,
    });

    expect(isErr(result)).toBe(true);
    // Only the failed commit ran — the push was skipped, and no PR was attempted.
    expect(gitCalls).toHaveLength(1);
    expect(ghCalls).toEqual([]);
  });
});
