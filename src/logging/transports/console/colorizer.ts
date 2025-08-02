/**
 * @fileoverview Console output colorization utilities
 * @module @oak-mcp-core/logging
 *
 * Pure functions for applying ANSI color codes
 */

import type { LogLevel } from '../../types/index.js';
import { LOG_LEVELS } from '../../types/index.js';

/**
 * ANSI color codes for different log levels
 */
const LEVEL_COLORS: Record<LogLevel, string> = {
  [LOG_LEVELS.TRACE.value]: '\x1b[90m', // gray
  [LOG_LEVELS.DEBUG.value]: '\x1b[36m', // cyan
  [LOG_LEVELS.INFO.value]: '\x1b[32m', // green
  [LOG_LEVELS.WARN.value]: '\x1b[33m', // yellow
  [LOG_LEVELS.ERROR.value]: '\x1b[31m', // red
  [LOG_LEVELS.FATAL.value]: '\x1b[35m', // magenta
};

/**
 * ANSI reset code
 */
const RESET_CODE = '\x1b[0m';

/**
 * Get ANSI color code for log level
 * Pure function
 */
export function getLevelColor(level: LogLevel): string {
  return LEVEL_COLORS[level] || RESET_CODE;
}

/**
 * Colorize text with ANSI codes
 * Pure function
 */
export function colorizeLevel(level: LogLevel, text: string): string {
  const colorCode = getLevelColor(level);
  return `${colorCode}${text}${RESET_CODE}`;
}

/**
 * Determine if output should be colorized
 * Pure function
 */
export function shouldColorize(forceColor?: boolean, noColor?: boolean, isTTY = true): boolean {
  if (forceColor === true) return true;
  if (noColor === true) return false;
  return isTTY;
}

/**
 * Detect if running in TTY environment
 * Separated for testability
 */
export function detectTTY(): boolean {
  // Runtime check needed for cross-platform compatibility (Node.js vs browser)
  if (typeof process === 'undefined') return false;
  if (typeof process.stdout === 'undefined') return false;
  return Boolean(process.stdout.isTTY);
}
