/**
 * Environment for spawning a pnpm resolved by `pnpm-path.ts`, covering BOTH
 * launch modes that resolver can return.
 *
 * @remarks
 * The contract per launch mode:
 *
 * - **Standalone binary** (`pnpm` / `pnpm.exe` launched directly): ignores
 *   every corepack variable — but the ones inherited from an outer
 *   corepack-shimmed pnpm chain must still be stripped, because under
 *   `COREPACK_ROOT` the standalone binary refuses to self-switch to the
 *   repo's pinned `packageManager` version and fails the devEngines pin
 *   (observed first-hand: an 11.9.0 standalone refusing the 11.8.0 pin
 *   inside a hook chain); without them it self-switches per the pin.
 * - **Corepack launcher** (the win32 FIRST candidate — `corepack/dist/pnpm.js`
 *   via Node): obeys every `COREPACK_*` variable. The whole prefix is
 *   scrubbed rather than a list of names, because the list kept growing
 *   behind the code-selection property it was meant to hold: `COREPACK_ROOT`
 *   and `COREPACK_HOME` redirect which cached build runs, but
 *   `COREPACK_NPM_REGISTRY` plus `COREPACK_INTEGRITY_KEYS` choose where the
 *   build is downloaded from AND replace the keys that verify it, and
 *   `COREPACK_ENABLE_PROJECT_SPEC=0` makes corepack ignore the repository's
 *   pin (read from the launcher this resolver executes, 2026-08-19 security
 *   review). No non-corepack variable carries the prefix, so the
 *   pass-through contract for unrelated keys holds.
 *
 *   Two variables are then SET, never left absent:
 *   `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, because an absent value re-enables
 *   corepack's download prompt, which fails in a non-TTY child; and
 *   `COREPACK_ENV_FILE=0`, because corepack otherwise reads `.corepack.env`
 *   from the child's cwd (the repository root at every call site) and merges
 *   every `COREPACK_*` entry it finds UNDER the process environment — the
 *   deleted names would come straight back from a file. `0` is corepack's
 *   documented opt-out.
 *
 * Pure: takes the environment as input and returns a new object; unrelated
 * keys pass through unchanged.
 *
 * @packageDocumentation
 */

import { typeSafeEntries } from '@oaknational/type-helpers';

const COREPACK_PREFIX = 'COREPACK_';

/**
 * Whether `key` is a corepack variable for the platform. Windows environment
 * names are case-insensitive: the child reads `corepack_root` and
 * `Corepack_Home` as `COREPACK_ROOT` / `COREPACK_HOME`, so on win32 every
 * case variant of the prefix is the same family and must go. POSIX names are
 * case-sensitive — `corepack_root` there is a variable corepack never reads,
 * and scrubbing it would break the pass-through contract for unrelated keys.
 */
function isCorepackVariable(key: string, platform: NodeJS.Platform): boolean {
  return platform === 'win32'
    ? key.toUpperCase().startsWith(COREPACK_PREFIX)
    : key.startsWith(COREPACK_PREFIX);
}

/**
 * Derive the spawn environment for pnpm from `env`.
 *
 * `platform` is injected (defaulting to `process.platform`) so both branches
 * are provable from any host: the resolver that hands this environment out
 * already takes the same injection, and the two must agree.
 *
 * @param env - The environment to derive the spawn environment from.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns A new environment safe for either pnpm launch mode.
 */
export function pnpmSpawnEnvironment(
  env: NodeJS.ProcessEnv,
  platform: NodeJS.Platform = process.platform,
): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = Object.fromEntries(
    typeSafeEntries(env).filter(([key]) => !isCorepackVariable(key, platform)),
  );
  environment.COREPACK_ENABLE_DOWNLOAD_PROMPT = '0';
  environment.COREPACK_ENV_FILE = '0';
  return environment;
}
