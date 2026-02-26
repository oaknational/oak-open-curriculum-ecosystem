/**
 * Environment resolution pipeline for MCP applications.
 *
 * Provides `resolveEnv` — a pipeline that reads `.env` and `.env.local`
 * files, merges with `processEnv`, validates against a Zod schema,
 * and returns `Result<T, EnvResolutionError>`.
 *
 * Also exports `findRepoRoot` for monorepo root discovery.
 *
 * Schema contracts (OakApiKeyEnvSchema, ElasticsearchEnvSchema,
 * LoggingEnvSchema) live in `@oaknational/env`.
 */

export { findRepoRoot } from './repo-root.js';

export { resolveEnv } from './resolve-env.js';
export type { ResolveEnvOptions, EnvResolutionError, EnvKeyDiagnostic } from './resolve-env.js';
