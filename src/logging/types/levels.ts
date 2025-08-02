/**
 * @fileoverview Shared log level definitions for logging system
 * @module @oak-mcp-core/logging
 *
 * Single source of truth for log levels
 */

/**
 * Log levels as const object for runtime access
 */
export const LOG_LEVELS = {
  TRACE: {
    value: 0,
    name: 'TRACE',
  },
  DEBUG: {
    value: 10,
    name: 'DEBUG',
  },
  INFO: {
    value: 20,
    name: 'INFO',
  },
  WARN: {
    value: 30,
    name: 'WARN',
  },
  ERROR: {
    value: 40,
    name: 'ERROR',
  },
  FATAL: {
    value: 50,
    name: 'FATAL',
  },
} as const;

// Type for the lookup, that guarantees the name in key is the same as the name in the value
// Without this rigamarole, any combo of names would be valid
type LogLevelLookup = {
  [key in keyof typeof LOG_LEVELS]: (typeof LOG_LEVELS)[key] extends { name: string }
    ? (typeof LOG_LEVELS)[key]
    : never;
};

/**
 * Log level type derived from const object
 */
export type LogLevel = LogLevelLookup[keyof LogLevelLookup]['value'];
export type LogLevelName = LogLevelLookup[keyof LogLevelLookup]['name'];

/**
 * Type guard for numeric log level
 *
 * @param value - The value to check
 * @returns {boolean} True if the value is a valid log level, false otherwise
 */
export function isLogLevel(value: unknown): value is LogLevel {
  if (typeof value !== 'number') return false;
  const validLevels: readonly number[] = Object.values(LOG_LEVELS).map((level) => level.value);
  return validLevels.includes(value);
}

/**
 * Given a numeric log level, return the corresponding name (reverse lookup)
 *
 * @param level - The numeric value to check
 * @returns The corresponding log level name
 * @throws Error if the level is not a valid log level
 */
export function getLogLevelName(level: number): LogLevelName {
  const levelName = Object.values(LOG_LEVELS).find((l) => l.value === level)?.name;
  if (!levelName) {
    throw new TypeError(
      `Invalid log level: ${String(level)}. Valid levels are: ${Object.entries(LOG_LEVELS)
        .map(([key, val]) => `${key}=${String(val.value)}`)
        .join(', ')}`,
    );
  }
  return levelName;
}
