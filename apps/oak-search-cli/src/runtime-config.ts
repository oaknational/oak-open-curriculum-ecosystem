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
import { resolveEnv, type EnvResolutionError } from '@oaknational/env-resolution';
import { ok, err, type Result } from '@oaknational/result';
import { SearchCliEnvSchema, type SearchCliEnv } from './env.js';

/**
 * Runtime configuration derived from validated environment variables.
 *
 * All fields are guaranteed valid by Zod schema validation in `resolveEnv`.
 */
export interface SearchCliRuntimeConfig {
  /** Validated environment variables */
  readonly env: SearchCliEnv;
  /** Validated log level (defaults to `'info'`) */
  readonly logLevel: SearchCliEnv['LOG_LEVEL'];
  /** Application version from `npm_package_version` (defaults to `'0.0.0'`) */
  readonly version: string;
}

/**
 * Structured error from the configuration pipeline.
 */
export interface ConfigError {
  readonly message: string;
  readonly diagnostics: EnvResolutionError['diagnostics'];
}

/**
 * Options for loading runtime configuration.
 */
export interface LoadRuntimeConfigOptions {
  /** The process environment object (typically `process.env`) */
  readonly processEnv: Readonly<Record<string, string | undefined>>;
  /** Directory from which to begin searching for app and repo roots */
  readonly startDir: string;
}

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

  return ok({
    env,
    logLevel: env.LOG_LEVEL,
    version: options.processEnv.npm_package_version ?? '0.0.0',
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
