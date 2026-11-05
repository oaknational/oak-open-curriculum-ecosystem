import { execFileSync } from 'node:child_process';

import { err, ok, type Result } from '@oaknational/result';

/**
 * The real pnpm runner: runs `pnpm` with `args` from `cwd` inheriting stdio so the
 * user sees install/build progress, and translates a non-zero exit into an `err`
 * Result at this single library boundary (ADR-088) rather than letting
 * `execFileSync`'s throw escape.
 *
 * @remarks
 * Structurally a `PnpmRunner` (see `build.ts`); the composition-root default
 * injected by {@link buildWorktree}. Unit tests inject a fake runner instead, so
 * this real runner is exercised only at the integration/CLI edge.
 */
export const realPnpmRunner = (args: readonly string[], cwd: string): Result<void, Error> => {
  try {
    execFileSync('pnpm', [...args], { cwd, stdio: 'inherit' });
    return ok(undefined);
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
};
