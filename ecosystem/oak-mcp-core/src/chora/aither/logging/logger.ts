/**
 * @fileoverview Console logger implementation without external dependencies
 * @module @oak-mcp-core/logging
 */

import { join } from 'node:path';
import type { Logger, LogContext, LogLevel } from './logger-interface.js';
import { LOG_LEVELS } from './logger-interface.js';
import { scrubSensitiveData } from '../sensitive-data/scrubbing.js';
import { createFileReporter } from './file-reporter.js';
import { createConsoleTransport } from './transports/console-index.js';

/**
 * Scrub context data if present
 */
function scrubContext(context?: LogContext): LogContext | undefined {
  return context !== undefined ? scrubSensitiveData(context) : undefined;
}

/**
 * Helper to create log methods
 */
function createLogMethod(
  logToTransports: (level: LogLevel, msg: string, error?: unknown, ctx?: LogContext) => void,
  level: LogLevel,
) {
  return (message: string, context?: LogContext) => {
    logToTransports(level, message, undefined, context);
  };
}

/**
 * Helper to create error log methods
 */
function createErrorLogMethod(
  logToTransports: (level: LogLevel, msg: string, error?: unknown, ctx?: LogContext) => void,
  level: LogLevel,
) {
  return (message: string, error?: unknown, context?: LogContext) => {
    logToTransports(level, message, error, context);
  };
}

/**
 * Creates transports for logging
 */
function createTransports() {
  const consoleTransport = createConsoleTransport({
    colorize: true,
    includeTimestamp: true,
  });

  const logDir = join(process.cwd(), '.logs', 'oak-notion-mcp');
  const fileReporter = createFileReporter({ logDir });

  return { consoleTransport, fileReporter };
}

/**
 * Creates the log function that writes to all transports
 */
function createLogFunction(
  transports: ReturnType<typeof createTransports>,
  isEnabled: (level: LogLevel) => boolean,
) {
  return (logLevel: LogLevel, message: string, error?: unknown, context?: LogContext): void => {
    if (!isEnabled(logLevel)) return;

    const scrubbedContext = scrubContext(context);

    transports.consoleTransport.log(logLevel, message, error, scrubbedContext);
    transports.fileReporter.log({
      level: logLevel,
      msg: message,
      args: error ? [error, scrubbedContext] : [scrubbedContext],
      tag: '',
      type: 'log',
      date: new Date(),
    });
  };
}

/**
 * Creates a logger instance with console and file transports
 */
export function createConsoleLogger(level: LogLevel = LOG_LEVELS.INFO.value): Logger {
  const transports = createTransports();
  let currentLevel = level;
  const isEnabled = (msgLevel: LogLevel): boolean => msgLevel >= currentLevel;
  const logToTransports = createLogFunction(transports, isEnabled);

  return {
    trace: createLogMethod(logToTransports, LOG_LEVELS.TRACE.value),
    debug: createLogMethod(logToTransports, LOG_LEVELS.DEBUG.value),
    info: createLogMethod(logToTransports, LOG_LEVELS.INFO.value),
    warn: createLogMethod(logToTransports, LOG_LEVELS.WARN.value),
    error: createErrorLogMethod(logToTransports, LOG_LEVELS.ERROR.value),
    fatal: createErrorLogMethod(logToTransports, LOG_LEVELS.FATAL.value),
    child: () => createConsoleLogger(currentLevel),
    isLevelEnabled: isEnabled,
    setLevel: (newLevel: LogLevel) => {
      currentLevel = newLevel;
    },
    getLevel: () => currentLevel,
  };
}
