/**
 * @fileoverview Level formatting utilities for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogLevel } from '../../../stroma/types/index.js';
import { LOG_LEVELS, getLogLevelName } from '../../../stroma/types/index.js';

/**
 * Get abbreviated form of log level
 * Pure function
 */
export function getLevelAbbreviation(level: LogLevel): string {
  switch (level) {
    case LOG_LEVELS.FATAL.value:
      return 'FTL';
    case LOG_LEVELS.ERROR.value:
      return 'ERR';
    case LOG_LEVELS.WARN.value:
      return 'WRN';
    case LOG_LEVELS.INFO.value:
      return 'INF';
    case LOG_LEVELS.DEBUG.value:
      return 'DBG';
    case LOG_LEVELS.TRACE.value:
      return 'TRC';
    default:
      return '???';
  }
}

/**
 * Format log level for display
 * @param level - Log level
 * @param compact - Use abbreviated form
 * @returns Formatted level string
 */
export function formatLogLevel(level: LogLevel, compact = false): string {
  return compact ? getLevelAbbreviation(level) : getLogLevelName(level).padEnd(5);
}
