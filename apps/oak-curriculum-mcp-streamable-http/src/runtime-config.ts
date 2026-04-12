import { resolveEnv, type EnvResolutionError } from '@oaknational/env-resolution';
import { ok, err, type Result } from '@oaknational/result';
import { HttpEnvSchema, type Env, type AuthEnabledEnv, type AuthDisabledEnv } from './env.js';

/**
 * Runtime configuration when authentication is enabled.
 *
 * Clerk keys are guaranteed present as `string`.
 */
export interface AuthEnabledRuntimeConfig {
  readonly env: AuthEnabledEnv;
  readonly dangerouslyDisableAuth: false;
  readonly useStubTools: boolean;
  readonly version: string;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}

/**
 * Runtime configuration when authentication is disabled.
 *
 * Clerk keys may be absent.
 */
export interface AuthDisabledRuntimeConfig {
  readonly env: AuthDisabledEnv;
  readonly dangerouslyDisableAuth: true;
  readonly useStubTools: boolean;
  readonly version: string;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}

/**
 * Discriminated union on `dangerouslyDisableAuth`.
 *
 * After narrowing on `dangerouslyDisableAuth`, the compiler knows whether
 * Clerk keys are guaranteed present (`string`) or possibly absent.
 */
export type RuntimeConfig = AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig;

/**
 * Structured error from the configuration pipeline.
 *
 * Wraps the underlying `EnvResolutionError` with a human-readable message
 * and per-key diagnostics.
 */
interface ConfigError {
  readonly message: string;
  readonly diagnostics: EnvResolutionError['diagnostics'];
}

/**
 * Options for loading runtime configuration.
 */
interface LoadRuntimeConfigOptions {
  readonly processEnv: Readonly<Record<string, string | undefined>>;
  readonly startDir: string;
}

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

/**
 * Determines the preferred hostname for display purposes.
 *
 * In production: Uses VERCEL_PROJECT_PRODUCTION_URL (custom domain).
 * In preview/dev: Uses VERCEL_URL (deployment-specific URL).
 */
function getDisplayHostname(env: Env): string | undefined {
  if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return env.VERCEL_PROJECT_PRODUCTION_URL.toLowerCase();
  }
  if (env.VERCEL_URL) {
    return env.VERCEL_URL.toLowerCase();
  }
  return undefined;
}

/**
 * Loads runtime configuration from the environment resolution pipeline.
 *
 * Calls `resolveEnv` to load `.env` and `.env.local` files, merge with
 * `processEnv`, and validate against `HttpEnvSchema`. Returns a typed
 * `Result` — callers handle the error case, this function does not exit
 * or throw.
 *
 * @param options - processEnv and startDir for the env resolution pipeline
 * @returns `Ok<RuntimeConfig>` or `Err<ConfigError>`
 */
export function loadRuntimeConfig(
  options: LoadRuntimeConfigOptions,
): Result<RuntimeConfig, ConfigError> {
  const envResult = resolveEnv({
    schema: HttpEnvSchema,
    processEnv: options.processEnv,
    startDir: options.startDir,
  });

  if (!envResult.ok) {
    return err({
      message: envResult.error.message,
      diagnostics: envResult.error.diagnostics,
    });
  }

  const env = envResult.value;

  const vercelHostnames = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter((url): url is string => Boolean(url))
    .map((url) => url.toLowerCase());

  const disableAuth = toBooleanFlag(env.DANGEROUSLY_DISABLE_AUTH);

  const shared = {
    useStubTools: toBooleanFlag(env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
    version: options.processEnv.npm_package_version ?? '0.0.0',
    vercelHostnames,
    displayHostname: getDisplayHostname(env),
  };

  if (disableAuth) {
    return ok({ ...shared, env, dangerouslyDisableAuth: true } satisfies AuthDisabledRuntimeConfig);
  }

  const clerkPublishableKey = env.CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey || !clerkSecretKey) {
    return err({
      message: 'Clerk keys are required when auth is enabled but were not found after validation',
      diagnostics: [],
    });
  }

  return ok({
    ...shared,
    env: { ...env, CLERK_PUBLISHABLE_KEY: clerkPublishableKey, CLERK_SECRET_KEY: clerkSecretKey },
    dangerouslyDisableAuth: false,
  } satisfies AuthEnabledRuntimeConfig);
}
