/**
 * @fileoverview Layout implementations for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogLevel, LogContext } from '../types/index.js';
import { getLogLevelName } from '../types/index.js';

import type { PrettyFormatterOptions } from './pretty-types.js';
import { Colors, getLevelColor, colorize } from './pretty-colors.js';
import { formatLogLevel } from './pretty-levels.js';
import { indentMultiline } from './pretty-text.js';
import { formatContext } from './pretty-serializers.js';
import { formatError, formatCompactError } from './pretty-error.js';

/**
 * Build header parts for log entry
 */
function buildHeaderParts(
  level: LogLevel,
  message: string,
  timestamp: Date | undefined,
  options: PrettyFormatterOptions,
  useColor: boolean,
): string[] {
  const parts: string[] = [];

  if (options.timestamp && timestamp) {
    const formatter = options.timestampFormat ?? defaultTimestampFormat;
    parts.push(formatTimestamp(timestamp, formatter, useColor));
  }

  parts.push(formatLevel(level, options, useColor));
  parts.push(message);

  return parts;
}

/**
 * Build body lines for log entry
 */
function buildBodyLines(
  error: unknown,
  context: LogContext | undefined,
  options: PrettyFormatterOptions,
): string[] {
  const lines: string[] = [];
  const indent = options.indent ?? '  ';

  if (error) {
    const errorStr = formatError(error, indent, options.includeStack ?? true, false);
    lines.push(indentMultiline(errorStr, indent));
  }

  if (context && Object.keys(context).length > 0) {
    const contextStr = formatContext(context, indent, options.maxContextDepth ?? 3);
    lines.push(indentMultiline(contextStr, indent));
  }

  return lines;
}

/**
 * Format log entry in pretty multi-line format
 * Pure function
 */
export function formatPretty(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
  options: PrettyFormatterOptions = {},
): string {
  const useColor = options.useColor ?? false;

  // Build header
  const headerParts = buildHeaderParts(level, message, timestamp, options, useColor);
  const header = headerParts.join(' ');

  // Build body
  const bodyLines = buildBodyLines(error, context, options);

  // Combine all lines
  return [header, ...bodyLines].join('\n');
}

/**
 * Format log entry in compact single-line format
 * Pure function
 */
export function formatCompact(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): string {
  const parts: string[] = [];

  // Timestamp
  if (timestamp) {
    parts.push(`[${timestamp.toISOString()}]`);
  }

  // Level
  parts.push(formatLogLevel(level, true));

  // Message
  parts.push(message);

  // Error
  if (error) {
    parts.push(formatCompactError(error));
  }

  // Context
  if (context && Object.keys(context).length > 0) {
    parts.push(JSON.stringify(context));
  }

  return parts.join(' ');
}

/**
 * Default timestamp formatter
 */
function defaultTimestampFormat(date: Date): string {
  return date.toISOString();
}

/**
 * Format timestamp part
 */
function formatTimestamp(
  timestamp: Date,
  formatter: (date: Date) => string,
  useColor: boolean,
): string {
  const timestampStr =
    formatter === defaultTimestampFormat
      ? `[${timestamp.toISOString()}]`
      : `[${formatter(timestamp)}]`;

  return useColor ? colorize(timestampStr, Colors.gray) : timestampStr;
}

/**
 * Format level part
 */
function formatLevel(level: LogLevel, options: PrettyFormatterOptions, useColor: boolean): string {
  const levelStr = options.compact ? formatLogLevel(level, true) : getLogLevelName(level).padEnd(5);

  if (useColor) {
    const levelColor = getLevelColor(level);
    return colorize(levelStr, levelColor);
  }

  return levelStr;
}
