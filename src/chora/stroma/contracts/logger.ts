/**
 * @fileoverview Logger contract - cell membrane for logging system
 * @module substrate/contracts/logger
 *
 * This interface defines the boundary for all logging interactions.
 * It controls what can enter and exit the logging system.
 * Zero dependencies - pure contract.
 */

import type { LogLevel } from '../types/logging.js';

/**
 * Logger interface - the cell membrane for logging
 * All logging implementations must honor this contract
 */
export interface Logger {
  /**
   * Log a trace-level message
   * @param message - The message to log
   * @param context - Optional context data
   */
  trace(message: string, context?: unknown): void;

  /**
   * Log a debug-level message
   * @param message - The message to log
   * @param context - Optional context data
   */
  debug(message: string, context?: unknown): void;

  /**
   * Log an info-level message
   * @param message - The message to log
   * @param context - Optional context data
   */
  info(message: string, context?: unknown): void;

  /**
   * Log a warning-level message
   * @param message - The message to log
   * @param context - Optional context data
   */
  warn(message: string, context?: unknown): void;

  /**
   * Log an error-level message
   * @param message - The message to log
   * @param error - Optional error object
   * @param context - Optional context data
   */
  error(message: string, error?: unknown, context?: unknown): void;

  /**
   * Log a fatal-level message
   * @param message - The message to log
   * @param error - Optional error object
   * @param context - Optional context data
   */
  fatal(message: string, error?: unknown, context?: unknown): void;

  /**
   * Check if a log level is enabled
   * @param level - The log level to check
   * @returns True if the level is enabled
   */
  isLevelEnabled?(level: LogLevel): boolean;

  /**
   * Create a child logger with additional context
   * @param context - Context to add to all log messages
   * @returns A new logger instance
   */
  child?(context: Record<string, unknown>): Logger;
}
