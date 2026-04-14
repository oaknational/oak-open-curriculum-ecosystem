/**
 * Shared types for provider-neutral observability helpers.
 */

// ---------------------------------------------------------------------------
// Enrichment types — provider-neutral contracts for scope enrichment
// ---------------------------------------------------------------------------

/**
 * Provider-neutral user identity for observability scope enrichment.
 *
 * @remarks Maps to adapter-specific user types (e.g. `SentryUser`) inside
 * the observability factory. App-layer callers import this type, never the
 * adapter type. This boundary means a future provider change touches only
 * the factory, not callers.
 *
 * Constrained to `id` (required) and optional `username`. No PII fields
 * (email, IP) — mirrors the `sendDefaultPii: false` policy.
 */
export interface ObservabilityUser {
  readonly id: string;
  readonly username?: string;
}

/**
 * Primitive value types safe for structured context payloads.
 *
 * @remarks Kept narrow to prevent accidental object nesting in
 * provider-specific serialisation.
 */
export type ObservabilityPrimitiveValue = string | number | boolean | undefined;

/**
 * Structured context payload for observability scope enrichment.
 *
 * @remarks Maps to adapter-specific context types (e.g. `SentryContextPayload`)
 * inside the factory. Open-keyed but value-narrowed.
 */
export type ObservabilityContextPayload = Readonly<Record<string, ObservabilityPrimitiveValue>>;

// ---------------------------------------------------------------------------
// Lifecycle error types — provider-neutral flush/close results
// ---------------------------------------------------------------------------

/**
 * Error from a provider-neutral flush operation failing to drain events.
 *
 * @remarks Mirrors the shape of adapter-specific flush errors
 * (e.g. `SentryFlushError`) but uses provider-neutral kind literals.
 * App-layer code imports this, not the adapter error type.
 */
export type ObservabilityFlushError =
  | { readonly kind: 'observability_flush_timeout'; readonly timeoutMs: number }
  | { readonly kind: 'observability_flush_failed'; readonly message: string };

/**
 * Error from a provider-neutral close operation failing to drain and disable.
 *
 * @remarks Mirrors the shape of adapter-specific close errors
 * (e.g. `SentryCloseError`) but uses provider-neutral kind literals.
 * `close()` both drains pending events AND disables the SDK — the
 * correct semantic when the process is about to exit.
 */
export type ObservabilityCloseError =
  | { readonly kind: 'observability_close_timeout'; readonly timeoutMs: number }
  | { readonly kind: 'observability_close_failed'; readonly message: string };

// ---------------------------------------------------------------------------
// Telemetry types — redaction and span primitives
// ---------------------------------------------------------------------------

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
