/**
 * Subpath barrel: `@oaknational/curriculum-sdk-generation/observability`
 *
 * Zero-hit telemetry schemas, fixtures, and summary utilities.
 */

export {
  ZERO_HIT_SCOPES,
  ZeroHitScopeSchema,
  ZeroHitScopeBreakdownSchema,
  ZeroHitSummarySchema,
  ZeroHitEventSchema,
  ZeroHitTelemetrySchema,
  createZeroHitEvent,
  createZeroHitSummary,
  createZeroHitTelemetry,
  summariseZeroHitEvents,
} from './types/generated/observability/index.js';
export type {
  ZeroHitScope,
  ZeroHitScopeBreakdown,
  ZeroHitSummary,
  ZeroHitEvent,
  ZeroHitTelemetry,
} from './types/generated/observability/index.js';
