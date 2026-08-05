import { err, ok, type Result } from '@oaknational/result';
import {
  HttpEnvSchema,
  parseCsv,
  type AuthDisabledEnv,
  type Env,
  type ValidatedHttpEnv,
} from './env.js';
import { resolveOptInFlag } from './feature-flags.js';
import {
  resolveProductAnalyticsConfig,
  type ProductAnalyticsBootstrap,
} from './product-analytics-config.js';
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

/**
 * Removes the PostHog deployment inputs from the handler-facing env.
 *
 * @remarks
 * Those inputs are consumed at the composition root by
 * `resolveProductAnalyticsConfig`; credentials and actor-projection key
 * material must not ride the handler-facing `RuntimeConfig`. The parsed
 * `OBSERVABILITY_SINKS` selection stays — it is non-secret and the
 * composition root reads it to decide the product-analytics mode.
 */
function stripProductAnalyticsInputs<TEnv extends Env>(parsed: TEnv): TEnv {
  const env = { ...parsed };
  delete env.POSTHOG_PROJECT_API_KEY;
  delete env.POSTHOG_HOST;
  delete env.POSTHOG_PSEUDONYM_ACTIVE_KEY_ID;
  delete env.POSTHOG_PSEUDONYM_KEYRING;
  // POSTHOG_CAPTURE_MODE reaches this seam in off mode (ignored there by
  // design) and as an empty string in selected mode — strip it too so no
  // PostHog input of any kind rides the handler-facing config.
  delete env.POSTHOG_CAPTURE_MODE;
  return env;
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
    useStubTools: resolveOptInFlag(env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
    version: versionResult.value.value,
    versionSource: versionResult.value.source,
    ...(gitShaResult.value
      ? { gitSha: gitShaResult.value.value, gitShaSource: gitShaResult.value.source }
      : {}),
    vercelHostnames,
    displayHostname: getDisplayHostname(env),
    // Guard 1c: the env-layer refinement already validated each entry is an
    // exact origin; parseCsv trims and drops empties, so unset → [].
    authorizedParties: parseCsv(env.CLERK_AUTHORIZED_PARTIES) ?? [],
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
 * Everything the composition root receives from one environment
 * resolution pass: the handler-facing runtime config (PostHog inputs
 * stripped) and the adapter-owned product-analytics bootstrap value,
 * resolved while the inputs were still in scope. The bootstrap is
 * consumed at application bootstrap only and never rides the
 * handler-facing config.
 */
export interface LoadedRuntime {
  readonly runtimeConfig: RuntimeConfig;
  readonly productAnalytics: ProductAnalyticsBootstrap;
}

/**
 * Compose the full loaded runtime from an already supplied environment
 * object: parse once, resolve the product-analytics bootstrap (deep
 * keyring validation gates boot here), and build the handler-facing
 * runtime config.
 *
 * @remarks This seam validates the explicit input without loading `.env`
 * files or reading ambient process state. It is the in-process testable
 * boundary for local startup composition; `loadRuntimeConfig` is the
 * file-reading glue in front of it.
 */
export function composeLoadedRuntimeFromValidatedEnv(
  input: Env,
): Result<LoadedRuntime, ConfigError> {
  const parsedEnv = HttpEnvSchema.safeParse(input);

  if (!parsedEnv.success) {
    return err({
      message: parsedEnv.error.message,
      diagnostics: [],
    });
  }

  const productAnalytics = resolveProductAnalyticsConfig(parsedEnv.data);

  if (!productAnalytics.ok) {
    return productAnalytics;
  }

  const configResult = buildRuntimeConfigFromParsed(parsedEnv.data);

  if (!configResult.ok) {
    return configResult;
  }

  return ok({ runtimeConfig: configResult.value, productAnalytics: productAnalytics.value });
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

  return buildRuntimeConfigFromParsed(parsedEnv.data);
}

function buildRuntimeConfigFromParsed(
  parsed: ValidatedHttpEnv,
): Result<RuntimeConfig, ConfigError> {
  const sharedResult = resolveSharedRuntimeFields(parsed);

  if (!sharedResult.ok) {
    return sharedResult;
  }

  const env = stripProductAnalyticsInputs(parsed);
  const shared = sharedResult.value;

  if (resolveOptInFlag(env.DANGEROUSLY_DISABLE_AUTH)) {
    return ok(createAuthDisabledConfig(env, shared));
  }

  const clerkPublishableKey = env.CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey || !clerkSecretKey) {
    return err({
      message: 'Clerk keys are required when auth is enabled but were not found after validation',
      diagnostics: [],
    });
  }

  return ok(createAuthEnabledConfig(env, clerkPublishableKey, clerkSecretKey, shared));
}
