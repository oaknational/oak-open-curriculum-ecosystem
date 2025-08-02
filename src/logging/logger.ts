/**
 * @fileoverview Consola-based implementation of the Logger interface
 * @module @oak-mcp-core/logging
 */

import { createConsola, type ConsolaInstance } from 'consola';
import { join } from 'node:path';
import type { Logger, LogContext, LogLevel } from './logger-interface.js';
import { LOG_LEVELS } from './logger-interface.js';
import { scrubSensitiveData } from '../utils/scrubbing.js';
import { createFileReporter } from './file-reporter.js';

/**
 * Map our numeric log levels to Consola's numeric levels
 * Pure function
 */
function mapLogLevelToConsola(level: LogLevel): number {
  switch (level) {
    case LOG_LEVELS.TRACE.value:
      return 5; // Consola trace
    case LOG_LEVELS.DEBUG.value:
      return 4; // Consola debug
    case LOG_LEVELS.INFO.value:
      return 3; // Consola info
    case LOG_LEVELS.WARN.value:
      return 2; // Consola warn
    case LOG_LEVELS.ERROR.value:
      return 1; // Consola error
    case LOG_LEVELS.FATAL.value:
      return 0; // Consola fatal
    default:
      return 3; // Default to info
  }
}

/**
 * Creates a logger instance using Consola with automatic data scrubbing
 */
export function createConsoleLogger(level: LogLevel = LOG_LEVELS.INFO.value): Logger {
  const consolaLevel = mapLogLevelToConsola(level);

  // Create file reporter for persistent logging
  const logDir = join(process.cwd(), '.logs', 'oak-notion-mcp');
  const fileReporter = createFileReporter({ logDir });

  // Create a custom Consola instance
  const consola: ConsolaInstance = createConsola({
    level: consolaLevel,
    formatOptions: {
      date: true,
      colors: true,
    },
    reporters: [...createConsola().options.reporters, fileReporter],
  });

  let currentLevel = level;

  return {
    trace(message: string, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      consola.trace(message, scrubbed);
    },

    debug(message: string, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      consola.debug(message, scrubbed);
    },

    info(message: string, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      consola.info(message, scrubbed);
    },

    warn(message: string, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      consola.warn(message, scrubbed);
    },

    error(message: string, error?: unknown, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      if (error) {
        consola.error(message, error, scrubbed);
      } else {
        consola.error(message, scrubbed);
      }
    },

    fatal(message: string, error?: unknown, context?: LogContext): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      if (error) {
        consola.fatal(message, error, scrubbed);
      } else {
        consola.fatal(message, scrubbed);
      }
    },

    child(context: LogContext): Logger {
      // Consola doesn't have built-in child logger support
      // Create a new logger with merged context
      const tag = typeof context['service'] === 'string' ? context['service'] : 'child';
      consola.withTag(tag);
      return createConsoleLogger(currentLevel);
    },

    isLevelEnabled(level: LogLevel): boolean {
      return level >= currentLevel;
    },

    setLevel(level: LogLevel): void {
      currentLevel = level;
      consola.level = mapLogLevelToConsola(level);
    },

    getLevel(): LogLevel {
      return currentLevel;
    },
  };
}
