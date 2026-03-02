/**
 * SDK-backed search tool for semantic curriculum search.
 *
 * This module provides the search tool backed by the Search SDK,
 * offering 4-way RRF semantic search across all four Elasticsearch
 * indexes (lessons, units, threads, sequences) plus typeahead suggestions.
 *
 * ## Directory Structure
 *
 * - `tool-definition.ts` - MCP tool metadata, input schema, NL guidance
 * - `types.ts` - SearchSdkScope, SearchSdkArgs, dispatch union types
 * - `validation.ts` - Input validation with Zod and generated type guards
 * - `execution.ts` - Scope-based dispatch to Search SDK retrieval methods
 * - `formatting.ts` - Per-scope result formatting for humans and agents
 *
 * @example
 * ```typescript
 * import {
 *   SEARCH_TOOL_DEF,
 *   SEARCH_INPUT_SCHEMA,
 *   validateSearchSdkArgs,
 *   runSearchSdkTool,
 * } from './aggregated-search/index.js';
 * ```
 */

export { SEARCH_TOOL_DEF, SEARCH_INPUT_SCHEMA } from './tool-definition.js';
export type {
  SearchSdkArgs,
  SearchSdkScope,
  ScopedSearchResult,
  SearchDispatchResult,
} from './types.js';
export { SEARCH_SCOPES, isSearchSdkScope } from './types.js';
export { validateSearchSdkArgs } from './validation.js';
export { runSearchSdkTool } from './execution.js';
export { formatSearchResults } from './formatting.js';
