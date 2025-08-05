/**
 * @fileoverview Pretty formatter implementation for human-readable logging
 * @module @oak-mcp-core/logging
 *
 * This formatter will be extracted to oak-mcp-core.
 * Pure functions only - no side effects.
 *
 * This file now re-exports from the modular pretty subdomain
 * and provides adapters for backward compatibility.
 */

import type { LogLevel, LogFormatter, LogContext } from '../logger-interface.js';
import { LOG_LEVELS } from '../../../stroma/types/index.js';
import {
  type PrettyFormatterOptions as InternalOptions,
  createPrettyFormatter as createInternal,
  createCompactFormatter as createCompactInternal,
  createLogLevelAdapter,
  createAdaptedFormatter,
  formatPretty as formatPrettyInternal,
  formatCompact as formatCompactInternal,
  Colors,
  getLevelColor as getLevelColorInternal,
  colorize,
  getLevelAbbreviation as getLevelAbbreviationInternal,
  indentMultiline,
  formatContext as formatContextInternal,
} from './pretty-index.js';

// Re-export types with original names
export type { InternalOptions as PrettyFormatterOptions };
export { Colors, colorize, indentMultiline };

// Create adapter using LOG_LEVELS values
const levelAdapter = createLogLevelAdapter({
  TRACE: LOG_LEVELS.TRACE.value,
  DEBUG: LOG_LEVELS.DEBUG.value,
  INFO: LOG_LEVELS.INFO.value,
  WARN: LOG_LEVELS.WARN.value,
  ERROR: LOG_LEVELS.ERROR.value,
  FATAL: LOG_LEVELS.FATAL.value,
});

/**
 * Get color for log level
 * Pure function
 */
export function getLevelColor(level: LogLevel): string {
  const formatterLevel = levelAdapter(level);
  return getLevelColorInternal(formatterLevel);
}

/**
 * Get short level abbreviation
 * Pure function
 */
export function getLevelAbbreviation(level: LogLevel): string {
  const formatterLevel = levelAdapter(level);
  return getLevelAbbreviationInternal(formatterLevel);
}

/**
 * Format context object for display
 * Pure function
 */
export function formatContext(
  context: LogContext,
  indent = '  ',
  maxDepth = 3,
  currentDepth = 0,
): string {
  return formatContextInternal(context, indent, maxDepth, currentDepth);
}

/**
 * Format log entry in pretty human-readable format
 * Pure function
 */
export function formatPretty(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
  options: InternalOptions = {},
): string {
  const formatterLevel = levelAdapter(level);
  return formatPrettyInternal(formatterLevel, message, error, context, timestamp, options);
}

/**
 * Format log entry in compact format
 * Pure function
 */
export function formatCompact(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): string {
  const formatterLevel = levelAdapter(level);
  return formatCompactInternal(formatterLevel, message, error, context, timestamp);
}

/**
 * Create a pretty formatter with options
 * Returns a LogFormatter implementation
 */
export function createPrettyFormatter(options: InternalOptions = {}): LogFormatter {
  const internalFormatter = createInternal(options);
  const adaptedFormatter = createAdaptedFormatter(internalFormatter, levelAdapter);

  return {
    format: (level, message, error, context, timestamp) => {
      return adaptedFormatter(level, message, error, context, timestamp);
    },
  };
}

/**
 * Create a compact formatter
 * Single line output for space efficiency
 */
export function createCompactFormatter(): LogFormatter {
  const internalFormatter = createCompactInternal();
  const adaptedFormatter = createAdaptedFormatter(internalFormatter, levelAdapter);

  return {
    format: (level, message, error, context, timestamp) => {
      return adaptedFormatter(level, message, error, context, timestamp);
    },
  };
}

/**
 * Create a colorized formatter for TTY output
 * Automatically detects TTY in Node.js
 */
export function createColorizedFormatter(
  options: Omit<InternalOptions, 'useColor'> = {},
): LogFormatter {
  // Detect TTY (Node.js specific, safe fallback for other environments)
  // In Node.js environments, process.stdout will always exist if process exists
  const isTTY = typeof process !== 'undefined' && Boolean(process.stdout.isTTY);

  const formatterOptions = isTTY ? { ...options, useColor: true } : options;
  const internalFormatter = createInternal(formatterOptions);
  const adaptedFormatter = createAdaptedFormatter(internalFormatter, levelAdapter);

  return {
    format: (level, message, error, context, timestamp) => {
      return adaptedFormatter(level, message, error, context, timestamp);
    },
  };
}

/**
 * Default pretty formatter instance
 * No colors, includes timestamp
 */
export const defaultPrettyFormatter: LogFormatter = createPrettyFormatter({
  timestamp: true,
  useColor: false,
});
