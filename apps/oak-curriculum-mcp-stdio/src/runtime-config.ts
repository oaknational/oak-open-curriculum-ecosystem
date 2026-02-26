/**
 * Runtime configuration for the STDIO MCP server.
 *
 * Loads environment variables via `resolveEnv` from `@oaknational/env-resolution`,
 * validates against `StdioEnvSchema`, and returns a typed `Result`. Callers
 * handle the error case — this module does not exit or throw.
 *
 * @see StdioEnvSchema in `./env.ts`
 * @see resolveEnv in `@oaknational/env-resolution`
 */

import { resolveEnv, type EnvResolutionError } from '@oaknational/env-resolution';
import { ok, err, type Result } from '@oaknational/result';
import type { LOG_LEVELS } from '@oaknational/env';
import { StdioEnvSchema, type StdioEnv } from './env.js';

type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Runtime configuration derived from validated environment variables.
 *
 * All fields are guaranteed valid by Zod schema validation in `resolveEnv`.
 */
export interface RuntimeConfig {
  /** Validated environment variables */
  readonly env: StdioEnv;
  /** Validated log level (defaults to `'info'` when absent) */
  readonly logLevel: LogLevel;
  /** Whether to use stub tool executors instead of real API calls */
  readonly useStubTools: boolean;
  /** Application version from `npm_package_version` (defaults to `'0.0.0'`) */
  readonly version: string;
}

/**
 * Structured error from the configuration pipeline.
 *
 * Wraps the underlying `EnvResolutionError` with a human-readable message
 * and per-key diagnostics.
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
  /** Directory from which to begin searching for the monorepo root */
  readonly startDir: string;
}

/**
 * Loads runtime configuration from the environment resolution pipeline.
 *
 * Calls `resolveEnv` to load `.env` and `.env.local` files from the monorepo
 * root, merge with `processEnv`, and validate against `StdioEnvSchema`.
 * Returns a typed `Result` — callers handle the error case.
 *
 * @param options - processEnv and startDir for the env resolution pipeline
 * @returns `Ok<RuntimeConfig>` or `Err<ConfigError>`
 */
export function loadRuntimeConfig(
  options: LoadRuntimeConfigOptions,
): Result<RuntimeConfig, ConfigError> {
  const envResult = resolveEnv({
    schema: StdioEnvSchema,
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
    logLevel: env.LOG_LEVEL ?? 'info',
    useStubTools: env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS === 'true',
    version: options.processEnv.npm_package_version ?? '0.0.0',
  });
}
