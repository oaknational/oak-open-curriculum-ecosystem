/**
 * @fileoverview Shared transport interfaces for logging system
 * @module @oak-mcp-core/logging
 *
 * Core abstractions for log transports
 */

import type { LogLevel } from './levels.js';
import type { LogFormatter } from './formatters.js';

/**
 * Context object for structured logging
 */
export type LogContext = Record<string, unknown>;

/**
 * Core transport interface
 * All transports must implement this contract
 */
export interface LogTransport {
  log(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): void | Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Console-specific options
 */
export interface ConsoleTransportOptions {
  /**
   * Console instance to use (defaults to global console)
   */
  console?: Console;

  /**
   * Include timestamp in output
   */
  includeTimestamp?: boolean;

  /**
   * Colorize output (auto-detected from TTY by default)
   */
  colorize?: boolean;

  /**
   * Force color output regardless of TTY
   */
  forceColor?: boolean;

  /**
   * Disable color output regardless of TTY
   */
  noColor?: boolean;

  /**
   * Custom prefix for all log messages
   */
  prefix?: string;
}

/**
 * File writer abstraction for dependency injection
 */
export interface FileWriter {
  write(data: string): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
}

/**
 * File-specific options
 */
export interface FileTransportOptions {
  /**
   * File writer implementation
   */
  writer: FileWriter;

  /**
   * Custom formatter for log entries
   */
  formatter?: LogFormatter;

  /**
   * Buffer size (0 = no buffering)
   */
  bufferSize?: number;

  /**
   * Include timestamp in output
   */
  includeTimestamp?: boolean;

  /**
   * Include stack traces for errors
   */
  includeStackTrace?: boolean;
}
