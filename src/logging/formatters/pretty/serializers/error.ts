/**
 * @fileoverview Error serialization utilities
 * @module @oak-mcp-core/logging/formatters/pretty/serializers
 */

import { indentMultiline } from '../text/index.js';

/**
 * Format error content based on type
 */
function formatErrorContent(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  const type = typeof error;
  if (type === 'object') {
    return JSON.stringify(error, null, 2);
  }
  if (type === 'string') {
    return String(error);
  }
  if (type === 'number' || type === 'boolean') {
    return String(error);
  }

  return '[unknown]';
}

/**
 * Format error for pretty display
 * Pure function
 */
export function formatError(
  error: unknown,
  indent: string,
  includeStack: boolean,
  compact: boolean,
): string {
  const errorPrefix = compact ? ' !' : '\n' + indent + 'Error: ';
  const content = formatErrorContent(error);

  // Add stack trace for Error instances when not compact
  if (!compact && includeStack && error instanceof Error && error.stack) {
    return errorPrefix + content + '\n' + indentMultiline(error.stack, indent);
  }

  return errorPrefix + content;
}

/**
 * Format error for compact display
 * Pure function
 */
export function formatCompactError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object') {
    return JSON.stringify(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'number' || typeof error === 'boolean') {
    return String(error);
  }

  return '[unknown]';
}
