/**
 * @fileoverview Pretty (multiline) layout implementation
 * @module @oak-mcp-core/logging/formatters/pretty/layouts
 */

import type { FormatterLogContext, PrettyFormatterOptions, FormatterLogLevel } from '../types.js';
import { Colors, getLevelColor, colorize } from '../colors/index.js';
import { getLevelAbbreviation } from '../levels/index.js';
import { getLogLevelName } from '../../../types/index.js';
import { formatContext, formatError } from '../serializers/index.js';

/**
 * Format timestamp part
 */
function formatTimestamp(
  timestamp: Date | undefined,
  options: PrettyFormatterOptions,
  useColor: boolean,
): string | undefined {
  if (options.includeTimestamp === false || !timestamp) {
    return undefined;
  }

  const timestampStr = options.timestampFormat
    ? options.timestampFormat(timestamp)
    : `[${timestamp.toISOString()}]`;

  return useColor ? colorize(timestampStr, Colors.gray) : timestampStr;
}

/**
 * Format level part
 */
function formatLevel(
  level: FormatterLogLevel,
  options: PrettyFormatterOptions,
  useColor: boolean,
): string {
  const levelStr = options.compact ? getLevelAbbreviation(level) : getLogLevelName(level).padEnd(5);

  if (useColor) {
    const levelColor = getLevelColor(level);
    return colorize(levelStr, levelColor);
  }

  return levelStr;
}

/**
 * Format context part
 */
function formatContextPart(
  context: FormatterLogContext | undefined,
  options: PrettyFormatterOptions,
  useColor: boolean,
  indent: string,
): string {
  if (!context || Object.keys(context).length === 0) {
    return '';
  }

  if (options.compact) {
    const contextPairs = Object.entries(context)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(' ');
    return ` [${contextPairs}]`;
  }

  const contextStr = formatContext(context, indent, options.maxContextDepth ?? 3);
  const formatted = '\n' + contextStr;
  return useColor ? colorize(formatted, Colors.gray) : formatted;
}

/**
 * Format log entry in pretty human-readable format
 * Pure function
 */
export function formatPretty(
  level: FormatterLogLevel,
  message: string,
  error?: unknown,
  context?: FormatterLogContext,
  timestamp?: Date,
  options: PrettyFormatterOptions = {},
): string {
  const useColor = options.useColor ?? false;
  const indent = options.indent ?? '  ';

  // Build parts array
  const parts: string[] = [];

  const timestampPart = formatTimestamp(timestamp, options, useColor);
  if (timestampPart) {
    parts.push(timestampPart);
  }

  parts.push(formatLevel(level, options, useColor));
  parts.push(message);

  let output = parts.join(' ');
  output += formatContextPart(context, options, useColor, indent);

  // Error
  if (error) {
    const errorStr = formatError(
      error,
      indent,
      options.includeStackTrace !== false,
      false, // not compact
    );

    output += useColor ? colorize(errorStr, Colors.red) : errorStr;
  }

  return output + '\n';
}
