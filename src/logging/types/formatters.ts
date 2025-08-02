/**
 * @fileoverview Shared formatter interfaces for logging system
 * @module @oak-mcp-core/logging
 *
 * Core abstractions for log formatting
 */

import type { LogLevel } from './levels.js';
import type { LogContext } from './transports.js';

/**
 * Log formatter interface
 * Transforms log data into string output
 */
export interface LogFormatter {
  format(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
    timestamp?: Date,
  ): string;
}

/**
 * Options for formatter creation
 */
export interface FormatterOptions {
  includeTimestamp?: boolean;
  includeStackTrace?: boolean;
  colorize?: boolean;
}
