/**
 * `@oaknational/observability`
 *
 * Provider-neutral helpers shared by logging, tracing, and future telemetry
 * adapters.
 */

export {
  REDACTED_VALUE,
  redactHeaderRecord,
  redactHeaderValue,
  redactTelemetryObject,
  redactTelemetryValue,
} from './redaction.js';
export {
  getActiveSpanContextSnapshot,
  withActiveSpan,
  type WithActiveSpanOptions,
} from './span-context.js';
export type {
  ActiveSpanContextSnapshot,
  SpanAttributes,
  SpanAttributeValue,
  TelemetryScalar,
  TelemetryValue,
} from './types.js';
