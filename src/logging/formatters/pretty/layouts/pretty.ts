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
  const parts: string[] = [];
  const useColor = options.useColor ?? false;
  const indent = options.indent ?? '  ';

  // Timestamp
  if (options.includeTimestamp !== false && timestamp) {
    const timestampStr = options.timestampFormat
      ? options.timestampFormat(timestamp)
      : `[${timestamp.toISOString()}]`;
    parts.push(useColor ? colorize(timestampStr, Colors.gray) : timestampStr);
  }

  // Level
  const levelStr = options.compact ? getLevelAbbreviation(level) : getLogLevelName(level).padEnd(5);

  if (useColor) {
    const levelColor = getLevelColor(level);
    parts.push(colorize(levelStr, levelColor));
  } else {
    parts.push(levelStr);
  }

  // Message
  parts.push(message);

  let output = parts.join(' ');

  // Context
  if (context && Object.keys(context).length > 0) {
    if (options.compact) {
      // Inline context for compact mode
      const contextPairs = Object.entries(context)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(' ');
      output += ` [${contextPairs}]`;
    } else {
      // Multi-line context
      const contextStr = formatContext(context, indent, options.maxContextDepth ?? 3);
      if (useColor) {
        output += '\n' + colorize(contextStr, Colors.gray);
      } else {
        output += '\n' + contextStr;
      }
    }
  }

  // Error
  if (error) {
    const errorStr = formatError(
      error,
      indent,
      options.includeStackTrace !== false,
      false, // not compact
    );

    if (useColor) {
      output += colorize(errorStr, Colors.red);
    } else {
      output += errorStr;
    }
  }

  return output + '\n';
}
