/**
 * Environment resolution pipeline for MCP applications.
 *
 * Provides `resolveEnv` — a pipeline that loads `.env` and `.env.local`
 * files from both the monorepo root and the nearest app root, merges
 * with `processEnv` (highest precedence), validates against a Zod schema,
 * and returns `EnvResolveResult<T>` (an `Ok` variant carrying both
 * `value` and `warnings: EnvWarning[]`, or an `Err` variant carrying a
 * structured `EnvResolutionError`). Shape-compatible with
 * `@oaknational/result`'s `Result<T, EnvResolutionError>` for
 * property-access patterns that ignore warnings.
 *
 * Five-source precedence (lowest to highest):
 * 1. Repo root `.env`
 * 2. Repo root `.env.local`
 * 3. App root `.env`
 * 4. App root `.env.local`
 * 5. `processEnv`
 *
 * Also exports `findRepoRoot` and `findAppRoot` for root discovery.
 *
 * Schema contracts (OakApiKeyEnvSchema, ElasticsearchEnvSchema,
 * LoggingEnvSchema, ObservabilityEnvSchema) live in `@oaknational/env`.
 */

export { findRepoRoot, findAppRoot } from './repo-root.js';

export { resolveEnv } from './resolve-env.js';
export type { ResolveEnvOptions } from './resolve-env.js';
export type {
  EnvKeyDiagnostic,
  EnvResolutionError,
  EnvResolveErr,
  EnvResolveOk,
  EnvResolveResult,
  EnvWarning,
  ObservabilitySinksEmptyInPreviewWarning,
} from './types.js';
