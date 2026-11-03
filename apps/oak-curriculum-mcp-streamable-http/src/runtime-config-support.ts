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
  /**
   * The variable names the schema refused, when the error came from env
   * resolution — a value-free rendering surface for boundaries (the build
   * gate) that must never echo a supplied value.
   */
  readonly failingKeys?: readonly string[];
}

/**
 * Options for loading runtime configuration: the process environment and
 * where `.env` files come from — discovered walking up from `startDir`
 * (the server entrypoints) or not read at all (`envFiles: 'none'`: the
 * deploy-config gate, which must see exactly what the platform injects).
 */
export type LoadRuntimeConfigOptions = {
  readonly processEnv: Readonly<Record<string, string | undefined>>;
} & ({ readonly envFiles?: 'discover'; readonly startDir: string } | { readonly envFiles: 'none' });

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
} from '@oaknational/build-metadata';
