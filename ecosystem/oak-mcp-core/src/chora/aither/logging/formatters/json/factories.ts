/**
 * @fileoverview Factory functions for JSON formatters
 * @module @oak-mcp-core/logging/formatters/json
 */

import type { LogFormatter, LogLevel } from '../../logger-interface.js';
import { formatJson } from './formatter.js';
import type { JsonFormatterOptions } from './types.js';

/**
 * Internal formatter function type
 */
type FormatterFunction = (
  timestamp: Date,
  level: LogLevel,
  message: string,
  context: Record<string, unknown>,
) => string;

/**
 * Creates a JSON formatter with the given options
 */
export function createJsonFormatter(options: JsonFormatterOptions = {}): LogFormatter {
  const formatter: FormatterFunction = (timestamp, level, message, context) => {
    try {
      return formatJson(timestamp, level, message, context, options);
    } catch (error) {
      // Fallback for formatter errors
      return (
        JSON.stringify({
          timestamp: timestamp.toISOString(),
          level: 'ERROR',
          message: 'Failed to format log entry',
          error: String(error),
          originalMessage: message,
        }) + '\n'
      );
    }
  };

  return {
    format: (level, message, error, context = {}, timestamp = new Date()) => {
      // Merge error into context if provided
      const fullContext = error ? { ...context, error } : context;
      return formatter(timestamp, level, message, fullContext);
    },
  };
}

/**
 * Creates a JSON Lines formatter (one JSON object per line)
 */
export function createJsonLinesFormatter(
  options: Omit<JsonFormatterOptions, 'pretty' | 'newline'> = {},
): LogFormatter {
  return createJsonFormatter({
    ...options,
    pretty: false,
    newline: true,
  });
}

/**
 * Creates a compact JSON formatter (no newlines)
 */
export function createCompactJsonFormatter(
  options: Omit<JsonFormatterOptions, 'pretty' | 'newline'> = {},
): LogFormatter {
  return createJsonFormatter({
    ...options,
    pretty: false,
    newline: false,
  });
}

/**
 * Creates a pretty JSON formatter (formatted with indentation)
 */
export function createPrettyJsonFormatter(
  options: Omit<JsonFormatterOptions, 'pretty'> = {},
): LogFormatter {
  return createJsonFormatter({
    ...options,
    pretty: true,
  });
}

/**
 * Default JSON formatter for general use
 */
export const defaultJsonFormatter: LogFormatter = createJsonLinesFormatter();
