import { buildNormalizedError, type LogContext, type NormalizedError } from '@oaknational/logger';
import type { ObservabilityCloseError, ObservabilityFlushError } from '@oaknational/observability';
import { redactJsonObject, redactText } from './runtime-telemetry.js';
import type { SentryCloseError, SentryFlushError } from './types.js';

export function redactLogContext(context: LogContext | undefined): LogContext | undefined {
  return context ? redactJsonObject(context) : undefined;
}

export function redactNormalizedError(error: NormalizedError): NormalizedError {
  return buildNormalizedError({
    name: redactText(error.name),
    message: redactText(error.message),
    stack: error.stack ? redactText(error.stack) : undefined,
    cause: error.cause ? redactNormalizedError(error.cause) : undefined,
    metadata: redactLogContext(error.metadata),
  });
}

export function toNativeError(error: NormalizedError): Error {
  const native = new Error(
    error.message,
    error.cause ? { cause: toNativeError(error.cause) } : undefined,
  );

  native.name = error.name;

  if (error.stack) {
    native.stack = error.stack;
  }

  return native;
}

/**
 * Map a Sentry-specific flush error to a provider-neutral equivalent.
 *
 * @remarks Lives in the adapter library because it knows both sides
 * of the boundary: `SentryFlushError` (adapter) and
 * `ObservabilityFlushError` (core). Consumers import this mapper
 * rather than duplicating the switch in each app.
 */
export function mapFlushError(error: SentryFlushError): ObservabilityFlushError {
  switch (error.kind) {
    case 'sentry_flush_timeout':
      return { kind: 'observability_flush_timeout', timeoutMs: error.timeoutMs };
    case 'sentry_flush_failed':
      return { kind: 'observability_flush_failed', message: error.message };
  }
  const exhaustive: never = error;
  throw new Error(`Unhandled flush error kind: ${String(exhaustive)}`);
}

/**
 * Map a Sentry-specific close error to a provider-neutral equivalent.
 *
 * @remarks Lives in the adapter library because it knows both sides
 * of the boundary: `SentryCloseError` (adapter) and
 * `ObservabilityCloseError` (core). Consumers import this mapper
 * rather than duplicating the switch in each app.
 */
export function mapCloseError(error: SentryCloseError): ObservabilityCloseError {
  switch (error.kind) {
    case 'sentry_close_timeout':
      return { kind: 'observability_close_timeout', timeoutMs: error.timeoutMs };
    case 'sentry_close_failed':
      return { kind: 'observability_close_failed', message: error.message };
  }
  const exhaustive: never = error;
  throw new Error(`Unhandled close error kind: ${String(exhaustive)}`);
}
