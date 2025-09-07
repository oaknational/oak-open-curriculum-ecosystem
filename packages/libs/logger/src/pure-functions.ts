/**
 * Pure functions extracted from ConsolaLogger for testability
 */

import type { LogLevel } from './types.js';
import type { JsonObject, JsonValue } from '@oaknational/mcp-core';
import { isObject } from '@oaknational/mcp-core';

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
// kept for clarity via isJsonValue

function toJsonSafeObject(value: unknown): JsonObject | null {
  if (!isObject(value)) return null;
  const serialised: unknown = JSON.parse(JSON.stringify(value));
  return isObject(serialised) ? serialised : null;
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return true;
  if (Array.isArray(value)) return value.every((v) => isJsonValue(v));
  if (isObject(value)) return Object.values(value).every((v) => isJsonValue(v));
  return false;
}

function toAttachableValue(value: unknown): JsonValue {
  if (isJsonValue(value)) return value;
  try {
    const sanitised: unknown = JSON.parse(JSON.stringify(value));
    if (isJsonValue(sanitised)) return sanitised;
  } catch {
    // fall through to string fallback
  }
  return '[unserializable]';
}

export function mergeLogContext(base: JsonObject, context?: unknown): JsonObject {
  if (context === undefined) return base;
  const jsonSafe = toJsonSafeObject(context);
  if (jsonSafe) return { ...base, ...jsonSafe };
  return { ...base, value: toAttachableValue(context) };
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
