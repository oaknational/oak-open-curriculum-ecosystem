/**
 * OpenTelemetry log record formatting
 *
 * This module provides functions to format log records according to the
 * OpenTelemetry Logs Data Model specification.
 *
 * @see https://opentelemetry.io/docs/specs/otel/logs/data-model/
 */

import { createHash } from 'crypto';
import type { LogLevel } from './log-levels';
import type { JsonObject } from './types';

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
 * Resource attributes for service identification
 */
export interface ResourceAttributes {
  'service.name': string;
  'service.version': string;
  'deployment.environment': string;
  'host.name'?: string;
  'host.id'?: string;
  'cloud.provider'?: string;
  'cloud.region'?: string;
}

/**
 * OpenTelemetry log record structure
 * @see https://opentelemetry.io/docs/specs/otel/logs/data-model/
 */
export interface OtelLogRecord {
  /** Timestamp when the event occurred (ISO 8601) */
  Timestamp: string;
  /** Timestamp when the event was observed by the logger (ISO 8601) */
  ObservedTimestamp: string;
  /** Severity number (1-24) */
  SeverityNumber: number;
  /** Severity text (DEBUG, INFO, WARN, ERROR, FATAL) */
  SeverityText: string;
  /** Log message */
  Body: string;
  /** Context attributes */
  Attributes: JsonObject;
  /** Resource identification attributes */
  Resource: ResourceAttributes;
  /** W3C Trace ID (32-character hex string) */
  TraceId?: string;
  /** W3C Span ID (16-character hex string) */
  SpanId?: string;
  /** W3C Trace flags */
  TraceFlags?: number;
}

/**
 * Options for formatting an OpenTelemetry log record
 */
export interface FormatOtelLogRecordOptions {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Optional error object */
  error?: Error;
  /** Context data */
  context: JsonObject;
  /** Resource attributes */
  resourceAttributes: ResourceAttributes;
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
function extractErrorAttributes(error: Error): JsonObject {
  return {
    'exception.type': error.name,
    'exception.message': error.message,
    'exception.stacktrace': error.stack ?? '',
  };
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
  const { level, message, error, context, resourceAttributes } = options;

  const now = new Date();
  const timestamp = now.toISOString();

  // Build attributes by combining context with error info if present
  const attributes: JsonObject = { ...context };
  if (error !== undefined) {
    const errorAttrs = extractErrorAttributes(error);
    Object.assign(attributes, errorAttrs);
  }

  // Extract correlationId if present
  const correlationId =
    typeof context.correlationId === 'string' ? context.correlationId : undefined;

  // Build base record
  const record: OtelLogRecord = {
    Timestamp: timestamp,
    ObservedTimestamp: timestamp,
    SeverityNumber: logLevelToSeverityNumber(level),
    SeverityText: logLevelToSeverityText(level),
    Body: message,
    Attributes: attributes,
    Resource: resourceAttributes,
  };

  // Add TraceId if we have a correlation ID
  if (correlationId !== undefined) {
    const traceId = correlationIdToTraceId(correlationId);
    if (traceId !== undefined) {
      record.TraceId = traceId;
    }
  }

  return record;
}
