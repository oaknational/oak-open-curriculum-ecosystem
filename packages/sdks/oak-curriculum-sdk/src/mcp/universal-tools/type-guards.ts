/**
 * Type guards for universal tool names.
 *
 * These type predicates enable TypeScript to narrow types when working
 * with tool names, distinguishing between aggregated tools (hand-written)
 * and generated tools (from OpenAPI spec).
 */

import { isToolName } from '../../types/generated/api-schema/mcp-tools/index.js';
import type { AggregatedToolName, UniversalToolName } from './types.js';

/**
 * Type predicate for aggregated tool names.
 *
 * Aggregated tools are hand-written tools that combine multiple API
 * calls into a single operation. They have different execution paths
 * than generated tools.
 *
 * @param value - Value to check
 * @returns True if value is an aggregated tool name
 *
 * @example
 * ```typescript
 * if (isAggregatedToolName(toolName)) {
 *   // TypeScript knows toolName is 'search' | 'fetch' | 'get-ontology' | 'get-help' | ...
 *   return executeAggregatedTool(toolName, args);
 * }
 * ```
 */
export function isAggregatedToolName(value: unknown): value is AggregatedToolName {
  return (
    value === 'search' ||
    value === 'fetch' ||
    value === 'get-ontology' ||
    value === 'get-help' ||
    value === 'get-knowledge-graph' ||
    value === 'get-thread-progressions' ||
    value === 'get-prerequisite-graph'
  );
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
 * if (!isUniversalToolName(name)) {
 *   return formatError(`Unknown tool: ${name}`);
 * }
 * // TypeScript knows name is UniversalToolName here
 * ```
 */
export function isUniversalToolName(value: unknown): value is UniversalToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return isAggregatedToolName(value) || isToolName(value);
}
