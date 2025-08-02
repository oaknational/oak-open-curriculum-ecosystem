/**
 * @fileoverview Level formatting utilities
 * @module @oak-mcp-core/logging/formatters/pretty/levels
 */

import type { FormatterLogLevel } from '../types.js';
import { LOG_LEVELS } from '../../../types/index.js';

/**
 * Get short level abbreviation
 * Pure function
 * @throws Error if the level is not a valid log level
 */
export function getLevelAbbreviation(level: FormatterLogLevel): string {
  const abbrevMap: Record<FormatterLogLevel, string> = {
    [LOG_LEVELS.TRACE.value]: 'TRC',
    [LOG_LEVELS.DEBUG.value]: 'DBG',
    [LOG_LEVELS.INFO.value]: 'INF',
    [LOG_LEVELS.WARN.value]: 'WRN',
    [LOG_LEVELS.ERROR.value]: 'ERR',
    [LOG_LEVELS.FATAL.value]: 'FTL',
  };
  const abbreviation = abbrevMap[level];
  if (!abbreviation) {
    throw new TypeError(
      `Invalid log level: ${String(level)}. Valid levels are: ${Object.entries(LOG_LEVELS)
        .map(([key, val]) => `${key}=${String(val.value)}`)
        .join(', ')}`,
    );
  }
  return abbreviation;
}
