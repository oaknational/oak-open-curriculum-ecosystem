/**
 * @fileoverview Factory functions for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogLevel } from '../types/index.js';
import { LOG_LEVELS } from '../types/index.js';
import type { FormatterFunction, PrettyFormatterOptions, LogLevelMapping } from './pretty-types.js';
import { formatPretty, formatCompact } from './pretty-layouts.js';

/**
 * Create pretty formatter with options
 * Factory function that returns a formatter
 */
export function createPrettyFormatter(options: PrettyFormatterOptions = {}): FormatterFunction {
  return (level, message, error, context, timestamp = new Date()) => {
    return formatPretty(level, message, error, context, timestamp, options);
  };
}

/**
 * Create compact formatter
 * Factory function that returns a single-line formatter
 */
export function createCompactFormatter(): FormatterFunction {
  return (level, message, error, context, timestamp = new Date()) => {
    return formatCompact(level, message, error, context, timestamp);
  };
}

/**
 * Create formatter by name
 * Factory function that returns named formatter
 */
export function createFormatterByName(
  name: 'pretty' | 'compact',
  options: PrettyFormatterOptions = {},
): FormatterFunction {
  switch (name) {
    case 'compact':
      return createCompactFormatter();
    case 'pretty':
    default:
      return createPrettyFormatter(options);
  }
}

/**
 * Create a log level adapter function
 * Maps external log levels to formatter log levels
 */
export function createLogLevelAdapter(mapping: LogLevelMapping): (level: number) => LogLevel {
  const reverseMap = new Map<number, LogLevel>();

  if (mapping.TRACE !== undefined) reverseMap.set(mapping.TRACE, LOG_LEVELS.TRACE.value);
  if (mapping.DEBUG !== undefined) reverseMap.set(mapping.DEBUG, LOG_LEVELS.DEBUG.value);
  if (mapping.INFO !== undefined) reverseMap.set(mapping.INFO, LOG_LEVELS.INFO.value);
  if (mapping.WARN !== undefined) reverseMap.set(mapping.WARN, LOG_LEVELS.WARN.value);
  if (mapping.ERROR !== undefined) reverseMap.set(mapping.ERROR, LOG_LEVELS.ERROR.value);
  if (mapping.FATAL !== undefined) reverseMap.set(mapping.FATAL, LOG_LEVELS.FATAL.value);

  return (level: number): LogLevel => {
    const mapped = reverseMap.get(level);
    if (mapped === undefined) {
      // Find closest level
      let closest: LogLevel = LOG_LEVELS.INFO.value;
      let minDiff = Math.abs(level - closest);

      for (const [sourceLevel, targetLevel] of reverseMap) {
        const diff = Math.abs(level - sourceLevel);
        if (diff < minDiff) {
          minDiff = diff;
          closest = targetLevel;
        }
      }

      return closest;
    }
    return mapped;
  };
}

/**
 * Create an adapted formatter that maps external log levels
 * Adapter pattern for external logging systems
 */
export function createAdaptedFormatter(
  formatter: FormatterFunction,
  levelAdapter: (level: number) => LogLevel,
): (
  level: number,
  message: string,
  error?: unknown,
  context?: Record<string, unknown>,
  timestamp?: Date,
) => string {
  return (level, message, error, context, timestamp) => {
    const adaptedLevel = levelAdapter(level);
    return formatter(adaptedLevel, message, error, context, timestamp);
  };
}
