/**
 * @fileoverview JSON formatter implementation for structured logging
 * @module @oak-mcp-core/logging
 *
 * This formatter will be extracted to oak-mcp-core.
 * Pure functions only - no side effects.
 */

import { LogLevel, type LogFormatter, type LogContext } from '../logger-interface.js';

/**
 * JSON formatter options
 */
export interface JsonFormatterOptions {
  /**
   * Pretty print with indentation
   */
  pretty?: boolean;

  /**
   * Indentation size for pretty printing
   */
  indent?: number;

  /**
   * Add newline after each entry
   */
  newline?: boolean;

  /**
   * Custom field names
   */
  fields?: {
    timestamp?: string;
    level?: string;
    levelValue?: string;
    message?: string;
    context?: string;
    error?: string;
  };

  /**
   * Include numeric level value
   */
  includeLevelValue?: boolean;

  /**
   * Sensitive keys to redact
   */
  sensitiveKeys?: string[];
}

/**
 * Error serialization result
 */
export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  [key: string]: unknown;
}

/**
 * Serialize error object for JSON output
 * Pure function
 */
export function serializeError(error: unknown): unknown {
  if (error instanceof Error) {
    const serialized: SerializedError = {
      name: error.name,
      message: error.message,
    };

    if (error.stack) {
      serialized.stack = error.stack;
    }

    // Include any additional properties
    Object.entries(error).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'message' && key !== 'stack') {
        serialized[key] = value;
      }
    });

    return serialized;
  }

  return String(error);
}

/**
 * Sanitize sensitive data from object
 * Pure function - returns new object
 */
export function sanitizeJsonEntry(
  entry: Record<string, unknown>,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey'],
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entry)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitive) =>
      lowerKey.includes(sensitive.toLowerCase()),
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      // We know value is an object here, build a new record
      const nestedRecord: Record<string, unknown> = {};
      Object.assign(nestedRecord, value);
      sanitized[key] = sanitizeJsonEntry(nestedRecord, sensitiveKeys);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Format log entry as JSON
 * Pure function
 */
export function formatJson(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
  options: JsonFormatterOptions = {},
): string {
  const fields = options.fields ?? {};

  const entry: Record<string, unknown> = {
    [fields.timestamp ?? 'timestamp']: timestamp
      ? timestamp.toISOString()
      : new Date().toISOString(),
    [fields.level ?? 'level']: LogLevel[level],
    [fields.message ?? 'message']: message,
  };

  if (options.includeLevelValue !== false) {
    entry[fields.levelValue ?? 'levelValue'] = level;
  }

  if (context && Object.keys(context).length > 0) {
    const contextField = fields.context ?? 'context';
    entry[contextField] = options.sensitiveKeys
      ? sanitizeJsonEntry(context, options.sensitiveKeys)
      : context;
  }

  if (error) {
    entry[fields.error ?? 'error'] = serializeError(error);
  }

  // Sanitize the entire entry if needed
  const finalEntry = options.sensitiveKeys
    ? sanitizeJsonEntry(entry, options.sensitiveKeys)
    : entry;

  let json: string;
  if (options.pretty) {
    json = JSON.stringify(finalEntry, null, options.indent ?? 2);
  } else {
    json = JSON.stringify(finalEntry);
  }

  return options.newline !== false ? json + '\n' : json;
}

/**
 * Create a JSON formatter with options
 * Returns a LogFormatter implementation
 */
export function createJsonFormatter(options: JsonFormatterOptions = {}): LogFormatter {
  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      return formatJson(level, message, error, context, timestamp, options);
    },
  };
}

/**
 * Create a JSON Lines formatter (one JSON object per line)
 * Useful for log aggregation systems
 */
export function createJsonLinesFormatter(
  options: Omit<JsonFormatterOptions, 'pretty' | 'newline'> = {},
): LogFormatter {
  const formatterOptions: JsonFormatterOptions = {
    ...options,
    pretty: false,
    newline: true,
  };

  return createJsonFormatter(formatterOptions);
}

/**
 * Create a compact JSON formatter optimized for size
 * Omits null values and uses short field names
 */
export function createCompactJsonFormatter(
  options: Omit<JsonFormatterOptions, 'fields' | 'pretty'> = {},
): LogFormatter {
  const formatterOptions: JsonFormatterOptions = {
    ...options,
    pretty: false,
    fields: {
      timestamp: 't',
      level: 'l',
      levelValue: 'lv',
      message: 'm',
      context: 'c',
      error: 'e',
    },
  };

  return createJsonFormatter(formatterOptions);
}

/**
 * Default JSON formatter instance
 * Single line JSON with newline
 */
export const defaultJsonFormatter: LogFormatter = createJsonLinesFormatter();
