import { resolveEnv } from '@oaknational/env-resolution';
import { err, ok, type Result } from '@oaknational/result';
import { HttpEnvSchema, type ValidatedHttpEnv } from './env.js';
import {
  composeLoadedRuntimeFromValidatedEnv,
  type LoadedRuntime,
} from './runtime-config-from-validated-env.js';
import { type ConfigError, type LoadRuntimeConfigOptions } from './runtime-config-support.js';

export type {
  AuthEnabledRuntimeConfig,
  AuthDisabledRuntimeConfig,
  RuntimeConfig,
} from './runtime-config-support.js';
export type { LoadedRuntime } from './runtime-config-from-validated-env.js';

function resolveValidatedEnv(
  options: LoadRuntimeConfigOptions,
): Result<ValidatedHttpEnv, ConfigError> {
  const envResult = resolveEnv(
    options.envFiles === 'none'
      ? { schema: HttpEnvSchema, processEnv: options.processEnv, envFiles: 'none' }
      : { schema: HttpEnvSchema, processEnv: options.processEnv, startDir: options.startDir },
  );

  if (!envResult.ok) {
    return err({
      message: envResult.error.message,
      diagnostics: envResult.error.diagnostics,
      failingKeys: [
        ...new Set(
          envResult.error.zodIssues
            .map((issue) => issue.path[0])
            .filter((segment): segment is string => typeof segment === 'string'),
        ),
      ],
    });
  }

  return ok(envResult.value);
}

/**
 * Loads runtime configuration from the environment resolution pipeline.
 *
 * Calls `resolveEnv` to load `.env` and `.env.local` files, merge with
 * `processEnv`, and validate against `HttpEnvSchema`; then composes the
 * loaded runtime — the product-analytics bootstrap (deep keyring
 * validation gates boot here) plus the handler-facing runtime config.
 * Returns a typed `Result` — callers handle the error case, this
 * function does not exit or throw.
 *
 * @param options - processEnv plus either startDir (env-file discovery) or envFiles: 'none'
 * @returns `Ok<LoadedRuntime>` or `Err<ConfigError>`
 */
export function loadRuntimeConfig(
  options: LoadRuntimeConfigOptions,
): Result<LoadedRuntime, ConfigError> {
  const envResult = resolveValidatedEnv(options);

  if (!envResult.ok) {
    return envResult;
  }

  return composeLoadedRuntimeFromValidatedEnv(envResult.value);
}
