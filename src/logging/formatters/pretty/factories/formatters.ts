/**
 * @fileoverview Formatter factory functions
 * @module @oak-mcp-core/logging/formatters/pretty/factories
 */

import type {
  FormatterFunction,
  PrettyFormatterOptions,
  FormatterLogLevel,
  FormatterLogContext,
} from '../types.js';
import { formatPretty, formatCompact } from '../layouts/index.js';

/**
 * Create a pretty formatter with options
 * Returns a formatter function
 * Pure function - returns a pure function
 */
export function createPrettyFormatter(options: PrettyFormatterOptions = {}): FormatterFunction {
  return (
    level: FormatterLogLevel,
    message: string,
    error?: unknown,
    context?: FormatterLogContext,
    timestamp?: Date,
  ) => {
    return formatPretty(level, message, error, context, timestamp, options);
  };
}

/**
 * Create a compact formatter
 * Returns a formatter function
 * Pure function - returns a pure function
 */
export function createCompactFormatter(): FormatterFunction {
  return (
    level: FormatterLogLevel,
    message: string,
    error?: unknown,
    context?: FormatterLogContext,
    timestamp?: Date,
  ) => {
    return formatCompact(level, message, error, context, timestamp);
  };
}

/**
 * Create a formatter from a layout name
 * Factory function for convenience
 */
export function createFormatterByName(
  name: 'pretty' | 'compact',
  options: PrettyFormatterOptions = {},
): FormatterFunction {
  switch (name) {
    case 'pretty':
      return createPrettyFormatter(options);
    case 'compact':
      return createCompactFormatter();
    default:
      // TypeScript exhaustiveness check
      name satisfies never;
      return createPrettyFormatter(options);
  }
}
