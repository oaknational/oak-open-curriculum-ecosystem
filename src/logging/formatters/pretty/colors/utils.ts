/**
 * @fileoverview Color utility functions
 * @module @oak-mcp-core/logging/formatters/pretty/colors
 */

import type { FormatterLogLevel } from '../types.js';
import { getLevelColor as getConsolidatedLevelColor, ANSI_COLORS } from '../../../colors/index.js';

/**
 * Get color for log level
 * Pure function
 */
export function getLevelColor(level: FormatterLogLevel): string {
  return getConsolidatedLevelColor(level);
}

/**
 * Apply color to text
 * Pure function
 */
export function colorize(text: string, colorCode: string): string {
  return `${colorCode}${text}${ANSI_COLORS.reset}`;
}
