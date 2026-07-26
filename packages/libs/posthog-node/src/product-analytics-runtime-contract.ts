/**
 * Closed configuration for the PostHog product-analytics adapter.
 *
 * @packageDocumentation
 */

import type { ResolvedRelease } from '@oaknational/build-metadata';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';

/**
 * Required EU ingestion endpoint for the Oak PostHog runtime.
 *
 * @remarks
 * Keeping the host as an exact literal prevents callers from selecting a
 * different data region through this adapter's public configuration.
 */
export const POSTHOG_EU_INGESTION_HOST = 'https://eu.i.posthog.com' as const;

/**
 * Fixed, content-free operational signals emitted by the adapter.
 *
 * @remarks
 * These values classify a failure without carrying the actor principal,
 * event content, vendor response, credentials, or exception details.
 */
export type PostHogOperationalErrorKind =
  | 'posthog_client_delivery_failed'
  | 'posthog_identity_projection_failed'
  | 'posthog_event_policy_failed';

/**
 * Serverless lifecycle hook that extends request lifetime for bounded delivery.
 *
 * @param promise - Adapter-owned flush work to register with the hosting
 * platform. The callback must not inspect or transform its result.
 * @returns Nothing; the hosting platform owns the registered promise lifetime.
 */
export type PostHogWaitUntil = (promise: Promise<unknown>) => void;

/**
 * Already-validated, ambient-free inputs for one PostHog runtime.
 *
 * @remarks
 * The factory snapshots these values before constructing the client. The
 * verified principal remains outside this object: request handling supplies it
 * to the active projector only at the synchronous identity boundary.
 */
export interface PostHogProductAnalyticsConfig {
  /** Project-scoped ingestion key supplied by the composition root. */
  readonly projectApiKey: string;
  /** Exact EU ingestion host; no caller-selected endpoint is accepted. */
  readonly host: typeof POSTHOG_EU_INGESTION_HOST;
  /** Authoritative server version added to every accepted event. */
  readonly serverVersion: string;
  /** Canonical environment and release resolved once during bootstrap. */
  readonly release: ResolvedRelease;
  /** Closed projector for a verified actor; raw principals are never event properties. */
  readonly activeActorProjector: ActivePostHogActorProjector;
  /** Canonical live tool registration names used to close vendor event labels. */
  readonly toolNames: readonly string[];
  /** Canonical live resource registration names used to close Oak event labels. */
  readonly resourceNames: readonly string[];
  /** Hosting hook that owns bounded post-response delivery work. */
  readonly waitUntil: PostHogWaitUntil;
  /** Content-free operational observer whose throws are isolated by the adapter. */
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}
