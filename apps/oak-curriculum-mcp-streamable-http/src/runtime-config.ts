import { resolveEnv } from '@oaknational/env-resolution';
import { ok, err, type Result } from '@oaknational/result';
import { HttpEnvSchema, type Env } from './env.js';
import {
  getDisplayHostname,
  resolveApplicationVersion,
  resolveGitSha,
  type AuthDisabledRuntimeConfig,
  type AuthEnabledRuntimeConfig,
  type ConfigError,
  type LoadRuntimeConfigOptions,
  type RuntimeConfig,
  type SharedRuntimeFields,
} from './runtime-config-support.js';

export type {
  AuthEnabledRuntimeConfig,
  AuthDisabledRuntimeConfig,
  RuntimeConfig,
} from './runtime-config-support.js';

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

function resolveValidatedEnv(options: LoadRuntimeConfigOptions): Result<Env, ConfigError> {
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

  return ok(envResult.value);
}

function resolveSharedRuntimeFields(
  env: Env,
  processEnv: Readonly<Record<string, string | undefined>>,
): Result<SharedRuntimeFields, ConfigError> {
  const versionResult = resolveApplicationVersion(processEnv);

  if (!versionResult.ok) {
    return versionResult;
  }

  const gitShaResult = resolveGitSha(env);

  if (!gitShaResult.ok) {
    return gitShaResult;
  }

  const vercelHostnames = [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter((url): url is string => Boolean(url))
    .map((url) => url.toLowerCase());

  return ok({
    useStubTools: toBooleanFlag(env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
    version: versionResult.value.value,
    versionSource: versionResult.value.source,
    ...(gitShaResult.value
      ? { gitSha: gitShaResult.value.value, gitShaSource: gitShaResult.value.source }
      : {}),
    vercelHostnames,
    displayHostname: getDisplayHostname(env),
  });
}

function buildAuthEnabledRuntimeConfig(
  env: Env & { readonly CLERK_PUBLISHABLE_KEY: string; readonly CLERK_SECRET_KEY: string },
  shared: SharedRuntimeFields,
): AuthEnabledRuntimeConfig {
  return {
    ...shared,
    env,
    dangerouslyDisableAuth: false,
  };
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
  const envResult = resolveValidatedEnv(options);

  if (!envResult.ok) {
    return envResult;
  }

  const env = envResult.value;
  const sharedResult = resolveSharedRuntimeFields(env, options.processEnv);

  if (!sharedResult.ok) {
    return sharedResult;
  }

  const disableAuth = toBooleanFlag(env.DANGEROUSLY_DISABLE_AUTH);
  const shared = sharedResult.value;

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

  return ok(
    buildAuthEnabledRuntimeConfig(
      { ...env, CLERK_PUBLISHABLE_KEY: clerkPublishableKey, CLERK_SECRET_KEY: clerkSecretKey },
      shared,
    ),
  );
}
