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
export {
  DIAGNOSTIC_SINK_KINDS,
  OBSERVABILITY_SINK_DEFINITIONS,
  OBSERVABILITY_SINK_KINDS,
  type DiagnosticSinkKind,
  type ObservabilitySink,
  type ObservabilitySinkKind,
  type ServerInstrumenter,
  type SinkRegistry,
} from './sink-registry.js';
export {
  createOffProductAnalyticsRuntime,
  type McpTransportObserver,
  type OffProductAnalyticsRuntime,
  type ProductAnalyticsCaptureContext,
  type ProductAnalyticsCloseError,
  type ProductAnalyticsEvent,
  type ProductAnalyticsRuntime,
  type ProductAnalyticsSink,
} from './product-analytics.js';
