/**
 * @fileoverview Text formatting utilities for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

/**
 * Indent multiline text
 * Pure function
 * @param text - Text to indent
 * @param indent - Indentation string
 * @returns Indented text
 */
export function indentMultiline(text: string, indent = '  '): string {
  return text
    .split('\n')
    .map((line) => (line ? indent + line : line))
    .join('\n');
}

/**
 * Truncate text to maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Wrap text in quotes if it contains spaces or special characters
 * @param text - Text to wrap
 * @returns Wrapped text
 */
export function quoteIfNeeded(text: string): string {
  if (/[\s"'{}[\],:]/.test(text)) {
    return `"${text.replace(/"/g, '\\"')}"`;
  }
  return text;
}
