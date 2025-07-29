import { scrubSensitiveData } from '../utils/scrubbing.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

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

export function shouldLog(currentLevel: LogLevel, messageLevel: LogLevel): boolean {
  return LOG_LEVELS[messageLevel] >= LOG_LEVELS[currentLevel];
}

export interface Logger {
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
}

export function createConsoleLogger(level: LogLevel = 'info'): Logger {
  return {
    debug(message: string, context?: unknown): void {
      if (shouldLog(level, 'debug')) {
        console.log(formatLogMessage('debug', message, context));
      }
    },
    info(message: string, context?: unknown): void {
      if (shouldLog(level, 'info')) {
        console.log(formatLogMessage('info', message, context));
      }
    },
    warn(message: string, context?: unknown): void {
      if (shouldLog(level, 'warn')) {
        console.warn(formatLogMessage('warn', message, context));
      }
    },
    error(message: string, context?: unknown): void {
      if (shouldLog(level, 'error')) {
        console.error(formatLogMessage('error', message, context));
      }
    },
  };
}
