/**
 * Minimal subset of environment variables used to control the search fixture toggle.
 */
export interface FixtureToggleEnv {
  readonly NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE?: string;
}

/**
 * Explicit values that disable the fixture toggle when provided via env vars.
 */
const DISABLED_FLAG_VALUES = new Set(['false', '0', 'off', 'no']);

/**
 * Normalises user supplied environment values for consistent comparisons.
 */
function normaliseFlagValue(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Resolves whether the fixture toggle should be visible based on explicit env flags.
 *
 * By default the toggle is visible. Setting `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` to
 * any of `false`, `0`, `off`, or `no` disables the toggle. Any other value leaves
 * it enabled.
 *
 * @remarks generalise this to env handling in core and feature flags in lib
 */
export function resolveFixtureToggleVisibility(env?: FixtureToggleEnv): boolean {
  const rawValue =
    env?.NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE ?? process.env.NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE;

  if (typeof rawValue !== 'string') {
    return true;
  }

  return !DISABLED_FLAG_VALUES.has(normaliseFlagValue(rawValue));
}
