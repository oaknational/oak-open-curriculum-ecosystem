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
 *   via Node): obeys these variables. `COREPACK_ROOT`, `COREPACK_HOME`
 *   (redirects which cached package-manager build corepack executes — an env
 *   knob over code selection, 2026-08-12 security review), and
 *   `COREPACK_ENABLE_AUTO_PIN` are deleted. `COREPACK_ENABLE_DOWNLOAD_PROMPT`
 *   is SET to `'0'`, never deleted: deleting it re-enables corepack's
 *   download prompt, which fails in a non-TTY child.
 *
 * Pure: takes the environment as input and returns a new object; unrelated
 * keys pass through unchanged.
 *
 * @param env - The environment to derive the spawn environment from.
 * @returns A new environment safe for either pnpm launch mode.
 */
export function pnpmSpawnEnvironment(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const environment = { ...env };
  delete environment.COREPACK_ROOT;
  delete environment.COREPACK_HOME;
  delete environment.COREPACK_ENABLE_AUTO_PIN;
  environment.COREPACK_ENABLE_DOWNLOAD_PROMPT = '0';
  return environment;
}
