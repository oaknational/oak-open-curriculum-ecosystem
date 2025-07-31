import { createConsola, type ConsolaInstance } from 'consola';
import { scrubSensitiveData } from '../utils/scrubbing.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
}

/**
 * Creates a logger instance using Consola with automatic data scrubbing
 */
export function createConsoleLogger(level: LogLevel = 'info'): Logger {
  // Map our log levels to Consola log levels
  const consolaLevel = {
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
  }[level];

  // Create a custom Consola instance with our configuration
  const logger: ConsolaInstance = createConsola({
    level: consolaLevel,
    formatOptions: {
      date: true,
      colors: true,
    },
  });

  // Wrap Consola methods to add automatic scrubbing
  return {
    debug(message: string, context?: unknown): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      logger.debug(message, scrubbed);
    },
    info(message: string, context?: unknown): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      logger.info(message, scrubbed);
    },
    warn(message: string, context?: unknown): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      logger.warn(message, scrubbed);
    },
    error(message: string, context?: unknown): void {
      const scrubbed = context !== undefined ? scrubSensitiveData(context) : undefined;
      logger.error(message, scrubbed);
    },
  };
}

/**
 * Legacy pure functions for testing log formatting logic
 * @deprecated Use Consola directly
 */
export function formatLogMessage(level: LogLevel, message: string, context?: unknown): string {
  const timestamp = new Date().toISOString();
  const levelStr = `[${level.toUpperCase()}]`;

  let contextStr = '';
  if (context !== undefined) {
    try {
      // Scrub sensitive data before logging
      const scrubbed = scrubSensitiveData(context);
      contextStr = ` ${JSON.stringify(scrubbed)}`;
    } catch {
      // Handle circular references
      contextStr = ' [Circular Reference]';
    }
  }

  return `${timestamp} ${levelStr} ${message}${contextStr}`;
}

/**
 * Legacy function for testing log level filtering
 * @deprecated Consola handles this internally
 */
export function shouldLog(currentLevel: LogLevel, messageLevel: LogLevel): boolean {
  const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  return LOG_LEVELS[messageLevel] >= LOG_LEVELS[currentLevel];
}
