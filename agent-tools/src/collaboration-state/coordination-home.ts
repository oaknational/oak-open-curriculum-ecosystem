import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

import { resolveTrustedGit, TrustedGitResolutionError } from '../core/trusted-git.js';

/** Runs a git subcommand from `cwd` and returns stdout; throws on non-zero exit. */
export type GitRunner = (args: readonly string[], cwd: string) => string;

/** Injectable seams for {@link resolveCoordinationHome}. */
export interface ResolveCoordinationHomeOptions {
  /**
   * Git runner seam. Defaults to invoking the real `git` binary. Injected in
   * tests so the resolution is exercised without a real repository.
   */
  readonly runGit?: GitRunner;
  /**
   * The declared coordination home: the value of `PRACTICE_COORDINATION_HOME`,
   * injected at the composition edge (ADR-078 — neither this module nor its
   * tests read `process.env`). When present it wins over git-native resolution
   * and is validated loudly (existence + a recognisable collaboration
   * substrate); `undefined` preserves git-native behaviour byte-for-byte. An
   * empty string is a malformed declaration, not absence — it fails loudly.
   * The inter-Practice protocol's resolution order is
   * explicit flag, then declared home, then git-native — the explicit-flag
   * leg lives at call sites (`repoRoot ?? resolveCoordinationHome(...)`),
   * which never consult this resolver when an explicit value is given.
   */
  readonly coordinationHomeEnv?: string;
  /**
   * Directory-existence seam for validating a declared home. Defaults to a
   * real filesystem probe. Injected in tests so validation is exercised
   * without touching the filesystem.
   */
  readonly directoryExists?: (path: string) => boolean;
}

/** The directory a coordination home must contain to be recognisable as one. */
export const COLLABORATION_SUBSTRATE_REL = '.agent/state/collaboration';

/**
 * The resolver's own directory probe, exported so consumers that certify the
 * resolver (the protocol-conformance detector) probe with EXACTLY the same
 * semantics — a file at the substrate path is not a directory.
 */
export const defaultDirectoryExists = (path: string): boolean => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};

export const defaultRunGit: GitRunner = (args, cwd) =>
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
 * A **declared** home (`PRACTICE_COORDINATION_HOME`, injected via
 * `options.coordinationHomeEnv`) wins over git-native resolution — the
 * inter-Practice arrangement where the session's worktree lives in one repo
 * while its coordination home lives in another. A declared home that does not
 * exist or holds no recognisable collaboration substrate is a loud failure,
 * never a silent fallback to git-native resolution.
 *
 * @param cwd - the directory git resolution runs from (typically `process.cwd()`
 *   at the composition edge, or a runtime-injected value).
 * @param options - the git-runner, declared-home, and filesystem seams.
 * @throws when a declared home is missing or substrate-less; when `cwd` is not
 *   inside a git working tree; or when git reports no worktree — refusing
 *   loudly rather than silently writing to a wrong location.
 */
export function resolveCoordinationHome(
  cwd: string,
  options: ResolveCoordinationHomeOptions = {},
): string {
  const declaredHome = options.coordinationHomeEnv;
  if (declaredHome !== undefined) {
    return validateDeclaredHome(declaredHome, options.directoryExists ?? defaultDirectoryExists);
  }

  const runGit = options.runGit ?? defaultRunGit;

  let porcelain: string;
  try {
    porcelain = runGit(['worktree', 'list', '--porcelain'], cwd);
  } catch (cause) {
    // A resolver refusal is its own diagnosis — git never ran, so "not inside
    // a git working tree" would be a false statement about a true repository
    // (observed 2026-08-11 on Windows: the POSIX-only allowlist refused and
    // this wrapper rebranded it, exactly the pnpm-path misleading-error
    // precedent).
    if (cause instanceof TrustedGitResolutionError) {
      throw cause;
    }
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

/**
 * Validate a declared coordination home: it must exist as a directory and
 * contain the collaboration substrate. Returns the home on success; throws a
 * message naming the variable, the path, and the fix on failure — the
 * protocol's no-silent-fallback clause.
 */
function validateDeclaredHome(
  declaredHome: string,
  directoryExists: (path: string) => boolean,
): string {
  if (!isAbsolute(declaredHome)) {
    throw new Error(
      `PRACTICE_COORDINATION_HOME must be an absolute path, got '${declaredHome}'. A relative ` +
        `declared home resolves against the invoking process's working directory — a different ` +
        `location per invocation — so it cannot name the one shared coordination home. Fix or ` +
        `unset the variable — there is no silent fallback to git-native resolution.`,
    );
  }
  if (!directoryExists(declaredHome)) {
    throw new Error(
      `PRACTICE_COORDINATION_HOME points at '${declaredHome}', which does not exist or is not a directory. ` +
        `A declared coordination home must be the root of a checkout; fix or unset the variable — ` +
        `there is no silent fallback to git-native resolution.`,
    );
  }
  const substrate = join(declaredHome, COLLABORATION_SUBSTRATE_REL);
  if (!directoryExists(substrate)) {
    throw new Error(
      `PRACTICE_COORDINATION_HOME points at '${declaredHome}', but it holds no recognisable ` +
        `collaboration substrate ('${COLLABORATION_SUBSTRATE_REL}' is missing). Fix or unset the ` +
        `variable — there is no silent fallback to git-native resolution.`,
    );
  }
  return declaredHome;
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
