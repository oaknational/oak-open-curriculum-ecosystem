import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TrustedGitResolutionError } from '../core/trusted-git.js';

import { type GitRunner, resolveCoordinationHome } from './coordination-home.js';

const PRIMARY = '/workspace/oak';
const LINKED = '/workspace/oak-worktrees/feature';

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

  it('lets a trusted-git RESOLUTION refusal pass through as its own diagnosis', () => {
    // git never ran, so "not inside a git working tree" would be a false
    // statement about a true repository (the 2026-08-11 Windows instance of
    // the misleading-error class): the resolver's typed refusal — and its
    // actionable remedy — must reach the reader unrebranded.
    const resolverRefuses: GitRunner = () => {
      throw new TrustedGitResolutionError('No trusted git binary found. Searched: …');
    };
    expect(() => resolveCoordinationHome(PRIMARY, { runGit: resolverRefuses })).toThrow(
      /No trusted git binary found/u,
    );
    expect(() => resolveCoordinationHome(PRIMARY, { runGit: resolverRefuses })).not.toThrow(
      /not inside a git working tree/u,
    );
  });
});

describe('resolveCoordinationHome — PRACTICE_COORDINATION_HOME override (inter-Practice WS1)', () => {
  const DECLARED = '/workspace/other-practice';
  // Derived with the same platform join the resolver uses, so the fake
  // recognises the probed path on every host (a hard-coded POSIX join fails
  // the probe on Windows, where join produces backslashes).
  const DECLARED_SUBSTRATE = join(DECLARED, '.agent/state/collaboration');

  // Pure existence fake: only the listed directories exist.
  const dirsPresent =
    (...dirs: readonly string[]) =>
    (path: string): boolean =>
      dirs.includes(path);

  // Proves precedence: when the declared home resolves, git is never consulted.
  const gitMustNotRun: GitRunner = () => {
    throw new Error('git must not be consulted when the declared home resolves');
  };

  it('returns the declared home without consulting git (env wins over git-native)', () => {
    expect(
      resolveCoordinationHome(PRIMARY, {
        coordinationHomeEnv: DECLARED,
        directoryExists: dirsPresent(DECLARED, DECLARED_SUBSTRATE),
        runGit: gitMustNotRun,
      }),
    ).toBe(DECLARED);
  });

  it('throws loudly when the declared home does not exist, naming the variable and the path', () => {
    const resolve = () =>
      resolveCoordinationHome(PRIMARY, {
        coordinationHomeEnv: DECLARED,
        directoryExists: dirsPresent(),
        runGit: gitMustNotRun,
      });
    expect(resolve).toThrow(/PRACTICE_COORDINATION_HOME/u);
    expect(resolve).toThrow(/\/workspace\/other-practice/u);
  });

  it('throws loudly when the declared home holds no recognisable collaboration substrate', () => {
    const resolve = () =>
      resolveCoordinationHome(PRIMARY, {
        coordinationHomeEnv: DECLARED,
        directoryExists: dirsPresent(DECLARED),
        runGit: gitMustNotRun,
      });
    expect(resolve).toThrow(/PRACTICE_COORDINATION_HOME/u);
    expect(resolve).toThrow(/\.agent\/state\/collaboration/u);
  });

  it('treats an empty declared value as a declared (malformed) home — loud failure, never a silent fallback', () => {
    expect(() =>
      resolveCoordinationHome(PRIMARY, {
        coordinationHomeEnv: '',
        directoryExists: dirsPresent(),
        runGit: gitMustNotRun,
      }),
    ).toThrow(/PRACTICE_COORDINATION_HOME/u);
  });

  it('rejects a relative declared home loudly — it would resolve against the node process cwd, not the session', () => {
    const resolve = () =>
      resolveCoordinationHome(PRIMARY, {
        coordinationHomeEnv: 'relative/practice-checkout',
        // The relative path "exists" per the fake: existence must not rescue it.
        directoryExists: dirsPresent(
          'relative/practice-checkout',
          'relative/practice-checkout/.agent/state/collaboration',
        ),
        runGit: gitMustNotRun,
      });
    expect(resolve).toThrow(/PRACTICE_COORDINATION_HOME/u);
    expect(resolve).toThrow(/absolute/u);
  });

  it('preserves git-native resolution when the variable is explicitly undefined', () => {
    expect(
      resolveCoordinationHome(LINKED, {
        coordinationHomeEnv: undefined,
        runGit: gitReturning(porcelain(PRIMARY, LINKED)),
      }),
    ).toBe(PRIMARY);
  });
});
