import type { ApplicationVersionSource, GitShaSource } from '@oaknational/build-metadata';
import type { EnvResolutionError } from '@oaknational/env-resolution';
import type { AuthEnabledEnv, AuthDisabledEnv } from './env.js';

/**
 * Runtime configuration when authentication is enabled.
 *
 * Clerk keys are guaranteed present as `string`.
 */
export interface AuthEnabledRuntimeConfig {
  readonly env: AuthEnabledEnv;
  readonly dangerouslyDisableAuth: false;
  readonly useStubTools: boolean;
  readonly version: string;
  readonly versionSource: ApplicationVersionSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}

/**
 * Runtime configuration when authentication is disabled.
 *
 * Clerk keys may be absent.
 */
export interface AuthDisabledRuntimeConfig {
  readonly env: AuthDisabledEnv;
  readonly dangerouslyDisableAuth: true;
  readonly useStubTools: boolean;
  readonly version: string;
  readonly versionSource: ApplicationVersionSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}

/**
 * Discriminated union on `dangerouslyDisableAuth`.
 *
 * After narrowing on `dangerouslyDisableAuth`, the compiler knows whether
 * Clerk keys are guaranteed present (`string`) or possibly absent.
 */
export type RuntimeConfig = AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig;

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
  readonly processEnv: Readonly<Record<string, string | undefined>>;
  readonly startDir: string;
}

export interface SharedRuntimeFields {
  readonly useStubTools: boolean;
  readonly version: string;
  readonly versionSource: ApplicationVersionSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
  readonly vercelHostnames: readonly string[];
  readonly displayHostname?: string;
}

export {
  getDisplayHostname,
  resolveApplicationVersion,
  resolveGitSha,
  type ApplicationVersionSource,
  type GitShaSource,
} from '@oaknational/build-metadata';
