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
 * Logger interface for consistent logging across the application
 */

/**
 * Message for the logger. ALL messages must be strings.
 */
type Message = string;
/**
 * Context for the logger. This is for configuring the logger, not for logging.
 */
type Context = unknown;
/**
 * Error for the logger. This is for logging errors.
 */
type Error = unknown;

export interface Logger {
  trace(message: Message, context?: Context): void;
  debug(message: Message, context?: Context): void;
  info(message: Message, context?: Context): void;
  warn(message: Message, context?: Context): void;
  error(message: Message, error?: Error, context?: Context): void;
  fatal(message: Message, error?: Error, context?: Context): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: JsonObject): Logger;
}

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: JsonObject;
}
