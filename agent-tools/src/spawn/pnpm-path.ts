import { existsSync } from 'node:fs';
import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

/** Existence probe seam (defaults to `node:fs` `existsSync`; injected in tests). */
export type PathExists = (candidate: string) => boolean;

/**
 * Ordered candidate absolute paths for the pnpm binary, derived from the
 * environment: `$PNPM_HOME`, the per-user standalone install locations (macOS and
 * Linux), then the common system directories. Bare `pnpm` is never a candidate —
 * resolution must never fall back to a PATH lookup.
 */
function pnpmCandidates(env: NodeJS.ProcessEnv): readonly string[] {
  const candidates: string[] = [];
  const pnpmHome = env.PNPM_HOME?.trim();
  if (pnpmHome !== undefined && pnpmHome.length > 0) {
    candidates.push(`${pnpmHome}/pnpm`);
  }
  const home = env.HOME?.trim();
  if (home !== undefined && home.length > 0) {
    candidates.push(`${home}/Library/pnpm/pnpm`, `${home}/.local/share/pnpm/pnpm`);
  }
  candidates.push('/opt/homebrew/bin/pnpm', '/usr/local/bin/pnpm', '/usr/bin/pnpm');
  // Enforce the absolute-only invariant: a relative PNPM_HOME (or HOME) would pass an
  // existsSync probe against the process cwd yet resolve against the worktree cwd under
  // execFileSync — running the wrong binary or none. Only absolute candidates are trusted.
  return candidates.filter((candidate) => isAbsolute(candidate));
}

/**
 * Resolve the pnpm binary to an absolute path, never consulting `PATH` — so a
 * writable PATH entry cannot shadow it (the S4036 hardening, matching the lane's
 * `resolveTrustedGit` / `resolveGhPath` siblings).
 *
 * Probes `$PNPM_HOME`, the per-user standalone install locations, and the common
 * system directories in order. Returns `err` (never a throw) naming the searched
 * paths and the remedy when pnpm is found in none. `env` is an explicit input,
 * not read from a global, so the resolver is unit-testable without touching
 * `process.env`.
 */
export function resolvePnpm(
  env: NodeJS.ProcessEnv,
  exists: PathExists = existsSync,
): Result<string, Error> {
  const candidates = pnpmCandidates(env);
  const found = candidates.find((candidate) => exists(candidate));
  if (found === undefined) {
    return err(
      new Error(
        `spawn: pnpm not found in any trusted location (${candidates.join(', ')}). ` +
          `Set PNPM_HOME to pnpm's install directory.`,
      ),
    );
  }
  return ok(found);
}
