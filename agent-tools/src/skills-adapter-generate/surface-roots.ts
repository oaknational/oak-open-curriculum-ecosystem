/**
 * The projection surface roots and the one guard that establishes they
 * are real in-repo directories before any consumer reads or writes
 * through them.
 *
 * `readdir`, `rm`, `mkdir`, and `writeFile` all follow a symlink at the
 * surface root or any ancestor, so a link there reroutes the whole
 * operation into a foreign tree — the destructive shape the 2026-08-11
 * security round cured for the reconciliation sweep. That cure lived
 * beside the sweep only, while the surface-root list was written twice;
 * the `--clear` path (which never applied it) then deleted through a
 * symlinked root outside the repository (security round 2, 2026-08-12).
 * The constant and the guard live here so every consumer — sweep, clear,
 * check, census — shares one root-reality contract by construction, not
 * by remembering to re-apply it.
 */
import { join } from 'node:path';

import type { FsRead } from './carriage-fs.js';

export const PROJECTION_SURFACE_ROOTS = ['.claude/skills', '.agents/skills'] as const;

/**
 * The surface root AND every ancestor under the repo root must resolve
 * to their own lexical location: one realpath comparison catches a
 * symlinked root and a symlinked ancestor alike (a symlinked `.claude`
 * defeats a root-only check). An absent root resolves to itself under
 * the nearest-existing-ancestor semantics of `resolveRealPath`, so a
 * not-yet-created surface passes (nothing to act on). Returns the
 * failure message, or `undefined` when the root is safe to act through.
 */
export async function surfaceRootGuardFailure(input: {
  readonly root: string;
  readonly surface: string;
  readonly repoReal: FsRead<string>;
  readonly resolveRealPath: (path: string) => Promise<FsRead<string>>;
}): Promise<string | undefined> {
  if (input.repoReal.kind === 'failure') {
    return input.repoReal.message;
  }
  const rootReal = await input.resolveRealPath(input.root);
  if (rootReal.kind === 'failure') {
    return rootReal.message;
  }
  if (rootReal.value !== join(input.repoReal.value, input.surface)) {
    return (
      `projection surface root resolves outside its lexical home (symlinked root or ` +
      `ancestor): ${input.root} -> ${rootReal.value} — refusing to act through it`
    );
  }
  return undefined;
}

/**
 * Both projection surface roots' guard failures (empty when both are
 * real in-repo directories) — the whole-run precondition for any
 * consumer that reads or writes across all surfaces at once (the checker
 * and generator short-circuit on it).
 */
export async function allSurfaceRootFailures(
  repoRoot: string,
  resolveRealPath: (path: string) => Promise<FsRead<string>>,
): Promise<string[]> {
  const repoReal = await resolveRealPath(repoRoot);
  const failures: string[] = [];
  for (const surface of PROJECTION_SURFACE_ROOTS) {
    const failure = await surfaceRootGuardFailure({
      root: join(repoRoot, surface),
      surface,
      repoReal,
      resolveRealPath,
    });
    if (failure !== undefined) {
      failures.push(failure);
    }
  }
  return failures;
}
