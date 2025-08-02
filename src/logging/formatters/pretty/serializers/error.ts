/**
 * @fileoverview Error serialization utilities
 * @module @oak-mcp-core/logging/formatters/pretty/serializers
 */

import { indentMultiline } from '../text/index.js';

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

  if (error instanceof Error) {
    const errorMsg = error.message;
    const errorStr = compact
      ? errorPrefix + errorMsg
      : errorPrefix +
        errorMsg +
        (includeStack && error.stack ? '\n' + indentMultiline(error.stack, indent) : '');

    return errorStr;
  }

  // Handle non-Error error values
  let errorValue: string;
  if (typeof error === 'object') {
    errorValue = errorPrefix + JSON.stringify(error, null, 2);
  } else if (typeof error === 'string') {
    errorValue = errorPrefix + error;
  } else if (typeof error === 'number' || typeof error === 'boolean') {
    errorValue = errorPrefix + String(error);
  } else {
    errorValue = errorPrefix + '[unknown]';
  }

  return errorValue;
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
