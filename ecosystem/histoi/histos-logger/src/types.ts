/**
 * Shared types and utilities for the logger module
 */

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: Record<string, unknown>;
}

/**
 * Converts semantic log level names to numeric values
 */
export function levelToNumber(level: LogLevel | number): number {
  if (typeof level === 'number') {
    return level;
  }

  switch (level) {
    case 'TRACE':
      return 0;
    case 'DEBUG':
      return 10;
    case 'INFO':
      return 20;
    case 'WARN':
      return 30;
    case 'ERROR':
      return 40;
    case 'FATAL':
      return 50;
    default:
      return 20; // Default to INFO
  }
}
