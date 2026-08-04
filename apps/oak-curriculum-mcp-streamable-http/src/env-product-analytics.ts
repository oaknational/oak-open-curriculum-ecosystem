import { z } from 'zod';
import { OBSERVABILITY_SINKS_SCHEMA } from '@oaknational/env';
import type { PostHogProductAnalyticsConfig } from '@oaknational/posthog-node';

/**
 * The EU ingestion host, typed against the adapter's own contract.
 *
 * @remarks
 * The type annotation is the adapter's literal host type, so a region
 * divergence is a compile error, and the type-only import erases at
 * runtime — this module itself adds no vendor module edge. Since the
 * MCP-241 composition, the adapter's VALUE import lives statically at
 * the composition root (`compose-product-analytics-runtime.ts`): the
 * repo's `no-dynamic-import` backbone forecloses a lazy gate, and no
 * plan or ADR clause requires vendor-free off-mode module load — off
 * mode's contract is no config read and no client, which composition
 * preserves. This module is still the app's single site naming the
 * adapter for this value; the env schema and the bootstrap resolver
 * both read it from here.
 */
export const POSTHOG_EU_INGESTION_HOST: PostHogProductAnalyticsConfig['host'] =
  'https://eu.i.posthog.com';

/**
 * `OBSERVABILITY_SINKS` accepted in either its raw env-var form (a JSON
 * array string) or its already-parsed form (a typed readonly array).
 *
 * @remarks
 * The runtime-config pipeline validates twice by design — once inside
 * `resolveEnv` and once at the `createRuntimeConfigFromValidatedEnv`
 * seam — so the schema must be idempotent: parsing its own output yields
 * the same value rather than failing on a non-string. An already-parsed
 * array re-enters the SHARED schema via its JSON form so a malformed
 * string always gets the shared schema's operator-facing message (never
 * a flattened union "Invalid input"), and the final freeze gives every
 * caller the same immutable value shape on both paths.
 */
const ObservabilitySinksSchema = z
  .preprocess(
    (value) => (Array.isArray(value) ? JSON.stringify(value) : value),
    OBSERVABILITY_SINKS_SCHEMA,
  )
  .transform((sinks) => Object.freeze([...sinks]));

/**
 * PostHog deployment inputs for the app env schema.
 *
 * @remarks
 * Declared as plain optional strings so off-mode deployments carrying
 * stale values still start; every requirement and shape rule is
 * conditional on the `posthog` selection (see
 * {@link refineProductAnalyticsEnv}), and the deep keyring parse belongs
 * to `resolveProductAnalyticsConfig` at the composition root. These
 * values are stripped from the handler-facing runtime config.
 * `POSTHOG_CAPTURE_MODE` is never consumed: when `posthog` is selected,
 * any non-empty value fails startup (a deployment-supplied value would
 * silently change the reviewed transport); off mode ignores it, and the
 * strip removes it from the handler-facing config in every mode.
 */
export const productAnalyticsEnvFields = {
  OBSERVABILITY_SINKS: ObservabilitySinksSchema,
  POSTHOG_PROJECT_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),
  POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: z.string().optional(),
  POSTHOG_PSEUDONYM_KEYRING: z.string().optional(),
  POSTHOG_CAPTURE_MODE: z.string().optional(),
};

interface ProductAnalyticsRefinementData {
  readonly OBSERVABILITY_SINKS: readonly string[];
  readonly POSTHOG_PROJECT_API_KEY?: string;
  readonly POSTHOG_HOST?: string;
  readonly POSTHOG_PSEUDONYM_ACTIVE_KEY_ID?: string;
  readonly POSTHOG_PSEUDONYM_KEYRING?: string;
  readonly POSTHOG_CAPTURE_MODE?: string;
  readonly DANGEROUSLY_DISABLE_AUTH?: string;
  readonly SENTRY_MODE?: string;
  readonly SENTRY_DSN?: string;
}

function refineSelectedPostHogFields(
  data: ProductAnalyticsRefinementData,
  ctx: z.RefinementCtx,
): void {
  if (!data.POSTHOG_PROJECT_API_KEY) {
    ctx.addIssue({
      code: 'custom',
      path: ['POSTHOG_PROJECT_API_KEY'],
      message: 'POSTHOG_PROJECT_API_KEY is required when posthog is selected',
    });
  }

  if (data.POSTHOG_HOST !== POSTHOG_EU_INGESTION_HOST) {
    ctx.addIssue({
      code: 'custom',
      path: ['POSTHOG_HOST'],
      message: `POSTHOG_HOST must be exactly ${POSTHOG_EU_INGESTION_HOST} when posthog is selected`,
    });
  }

  if (!data.POSTHOG_PSEUDONYM_ACTIVE_KEY_ID) {
    ctx.addIssue({
      code: 'custom',
      path: ['POSTHOG_PSEUDONYM_ACTIVE_KEY_ID'],
      message: 'POSTHOG_PSEUDONYM_ACTIVE_KEY_ID is required when posthog is selected',
    });
  }

  if (!data.POSTHOG_PSEUDONYM_KEYRING) {
    ctx.addIssue({
      code: 'custom',
      path: ['POSTHOG_PSEUDONYM_KEYRING'],
      message: 'POSTHOG_PSEUDONYM_KEYRING is required when posthog is selected',
    });
  }
}

/**
 * Conditional PostHog rules for the app env schema's `superRefine`.
 *
 * @remarks
 * Off mode reads no PostHog variable: when `posthog` is absent from the
 * selection this returns before touching any of them, so deselecting
 * analytics never takes the service down over leftover values — including
 * a cleared-but-present `POSTHOG_CAPTURE_MODE`.
 *
 * When `posthog` IS selected, Sentry must be actively delivering (owner
 * ruling 2026-07-29, strengthened 2026-08-04 via MCP-356): the `sentry`
 * sink selected, `SENTRY_MODE=sentry` (not the default `off`, which boots
 * the sink dark), and `SENTRY_DSN` set — in every environment.
 *
 * @returns `true` when a fatal issue was added and the caller should stop
 * refining; `false` when refinement may continue.
 */
export function refineProductAnalyticsEnv(
  data: ProductAnalyticsRefinementData,
  ctx: z.RefinementCtx,
): boolean {
  if (!data.OBSERVABILITY_SINKS.includes('posthog')) {
    return false;
  }

  // Oak does not set the vendor capture mode; a deployment-supplied value
  // would silently change the reviewed transport. Empty string reads as
  // absent, matching every other presence check here.
  if (data.POSTHOG_CAPTURE_MODE) {
    ctx.addIssue({
      code: 'custom',
      path: ['POSTHOG_CAPTURE_MODE'],
      message:
        'POSTHOG_CAPTURE_MODE must not be set. The capture transport is fixed ' +
        'by the reviewed adapter configuration, not deployment environment.',
    });
    return true;
  }

  // Selecting PostHog while authentication is disabled is an invalid live
  // configuration: analytics identity derives from verified principals.
  if (data.DANGEROUSLY_DISABLE_AUTH === 'true') {
    ctx.addIssue({
      code: 'custom',
      path: ['OBSERVABILITY_SINKS'],
      message:
        'posthog cannot be selected while DANGEROUSLY_DISABLE_AUTH is true. ' +
        'Product analytics requires verified authentication.',
    });
    return true;
  }

  if (refineSentryLiveForPostHog(data, ctx)) {
    return true;
  }

  refineSelectedPostHogFields(data, ctx);
  return false;
}

/**
 * Requires Sentry to be ACTIVELY delivering whenever posthog is selected —
 * the `sentry` sink chosen, `SENTRY_MODE=sentry`, and `SENTRY_DSN` set.
 *
 * @remarks
 * Owner ruling 2026-07-29, strengthened by owner decision 2026-08-04
 * (MCP-356). In this app `"sentry"` in `OBSERVABILITY_SINKS` is only a
 * selection marker; `SENTRY_MODE` gates real delivery (its default `off`
 * boots the sink dark — the "false Sentry marker"), and `SENTRY_DSN` is
 * where Sentry delivers. All three are required together, in every
 * environment. This strictly supersedes the earlier production-only "any
 * diagnostic sink" rule. Every missing piece is reported so the operator
 * sees the whole gap at once.
 *
 * @returns `true` when Sentry is not live (one or more issues were added).
 */
function refineSentryLiveForPostHog(
  data: ProductAnalyticsRefinementData,
  ctx: z.RefinementCtx,
): boolean {
  let sentryNotLive = false;
  if (!data.OBSERVABILITY_SINKS.includes('sentry')) {
    ctx.addIssue({
      code: 'custom',
      path: ['OBSERVABILITY_SINKS'],
      message:
        'OBSERVABILITY_SINKS includes "posthog" but not "sentry". Sentry ' +
        'must be selected alongside PostHog in every environment (owner ' +
        'ruling 2026-07-29: Sentry-as-a-sink is non-negotiable; MCP-361). ' +
        'Add "sentry" to OBSERVABILITY_SINKS.',
    });
    sentryNotLive = true;
  }
  if (data.SENTRY_MODE !== 'sentry') {
    ctx.addIssue({
      code: 'custom',
      path: ['SENTRY_MODE'],
      message:
        'SENTRY_MODE must be "sentry" when posthog is selected. A selected ' +
        '"sentry" sink with SENTRY_MODE=off (the default) boots dark — a ' +
        'false marker — so product analytics would ship without the ' +
        'non-negotiable Sentry diagnostics (owner ruling 2026-07-29; ' +
        'MCP-361). Set SENTRY_MODE=sentry with SENTRY_DSN.',
    });
    sentryNotLive = true;
  }
  if (!data.SENTRY_DSN) {
    ctx.addIssue({
      code: 'custom',
      path: ['SENTRY_DSN'],
      message:
        'SENTRY_DSN is required when posthog is selected: Sentry must be ' +
        'actively delivering, not merely selected (owner ruling 2026-07-29; ' +
        'MCP-361). Set SENTRY_DSN.',
    });
    sentryNotLive = true;
  }
  return sentryNotLive;
}
