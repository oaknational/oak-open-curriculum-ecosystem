/**
 * Environment-variable contract for the Oak observability orthogonal-axes
 * configuration shape.
 *
 * @remarks Replaces the single overloaded `SENTRY_MODE = off | fixture | sentry`
 * switch with two orthogonal axes:
 *
 * - {@link OBSERVABILITY_SINKS_SCHEMA} — typed list of additional external
 *   sink targets layered on top of the always-on stdout baseline (per
 *   ADR-162 §The Vendor-Independence Clause). The list is data, not a
 *   mode; new sinks (`'warehouse'`, `'posthog'`) extend the literal union
 *   without changing the surface shape.
 * - {@link OBSERVABILITY_FIXTURES_SCHEMA} — orthogonal fixture-as-tee
 *   boolean. When `true`, the fixture store observes the same events the
 *   external sinks see, **after** the ADR-160 redaction barrier. Fixtures
 *   are a tee, not a destination.
 *
 * Cross-field rules are encoded in {@link ObservabilityEnvSchema}'s
 * `superRefine` per the observability multi-sink + fixtures shape plan
 * (locality enforcement; sink-config conditional requirements;
 * legacy-rename rejection). The dedicated ADR is authored at WS8.6 of
 * that plan; until then the plan body is the canonical source.
 *
 * @see ../../../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md
 * @see ../../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md
 * @see ../../../../../docs/architecture/architectural-decisions/162-observability-first.md
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import type { z } from 'zod';
import { OBSERVABILITY_FIXTURES_SCHEMA, OBSERVABILITY_SINKS_SCHEMA } from './observability-axes.js';
import { ObservabilityEnvBaseSchema } from './observability-base.js';
import {
  refineLegacyLoggerKeys,
  refineLegacySentryMode,
  refineProductionLocality,
  refineSinkConditionalRequirements,
} from './observability-refinements.js';

export { OBSERVABILITY_FIXTURES_SCHEMA, OBSERVABILITY_SINKS_SCHEMA };

/**
 * Composed environment-variable contract for the orthogonal-axes
 * observability configuration.
 *
 * @remarks Five cross-field rules encoded across four helper
 * functions (`refineSinkConditionalRequirements` covers branches 3 and
 * 4 because the per-sink conditional requirements share a common
 * shape). The rules are named by the observability multi-sink +
 * fixtures shape plan (locality-enforcement and migration sections).
 * The dedicated ADR is authored at WS8.6 of that plan; until then the
 * plan body is the canonical source.
 *
 * 1. Legacy `SENTRY_MODE` set ⇒ hard error with the rename-replacement
 *    message. The mode-as-switch shape is gone; operators must move to
 *    `OBSERVABILITY_SINKS` + `OBSERVABILITY_FIXTURES`.
 * 2. Legacy `MCP_LOGGER_FILE_PATH` / `MCP_LOGGER_FILE_APPEND` /
 *    `MCP_LOGGER_STDOUT` set ⇒ hard error. File-sink config now lives
 *    inside the registry (D8 in the plan body).
 * 3. `'sentry'` in sinks ⇒ `SENTRY_DSN` required.
 * 4. `'file'` in sinks ⇒ `OBSERVABILITY_FILE_PATH` required.
 * 5. `VERCEL_ENV === 'production'` AND sinks empty ⇒ hard error
 *    (production must include a remote sink; ADR-162 §The
 *    Vendor-Independence Clause and the plan's locality-enforcement
 *    rule).
 *
 * The preview-with-empty-sinks warning is NOT emitted via `addIssue`
 * — warnings will be surfaced through the `warnings` channel on
 * `resolveEnv`'s success Result (plan body §D10 +
 * `@oaknational/env-resolution`'s `EnvWarning` discriminated union;
 * channel carrier reserved in WS1, populated in WS3).
 *
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */
export const ObservabilityEnvSchema = ObservabilityEnvBaseSchema.superRefine((data, ctx) => {
  refineLegacySentryMode(data, ctx);
  refineLegacyLoggerKeys(data, ctx);
  refineSinkConditionalRequirements(data, ctx);
  refineProductionLocality(data, ctx);
});

/**
 * Pre-validation input shape for {@link ObservabilityEnvSchema}.
 *
 * @remarks Reflects the raw env-var surface: every field is a string or
 * undefined. Use this when assembling input from `process.env` or similar
 * string-keyed sources before validation.
 */
export type ObservabilityEnvInput = z.input<typeof ObservabilityEnvSchema>;

/**
 * Post-validation output shape for {@link ObservabilityEnvSchema}.
 *
 * @remarks `OBSERVABILITY_SINKS` is a typed readonly array of sink kinds;
 * `OBSERVABILITY_FIXTURES` is a boolean. Downstream consumers (sentry-node,
 * app composition roots) bind to this output type.
 */
export type ObservabilityEnv = z.output<typeof ObservabilityEnvSchema>;
