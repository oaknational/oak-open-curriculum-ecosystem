import type { LogLevel } from '../../../stroma/types/logging.js';
import { LOG_LEVELS } from '../../../stroma/types/logging.js';

// ANSI color codes - single source of truth
export const ANSI_COLORS = {
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
} as const;

/**
 * Get ANSI color code for a log level
 * Fails fast with helpful error on invalid level
 */
export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case LOG_LEVELS.TRACE.value:
      return ANSI_COLORS.gray;
    case LOG_LEVELS.DEBUG.value:
      return ANSI_COLORS.cyan;
    case LOG_LEVELS.INFO.value:
      return ANSI_COLORS.green;
    case LOG_LEVELS.WARN.value:
      return ANSI_COLORS.yellow;
    case LOG_LEVELS.ERROR.value:
      return ANSI_COLORS.red;
    case LOG_LEVELS.FATAL.value:
      return ANSI_COLORS.magenta;
    default:
      throw new TypeError(
        `Invalid log level: ${String(level)}. Valid levels are: TRACE=0, DEBUG=10, INFO=20, WARN=30, ERROR=40, FATAL=50`,
      );
  }
}
