import type { ApplicationVersionSource, GitShaSource } from '@oaknational/build-metadata';
import type { EnvResolutionError } from '@oaknational/env-resolution';
import type { SearchCliEnv } from './env.js';

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
  /** Application version from root package.json or an explicit override. */
  readonly version: string;
  /** Source of the resolved application version. */
  readonly versionSource: ApplicationVersionSource;
  /** Optional git SHA metadata for observability tagging. */
  readonly gitSha?: string;
  /** Source of the resolved git SHA metadata. */
  readonly gitShaSource?: GitShaSource;
}

/**
 * Structured error from the configuration pipeline.
 */
export interface ConfigError {
  readonly message: string;
  readonly diagnostics: EnvResolutionError['diagnostics'];
}

/**
 * Format structured config diagnostics as a single user-facing string.
 *
 * The validation `error.message` already names failing keys and the
 * validation issue text; this formatter just prefixes it and appends
 * a trailing newline. Per-key MISSING lines for optional-and-absent
 * keys are intentionally NOT emitted — that information belongs on
 * a debug logger surface, not on the user-facing stderr stream.
 *
 * Pure function: no I/O, no global access. The thin stderr wrapper
 * lives at `printConfigError` in `runtime-config.ts`.
 *
 * @param error - Config validation error from the runtime config pipeline
 * @returns Formatted single-string output suitable for stderr
 */
export function formatConfigError(error: ConfigError): string {
  return `Environment validation failed: ${error.message}\n`;
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

export { resolveApplicationVersion, resolveGitSha } from '@oaknational/build-metadata';
