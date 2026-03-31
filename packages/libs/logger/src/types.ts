/**
 * Shared types and utilities for the logger module.
 */

import type { LogLevel } from './log-levels.js';
import type { OtelLogRecord } from './otel-format.js';

export type { LogLevel };

/**
 * JSON object type for logger payloads.
 */
export interface JsonObject {
  readonly [key: string]: JsonValue;
}

/**
 * JSON-safe value used in structured logger payloads.
 */
export type JsonValue = string | number | boolean | null | JsonObject | readonly JsonValue[];

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
