/**
 * @fileoverview Core JSON formatting logic
 * @module @oak-mcp-core/logging/formatters/json
 */

import type { LogLevel, LogContext } from '../../logger-interface.js';
import { getLogLevelName } from '../../types/index.js';
import { sanitizeJsonEntry } from './sanitizer.js';
import type { JsonFormatterOptions } from './types.js';

/**
 * Creates the field names mapping
 */
function createFieldNames(fields: JsonFormatterOptions['fields'] = {}) {
  return {
    timestamp: fields.timestamp ?? 'timestamp',
    level: fields.level ?? 'level',
    levelValue: fields.levelValue ?? 'levelValue',
    message: fields.message ?? 'message',
    context: fields.context ?? 'context',
    error: fields.error ?? 'error',
  };
}

/**
 * Adds context to the log entry
 */
function addContextToEntry(
  entry: Record<string, unknown>,
  context: LogContext,
  fieldNames: ReturnType<typeof createFieldNames>,
  sensitiveKeys: string[],
): void {
  // Add error field if present
  if (context['error'] !== undefined) {
    entry[fieldNames.error] = sanitizeJsonEntry(context['error'], sensitiveKeys);
  }

  // Add other context (excluding error which was already handled)
  const contextEntries = Object.entries(context).filter(([key]) => key !== 'error');
  if (contextEntries.length > 0) {
    const otherContext = Object.fromEntries(contextEntries);
    entry[fieldNames.context] = sanitizeJsonEntry(otherContext, sensitiveKeys);
  }
}

/**
 * Formats a log entry as JSON
 */
export function formatJson(
  timestamp: Date,
  level: LogLevel,
  message: string,
  context: LogContext,
  options: JsonFormatterOptions = {},
): string {
  const {
    pretty = false,
    indent = 2,
    newline = true,
    fields = {},
    includeLevelValue = false,
    sensitiveKeys = [],
  } = options;

  const fieldNames = createFieldNames(fields);

  const entry: Record<string, unknown> = {
    [fieldNames.timestamp]: timestamp.toISOString(),
    [fieldNames.level]: getLogLevelName(level),
    [fieldNames.message]: message,
  };

  if (includeLevelValue) {
    entry[fieldNames.levelValue] = level;
  }

  // Context is always an object (Record<string, unknown>)
  addContextToEntry(entry, context, fieldNames, sensitiveKeys);

  const json = pretty ? JSON.stringify(entry, null, indent) : JSON.stringify(entry);

  return newline ? json + '\n' : json;
}
