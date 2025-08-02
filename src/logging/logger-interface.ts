/**
 * @fileoverview Zero-dependency Logger interface for oak-mcp-core
 * @module @oak-mcp-core/logging
 *
 * This interface will be extracted to oak-mcp-core.
 * MUST remain free of any external dependencies.
 */

/**
 * Log levels in ascending order of severity
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50,
}

/**
 * Context object for structured logging
 * Allows arbitrary key-value pairs for maximum flexibility
 */
export type LogContext = Record<string, unknown>;

/**
 * Core logger interface - zero dependencies
 * All implementations must follow this contract
 */
export interface Logger {
  /**
   * Log a trace-level message (most verbose)
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
 * Transport interface for log output
 * Implementations handle actual log delivery
 */
export interface LogTransport {
  /**
   * Deliver a log entry
   * Must not throw - handle errors internally
   */
  log(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): void | Promise<void>;

  /**
   * Flush any buffered logs
   * Called on shutdown or when needed
   */
  flush?(): Promise<void>;

  /**
   * Close the transport and release resources
   */
  close?(): Promise<void>;
}

/**
 * Formatter interface for log serialization
 * Converts log data to string for output
 */
export interface LogFormatter {
  /**
   * Format a log entry
   * Pure function - no side effects
   */
  format(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
    timestamp?: Date,
  ): string;
}

/**
 * Configuration for logger creation
 * Used by logger factories
 */
export interface LoggerConfig {
  /**
   * Minimum log level to output
   */
  level?: LogLevel;

  /**
   * Optional context to include in all logs
   */
  defaultContext?: LogContext;

  /**
   * Transports for log output
   * Multiple transports can be used simultaneously
   */
  transports?: LogTransport[];

  /**
   * Formatter for log serialization
   * If not provided, transport decides format
   */
  formatter?: LogFormatter;
}
