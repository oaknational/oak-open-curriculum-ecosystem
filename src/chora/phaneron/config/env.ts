/**
 * @fileoverview Simple environment configuration
 * @module @notion-mcp/config
 *
 * This is the ONLY module that should access process.env.
 * All other modules should import from here.
 */

import { isLogLevelName, type LogLevelName } from '../../stroma/types/logging.js';

/**
 * Parse environment variable as string
 */
function getString(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value ?? defaultValue ?? '';
}

/**
 * Parse environment variable as boolean
 */
function getBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Parse environment variable as number
 */
function getNumber(key: string, defaultValue: number, min?: number, max?: number): number {
  const value = process.env[key];
  const num = value ? parseInt(value, 10) : defaultValue;

  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }

  if (min !== undefined && num < min) {
    throw new Error(`Environment variable ${key} must be at least ${String(min)}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`Environment variable ${key} must be at most ${String(max)}`);
  }

  return num;
}

/**
 * Parse log level with validation
 */
function getLogLevel(key: string, defaultValue: LogLevelName): LogLevelName {
  const value = process.env[key];
  if (!value) return defaultValue;

  // Try uppercase
  const upper = value.toUpperCase();
  if (isLogLevelName(upper)) return upper;

  // Try title case
  const titleCase = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  if (isLogLevelName(titleCase)) return titleCase;

  throw new Error(
    `Invalid ${key}: ${value}. Valid levels are: TRACE, DEBUG, INFO, WARN, ERROR, FATAL`,
  );
}

/**
 * Get one of allowed values
 */
function getEnum<T extends string>(key: string, allowed: readonly T[], defaultValue: T): T {
  const value = process.env[key];
  if (!value) return defaultValue;

  // Find the matching value
  const match = allowed.find((v) => v === value);
  if (match !== undefined) {
    return match;
  }

  throw new Error(`Invalid ${key}: ${value}. Must be one of: ${allowed.join(', ')}`);
}

/**
 * Environment configuration - validated once on module load
 */
export const env = {
  NOTION_API_KEY: getString('NOTION_API_KEY'),
  LOG_LEVEL: getLogLevel('LOG_LEVEL', 'INFO'),
  NODE_ENV: getEnum('NODE_ENV', ['development', 'production', 'test'] as const, 'production'),
  ENABLE_DEBUG_LOGGING: getBoolean('ENABLE_DEBUG_LOGGING', false),
  MAX_SEARCH_RESULTS: getNumber('MAX_SEARCH_RESULTS', 100, 1, 1000),
} as const;

/**
 * Inferred environment type
 */
export type Environment = typeof env;
