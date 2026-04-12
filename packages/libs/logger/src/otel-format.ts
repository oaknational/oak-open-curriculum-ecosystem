/**
 * OpenTelemetry log record formatting
 *
 * This module provides functions to format log records according to the
 * OpenTelemetry Logs Data Model specification.
 *
 * @see https://opentelemetry.io/docs/specs/otel/logs/data-model/
 */

import { createHash } from 'crypto';
import type { ActiveSpanContextSnapshot } from '@oaknational/observability';
import type { LogLevel } from './log-levels';
import type { LogContext, NormalizedError, OtelLogRecord, ResourceAttributes } from './types';

// Re-export OtelLogRecord for API continuity (consumed by index.ts, node.ts, test-helpers)
export type { OtelLogRecord };

/**
 * OpenTelemetry severity number mapping
 * @see https://opentelemetry.io/docs/specs/otel/logs/data-model/#field-severitynumber
 */
const SEVERITY_NUMBER_MAP: Record<LogLevel, number> = {
  TRACE: 1,
  DEBUG: 5,
  INFO: 9,
  WARN: 13,
  ERROR: 17,
  FATAL: 21,
};

/**
 * Options for formatting an OpenTelemetry log record
 */
interface FormatOtelLogRecordOptions {
  /** Log level */
  readonly level: LogLevel;
  /** Log message */
  readonly message: string;
  /** Optional error object */
  readonly error?: NormalizedError;
  /** Context data */
  readonly context: LogContext;
  /** Resource attributes */
  readonly resourceAttributes: ResourceAttributes;
  /** Active span context captured by the logger composition root. */
  readonly activeSpanContext: ActiveSpanContextSnapshot | undefined;
}

/**
 * Convert a log level to OpenTelemetry severity number
 *
 * @param level - The log level
 * @returns OpenTelemetry severity number (1-24)
 */
export function logLevelToSeverityNumber(level: LogLevel): number {
  return SEVERITY_NUMBER_MAP[level];
}

/**
 * Convert a log level to OpenTelemetry severity text
 *
 * @param level - The log level
 * @returns Severity text string
 */
export function logLevelToSeverityText(level: LogLevel): string {
  return level;
}

/**
 * Convert a correlation ID to an OpenTelemetry TraceId
 *
 * Uses MD5 hash to create a consistent 32-character hex string from the correlation ID.
 *
 * @param correlationId - The correlation ID to convert
 * @returns 32-character hex TraceId, or undefined if no correlationId provided
 */
export function correlationIdToTraceId(correlationId: string | undefined): string | undefined {
  if (correlationId === undefined) {
    return undefined;
  }

  // MD5 produces 128-bit (16-byte) hash, which is 32 hex characters
  const hash = createHash('md5').update(correlationId).digest('hex');
  return hash;
}

/**
 * Extract error information for OpenTelemetry semantic conventions
 *
 * @param error - The error object
 * @returns Object with exception attributes
 */
function extractErrorAttributes(error: NormalizedError): LogContext {
  return {
    'exception.type': error.name,
    'exception.message': error.message,
    'exception.stacktrace': error.stack ?? '',
  };
}

/**
 * Resolves trace context fields for an OtelLogRecord.
 *
 * Active span context takes precedence. Falls back to correlationId-derived
 * TraceId if no active span is available.
 */
function resolveTraceFields(
  activeSpanContext: ActiveSpanContextSnapshot | undefined,
  context: LogContext,
): { readonly TraceId?: string; readonly SpanId?: string; readonly TraceFlags?: number } {
  if (activeSpanContext) {
    return {
      TraceId: activeSpanContext.traceId,
      SpanId: activeSpanContext.spanId,
      TraceFlags: activeSpanContext.traceFlags,
    };
  }

  const correlationId =
    typeof context.correlationId === 'string' ? context.correlationId : undefined;

  if (correlationId !== undefined) {
    const traceId = correlationIdToTraceId(correlationId);
    if (traceId !== undefined) {
      return { TraceId: traceId };
    }
  }

  return {};
}

/**
 * Format a log record according to OpenTelemetry Logs Data Model
 *
 * Creates a structured log record with all required OpenTelemetry fields:
 * - Timestamp and ObservedTimestamp (ISO 8601)
 * - SeverityNumber and SeverityText
 * - Body (log message)
 * - Attributes (context data + error info if present)
 * - Resource (service identification)
 * - TraceId (if correlationId present in context)
 *
 * @param options - Formatting options
 * @returns OpenTelemetry log record
 */
export function formatOtelLogRecord(options: FormatOtelLogRecordOptions): OtelLogRecord {
  const { level, message, error, context, resourceAttributes, activeSpanContext } = options;

  const now = new Date();
  const timestamp = now.toISOString();

  // Build attributes by combining context with error info if present
  const attributes: LogContext =
    error === undefined ? { ...context } : { ...context, ...extractErrorAttributes(error) };

  // Resolve trace context — active span takes precedence over correlationId
  const traceFields = resolveTraceFields(activeSpanContext, context);

  return {
    Timestamp: timestamp,
    ObservedTimestamp: timestamp,
    SeverityNumber: logLevelToSeverityNumber(level),
    SeverityText: logLevelToSeverityText(level),
    Body: message,
    Attributes: attributes,
    Resource: resourceAttributes,
    ...traceFields,
  };
}
