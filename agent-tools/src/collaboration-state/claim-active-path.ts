import { join } from 'node:path';

import { optional, type Options } from './cli-options.js';
import { type CliHandler } from './cli-spec-factory.js';
import {
  resolveCoordinationHome,
  type ResolveCoordinationHomeOptions,
} from './coordination-home.js';

/** Active-claims registry path relative to the coordination home. */
const ACTIVE_CLAIMS_REL = '.agent/state/collaboration/active-claims.json';

/**
 * Resolve the active-claims path for a `claims` command (F-85).
 *
 * An explicit `--active` is honoured verbatim. Otherwise the path defaults to
 * the shared coordination home's `active-claims.json` — the SAME primary
 * checkout the `comms` commands resolve via {@link resolveCoordinationHome} — so
 * a worktree-isolated agent's claims stay visible to the team without per-call
 * ceremony (the F-41 fragmentation failure mode, but for claims rather than
 * comms). `--repo-root` is the explicit home override.
 *
 * Resolution is lazy: git is consulted (via `resolveCoordinationHome`) only when
 * neither `--active` nor `--repo-root` is supplied, so an explicit path never
 * pays for a git invocation. The `homeOptions` seam forwards the injectable
 * `runGit` runner so this is unit-testable without a real repository.
 */
export function resolveActivePath(
  options: Options,
  cwd: string,
  homeOptions?: ResolveCoordinationHomeOptions,
): string {
  const explicit = optional(options, 'active');
  if (explicit !== undefined) {
    return explicit;
  }
  const repoRoot = optional(options, 'repo-root') ?? resolveCoordinationHome(cwd, homeOptions);
  return join(repoRoot, ACTIVE_CLAIMS_REL);
}

/**
 * Return a copy of `options` whose `active` value is resolved per
 * {@link resolveActivePath}, leaving every other field untouched. Wrapping a
 * `claims` handler with this lets the handler body keep reading
 * `required(options, 'active')` unchanged while gaining the coordination-home
 * default.
 */
export function withActiveDefault(
  options: Options,
  cwd: string,
  homeOptions?: ResolveCoordinationHomeOptions,
): Options {
  const values = new Map(options.values);
  values.set('active', resolveActivePath(options, cwd, homeOptions));
  return { ...options, values };
}

/**
 * Wrap a `claims` {@link CliHandler} so an omitted `--active` defaults to the
 * coordination home before the handler runs (F-85). This mirrors the
 * default-resolution boundary in `cli-comms-send.ts` / `cli-comms-validate.ts`:
 * the default is applied once at spec-wiring time from `process.cwd()`, so each
 * handler body stays unchanged.
 */
export function withResolvedActive(handler: CliHandler): CliHandler {
  return (options, env, runtime) =>
    handler(withActiveDefault(options, process.cwd()), env, runtime);
}
