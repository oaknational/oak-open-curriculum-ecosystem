/**
 * Universal tools module for MCP server registration.
 *
 * This module provides a unified interface for working with all MCP tools,
 * both aggregated (hand-written) and generated (from OpenAPI spec).
 *
 * ## Architecture
 *
 * The module is organised into single-responsibility files:
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
 *   generatedToolRegistry,
 * } from './universal-tools/index.js';
 *
 * // List all tools for registration
 * const tools = listUniversalTools(generatedToolRegistry);
 *
 * // Create executor for tool invocations
 * const executor = createUniversalToolExecutor({
 *   executeMcpTool,
 *   searchRetrieval,
 *   generatedTools: generatedToolRegistry,
 * });
 *
 * // Execute a tool
 * const result = await executor('search', { query: 'fractions' });
 * ```
 */

// Aggregated tool definitions
export { AGGREGATED_TOOL_DEFS } from './definitions.js';

// Type definitions
export type {
  AggregatedToolName,
  UniversalToolName,
  ToolAnnotations,
  ToolMeta,
  UniversalToolListEntry,
  AppToolListEntry,
  GeneratedToolRegistry,
} from './types.js';

// Default registry wired to real generation SDK
export { generatedToolRegistry } from './generated-tool-registry.js';

// Type guards
export { isAggregatedToolName, isUniversalToolName, isAppToolEntry } from './type-guards.js';

// Zod utilities (internal, but exported for testing)
export { isZodObject, extractZodShape } from './zod-utils.js';

// Tool listing
export { listUniversalTools } from './list-tools.js';

// Tool execution
export { createUniversalToolExecutor, type UniversalToolExecutorDependencies } from './executor.js';
