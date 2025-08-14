/**
 * Pure functions extracted from ConsolaLogger for testability
 */

import type { LogLevel } from './types.js';
import { isObject } from '@oaknational/mcp-moria';

/**
 * Converts semantic log level to numeric value
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
 */
export function toConsolaLevel(level: number): number {
  return Math.floor(level / 10);
}

/**
 * Merges base context with additional context
 */
export function mergeLogContext(
  base: Record<string, unknown>,
  context?: unknown,
): Record<string, unknown> {
  if (context === undefined) return base;

  // Use the centrally defined isObject type guard from Moria
  if (isObject(context)) {
    // context is now ValidatedObject (which is Record<string, unknown>)
    return { ...base, ...context };
  }

  return { ...base, value: context };
}

/**
 * Normalizes various error types to Error objects
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (typeof error === 'number') {
    return new Error(String(error));
  }

  if (error === null || error === undefined) {
    return new Error('Unknown error');
  }

  // For objects, use JSON.stringify if possible, otherwise use a generic message
  try {
    return new Error(JSON.stringify(error));
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return new Error(String(error));
  }
}

/**
 * Checks if a log level is enabled
 */
export function isLevelEnabled(currentLevel: number, checkLevel: number): boolean {
  return currentLevel >= checkLevel;
}
