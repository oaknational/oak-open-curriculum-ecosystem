/**
 * Log level configuration for all servers/apps
 *
 * This module provides a single source of truth for log levels
 * across the entire workspace. All types and type guards are
 * derived from the master data structure.
 */

/**
 * The master data structure for log levels
 *
 * All types and type guards are derived from this.
 * Each level has:
 * - label: The string representation
 * - value: Numeric value for comparison (lower = more verbose)
 * - default: Whether this is the default level
 */
export const LOG_LEVEL_VALUES = {
  TRACE: { label: 'TRACE', value: 0, default: false },
  DEBUG: { label: 'DEBUG', value: 10, default: false },
  INFO: { label: 'INFO', value: 20, default: true },
  WARN: { label: 'WARN', value: 30, default: false },
  ERROR: { label: 'ERROR', value: 40, default: false },
  FATAL: { label: 'FATAL', value: 50, default: false },
} as const;

/**
 * Log levels: TRACE, DEBUG, INFO, WARN, ERROR, FATAL
 */
export type LogLevel = keyof typeof LOG_LEVEL_VALUES;

/**
 * Standard environment variable keys for logging configuration
 */
export const LOG_LEVEL_KEY = 'LOG_LEVEL' as const;
export const ENABLE_DEBUG_LOGGING_KEY = 'ENABLE_DEBUG_LOGGING' as const;

/**
 * Base logging environment interface
 * Use this to ensure consistent logging configuration across servers/apps
 */
export interface BaseLoggingEnvironment {
  [LOG_LEVEL_KEY]: LogLevel;
  [ENABLE_DEBUG_LOGGING_KEY]: boolean;
}

/**
 * Type guard to check if a value is a valid LogLevel
 * @param value - Unknown value to check
 * @returns True if value is a valid LogLevel
 */
export function isLogLevel(value: unknown): value is LogLevel {
  if (typeof value !== 'string') {
    return false;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Object.keys(LOG_LEVEL_VALUES).includes(value);
}

/**
 * Get the default log level from the configuration
 * @returns The log level marked as default in LOG_LEVEL_VALUES
 */
export function getDefaultLogLevel(): LogLevel {
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const defaultLevel = Object.values(LOG_LEVEL_VALUES).find((level) => level.default)?.label;
  if (defaultLevel === undefined) {
    throw new TypeError('No default log level found in LOG_LEVEL_VALUES');
  }
  return defaultLevel;
}

/**
 * Parse a log level from an environment value
 * @param envValue - The environment variable value to parse
 * @param defaultValue - Optional default value if envValue is undefined
 * @returns A valid LogLevel
 * @throws TypeError if the value is not a valid log level
 */
export function parseLogLevel(envValue: string | undefined, defaultValue?: LogLevel): LogLevel {
  // If no value is set, use the default override or the system default
  if (envValue === undefined) {
    return defaultValue ?? getDefaultLogLevel();
  }

  const upperValue = envValue.toUpperCase();
  if (!isLogLevel(upperValue)) {
    // eslint-disable-next-line no-restricted-properties -- REFACTOR
    const validLevels = Object.keys(LOG_LEVEL_VALUES).join(', ');
    throw new TypeError(`Log level must be one of: ${validLevels}, got: ${envValue}`);
  }

  return upperValue;
}

/**
 * Compare two log levels
 * @param level1 - First log level
 * @param level2 - Second log level
 * @returns Negative if level1 is more verbose, positive if less verbose, 0 if equal
 */
export function compareLogLevels(level1: LogLevel, level2: LogLevel): number {
  return LOG_LEVEL_VALUES[level1].value - LOG_LEVEL_VALUES[level2].value;
}

/**
 * Check if a log level should be output given the current threshold
 * @param messageLevel - The level of the message to log
 * @param thresholdLevel - The minimum level to output
 * @returns True if the message should be logged
 */
export function shouldLog(messageLevel: LogLevel, thresholdLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[messageLevel].value >= LOG_LEVEL_VALUES[thresholdLevel].value;
}
