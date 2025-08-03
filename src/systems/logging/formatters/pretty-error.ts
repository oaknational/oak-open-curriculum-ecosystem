/**
 * @fileoverview Error formatting utilities for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

/**
 * Format error for logging
 * Pure function
 * @param error - Error to format
 * @param indent - Indentation string
 * @param includeStack - Whether to include stack trace
 * @param compact - Use compact format
 * @returns Formatted error string
 */
export function formatError(
  error: unknown,
  indent = '  ',
  includeStack = true,
  compact = false,
): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  if (compact) {
    return formatCompactError(error);
  }

  const lines: string[] = [`${error.name}: ${error.message}`];

  if (includeStack && error.stack) {
    const stackLines = error.stack.split('\n').slice(1); // Skip first line (already in message)
    lines.push(...stackLines.map((line) => indent + line.trim()));
  }

  return lines.join('\n');
}

/**
 * Format error in compact single-line format
 * Pure function
 * @param error - Error to format
 * @returns Compact error string
 */
export function formatCompactError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const location = extractErrorLocation(error);
  return location
    ? `${error.name}: ${error.message} (${location})`
    : `${error.name}: ${error.message}`;
}

/**
 * Extract location from error stack
 * @param error - Error object
 * @returns Location string or null
 */
function extractErrorLocation(error: Error): string | null {
  if (!error.stack) return null;

  const stackLines = error.stack.split('\n');
  for (const line of stackLines.slice(1)) {
    const match = /at\s+(.+)\s+\((.+):(\d+):(\d+)\)/.exec(line);
    if (match?.[2] && match[3] && match[4]) {
      const file = match[2];
      const lineNum = match[3];
      const col = match[4];
      return `${file}:${lineNum}:${col}`;
    }
  }

  return null;
}
