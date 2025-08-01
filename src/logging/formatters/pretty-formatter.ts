/**
 * @fileoverview Pretty formatter implementation for human-readable logging
 * @module @oak-mcp-core/logging
 *
 * This formatter will be extracted to oak-mcp-core.
 * Pure functions only - no side effects.
 */

import { LogLevel, type LogFormatter, type LogContext } from '../logger-interface.js';

/**
 * Pretty formatter options
 */
export interface PrettyFormatterOptions {
  /**
   * Include timestamp
   */
  includeTimestamp?: boolean;

  /**
   * Timestamp format function
   */
  timestampFormat?: (date: Date) => string;

  /**
   * Use colors (ANSI escape codes)
   */
  useColor?: boolean;

  /**
   * Compact mode (single line)
   */
  compact?: boolean;

  /**
   * Indentation for multi-line output
   */
  indent?: string;

  /**
   * Include stack traces for errors
   */
  includeStackTrace?: boolean;

  /**
   * Maximum context depth to display
   */
  maxContextDepth?: number;
}

/**
 * ANSI color codes
 */
export const Colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
} as const;

/**
 * Get color for log level
 * Pure function
 */
export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case LogLevel.TRACE:
      return Colors.gray;
    case LogLevel.DEBUG:
      return Colors.cyan;
    case LogLevel.INFO:
      return Colors.green;
    case LogLevel.WARN:
      return Colors.yellow;
    case LogLevel.ERROR:
      return Colors.red;
    case LogLevel.FATAL:
      return Colors.magenta;
    default:
      return Colors.reset;
  }
}

/**
 * Apply color to text
 * Pure function
 */
export function colorize(text: string, colorCode: string): string {
  return `${colorCode}${text}${Colors.reset}`;
}

/**
 * Get short level abbreviation
 * Pure function
 */
export function getLevelAbbreviation(level: LogLevel): string {
  const abbrevMap: Record<LogLevel, string> = {
    [LogLevel.TRACE]: 'TRC',
    [LogLevel.DEBUG]: 'DBG',
    [LogLevel.INFO]: 'INF',
    [LogLevel.WARN]: 'WRN',
    [LogLevel.ERROR]: 'ERR',
    [LogLevel.FATAL]: 'FTL',
  };
  return abbrevMap[level] || 'UNK';
}

/**
 * Indent multiline text
 * Pure function
 */
export function indentMultiline(text: string, indent = '  '): string {
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? line : indent + line))
    .join('\n');
}

/**
 * Format context object for display
 * Pure function
 */
export function formatContext(
  context: LogContext,
  indent = '  ',
  maxDepth = 3,
  currentDepth = 0,
): string {
  if (currentDepth >= maxDepth) {
    return JSON.stringify(context);
  }

  const entries = Object.entries(context);
  if (entries.length === 0) return '';

  return entries
    .map(([key, value]) => {
      let valueStr: string;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (currentDepth + 1 < maxDepth) {
          // Type-safe nested object formatting
          const nestedContext: LogContext = {};
          Object.assign(nestedContext, value);
          const nested = formatContext(nestedContext, indent + '  ', maxDepth, currentDepth + 1);
          valueStr = '{\n' + nested + '\n' + indent + '}';
        } else {
          valueStr = JSON.stringify(value);
        }
      } else {
        valueStr = JSON.stringify(value);
      }

      return `${indent}${key}: ${valueStr}`;
    })
    .join('\n');
}

/**
 * Format log entry in pretty human-readable format
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
  const levelStr = options.compact
    ? getLevelAbbreviation(level)
    : (LogLevel[level] || 'UNKNOWN').padEnd(5);

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
    const errorPrefix = options.compact ? ' !' : '\n' + indent + 'Error: ';

    if (error instanceof Error) {
      const errorMsg = error.message;
      const errorStr = options.compact
        ? errorPrefix + errorMsg
        : errorPrefix +
          errorMsg +
          (options.includeStackTrace !== false && error.stack
            ? '\n' + indentMultiline(error.stack, indent)
            : '');

      if (useColor) {
        output += colorize(errorStr, Colors.red);
      } else {
        output += errorStr;
      }
    } else {
      const errorStr = errorPrefix + String(error);
      if (useColor) {
        output += colorize(errorStr, Colors.red);
      } else {
        output += errorStr;
      }
    }
  }

  return output + '\n';
}

/**
 * Format log entry in compact format
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

  // Short timestamp (time only)
  if (timestamp) {
    const timeParts = timestamp.toISOString().split('T');
    const time = timeParts[1] ? timeParts[1].replace('Z', '') : '';
    parts.push(time);
  }

  // Short level
  parts.push(getLevelAbbreviation(level));

  // Message
  parts.push(message);

  // Inline context
  if (context && Object.keys(context).length > 0) {
    const contextPairs = Object.entries(context)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(' ');
    parts.push(`[${contextPairs}]`);
  }

  // Inline error
  if (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    parts.push(`!${errorMsg}`);
  }

  return parts.join(' ') + '\n';
}

/**
 * Create a pretty formatter with options
 * Returns a LogFormatter implementation
 */
export function createPrettyFormatter(options: PrettyFormatterOptions = {}): LogFormatter {
  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      return formatPretty(level, message, error, context, timestamp, options);
    },
  };
}

/**
 * Create a compact formatter
 * Single line output for space efficiency
 */
export function createCompactFormatter(): LogFormatter {
  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      return formatCompact(level, message, error, context, timestamp);
    },
  };
}

/**
 * Create a colorized formatter for TTY output
 * Automatically detects TTY in Node.js
 */
export function createColorizedFormatter(
  options: Omit<PrettyFormatterOptions, 'useColor'> = {},
): LogFormatter {
  // Detect TTY (Node.js specific, safe fallback for other environments)
  const isTTY =
    typeof process !== 'undefined' && process.stdout && typeof process.stdout.isTTY === 'boolean'
      ? process.stdout.isTTY
      : false;

  return createPrettyFormatter({
    ...options,
    useColor: isTTY,
  });
}

/**
 * Default pretty formatter instance
 * No colors, includes timestamp
 */
export const defaultPrettyFormatter: LogFormatter = createPrettyFormatter({
  includeTimestamp: true,
  useColor: false,
});
