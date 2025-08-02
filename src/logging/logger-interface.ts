/**
 * @fileoverview Zero-dependency Logger interface for oak-mcp-core
 * @module @oak-mcp-core/logging
 *
 * This interface will be extracted to oak-mcp-core.
 * MUST remain free of any external dependencies.
 */

import type { LogLevel, LogContext, LogTransport, LogFormatter } from './types/index.js';

// Re-export shared types
export type { LogLevel, LogContext, LogTransport, LogFormatter };
export { LOG_LEVELS, isLogLevel, getLogLevelName } from './types/index.js';

/**
 * Core logger interface - zero dependencies
 * All implementations must follow this contract
 */
export interface Logger {
  /**
   * Log a trace-level message
   */
  trace(message: string, context?: LogContext): void;

  /**
   * Log a debug-level message
   */
  debug(message: string, context?: LogContext): void;

  /**
   * Log an info-level message
   */
  info(message: string, context?: LogContext): void;

  /**
   * Log a warning-level message
   */
  warn(message: string, context?: LogContext): void;

  /**
   * Log an error-level message with optional error object
   */
  error(message: string, error?: unknown, context?: LogContext): void;

  /**
   * Log a fatal-level message with optional error object
   */
  fatal(message: string, error?: unknown, context?: LogContext): void;

  /**
   * Create a child logger with additional context
   * Child logger inherits parent configuration
   */
  child(context: LogContext): Logger;

  /**
   * Check if a log level is enabled
   * Useful for avoiding expensive log message construction
   */
  isLevelEnabled(level: LogLevel): boolean;

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void;

  /**
   * Get the current minimum log level
   */
  getLevel(): LogLevel;
}

/**
 * Configuration for logger creation
 * Used by logger factories
 */
export interface LoggerConfig {
  /**
   * Logger name/category
   */
  name?: string;

  /**
   * Minimum log level
   */
  level?: LogLevel;

  /**
   * Log transports
   */
  transports?: LogTransport[];

  /**
   * Default context
   */
  context?: LogContext;
}

/**
 * Factory interface for creating loggers
 * Allows different implementations
 */
export interface LoggerFactory {
  /**
   * Create a new logger instance
   */
  create(config: LoggerConfig): Logger;
}
