/**
 * @fileoverview Level formatting utilities
 * @module @oak-mcp-core/logging
 *
 * Pure functions for formatting log levels
 */

import type { ConsoleInterface } from './types.js';
import type { LogLevel } from '../../types/index.js';
import { LOG_LEVELS, getLogLevelName } from '../../types/index.js';

/**
 * Format log level to string
 * Pure function
 */
export function formatLogLevel(level: LogLevel): string {
  try {
    return getLogLevelName(level);
  } catch {
    return 'UNKNOWN';
  }
}

/**
 * Get console method for log level
 * Pure function
 */
export function getConsoleMethod(level: LogLevel): keyof ConsoleInterface {
  switch (level) {
    case LOG_LEVELS.TRACE.value:
    case LOG_LEVELS.DEBUG.value:
      return 'debug';
    case LOG_LEVELS.INFO.value:
      return 'info';
    case LOG_LEVELS.WARN.value:
      return 'warn';
    case LOG_LEVELS.ERROR.value:
    case LOG_LEVELS.FATAL.value:
      return 'error';
    default:
      return 'log';
  }
}

/**
 * Format timestamp
 * Pure function
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}
