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
 * Options for loading runtime configuration.
 */
export interface LoadRuntimeConfigOptions {
  /** The process environment object (typically `process.env`) */
  readonly processEnv: Readonly<Record<string, string | undefined>>;
  /** Directory from which to begin searching for app and repo roots */
  readonly startDir: string;
}

export { resolveApplicationVersion, resolveGitSha } from '@oaknational/build-metadata';
