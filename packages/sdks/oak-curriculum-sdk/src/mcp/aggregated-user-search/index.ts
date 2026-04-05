/**
 * User-facing MCP App search tools.
 *
 * This module provides the user-search and user-search-query tools for the
 * MCP App interface. Both tools provide interactive, visual search experiences
 * backed by the Search SDK.
 *
 * - `user-search`: UI-first search entry point (model + app visible)
 * - `user-search-query`: app-only helper (hidden from model)
 *
 * @example
 * ```typescript
 * import {
 *   USER_SEARCH_TOOL_DEF,
 *   USER_SEARCH_FLAT_ZOD_SCHEMA,
 *   USER_SEARCH_QUERY_TOOL_DEF,
 *   USER_SEARCH_QUERY_FLAT_ZOD_SCHEMA,
 *   validateUserSearchArgs,
 *   runUserSearchTool,
 * } from './aggregated-user-search/index.js';
 * ```
 */

export {
  USER_SEARCH_TOOL_DEF,
  USER_SEARCH_FLAT_ZOD_SCHEMA,
  USER_SEARCH_QUERY_TOOL_DEF,
  USER_SEARCH_QUERY_FLAT_ZOD_SCHEMA,
} from './tool-definition.js';
export type { UserSearchArgs, UserSearchScope } from './types.js';
export { USER_SEARCH_SCOPES, isUserSearchScope } from './types.js';
export { validateUserSearchArgs } from './validation.js';
export { runUserSearchTool, handleUserSearchExecution } from './execution.js';
