/**
 * @fileoverview Serialization utilities for pretty formatter
 * @module @oak-mcp-core/logging/formatters
 */

import type { LogContext } from '../types/index.js';
import { quoteIfNeeded } from './pretty-text.js';
import { formatError } from './pretty-error.js';

/**
 * Format context object for logging
 * Pure function - recursively serializes objects
 * @param context - Context object to format
 * @param indent - Current indentation
 * @param maxDepth - Maximum recursion depth
 * @param currentDepth - Current recursion depth
 * @returns Formatted context string
 */
export function formatContext(
  context: LogContext,
  indent = '  ',
  maxDepth = 3,
  currentDepth = 0,
): string {
  if (currentDepth >= maxDepth) {
    return '[Object]';
  }

  const entries = Object.entries(context);
  if (entries.length === 0) {
    return '{}';
  }

  const lines: string[] = ['{'];
  for (const [key, value] of entries) {
    const formattedKey = quoteIfNeeded(key);
    const formattedValue = formatValue(value, indent, maxDepth, currentDepth + 1);
    lines.push(`${indent}${formattedKey}: ${formattedValue},`);
  }
  lines.push('}');

  return lines.join('\n');
}

/**
 * Format primitive values
 */
function formatPrimitive(value: unknown): string | null {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  switch (typeof value) {
    case 'string':
      return quoteIfNeeded(value);
    case 'number':
    case 'boolean':
      return String(value);
    default:
      return null;
  }
}

/**
 * Format object values
 */
function formatObject(
  value: object,
  indent: string,
  maxDepth: number,
  currentDepth: number,
): string {
  if (Array.isArray(value)) {
    return formatArray(value, indent, maxDepth, currentDepth);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof Error) {
    return formatError(value, indent, true, false);
  }

  // Format as generic object - safe because we know it's an object
  const context: LogContext = {};
  for (const [key, val] of Object.entries(value)) {
    context[key] = val;
  }
  return formatContext(context, indent, maxDepth, currentDepth);
}

/**
 * Format a single value
 * @param value - Value to format
 * @param indent - Indentation string
 * @param maxDepth - Maximum depth
 * @param currentDepth - Current depth
 * @returns Formatted value
 */
function formatValue(
  value: unknown,
  indent: string,
  maxDepth: number,
  currentDepth: number,
): string {
  const primitive = formatPrimitive(value);
  if (primitive !== null) {
    return primitive;
  }

  if (typeof value === 'object' && value !== null) {
    return formatObject(value, indent, maxDepth, currentDepth);
  }

  // Fallback for functions, symbols, etc.
  return `[${typeof value}]`;
}

/**
 * Format array for logging
 * @param arr - Array to format
 * @param indent - Indentation
 * @param maxDepth - Maximum depth
 * @param currentDepth - Current depth
 * @returns Formatted array
 */
function formatArray(
  arr: unknown[],
  indent: string,
  maxDepth: number,
  currentDepth: number,
): string {
  if (currentDepth >= maxDepth) {
    return `[Array(${String(arr.length)})]`;
  }

  if (arr.length === 0) {
    return '[]';
  }

  const lines: string[] = ['['];
  for (const item of arr) {
    const formattedItem = formatValue(item, indent, maxDepth, currentDepth + 1);
    lines.push(`${indent}${formattedItem},`);
  }
  lines.push(']');

  return lines.join('\n');
}
