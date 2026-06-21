import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Default repo-root sentinel: the pnpm workspace manifest at the monorepo root. */
export const DEFAULT_REPO_ROOT_SENTINEL = 'pnpm-workspace.yaml';

/** Injectable seams for {@link resolveRepoRoot} (testing + composition). */
export interface ResolveRepoRootOptions {
  /** A path that exists only at the repository root. */
  readonly sentinel?: string;
  /**
   * The harness-provided project directory. Defaults to
   * `process.env.CLAUDE_PROJECT_DIR` at call time; pass an explicit value
   * (including `undefined`) to keep tests off global state.
   */
  readonly projectDir?: string;
  /** Filesystem-existence probe. Defaults to `node:fs` `existsSync`. */
  readonly exists?: (path: string) => boolean;
}

/** Injectable seams for {@link resolveRootFromDir}. */
export interface ResolveRootFromDirOptions {
  /** A path that exists only at the root being resolved. */
  readonly sentinel?: string;
  /** Filesystem-existence probe. Defaults to `node:fs` `existsSync`. */
  readonly exists?: (path: string) => boolean;
  /**
   * Noun phrase completing the not-found error `Unable to resolve ___:` — e.g.
   * `"the collaboration home"`. Must read naturally in that slot. Lets a domain
   * caller surface an actionable message without re-implementing the walk.
   * Defaults to `"repository root"`.
   */
  readonly description?: string;
}

/**
 * Ascend from `startDir` until a directory containing `sentinel` is found,
 * throwing when no ancestor contains it. This is the shared walk primitive:
 * it never falls back to `startDir` on failure, so a caller can never silently
 * resolve to the wrong directory (the F-41 corruption vector). Callers that
 * need a domain-specific home (e.g. the collaboration-state home) compose this
 * with their own sentinel rather than re-implementing the loop.
 *
 * @param startDir - the directory to begin the upward walk from.
 * @param options - sentinel, existence-probe, and error-description seams.
 * @throws when no ancestor directory contains the sentinel.
 */
export function resolveRootFromDir(
  startDir: string,
  options: ResolveRootFromDirOptions = {},
): string {
  const sentinel = options.sentinel ?? DEFAULT_REPO_ROOT_SENTINEL;
  const exists = options.exists ?? existsSync;
  const description = options.description ?? 'repository root';
  let dir = startDir;
  for (;;) {
    if (exists(resolve(dir, sentinel))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        `Unable to resolve ${description}: sentinel '${sentinel}' not found in any ancestor of '${startDir}'.`,
      );
    }
    dir = parent;
  }
}

/**
 * Resolve the repository root independently of whether the calling module runs
 * from TypeScript source (`tsx`, e.g. `src/hook-policy/`) or compiled output
 * (`node` on `dist/src/hook-policy/`).
 *
 * Resolution order:
 *   1. `CLAUDE_PROJECT_DIR` — the contract the Claude Code harness guarantees
 *      for hook invocations — when it points at a directory containing the
 *      sentinel.
 *   2. Walk up from the calling module's own directory until a directory
 *      containing the sentinel is found.
 *
 * The walk-up is robust to differing module depths: a `../../..` hard-coded
 * offset is correct from `src/hook-policy/` but wrong from
 * `dist/src/hook-policy/`; ascending to a sentinel is correct from both. This
 * is the bug that made node-direct hook invocation fail to locate
 * `.agent/hooks/policy.json` before this helper existed.
 *
 * @param fromUrl - the caller's `import.meta.url`.
 * @param options - sentinel, project-directory, and existence-probe seams.
 * @throws when no ancestor directory contains the sentinel.
 */
export function resolveRepoRoot(fromUrl: string, options: ResolveRepoRootOptions = {}): string {
  const sentinel = options.sentinel ?? DEFAULT_REPO_ROOT_SENTINEL;
  const exists = options.exists ?? existsSync;
  const projectDir = 'projectDir' in options ? options.projectDir : process.env.CLAUDE_PROJECT_DIR;

  if (projectDir !== undefined && projectDir.length > 0 && exists(resolve(projectDir, sentinel))) {
    return projectDir;
  }

  return resolveRootFromDir(dirname(fileURLToPath(fromUrl)), { sentinel, exists });
}
