/**
 * Shared types and utilities for the logger module.
 */

import type { JsonObject, JsonValue } from '@oaknational/observability';
import type { LogLevel } from './log-levels.js';

export type { LogLevel };

/**
 * Resource attributes for service identification.
 *
 * @remarks Defined here (rather than in `otel-format.ts`) to break the
 * circular dependency between `types.ts` and `otel-format.ts`.
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
 * OpenTelemetry log record structure.
 *
 * @see https://opentelemetry.io/docs/specs/otel/logs/data-model/
 * @remarks Defined here (rather than in `otel-format.ts`) to break the
 * circular dependency between `types.ts` and `otel-format.ts`.
 */
export interface OtelLogRecord {
  /** Timestamp when the event occurred (ISO 8601) */
  readonly Timestamp: string;
  /** Timestamp when the event was observed by the logger (ISO 8601) */
  readonly ObservedTimestamp: string;
  /** Severity number (1-24) */
  readonly SeverityNumber: number;
  /** Severity text (DEBUG, INFO, WARN, ERROR, FATAL) */
  readonly SeverityText: string;
  /** Log message */
  readonly Body: string;
  /** Context attributes */
  readonly Attributes: LogContext;
  /** Resource identification attributes */
  readonly Resource: ResourceAttributes;
  /** W3C Trace ID (32-character hex string) */
  readonly TraceId?: string;
  /** W3C Span ID (16-character hex string) */
  readonly SpanId?: string;
  /** W3C Trace flags */
  readonly TraceFlags?: number;
}

/**
 * Internal marker attached to package-owned normalised errors.
 */
export const NORMALIZED_ERROR_MARKER = Symbol('oak.logger.normalized-error');

/**
 * Package-owned normalised error shape used by logger sinks and telemetry
 * adapters.
 */
export interface NormalizedError {
  readonly __oakNormalizedError: typeof NORMALIZED_ERROR_MARKER;
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly cause?: NormalizedError;
  readonly metadata?: LogContext;
}

/**
 * Final JSON-safe log context after sanitisation and redaction.
 */
export type LogContext = JsonObject;

/**
 * Public context object accepted by logger methods before sanitisation.
 */
export interface LogContextInput {
  readonly [key: string]: LogContextInputValue;
}

/**
 * Public context values accepted by logger methods before sanitisation.
 */
export type LogContextInputValue =
  | JsonValue
  | Date
  | bigint
  | NormalizedError
  | readonly LogContextInputValue[]
  | LogContextInput
  | undefined;

/**
 * Message for the logger. ALL messages must be strings.
 */
type Message = string;

/**
 * Immutable event object written to logger sinks.
 */
export interface LogEvent {
  readonly level: LogLevel;
  readonly message: string;
  readonly context: LogContext;
  readonly error?: NormalizedError;
  readonly otelRecord: OtelLogRecord;
  readonly line: string;
}

/**
 * Sink contract for logger fan-out destinations.
 */
export interface LogSink {
  write(event: LogEvent): void;
}

/**
 * Logger interface for consistent structured logging across the application.
 */
export interface Logger {
  trace(message: Message, context?: LogContextInput): void;
  debug(message: Message, context?: LogContextInput): void;
  info(message: Message, context?: LogContextInput): void;
  warn(message: Message, context?: LogContextInput): void;
  error(message: Message, context?: LogContextInput): void;
  error(message: Message, error: NormalizedError, context?: LogContextInput): void;
  fatal(message: Message, context?: LogContextInput): void;
  fatal(message: Message, error: NormalizedError, context?: LogContextInput): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: LogContextInput): Logger;
}

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: LogContextInput;
}
