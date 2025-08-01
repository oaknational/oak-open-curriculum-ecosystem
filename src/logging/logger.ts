import { createConsola, type ConsolaInstance } from 'consola';
import { join } from 'node:path';
import { scrubSensitiveData } from '../utils/scrubbing.js';
import { createFileReporter } from './file-reporter.js';

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

  // Create file reporter for persistent logging
  const logDir = join(process.cwd(), '.logs', 'oak-notion-mcp');
  const fileReporter = createFileReporter({ logDir });

  // Create a custom Consola instance with our configuration
  const logger: ConsolaInstance = createConsola({
    level: consolaLevel,
    formatOptions: {
      date: true,
      colors: true,
    },
    reporters: [
      // Default reporter for console output
      ...createConsola().options.reporters,
      // File reporter for persistent logs
      fileReporter,
    ],
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
