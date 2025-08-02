/**
 * @fileoverview Context serialization utilities
 * @module @oak-mcp-core/logging/formatters/pretty/serializers
 */

import type { FormatterLogContext } from '../types.js';

/**
 * Format context object for display
 * Pure function
 */
export function formatContext(
  context: FormatterLogContext,
  indent = '  ',
  maxDepth = 3,
  currentDepth = 0,
): string {
  if (currentDepth >= maxDepth) {
    return JSON.stringify(context);
  }

  const entries = Object.entries(context);
  if (entries.length === 0) return '';

  return entries
    .map(([key, value]) => {
      let valueStr: string;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (currentDepth + 1 < maxDepth) {
          // Type-safe nested object formatting
          const nestedContext: FormatterLogContext = {};
          Object.assign(nestedContext, value);
          const nested = formatContext(nestedContext, indent + '  ', maxDepth, currentDepth + 1);
          valueStr = '{\n' + nested + '\n' + indent + '}';
        } else {
          valueStr = JSON.stringify(value);
        }
      } else {
        valueStr = JSON.stringify(value);
      }

      return `${indent}${key}: ${valueStr}`;
    })
    .join('\n');
}
