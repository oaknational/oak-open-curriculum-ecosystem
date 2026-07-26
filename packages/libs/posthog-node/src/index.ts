/**
 * Privacy-bounded PostHog identity and product-analytics adapter.
 *
 * @remarks
 * The package root exposes only bootstrap configuration, actor projection, and
 * the closed runtime capability. Vendor client and instrumentation types stay
 * inside the adapter.
 *
 * @packageDocumentation
 */

export { createPostHogPseudonymCapabilities } from './actor-pseudonym.js';
export { createPostHogProductAnalyticsRuntime } from './product-analytics-runtime.js';
export { POSTHOG_EU_INGESTION_HOST } from './product-analytics-runtime-contract.js';

export type {
  ActivePostHogActorProjector,
  PostHogActorPseudonym,
  PostHogDeletionProjector,
  PostHogIdentityProjectionError,
  PostHogPseudonymCapabilities,
  PostHogPseudonymConfig,
  PostHogPseudonymConfigurationError,
  PostHogPseudonymEnvironment,
  PostHogPseudonymKey,
} from './actor-pseudonym-contract.js';
export type {
  PostHogOperationalErrorKind,
  PostHogProductAnalyticsConfig,
  PostHogWaitUntil,
} from './product-analytics-runtime-contract.js';
