/**
 * @fileoverview File formatter implementations
 * @module @oak-mcp-core/logging/transports
 *
 * Formatter utilities for file logging output. Provides default and
 * customizable formatters for converting log entries to string format.
 */

// =============================================================================
// IMPORTS
// =============================================================================
import type { LogLevel } from '../../../stroma/types/logging.js';
import { getLogLevelName } from '../../../stroma/types/logging.js';
import type { LogContext, LogFormatter } from '../types/index.js';
import { serializeError } from './file-error-serializer.js';

// =============================================================================
// FORMATTER FUNCTIONS
// =============================================================================

/**
 * Default formatter for file output
 * Pure function - no side effects
 */
export function defaultFileFormatter(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: LogContext,
  timestamp?: Date,
): string {
  const parts: string[] = [];

  // Add timestamp
  if (timestamp) {
    parts.push(timestamp.toISOString());
  }

  // Add level
  parts.push(`[${getLogLevelName(level)}]`);

  // Add message
  parts.push(message);

  // Add context if present
  if (context && Object.keys(context).length > 0) {
    parts.push(JSON.stringify(context));
  }

  // Add error if present
  const errorStr = serializeError(error);
  if (errorStr) {
    parts.push(errorStr);
  }

  return parts.join(' ') + '\n';
}

/**
 * Create default formatter with options
 * Factory function for customizable formatting
 */
export function createDefaultFormatter(
  options: {
    includeTimestamp?: boolean;
    includeStackTrace?: boolean;
  } = {},
): LogFormatter {
  const { includeTimestamp = true, includeStackTrace = true } = options;

  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      // Use timestamp if includeTimestamp is true
      const ts = includeTimestamp ? (timestamp ?? new Date()) : undefined;

      // Process error based on includeStackTrace option
      let processedError = error;
      if (error instanceof Error && !includeStackTrace) {
        processedError = error.message;
      }

      return defaultFileFormatter(level, message, processedError, context, ts);
    },
  };
}

/**
 * Helper to create a simple file formatter
 * Pure function factory
 */
export function createSimpleFileFormatter(
  options: {
    delimiter?: string;
    includeLevel?: boolean;
    includeTimestamp?: boolean;
    dateFormat?: (date: Date) => string;
  } = {},
): LogFormatter {
  const {
    delimiter = ' | ',
    includeLevel = true,
    includeTimestamp = true,
    dateFormat = (d) => d.toISOString(),
  } = options;

  return {
    format: (
      level: LogLevel,
      message: string,
      error?: unknown,
      context?: LogContext,
      timestamp?: Date,
    ): string => {
      const parts: string[] = [];

      if (includeTimestamp && timestamp) {
        parts.push(dateFormat(timestamp));
      }

      if (includeLevel) {
        parts.push(getLogLevelName(level));
      }

      parts.push(message);

      if (context && Object.keys(context).length > 0) {
        parts.push(JSON.stringify(context));
      }

      const errorStr = serializeError(error, false);
      if (errorStr) {
        parts.push(errorStr);
      }

      return parts.join(delimiter) + '\n';
    },
  };
}
