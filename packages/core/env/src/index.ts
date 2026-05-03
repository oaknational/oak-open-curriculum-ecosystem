/**
 * Environment schema contracts for MCP applications.
 *
 * @remarks Provides shared Zod schemas for common environment variable
 * contracts. Schemas are opt-in: apps import only what they need,
 * compose them into an app-specific schema, and pass it to `resolveEnv`
 * from `@oaknational/env-resolution`.
 *
 * **Observability migration in progress (WS1 RED–WS3 of the
 * observability multi-sink + fixtures plan)**: new code consumes
 * {@link ObservabilityEnvSchema} (orthogonal axes —
 * `OBSERVABILITY_SINKS` + `OBSERVABILITY_FIXTURES`). Legacy
 * {@link SentryEnvSchema} (`SENTRY_MODE`) is exported only to keep the
 * WS1 RED-phase tree compile-clean; WS3 atomically removes it.
 *
 * @see ../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */

export {
  OakApiKeyEnvSchema,
  ElasticsearchEnvSchema,
  BulkDataEnvSchema,
  LoggingEnvSchema,
  SentryEnvSchema,
  BuildEnvSchema,
  ObservabilityEnvSchema,
  OBSERVABILITY_SINKS_SCHEMA,
  OBSERVABILITY_FIXTURES_SCHEMA,
  LOG_LEVELS,
  NODE_ENVS,
  SENTRY_MODES,
  VERCEL_ENVS,
} from './schemas/index.js';
export { ROOT_PACKAGE_VERSION } from './root-package-version.js';
export type {
  OakApiKeyEnv,
  ElasticsearchEnv,
  BulkDataEnv,
  LoggingEnv,
  SentryEnv,
  BuildEnv,
  ObservabilityEnv,
  ObservabilityEnvInput,
} from './schemas/index.js';
