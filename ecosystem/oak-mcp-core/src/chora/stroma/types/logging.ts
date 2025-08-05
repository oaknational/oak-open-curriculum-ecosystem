/**
 * @fileoverview Logging physics - fundamental constants and laws for logging
 * @module substrate/types/logging
 *
 * This is the single source of truth for log levels in the system.
 * Types are derived from the data structure following the exemplar pattern.
 * Zero dependencies - this is foundational physics.
 */

/**
 * Log levels as const object for runtime access
 * This data structure is the source from which all types are derived
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
 * Log level type derived from const object - numeric values
 */
export type LogLevel = LogLevelLookup[keyof LogLevelLookup]['value'];

/**
 * Log level name type derived from const object - string names
 */
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
 * Type guard for log level name
 *
 * @param value - The value to check
 * @returns {boolean} True if the value is a valid log level name, false otherwise
 */
export function isLogLevelName(value: unknown): value is LogLevelName {
  if (typeof value !== 'string') return false;
  const validLevels: readonly string[] = Object.values(LOG_LEVELS).map((level) => level.name);
  return validLevels.includes(value);
}

/**
 * Given a log level name, return the corresponding numeric value
 *
 * @param levelName - The log level name to check
 * @returns The corresponding numeric value
 * @throws Error if the level name is not a valid log level name
 */
export function getLogLevelValue(levelName: LogLevelName): LogLevel {
  return LOG_LEVELS[levelName].value;
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
