/**
 * Shared types for provider-neutral observability helpers.
 */

/**
 * Primitive telemetry value that remains JSON-safe after redaction.
 */
export type TelemetryScalar = string | number | boolean | null;

/**
 * Recursive JSON-safe telemetry value used after redaction.
 */
export interface TelemetryRecord {
  readonly [key: string]: TelemetryValue;
}

/**
 * Recursive JSON-safe telemetry value used after redaction.
 */
export type TelemetryValue = TelemetryScalar | readonly TelemetryValue[] | TelemetryRecord;

/**
 * Attribute values accepted by OpenTelemetry span helpers.
 */
export type SpanAttributeValue = string | number | boolean;

/**
 * Span attribute bag accepted by provider-neutral tracing helpers.
 */
export type SpanAttributes = Readonly<Record<string, SpanAttributeValue>>;

/**
 * Snapshot of the currently-active span context.
 */
export interface ActiveSpanContextSnapshot {
  readonly traceId: string;
  readonly spanId: string;
  readonly traceFlags: number;
}
