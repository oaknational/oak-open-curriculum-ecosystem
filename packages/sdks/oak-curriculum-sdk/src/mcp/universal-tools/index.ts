/**
 * Universal tools module for MCP server registration.
 *
 * This module provides a unified interface for working with all MCP tools,
 * both aggregated (hand-written) and generated (from OpenAPI spec).
 *
 * ## Architecture
 *
 * The module is organized into single-responsibility files:
 *
 * - `definitions.ts` - Aggregated tool definition map
 * - `types.ts` - Type definitions and interfaces
 * - `type-guards.ts` - Type predicates for tool name validation
 * - `zod-utils.ts` - Zod schema extraction utilities
 * - `list-tools.ts` - Tool listing for MCP registration
 * - `executor.ts` - Tool execution dispatch logic
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   listUniversalTools,
 *   createUniversalToolExecutor,
 *   isUniversalToolName,
 * } from './universal-tools/index.js';
 *
 * // List all tools for registration
 * const tools = listUniversalTools();
 *
 * // Create executor for tool invocations
 * const executor = createUniversalToolExecutor({ executeMcpTool });
 *
 * // Execute a tool
 * const result = await executor('search', { query: 'fractions' });
 * ```
 *
 * @module universal-tools
 */

// Aggregated tool definitions
export { AGGREGATED_TOOL_DEFS } from './definitions.js';

// Type definitions
export type {
  AggregatedToolName,
  UniversalToolName,
  UniversalToolInputSchema,
  ToolAnnotations,
  ToolMeta,
  UniversalToolListEntry,
} from './types.js';

// Type guards
export { isAggregatedToolName, isUniversalToolName } from './type-guards.js';

// Zod utilities (internal, but exported for testing)
export { isZodObject, extractZodShape } from './zod-utils.js';

// Tool listing
export { listUniversalTools } from './list-tools.js';

// Tool execution
export { createUniversalToolExecutor, type UniversalToolExecutorDependencies } from './executor.js';
