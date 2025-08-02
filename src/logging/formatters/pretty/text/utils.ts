/**
 * @fileoverview Text formatting utilities
 * @module @oak-mcp-core/logging/formatters/pretty/text
 */

/**
 * Indent multiline text
 * Pure function
 */
export function indentMultiline(text: string, indent = '  '): string {
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? line : indent + line))
    .join('\n');
}
