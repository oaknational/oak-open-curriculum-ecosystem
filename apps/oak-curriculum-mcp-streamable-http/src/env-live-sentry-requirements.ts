import type { z } from 'zod';

/**
 * The Sentry-relevant subset of the app env that the live-Sentry check reads.
 *
 * @remarks Structurally satisfied by the app's `ProductAnalyticsRefinementData`.
 */
interface LiveSentryRefinementData {
  readonly OBSERVABILITY_SINKS: readonly string[];
  readonly SENTRY_MODE?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly SENTRY_ENABLE_LOGS?: string;
}

/**
 * The env preconditions for a live, log-emitting Sentry, enforced whenever
 * posthog is selected. Kept as data so the refinement reads as a checklist
 * and stays small as the list grows.
 *
 * @remarks
 * This enumerates the preconditions the runtime imposes; the single source
 * of truth for a bootable live-Sentry config is `createLiveConfig` in
 * `@oaknational/sentry-node` (it validates the DSN and traces sample rate,
 * and defaults `enableLogs`). A follow-up should delegate to that builder
 * rather than re-listing preconditions here, so validation cannot drift from
 * the real boot (post-submission; see the MCP-361 reconcile).
 */
const LIVE_SENTRY_REQUIREMENTS: readonly {
  readonly path: string;
  readonly violated: (data: LiveSentryRefinementData) => boolean;
  readonly message: string;
}[] = [
  {
    path: 'OBSERVABILITY_SINKS',
    violated: (data) => !data.OBSERVABILITY_SINKS.includes('sentry'),
    message:
      'OBSERVABILITY_SINKS includes "posthog" but not "sentry". Sentry must ' +
      'be selected alongside PostHog in every environment (owner ruling ' +
      '2026-07-29: Sentry-as-a-sink is non-negotiable; MCP-361). Add ' +
      '"sentry" to OBSERVABILITY_SINKS.',
  },
  {
    path: 'SENTRY_MODE',
    violated: (data) => data.SENTRY_MODE !== 'sentry',
    message:
      'SENTRY_MODE must be "sentry" when posthog is selected. A selected ' +
      '"sentry" sink with SENTRY_MODE=off (the default) boots dark — a false ' +
      'marker — so product analytics would ship without the non-negotiable ' +
      'Sentry diagnostics (owner ruling 2026-07-29; MCP-361). Set ' +
      'SENTRY_MODE=sentry with SENTRY_DSN.',
  },
  {
    path: 'SENTRY_DSN',
    violated: (data) => !data.SENTRY_DSN,
    message:
      'SENTRY_DSN is required when posthog is selected: Sentry must be ' +
      'actively delivering, not merely selected (owner ruling 2026-07-29; ' +
      'MCP-361). Set SENTRY_DSN.',
  },
  {
    path: 'SENTRY_TRACES_SAMPLE_RATE',
    violated: (data) => !data.SENTRY_TRACES_SAMPLE_RATE,
    message:
      'SENTRY_TRACES_SAMPLE_RATE is required when posthog is selected: live ' +
      'Sentry mode parses it at boot and rejects an absent value, so without ' +
      'it the server fails to start despite passing this schema (owner ' +
      'ruling 2026-07-29; MCP-361). Set SENTRY_TRACES_SAMPLE_RATE.',
  },
  {
    path: 'SENTRY_ENABLE_LOGS',
    violated: (data) => data.SENTRY_ENABLE_LOGS === 'false',
    message:
      'SENTRY_ENABLE_LOGS must not be "false" when posthog is selected: it ' +
      'turns the Sentry log sink off, so PostHog would ship with Sentry logs ' +
      'dark — the exact state the ruling forbids (owner ruling 2026-07-29; ' +
      'MCP-361). Remove SENTRY_ENABLE_LOGS or set it to "true".',
  },
];

/**
 * Requires Sentry to be ACTIVELY delivering and logging whenever posthog is
 * selected, enforcing every {@link LIVE_SENTRY_REQUIREMENTS} precondition.
 *
 * @remarks
 * Owner ruling 2026-07-29, strengthened by owner decision 2026-08-04
 * (MCP-356). In this app `"sentry"` in `OBSERVABILITY_SINKS` is only a
 * selection marker; `SENTRY_MODE` gates real delivery, `SENTRY_DSN` and
 * `SENTRY_TRACES_SAMPLE_RATE` are what live mode needs to boot, and
 * `SENTRY_ENABLE_LOGS=false` would silence the log sink. All are required
 * together, in every environment. This strictly supersedes the earlier
 * production-only "any diagnostic sink" rule. Every missing piece is
 * reported so the operator sees the whole gap at once.
 *
 * @returns `true` when Sentry is not live (one or more issues were added).
 */
export function refineSentryLiveForPostHog(
  data: LiveSentryRefinementData,
  ctx: z.RefinementCtx,
): boolean {
  let sentryNotLive = false;
  for (const requirement of LIVE_SENTRY_REQUIREMENTS) {
    if (requirement.violated(data)) {
      ctx.addIssue({ code: 'custom', path: [requirement.path], message: requirement.message });
      sentryNotLive = true;
    }
  }
  return sentryNotLive;
}
