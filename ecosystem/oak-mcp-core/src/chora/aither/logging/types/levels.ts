/**
 * @fileoverview Shared log level definitions for logging system
 * @module @oak-mcp-core/logging
 *
 * Single source of truth for log levels
 *
 * @note JC: this file is an exemplar for my preferred approach to type derivation from data structures
 * @note MIGRATION: Temporarily re-exporting from substrate during Phase 3 migration
 */

// MIGRATION: Re-export from substrate to maintain compatibility
export {
  LOG_LEVELS,
  type LogLevel,
  type LogLevelName,
  isLogLevel,
  isLogLevelName,
  getLogLevelValue,
  getLogLevelName,
} from '../../../stroma/types/logging.js';

/* LEGACY: Original implementation preserved for reference during migration

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

export type LogLevel = LogLevelLookup[keyof LogLevelLookup]['value'];

export function isLogLevel(value: unknown): value is LogLevel {
  if (typeof value !== 'number') return false;
  const validLevels: readonly number[] = Object.values(LOG_LEVELS).map((level) => level.value);
  return validLevels.includes(value);
}

export type LogLevelName = LogLevelLookup[keyof LogLevelLookup]['name'];

export function isLogLevelName(value: unknown): value is LogLevelName {
  if (typeof value !== 'string') return false;
  const validLevels: readonly string[] = Object.values(LOG_LEVELS).map((level) => level.name);
  return validLevels.includes(value);
}

export function getLogLevelValue(levelName: LogLevelName): LogLevel {
  return LOG_LEVELS[levelName].value;
}

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
*/
