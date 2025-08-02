/**
 * @fileoverview ANSI color code constants
 * @module @oak-mcp-core/logging/formatters/pretty/colors
 */

/**
 * ANSI color codes for terminal output
 */
export const Colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
} as const;
