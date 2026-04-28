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
export { isJsonValue, sanitiseForJson, sanitiseObject } from './json-sanitisation.js';
export {
  redactJsonObject,
  redactStringRecord,
  redactText,
  redactUnknownValue,
} from './primitives.js';
export type {
  ActiveSpanContextSnapshot,
  JsonObject,
  JsonValue,
  ObservabilityCloseError,
  ObservabilityContextPayload,
  ObservabilityFlushError,
  ObservabilityPrimitiveValue,
  ObservabilityUser,
  SpanAttributes,
  SpanAttributeValue,
} from './types.js';
