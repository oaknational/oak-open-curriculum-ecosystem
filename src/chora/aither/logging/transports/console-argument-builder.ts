/**
 * @fileoverview Console transport argument building logic
 * @module @oak-mcp-core/logging/transports
 *
 * Argument building and formatting logic for console output
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type { LogLevel } from '../../../stroma/types/logging.js';
import type { LogContext } from '../types/index.js';
import type { ArgumentBuilderOptions } from './console-types.js';
import { formatLogLevel, formatTimestamp } from './console-level-formatter.js';
import { colorizeLevel } from './console-colorizer.js';

// ============================================================================
// ARGUMENT BUILDER UTILITIES
// ============================================================================

/**
 * Build console arguments
 * Pure function
 */
export function buildConsoleArgs(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): unknown[] {
  const args: unknown[] = [];

  // Add timestamp if provided
  if (timestamp) {
    args.push(`[${formatTimestamp(timestamp)}]`);
  }

  // Add level
  const levelStr = formatLogLevel(level);
  args.push(`[${levelStr}]`);

  // Add message
  args.push(message);

  // Add context if provided and not empty
  if (context && Object.keys(context).length > 0) {
    args.push(context);
  }

  // Add error if provided
  if (error) {
    args.push(error);
  }

  return args;
}

/**
 * Apply formatting options to console arguments
 * Pure function that modifies argument array
 */
export function applyFormatting(
  args: unknown[],
  level: LogLevel,
  options: ArgumentBuilderOptions,
): unknown[] {
  const formattedArgs = [...args]; // Create copy to maintain purity

  // Apply prefix if configured
  if (options.prefix && formattedArgs.length > 0) {
    formattedArgs[0] = `${options.prefix} ${String(formattedArgs[0])}`;
  }

  // Apply colorization if enabled
  if (options.colorize && formattedArgs.length > 1) {
    // Colorize the level part (second element after optional timestamp)
    const levelIndex = options.includeTimestamp ? 1 : 0;
    const levelArg = formattedArgs[levelIndex];
    if (typeof levelArg === 'string' && levelArg.startsWith('[')) {
      formattedArgs[levelIndex] = colorizeLevel(level, levelArg);
    }
  }

  return formattedArgs;
}
