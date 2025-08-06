/**
 * @fileoverview Core JSON formatting logic
 * @module @oak-mcp-core/logging/formatters/json
 */

import type { LogLevel, LogContext } from '../../logger-interface.js';
import { getLogLevelName } from '../../../../stroma/types/index.js';
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
  if (context.error !== undefined) {
    entry[fieldNames.error] = sanitizeJsonEntry(context.error, sensitiveKeys);
  }

  // Add other context (excluding error which was already handled)
  const contextEntries = Object.entries(context).filter(([key]) => key !== 'error');
  if (contextEntries.length > 0) {
    const otherContext = Object.fromEntries(contextEntries);
    entry[fieldNames.context] = sanitizeJsonEntry(otherContext, sensitiveKeys);
  }
}

/**
 * Build the core log entry structure
 */
function buildLogEntry(
  timestamp: Date,
  level: LogLevel,
  message: string,
  fieldNames: ReturnType<typeof createFieldNames>,
): Record<string, unknown> {
  return {
    [fieldNames.timestamp]: timestamp.toISOString(),
    [fieldNames.level]: getLogLevelName(level),
    [fieldNames.message]: message,
  };
}

/**
 * Serialize log entry to JSON string
 */
function serializeEntry(
  entry: Record<string, unknown>,
  pretty: boolean,
  indent: number,
  newline: boolean,
): string {
  const json = pretty ? JSON.stringify(entry, null, indent) : JSON.stringify(entry);
  return newline ? json + '\n' : json;
}

/**
 * Apply default options
 */
function applyDefaults(options: JsonFormatterOptions): Required<JsonFormatterOptions> {
  return {
    pretty: options.pretty ?? false,
    indent: options.indent ?? 2,
    newline: options.newline ?? true,
    fields: options.fields ?? {},
    includeLevelValue: options.includeLevelValue ?? false,
    sensitiveKeys: options.sensitiveKeys ?? [],
    maxDepth: options.maxDepth ?? 10,
  };
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
  const opts = applyDefaults(options);
  const fieldNames = createFieldNames(opts.fields);
  const entry = buildLogEntry(timestamp, level, message, fieldNames);

  if (opts.includeLevelValue) {
    entry[fieldNames.levelValue] = level;
  }

  addContextToEntry(entry, context, fieldNames, opts.sensitiveKeys);

  return serializeEntry(entry, opts.pretty, opts.indent, opts.newline);
}
