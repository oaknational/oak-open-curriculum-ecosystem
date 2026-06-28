import { execFileSync } from 'node:child_process';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { resolvePnpm } from './pnpm-path.js';

/**
 * The real pnpm runner: resolves pnpm to an absolute path (via {@link resolvePnpm},
 * so command resolution never consults `PATH` — no S4036 binary-shadowing surface),
 * runs it with `args` from `cwd` inheriting stdio so the user sees install/build
 * progress, and translates a non-zero exit into an `err` Result at this single
 * library boundary (ADR-088) rather than letting `execFileSync`'s throw escape.
 *
 * @remarks
 * Structurally a `PnpmRunner` (see `build.ts`); the composition-root default
 * injected by {@link buildWorktree}. Unit tests inject a fake runner instead, so
 * this real runner is exercised only at the integration/CLI edge. `process.env` is
 * read here (the real edge) and passed explicitly into {@link resolvePnpm}, which
 * keeps the resolver itself testable without touching globals.
 */
export const realPnpmRunner = (args: readonly string[], cwd: string): Result<void, Error> => {
  const pnpm = resolvePnpm(process.env);
  if (isErr(pnpm)) {
    return pnpm;
  }
  try {
    execFileSync(pnpm.value, [...args], { cwd, stdio: 'inherit' });
    return ok(undefined);
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
};
