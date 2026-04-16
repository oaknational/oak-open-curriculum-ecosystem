/**
 * Runtime configuration for the Search CLI.
 *
 * Loads environment variables via `resolveEnv` from `@oaknational/env-resolution`,
 * validates against `SearchCliEnvSchema`, and returns a typed `Result`. Callers
 * handle the error case — this module does not exit or throw.
 *
 * @see SearchCliEnvSchema in `./env.ts`
 * @see resolveEnv in `@oaknational/env-resolution`
 */

import process from 'node:process';
import { resolveEnv } from '@oaknational/env-resolution';
import { ok, err, type Result } from '@oaknational/result';
import { SearchCliEnvSchema, type SearchCliEnv } from './env.js';
import {
  resolveApplicationVersion,
  resolveGitSha,
  type ConfigError,
  type LoadRuntimeConfigOptions,
  type SearchCliRuntimeConfig,
} from './runtime-config-support.js';

export type { ConfigError, LoadRuntimeConfigOptions, SearchCliRuntimeConfig };

/**
 * Cached loader for validated CLI environment configuration.
 *
 * Composition roots create one loader and pass it down to command
 * registration. Actions opt into env validation only when they run.
 */
export interface SearchCliEnvLoader {
  /**
   * Load and cache validated CLI environment values.
   *
   * @returns `Ok<SearchCliEnv>` or `Err<ConfigError>`
   */
  load(): Result<SearchCliEnv, ConfigError>;
}

/**
 * Loads runtime configuration from the environment resolution pipeline.
 *
 * Calls `resolveEnv` to load `.env` and `.env.local` files from both the
 * app root and monorepo root, merge with `processEnv`, and validate against
 * `SearchCliEnvSchema`. Returns a typed `Result` — callers handle the error case.
 *
 * @param options - processEnv and startDir for the env resolution pipeline
 * @returns `Ok<SearchCliRuntimeConfig>` or `Err<ConfigError>`
 */
export function loadRuntimeConfig(
  options: LoadRuntimeConfigOptions,
): Result<SearchCliRuntimeConfig, ConfigError> {
  const envResult = resolveEnv({
    schema: SearchCliEnvSchema,
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
  const versionResult = resolveApplicationVersion(options.processEnv);

  if (!versionResult.ok) {
    return versionResult;
  }

  const gitShaResult = resolveGitSha(options.processEnv);

  if (!gitShaResult.ok) {
    return gitShaResult;
  }

  return ok({
    env,
    logLevel: env.LOG_LEVEL,
    version: versionResult.value.value,
    versionSource: versionResult.value.source,
    ...(gitShaResult.value
      ? { gitSha: gitShaResult.value.value, gitShaSource: gitShaResult.value.source }
      : {}),
  });
}

/**
 * Create a cached loader for validated CLI environment values.
 *
 * The first call executes the env resolution pipeline; later calls
 * return the cached `Result` so command actions share one source.
 *
 * @param options - processEnv and startDir for the env resolution pipeline
 * @returns Loader for validated `SearchCliEnv`
 */
export function createSearchCliEnvLoader(options: LoadRuntimeConfigOptions): SearchCliEnvLoader {
  let cachedResult: Result<SearchCliEnv, ConfigError> | undefined;

  return {
    load(): Result<SearchCliEnv, ConfigError> {
      if (cachedResult) {
        return cachedResult;
      }

      const configResult = loadRuntimeConfig(options);
      cachedResult = configResult.ok ? ok(configResult.value.env) : err(configResult.error);
      return cachedResult;
    },
  };
}

/**
 * Print structured config diagnostics to stderr.
 *
 * @param error - Config validation error from the runtime config pipeline
 * @returns void
 */
export function printConfigError(error: ConfigError): void {
  process.stderr.write(`Environment validation failed: ${error.message}\n`);
  for (const diagnostic of error.diagnostics) {
    if (!diagnostic.present) {
      process.stderr.write(`  ${diagnostic.key}: MISSING\n`);
    }
  }
}

/**
 * Load runtime config or exit with diagnostics.
 *
 * Convenience wrapper for composition-root entry points (scripts,
 * operations, evaluation). Prints diagnostics to stderr and exits
 * with code 1 on failure.
 */
export function loadConfigOrExit(options: LoadRuntimeConfigOptions): SearchCliRuntimeConfig {
  const result = loadRuntimeConfig(options);
  if (!result.ok) {
    printConfigError(result.error);
    return process.exit(1);
  }
  return result.value;
}
