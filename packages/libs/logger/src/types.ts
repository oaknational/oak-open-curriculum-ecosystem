/**
 * Shared types and utilities for the logger module
 */

import type { LogLevel } from './log-levels';

export type { LogLevel };

/**
 * JSON object type for logger context
 */
export interface JsonObject {
  readonly [key: string]: JsonValue;
}

/**
 * JSON value type for logger context
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[]
  | readonly JsonValue[];

/**
 * Structured context data for log entries.
 * All values must be JSON-serialisable.
 *
 * Use this type when you want compile-time type safety for log context.
 * The Logger interface accepts `unknown` for flexibility, but using
 * `LogContext` ensures your context is properly structured.
 */
export type LogContext = JsonObject;

/**
 * Logger interface for consistent logging across the application.
 *
 * Context parameters accept `unknown` for flexibility - the implementation
 * sanitises all values to JSON-safe format. For type-safe contexts, use
 * the exported `LogContext` type.
 */

/**
 * Message for the logger. ALL messages must be strings.
 */
type Message = string;

export interface Logger {
  trace(message: Message, context?: unknown): void;
  debug(message: Message, context?: unknown): void;
  info(message: Message, context?: unknown): void;
  warn(message: Message, context?: unknown): void;
  error(message: Message, error?: unknown, context?: unknown): void;
  fatal(message: Message, error?: unknown, context?: unknown): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: LogContext): Logger;
}

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: JsonObject;
}
