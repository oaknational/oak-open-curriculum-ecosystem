/**
 * @fileoverview Compact (single-line) layout implementation
 * @module @oak-mcp-core/logging/formatters/pretty/layouts
 */

import type { FormatterLogContext, FormatterLogLevel } from '../types.js';
import { getLevelAbbreviation } from '../levels/index.js';
import { formatCompactError } from '../serializers/index.js';

/**
 * Format log entry in compact format
 * Pure function
 */
export function formatCompact(
  level: FormatterLogLevel,
  message: string,
  error?: unknown,
  context?: FormatterLogContext,
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
    const errorMsg = formatCompactError(error);
    parts.push(`!${errorMsg}`);
  }

  return parts.join(' ') + '\n';
}
