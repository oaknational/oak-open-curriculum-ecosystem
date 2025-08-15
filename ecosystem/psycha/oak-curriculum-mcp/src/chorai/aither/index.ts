/**
 * Aither - Logging and Events Layer
 *
 * Provides centralised logging for the Oak Curriculum MCP server.
 * Uses the adaptive logger from histos-logger for runtime flexibility.
 */

import { createAdaptiveLogger, type LogLevel } from '@oaknational/mcp-histos-logger';
import type { Logger } from '@oaknational/mcp-moria';
import type { ConsolaOptions } from 'consola';
import { createFileReporter, getLogFilePath } from './file-reporter.js';

/**
 * Logger options for dependency injection
 */
export interface LoggerOptions {
  name?: string;
  level?: number | LogLevel;
  enableFileLogging?: boolean;
}

/**
 * Get default consola options for file reporting
 */
function getConsolaOptions(): ConsolaOptions {
  return {
    reporters: [],
    types: {
      silent: { level: -1 },
      fatal: { level: 0 },
      error: { level: 0 },
      warn: { level: 1 },
      log: { level: 2 },
      info: { level: 3 },
      success: { level: 3 },
      fail: { level: 3 },
      ready: { level: 3 },
      start: { level: 3 },
      box: { level: 3 },
      debug: { level: 4 },
      trace: { level: 5 },
      verbose: { level: 5 },
    },
    level: 0,
    defaults: {},
    throttle: 1000,
    throttleMin: 5,
    formatOptions: {},
  };
}

/**
 * Create file logging wrapper for a logger
 */
function wrapWithFileLogging(baseLogger: Logger, options?: LoggerOptions): Logger {
  const logFilePath = getLogFilePath();
  const fileReporter = createFileReporter(logFilePath);
  const consolaOptions = getConsolaOptions();
  const tag = options?.name ?? 'oak-curriculum-mcp';

  return {
    ...baseLogger,
    debug: (message: string, context?: Record<string, unknown>) => {
      const args = context ? [message, JSON.stringify(context)] : [message];
      fileReporter.log(
        { level: 0, type: 'debug', tag, args, date: new Date() },
        { options: consolaOptions },
      );
      baseLogger.debug(message, context);
    },
    info: (message: string, context?: Record<string, unknown>) => {
      const args = context ? [message, JSON.stringify(context)] : [message];
      fileReporter.log(
        { level: 1, type: 'info', tag, args, date: new Date() },
        { options: consolaOptions },
      );
      baseLogger.info(message, context);
    },
    warn: (message: string, context?: Record<string, unknown>) => {
      const args = context ? [message, JSON.stringify(context)] : [message];
      fileReporter.log(
        { level: 2, type: 'warn', tag, args, date: new Date() },
        { options: consolaOptions },
      );
      baseLogger.warn(message, context);
    },
    error: (message: string, context?: Record<string, unknown>) => {
      // Include context in the log message for file reporter
      const args = context ? [message, JSON.stringify(context, null, 2)] : [message];
      fileReporter.log(
        { level: 3, type: 'error', tag, args, date: new Date() },
        { options: consolaOptions },
      );
      baseLogger.error(message, context);
    },
    child: baseLogger.child
      ? () => {
          const childName = `${options?.name ?? 'oak-curriculum-mcp'}:child`;
          return createLogger({ ...options, name: childName });
        }
      : undefined,
  };
}

/**
 * Create the main logger for the Oak Curriculum MCP server
 */
export function createLogger(options?: LoggerOptions): Logger {
  const baseLogger = createAdaptiveLogger({
    name: options?.name ?? 'oak-curriculum-mcp',
    level: options?.level ?? 'INFO',
  });

  // If file logging is enabled, wrap the logger to also write to file
  if (options?.enableFileLogging !== false && typeof process !== 'undefined') {
    return wrapWithFileLogging(baseLogger, options);
  }

  return baseLogger;
}

/**
 * Create a child logger with a specific module context
 */
export function createModuleLogger(parentLogger: Logger, moduleName: string): Logger {
  return parentLogger.child ? parentLogger.child({ module: moduleName }) : parentLogger;
}

// Note: Don't create a default logger instance here
// The psychon layer will create it with proper configuration
