/**
 * @fileoverview Console transport colorization utilities
 * @module @oak-mcp-core/logging/transports
 *
 * Color detection and colorization utilities for console output
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { LogLevel } from '../../../stroma/types/logging.js';
import { getLevelColor, ANSI_COLORS } from '../colors/index.js';

// ============================================================================
// COLORIZER UTILITIES
// ============================================================================

/**
 * Colorize text with ANSI codes
 * Pure function
 */
export function colorizeLevel(level: LogLevel, text: string): string {
  const colorCode = getLevelColor(level);
  return `${colorCode}${text}${ANSI_COLORS.reset}`;
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
