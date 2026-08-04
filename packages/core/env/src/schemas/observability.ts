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
 *   mode; diagnostics (`'sentry'`, `'file'`) and product analytics
 *   (`'posthog'`) share the literal selection union without sharing a
 *   runtime capability shape.
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
import { ObservabilityEnvBaseSchema } from './observability-base.js';
import {
  refineLegacyLoggerKeys,
  refineLegacySentryMode,
  refinePosthogRequiresSentry,
  refineProductionLocality,
  refineSinkConditionalRequirements,
} from './observability-refinements.js';

export { OBSERVABILITY_FIXTURES_SCHEMA, OBSERVABILITY_SINKS_SCHEMA } from './observability-axes.js';

/**
 * Composed environment-variable contract for the orthogonal-axes
 * observability configuration.
 *
 * @remarks Six cross-field rules encoded across five helper
 * functions (`refineSinkConditionalRequirements` covers branches 3 and
 * 4 because the per-sink conditional requirements share a common
 * shape). The rules are named by the observability multi-sink +
 * fixtures shape plan (locality-enforcement and migration sections);
 * rule 6 is the MCP-361 owner ruling. The dedicated ADR is authored at
 * WS8.6 of that plan; until then the plan body is the canonical source.
 *
 * 1. Legacy `SENTRY_MODE` set ⇒ hard error with the rename-replacement
 *    message. The mode-as-switch shape is gone; operators must move to
 *    `OBSERVABILITY_SINKS` + `OBSERVABILITY_FIXTURES`.
 * 2. Legacy `MCP_LOGGER_FILE_PATH` / `MCP_LOGGER_FILE_APPEND` /
 *    `MCP_LOGGER_STDOUT` set ⇒ hard error. File-sink config now lives
 *    inside the registry (D8 in the plan body).
 * 3. `'sentry'` in sinks ⇒ `SENTRY_DSN` required.
 * 4. `'file'` in sinks ⇒ `OBSERVABILITY_FILE_PATH` required.
 * 5. `VERCEL_ENV === 'production'` AND no diagnostic sink selected ⇒
 *    hard error. PostHog alone does not satisfy diagnostic locality
 *    (ADR-162 §The Vendor-Independence Clause and ADR-218).
 * 6. `'posthog'` in sinks AND `'sentry'` not in sinks ⇒ hard error, in
 *    EVERY environment. Sentry-as-a-sink alongside PostHog is
 *    non-negotiable (owner ruling 2026-07-29; MCP-361). Composed last so
 *    that, in production, rule 5's issue precedes it on the shared
 *    `OBSERVABILITY_SINKS` path; rule 3 composes unchanged.
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
  refinePosthogRequiresSentry(data, ctx);
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
