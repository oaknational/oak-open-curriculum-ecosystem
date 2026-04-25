import { resolveEnv } from '@oaknational/env-resolution';
import { err, ok, type Result } from '@oaknational/result';
import { HttpEnvSchema, type Env } from './env.js';
import { createRuntimeConfigFromValidatedEnv } from './runtime-config-from-validated-env.js';
import {
  type ConfigError,
  type LoadRuntimeConfigOptions,
  type RuntimeConfig,
} from './runtime-config-support.js';

export type {
  AuthEnabledRuntimeConfig,
  AuthDisabledRuntimeConfig,
  RuntimeConfig,
} from './runtime-config-support.js';

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

  return createRuntimeConfigFromValidatedEnv(envResult.value);
}
