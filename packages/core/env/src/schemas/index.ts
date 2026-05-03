export { OakApiKeyEnvSchema } from './oak-api';
export type { OakApiKeyEnv } from './oak-api';

export { ElasticsearchEnvSchema } from './elasticsearch';
export type { ElasticsearchEnv } from './elasticsearch';

export { BulkDataEnvSchema } from './bulk-data';
export type { BulkDataEnv } from './bulk-data';

export { LoggingEnvSchema, LOG_LEVELS, NODE_ENVS } from './logging';
export type { LoggingEnv } from './logging';

/**
 * Legacy single-axis Sentry env schema. Replaced by the orthogonal-axes
 * {@link ObservabilityEnvSchema} below. New code MUST consume the
 * orthogonal-axes schema; the legacy export is retained only to keep
 * the WS1 RED-phase tree compile-clean while WS3 atomically renames the
 * remaining consumers and removes this file.
 *
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */
export { SentryEnvSchema, SENTRY_MODES } from './sentry';
export type { SentryEnv } from './sentry';

/**
 * Orthogonal-axes observability env contract — the canonical schema for
 * new code. Pair `OBSERVABILITY_SINKS` (typed sink list) with
 * `OBSERVABILITY_FIXTURES` (boolean tee toggle); the cross-field rules
 * live in {@link ObservabilityEnvSchema}'s `superRefine`.
 */
export {
  OBSERVABILITY_SINKS_SCHEMA,
  OBSERVABILITY_FIXTURES_SCHEMA,
  ObservabilityEnvSchema,
} from './observability';
export type { ObservabilityEnv, ObservabilityEnvInput } from './observability';

export { BuildEnvSchema, VERCEL_ENVS } from './build-env';
export type { BuildEnv } from './build-env';
