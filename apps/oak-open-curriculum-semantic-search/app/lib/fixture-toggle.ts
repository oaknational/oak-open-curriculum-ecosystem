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
 * String values that map to fixture or live modes when evaluating defaults.
 */
const ENABLED_MODE_VALUES = new Set([
  '1',
  'on',
  'true',
  'fixtures',
  'empty',
  'error',
  'fixtures-empty',
  'fixtures-error',
]);
const DISABLED_MODE_VALUES = new Set(['0', 'off', 'false', 'live']);

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

/**
 * Details provided when resolving the fixture toggle state.
 */
export interface ResolveFixtureToggleStateInput {
  readonly env?: FixtureToggleEnv;
  readonly cookieValue?: string | null;
  readonly defaultModeEnvValue?: string | undefined;
}

export interface FixtureToggleState {
  readonly visible: boolean;
  readonly initialMode: 'fixtures' | 'live';
}

function resolveModeValue(value?: string | null): 'fixtures' | 'live' | undefined {
  if (!value) {
    return undefined;
  }
  const normalised = normaliseFlagValue(value);
  if (ENABLED_MODE_VALUES.has(normalised)) {
    return 'fixtures';
  }
  if (DISABLED_MODE_VALUES.has(normalised)) {
    return 'live';
  }
  return undefined;
}

/**
 * Resolves both the toggle visibility and the initial fixture mode that should be applied.
 */
export function resolveFixtureToggleState(
  input: ResolveFixtureToggleStateInput = {},
): FixtureToggleState {
  const { env, cookieValue, defaultModeEnvValue } = input;
  const visible = resolveFixtureToggleVisibility(env);

  const cookieMode = resolveModeValue(cookieValue);
  if (cookieMode) {
    return { visible, initialMode: cookieMode };
  }

  const envMode = resolveModeValue(
    defaultModeEnvValue ??
      env?.NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE ??
      process.env.SEMANTIC_SEARCH_USE_FIXTURES,
  );
  if (envMode) {
    return { visible, initialMode: envMode };
  }

  return { visible, initialMode: 'live' };
}
