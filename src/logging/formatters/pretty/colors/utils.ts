/**
 * @fileoverview Color utility functions
 * @module @oak-mcp-core/logging/formatters/pretty/colors
 */

import type { FormatterLogLevel } from '../types.js';
import { LOG_LEVELS } from '../../../types/index.js';
import { Colors } from './constants.js';

/**
 * Get color for log level
 * Pure function
 */
export function getLevelColor(level: FormatterLogLevel): string {
  switch (level) {
    case LOG_LEVELS.TRACE.value:
      return Colors.gray;
    case LOG_LEVELS.DEBUG.value:
      return Colors.cyan;
    case LOG_LEVELS.INFO.value:
      return Colors.green;
    case LOG_LEVELS.WARN.value:
      return Colors.yellow;
    case LOG_LEVELS.ERROR.value:
      return Colors.red;
    case LOG_LEVELS.FATAL.value:
      return Colors.magenta;
    default:
      return Colors.reset;
  }
}

/**
 * Apply color to text
 * Pure function
 */
export function colorize(text: string, colorCode: string): string {
  return `${colorCode}${text}${Colors.reset}`;
}
