/**
 * @fileoverview Consola-based implementation of the Logger interface
 * @module @oak-mcp-core/logging
 */

import { createConsola, type ConsolaInstance } from 'consola';
import { join } from 'node:path';
import type { Logger, LogContext, LogLevel } from './logger-interface.js';
import { LOG_LEVELS } from './logger-interface.js';
import { scrubSensitiveData } from '../../../utils/scrubbing.js';
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
 * Scrub context data if present
 */
function scrubContext(context?: LogContext): unknown {
  return context !== undefined ? scrubSensitiveData(context) : undefined;
}

/**
 * Create a log method that scrubs context
 */
function createLogMethod(
  consolaMethod: (message: string, ...args: unknown[]) => void,
): (message: string, context?: LogContext) => void {
  return (message: string, context?: LogContext): void => {
    consolaMethod(message, scrubContext(context));
  };
}

/**
 * Create an error log method that scrubs context
 */
function createErrorMethod(
  consolaMethod: (message: string, ...args: unknown[]) => void,
): (message: string, error?: unknown, context?: LogContext) => void {
  return (message: string, error?: unknown, context?: LogContext): void => {
    const scrubbed = scrubContext(context);
    if (error) {
      consolaMethod(message, error, scrubbed);
    } else {
      consolaMethod(message, scrubbed);
    }
  };
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
    trace: createLogMethod(consola.trace.bind(consola)),
    debug: createLogMethod(consola.debug.bind(consola)),
    info: createLogMethod(consola.info.bind(consola)),
    warn: createLogMethod(consola.warn.bind(consola)),
    error: createErrorMethod(consola.error.bind(consola)),
    fatal: createErrorMethod(consola.fatal.bind(consola)),

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
