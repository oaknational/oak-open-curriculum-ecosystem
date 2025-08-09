/**
 * @fileoverview Logger interface - pure abstraction for logging
 * @module moria/interfaces/logger
 *
 * Zero-dependency logging contract that can be implemented by any logging system.
 * This is a pure abstraction with no implementation details.
 */

/**
 * Logger interface - defines the contract for all logging implementations
 *
 * This interface is intentionally minimal and focuses on the core logging
 * operations that any logging system must support. It avoids implementation
 * details and runtime-specific features.
 */
export interface Logger {
  /**
   * Log a trace-level message (most verbose)
   * @param message - The message to log
   * @param context - Optional structured context data
   */
  trace(message: string, context?: unknown): void;

  /**
   * Log a debug-level message
   * @param message - The message to log
   * @param context - Optional structured context data
   */
  debug(message: string, context?: unknown): void;

  /**
   * Log an info-level message
   * @param message - The message to log
   * @param context - Optional structured context data
   */
  info(message: string, context?: unknown): void;

  /**
   * Log a warning-level message
   * @param message - The message to log
   * @param context - Optional structured context data
   */
  warn(message: string, context?: unknown): void;

  /**
   * Log an error-level message
   * @param message - The message to log
   * @param error - Optional error object or error details
   * @param context - Optional structured context data
   */
  error(message: string, error?: unknown, context?: unknown): void;

  /**
   * Log a fatal-level message (most severe)
   * @param message - The message to log
   * @param error - Optional error object or error details
   * @param context - Optional structured context data
   */
  fatal(message: string, error?: unknown, context?: unknown): void;

  /**
   * Check if a specific log level is enabled
   * @param level - The numeric log level to check
   * @returns True if the level is enabled, false otherwise
   */
  isLevelEnabled?(level: number): boolean;

  /**
   * Create a child logger with additional context
   * @param context - Context to be included with all log messages from the child
   * @returns A new logger instance with the additional context
   */
  child?(context: Record<string, unknown>): Logger;
}
