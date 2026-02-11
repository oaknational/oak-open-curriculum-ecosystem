/**
 * Aggregated search tool for searching Oak curriculum content.
 *
 * This module provides the search aggregated tool which combines
 * get-search-lessons and get-search-transcripts into a single operation.
 *
 * ## Directory Structure
 *
 * - `tool-definition.ts` - MCP tool metadata and input schema
 * - `types.ts` - SearchArgs interface
 * - `validation.ts` - Input validation with Zod and type guards
 * - `execution.ts` - Tool execution logic
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   SEARCH_TOOL_DEF,
 *   SEARCH_INPUT_SCHEMA,
 *   validateSearchArgs,
 *   runSearchTool,
 * } from './aggregated-search/index.js';
 * ```
 */

// Tool definition and schema
export { SEARCH_TOOL_DEF, SEARCH_INPUT_SCHEMA } from './tool-definition.js';

// Types
export type { SearchArgs } from './types.js';

// Validation
export { validateSearchArgs } from './validation.js';

// Execution
export { runSearchTool } from './execution.js';
