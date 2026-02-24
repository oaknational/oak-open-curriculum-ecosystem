/**
 * Type guards for universal tool names.
 *
 * These type predicates enable TypeScript to narrow types when working
 * with tool names, distinguishing between aggregated tools (hand-written)
 * and generated tools (from OpenAPI spec).
 */

import type { ToolName } from '@oaknational/curriculum-sdk-generation/mcp-tools';
import { AGGREGATED_TOOL_DEFS } from './definitions.js';
import type { AggregatedToolName, UniversalToolName } from './types.js';

/**
 * Type predicate for aggregated tool names.
 *
 * Derived from `AGGREGATED_TOOL_DEFS` so the guard stays in sync
 * with the definitions automatically. Adding a new aggregated tool
 * to the definitions map is sufficient — no manual update here.
 *
 * @param value - Value to check
 * @returns True if value is an aggregated tool name
 *
 * @example
 * ```typescript
 * if (isAggregatedToolName(toolName)) {
 *   // TypeScript knows toolName is AggregatedToolName
 *   return executeAggregatedTool(toolName, args);
 * }
 * ```
 */
export function isAggregatedToolName(value: unknown): value is AggregatedToolName {
  return typeof value === 'string' && value in AGGREGATED_TOOL_DEFS;
}

/**
 * Type predicate for any universal tool name.
 *
 * Checks if a value is either an aggregated tool name or a generated
 * tool name from the OpenAPI spec.
 *
 * @param value - Value to check
 * @returns True if value is a valid universal tool name
 *
 * @example
 * ```typescript
 * if (!isUniversalToolName(name, registry.isToolName)) {
 *   return formatError(`Unknown tool: ${name}`);
 * }
 * // TypeScript knows name is UniversalToolName here
 * ```
 */
export function isUniversalToolName(
  value: unknown,
  isToolNameFn: (v: unknown) => v is ToolName,
): value is UniversalToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return isAggregatedToolName(value) || isToolNameFn(value);
}
