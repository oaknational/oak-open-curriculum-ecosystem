/**
 * Logging utilities for oak-notion-mcp
 */

import type { LogLevel } from './env-utils';

/**
 * Convert LogLevel string to numeric value for logger configuration
 */
export function getLogLevelValue(level: LogLevel): number {
  switch (level) {
    case 'DEBUG':
      return 10;
    case 'INFO':
      return 20;
    case 'WARN':
      return 30;
    case 'ERROR':
      return 40;
    default:
      return 20; // Default to INFO
  }
}
