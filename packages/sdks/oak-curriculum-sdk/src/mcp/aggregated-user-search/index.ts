/**
 * User-facing MCP App search tools.
 *
 * User-facing search for the MCP App: **`user-search`** (widget + model) and
 * **`user-search-query`** (same execution; app-only visibility for
 * `callServerTool` from the UI, no widget `resourceUri`).
 *
 * @example
 * ```typescript
 * import {
 *   USER_SEARCH_TOOL_DEF,
 *   USER_SEARCH_INPUT_SCHEMA,
 *   USER_SEARCH_QUERY_TOOL_DEF,
 *   USER_SEARCH_QUERY_INPUT_SCHEMA,
 *   validateUserSearchArgs,
 *   runUserSearchTool,
 * } from './aggregated-user-search/index.js';
 * ```
 */

export {
  USER_SEARCH_TOOL_DEF,
  USER_SEARCH_INPUT_SCHEMA,
  USER_SEARCH_QUERY_TOOL_DEF,
  USER_SEARCH_QUERY_INPUT_SCHEMA,
} from './tool-definition.js';
export type { UserSearchArgs, UserSearchScope } from './types.js';
export { USER_SEARCH_SCOPES, isUserSearchScope } from './types.js';
export { validateUserSearchArgs } from './validation.js';
export { runUserSearchTool, handleUserSearchExecution } from './execution.js';
