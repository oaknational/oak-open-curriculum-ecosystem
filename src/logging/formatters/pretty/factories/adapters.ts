/**
 * @fileoverview Adapter functions for formatter integration
 * @module @oak-mcp-core/logging/formatters/pretty/factories
 */

import type { FormatterLogLevel, FormatterLogContext, FormatterFunction } from '../types.js';
import { LOG_LEVELS } from '../../../types/index.js';

/**
 * Type for log level mapping between external and internal representations
 */
export interface LogLevelMapping {
  TRACE?: number;
  DEBUG?: number;
  INFO?: number;
  WARN?: number;
  ERROR?: number;
  FATAL?: number;
}

/**
 * Create a log level adapter function
 * Maps external log levels to formatter log levels
 */
export function createLogLevelAdapter(
  mapping: LogLevelMapping,
): (level: number) => FormatterLogLevel {
  const reverseMap = new Map<number, FormatterLogLevel>();

  if (mapping.TRACE !== undefined) reverseMap.set(mapping.TRACE, LOG_LEVELS.TRACE.value);
  if (mapping.DEBUG !== undefined) reverseMap.set(mapping.DEBUG, LOG_LEVELS.DEBUG.value);
  if (mapping.INFO !== undefined) reverseMap.set(mapping.INFO, LOG_LEVELS.INFO.value);
  if (mapping.WARN !== undefined) reverseMap.set(mapping.WARN, LOG_LEVELS.WARN.value);
  if (mapping.ERROR !== undefined) reverseMap.set(mapping.ERROR, LOG_LEVELS.ERROR.value);
  if (mapping.FATAL !== undefined) reverseMap.set(mapping.FATAL, LOG_LEVELS.FATAL.value);

  return (level: number): FormatterLogLevel => {
    const mapped = reverseMap.get(level);
    if (mapped === undefined) {
      // Default to INFO for unknown levels
      return LOG_LEVELS.INFO.value;
    }
    return mapped;
  };
}

/**
 * Create an adapted formatter that accepts external log levels
 */
export function createAdaptedFormatter(
  formatter: FormatterFunction,
  levelAdapter: (level: number) => FormatterLogLevel,
): (
  level: number,
  message: string,
  error?: unknown,
  context?: FormatterLogContext,
  timestamp?: Date,
) => string {
  return (
    level: number,
    message: string,
    error?: unknown,
    context?: FormatterLogContext,
    timestamp?: Date,
  ): string => {
    const adaptedLevel = levelAdapter(level);
    return formatter(adaptedLevel, message, error, context, timestamp);
  };
}
