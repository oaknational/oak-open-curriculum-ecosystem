import { execFileSync } from 'node:child_process';

import { resolveTrustedGit } from '../core/trusted-git.js';

/** Runs a git subcommand from `cwd` and returns stdout; throws on non-zero exit. */
export type GitRunner = (args: readonly string[], cwd: string) => string;

/** Injectable seams for {@link resolveCoordinationHome}. */
export interface ResolveCoordinationHomeOptions {
  /**
   * Git runner seam. Defaults to invoking the real `git` binary. Injected in
   * tests so the resolution is exercised without a real repository.
   */
  readonly runGit?: GitRunner;
}

const defaultRunGit: GitRunner = (args, cwd) =>
  // Execute git by its ABSOLUTE path (resolveTrustedGit) so a writable PATH
  // entry cannot shadow it (the S4036 FIX). Once the binary is addressed
  // absolutely no `env.PATH` override is needed — the absolute path is the
  // hardening, and it is the pattern the analyser actually accepts.
  execFileSync(resolveTrustedGit(), [...args], {
    cwd,
    encoding: 'utf8',
  });

/**
 * Resolve the coordination home: the **primary (main) checkout** for whatever
 * repository `cwd` sits in.
 *
 * The problem this solves is not "find a repo root" — it is "from any worktree
 * on this machine, resolve the ONE shared location every other worktree also
 * resolves to, so comms / claims / the commit queue land in a single place and
 * the agents can see each other." Each linked worktree has its own working-tree
 * copy of `.agent/state/collaboration/`; resolving locally makes worktree seats
 * invisible to one another (friction F-41). The answer is git-native: every
 * worktree shares one repository, and `git worktree list --porcelain` lists the
 * main worktree first, so its path is the shared home regardless of which
 * worktree `cwd` is in. A standalone clone is the degenerate case (it is its own
 * primary). This is the cure named in the F-41 register entry ("resolve the
 * coordination home across worktrees, e.g. via the git common dir") and aligns
 * with ADR-197 (one checkout owns shared registry state); callers keep the
 * explicit `--repo-root` override as the escape hatch.
 *
 * Resolution is per machine: across machines the collaboration filesystem is not
 * shared at all, so cross-machine coordination is a separate concern. No
 * machine-local path is baked in — the home is discovered via git at call time.
 *
 * @param cwd - the directory git resolution runs from (typically `process.cwd()`
 *   at the composition edge, or a runtime-injected value).
 * @param options - the git-runner seam.
 * @throws when `cwd` is not inside a git working tree, or git reports no
 *   worktree — refusing loudly rather than silently writing to a wrong location.
 */
export function resolveCoordinationHome(
  cwd: string,
  options: ResolveCoordinationHomeOptions = {},
): string {
  const runGit = options.runGit ?? defaultRunGit;

  let porcelain: string;
  try {
    porcelain = runGit(['worktree', 'list', '--porcelain'], cwd);
  } catch (cause) {
    throw new Error(
      `Unable to resolve the collaboration home: '${cwd}' is not inside a git working tree. ` +
        `Run from inside the repository, or pass an explicit --repo-root <path>.`,
      { cause },
    );
  }

  const primary = firstWorktreePath(porcelain);
  if (primary === undefined) {
    throw new Error(
      `Unable to resolve the collaboration home: 'git worktree list' returned no worktree for '${cwd}'.`,
    );
  }
  return primary;
}

const WORKTREE_LINE_PREFIX = 'worktree ';

/** The first `worktree <path>` line of `git worktree list --porcelain` is the main worktree. */
function firstWorktreePath(porcelain: string): string | undefined {
  for (const line of porcelain.split('\n')) {
    if (line.startsWith(WORKTREE_LINE_PREFIX)) {
      return line.slice(WORKTREE_LINE_PREFIX.length).trimEnd();
    }
  }
  return undefined;
}
