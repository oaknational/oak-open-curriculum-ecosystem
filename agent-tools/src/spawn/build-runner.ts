import { sync as crossSpawnSync } from 'cross-spawn';

import { err, ok, type Result } from '@oaknational/result';

/**
 * The real pnpm runner: runs `pnpm` with `args` from `cwd` inheriting stdio so the
 * user sees install/build progress, and translates a failed launch or a non-zero
 * exit into an `err` Result at this single library boundary (ADR-088).
 *
 * @remarks
 * pnpm runs by name through `cross-spawn`, which launches a Windows `pnpm.cmd`
 * shim that a shell-less Node spawn cannot. Structurally a `PnpmRunner` (see
 * `build.ts`); the composition-root default injected by {@link buildWorktree}.
 * Unit tests inject a fake runner instead; the `pnpm-by-name-launch` smoke
 * exercises this one.
 */
export const realPnpmRunner = (args: readonly string[], cwd: string): Result<void, Error> => {
  const result = crossSpawnSync('pnpm', [...args], { cwd, stdio: 'inherit' });
  // cross-spawn reports a clean launch with `error: null`, where Node's type
  // says `undefined`, so the check is on the value, not its absence.
  if (result.error instanceof Error) {
    return err(result.error);
  }
  if (result.status !== 0) {
    const ending =
      result.status === null ? `on signal ${String(result.signal)}` : `with ${result.status}`;
    return err(new Error(`pnpm ${args.join(' ')} exited ${ending}`));
  }
  return ok(undefined);
};
