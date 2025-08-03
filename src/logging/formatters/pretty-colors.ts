/**
 * @fileoverview Color utilities for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogLevel } from '../types/index.js';
import { LOG_LEVELS } from '../types/index.js';

/**
 * ANSI color codes for terminal output
 * @const
 */
export const Colors = {
  // Standard colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',

  // Background colors
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',

  // Styles
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',

  // Special
  gray: '\x1b[90m',
  reset: '\x1b[0m',
} as const;

/**
 * Get ANSI color code for log level
 * Pure function
 */
export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case LOG_LEVELS.FATAL.value:
      return Colors.bgRed + Colors.white + Colors.bold;
    case LOG_LEVELS.ERROR.value:
      return Colors.brightRed;
    case LOG_LEVELS.WARN.value:
      return Colors.brightYellow;
    case LOG_LEVELS.INFO.value:
      return Colors.brightCyan;
    case LOG_LEVELS.DEBUG.value:
      return Colors.brightBlue;
    case LOG_LEVELS.TRACE.value:
      return Colors.gray;
    default:
      return Colors.reset;
  }
}

/**
 * Apply ANSI color to text
 * Pure function
 * @param text - Text to colorize
 * @param colorCode - ANSI color code
 * @returns Colorized text with reset
 */
export function colorize(text: string, colorCode: string): string {
  return `${colorCode}${text}${Colors.reset}`;
}
