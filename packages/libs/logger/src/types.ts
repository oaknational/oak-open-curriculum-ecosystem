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
export interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
  fatal(message: string, error?: unknown, context?: unknown): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: JsonObject): Logger;
}

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: JsonObject;
}
