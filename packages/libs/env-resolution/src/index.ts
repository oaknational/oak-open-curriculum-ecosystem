/**
 * Environment resolution pipeline for MCP applications.
 *
 * Provides `resolveEnv` — a pipeline that loads `.env` and `.env.local`
 * files from both the monorepo root and the nearest app root, merges
 * with `processEnv` (highest precedence), validates against a Zod schema,
 * and returns `Result<T, EnvResolutionError>`.
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
 * LoggingEnvSchema) live in `@oaknational/env`.
 */

export { findRepoRoot, findAppRoot } from './repo-root.js';

export { resolveEnv } from './resolve-env.js';
export type { ResolveEnvOptions, EnvResolutionError, EnvKeyDiagnostic } from './resolve-env.js';
