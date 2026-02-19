/**
 * Environment utilities for MCP applications.
 *
 * Provides an environment resolution pipeline (`resolveEnv`) and
 * shared Zod schemas for common environment variable contracts.
 *
 * Schemas are opt-in: apps import only what they need, compose
 * them into an app-specific schema, and pass it to `resolveEnv`.
 */

export { findRepoRoot } from './repo-root';

export { resolveEnv } from './resolve-env';
export type { ResolveEnvOptions, EnvResolutionError, EnvKeyDiagnostic } from './resolve-env';

export {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  LoggingEnvSchema,
  LOG_LEVELS,
  NODE_ENVS,
} from './schemas/index';
export type { OakApiKeyEnv, ElasticsearchEnv, LoggingEnv } from './schemas/index';
