import { err, ok, type Result } from '@oaknational/result';
import { HttpEnvSchema, type AuthDisabledEnv, type Env } from './env.js';
import {
  getDisplayHostname,
  resolveApplicationVersion,
  resolveGitSha,
  type AuthDisabledRuntimeConfig,
  type AuthEnabledRuntimeConfig,
  type ConfigError,
  type RuntimeConfig,
  type SharedRuntimeFields,
} from './runtime-config-support.js';

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

function resolveSharedRuntimeFields(env: Env): Result<SharedRuntimeFields, ConfigError> {
  const versionResult = resolveApplicationVersion({
    APP_VERSION_OVERRIDE: env.APP_VERSION_OVERRIDE,
  });

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

function createAuthEnabledConfig(
  env: Env,
  clerkPublishableKey: string,
  clerkSecretKey: string,
  shared: SharedRuntimeFields,
): AuthEnabledRuntimeConfig {
  return {
    ...shared,
    env: { ...env, CLERK_PUBLISHABLE_KEY: clerkPublishableKey, CLERK_SECRET_KEY: clerkSecretKey },
    dangerouslyDisableAuth: false,
  };
}

function createAuthDisabledConfig(
  env: AuthDisabledEnv,
  shared: SharedRuntimeFields,
): AuthDisabledRuntimeConfig {
  return {
    ...shared,
    env,
    dangerouslyDisableAuth: true,
  };
}

/**
 * Build runtime config from an already supplied environment object.
 *
 * @remarks This seam validates the explicit input without loading `.env` files
 * or reading ambient process state. It is the in-process testable boundary for
 * local startup composition.
 */
export function createRuntimeConfigFromValidatedEnv(
  input: Env,
): Result<RuntimeConfig, ConfigError> {
  const parsedEnv = HttpEnvSchema.safeParse(input);

  if (!parsedEnv.success) {
    return err({
      message: parsedEnv.error.message,
      diagnostics: [],
    });
  }

  const env = parsedEnv.data;
  const sharedResult = resolveSharedRuntimeFields(env);

  if (!sharedResult.ok) {
    return sharedResult;
  }

  if (toBooleanFlag(env.DANGEROUSLY_DISABLE_AUTH)) {
    return ok(createAuthDisabledConfig(env, sharedResult.value));
  }

  const clerkPublishableKey = env.CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey || !clerkSecretKey) {
    return err({
      message: 'Clerk keys are required when auth is enabled but were not found after validation',
      diagnostics: [],
    });
  }

  return ok(createAuthEnabledConfig(env, clerkPublishableKey, clerkSecretKey, sharedResult.value));
}
