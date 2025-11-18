/**
 * Log level conversion utilities
 */

import type { LogLevel } from './types.js';

/**
 * Converts semantic log level to numeric value
 * @param level - Log level (TRACE=0, DEBUG=10, INFO=20, WARN=30, ERROR=40, FATAL=50)
 * @returns Numeric log level (0-50)
 *
 * @example
 * ```typescript
 * convertLogLevel('DEBUG') // Returns: 10
 * convertLogLevel(20) // Returns: 20
 * ```
 */
export function convertLogLevel(level: LogLevel | number): number {
  if (typeof level === 'number') {
    return level;
  }

  switch (level) {
    case 'TRACE':
      return 0;
    case 'DEBUG':
      return 10;
    case 'INFO':
      return 20;
    case 'WARN':
      return 30;
    case 'ERROR':
      return 40;
    case 'FATAL':
      return 50;
    default:
      return 20; // Default to INFO
  }
}

/**
 * Converts our 0-50 scale to consola's 0-5 scale
 * @param level - Numeric log level (0-50)
 * @returns Consola log level (0-5)
 *
 * @example
 * ```typescript
 * toConsolaLevel(20) // Returns: 2 (INFO)
 * toConsolaLevel(35) // Returns: 3 (WARN, floored)
 * ```
 */
export function toConsolaLevel(level: number): number {
  return Math.floor(level / 10);
}
