import { resolveRootFromDir } from '../core/repo-root.js';

/**
 * Sentinel marking the repository's collaboration-state home: the directory
 * tree that holds claims, comms, and the commit queue. The coordination home
 * is the directory that CONTAINS this path.
 */
export const COLLABORATION_HOME_SENTINEL = '.agent/state/collaboration';

/** Injectable seams for {@link resolveCoordinationHome}. */
export interface ResolveCoordinationHomeOptions {
  /** Filesystem-existence probe. Defaults to `node:fs` `existsSync`. */
  readonly exists?: (path: string) => boolean;
}

/**
 * Resolve the repository-root-anchored coordination home — the directory that
 * contains `.agent/state/collaboration` — by walking up from `cwd`.
 *
 * This is the single coordination-home resolver for the collaboration-state
 * CLI. It composes the shared {@link resolveRootFromDir} walk primitive with
 * the collaboration sentinel, inheriting that primitive's loud-refusal
 * contract: when no ancestor of `cwd` contains the sentinel it THROWS rather
 * than falling back to `cwd`. The fallback was the F-41 corruption vector — a
 * stale or worktree cwd would otherwise create a fresh, wrong registry and a
 * collaboration write would land there behind a green success token.
 *
 * ADR-197 (coordination-home owns registry state) names this exact hazard as a
 * standing cost: "an unparameterised call silently writes to the wrong
 * checkout's copy." The ADR-mandated targeting — an explicit `--repo-root` (or
 * absolute `--comms-dir`/`--active`) resolved at session open — short-circuits
 * this resolver in the callers; this resolver hardens the *unparameterised*
 * fallback from a silent wrong-write into a loud refusal.
 *
 * @param cwd - the directory to begin the upward walk from (typically
 *   `process.cwd()` at the composition edge, or a runtime-injected value).
 * @param options - the existence-probe seam.
 * @throws when no ancestor of `cwd` contains the collaboration sentinel.
 */
export function resolveCoordinationHome(
  cwd: string,
  options: ResolveCoordinationHomeOptions = {},
): string {
  return resolveRootFromDir(cwd, {
    sentinel: COLLABORATION_HOME_SENTINEL,
    description: 'the collaboration home',
    ...(options.exists === undefined ? {} : { exists: options.exists }),
  });
}
