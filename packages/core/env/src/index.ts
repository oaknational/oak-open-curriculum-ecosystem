/**
 * Environment schema contracts for MCP applications.
 *
 * Provides shared Zod schemas for common environment variable contracts.
 * Schemas are opt-in: apps import only what they need, compose
 * them into an app-specific schema, and pass it to `resolveEnv`
 * from `@oaknational/env-resolution`.
 */

export {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  BulkDataEnvSchema,
  LoggingEnvSchema,
  SentryEnvSchema,
  LOG_LEVELS,
  NODE_ENVS,
  SENTRY_MODES,
} from './schemas/index.js';
export type {
  OakApiKeyEnv,
  ElasticsearchEnv,
  BulkDataEnv,
  LoggingEnv,
  SentryEnv,
} from './schemas/index.js';
