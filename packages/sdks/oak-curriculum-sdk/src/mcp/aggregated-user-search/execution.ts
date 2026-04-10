/**
 * Execution logic for user-facing search tools.
 *
 * Both `user-search` and `user-search-query` delegate to the same Search SDK
 * retrieval service as the agent-facing `search` tool. Phases 4-5 will add
 * differentiated UI-specific execution and presentation logic.
 *
 * @see aggregated-search/execution.ts — agent-facing search execution
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { validateSearchSdkArgs, runSearchSdkTool } from '../aggregated-search/index.js';
import { formatError } from '../universal-tool-shared.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { UserSearchArgs } from './types.js';
import { validateUserSearchArgs } from './validation.js';

/**
 * Maps validated UserSearchArgs to the search SDK validation path and executes.
 *
 * Converts user-search args to the shape expected by the search SDK, then
 * delegates to the same execution pipeline as the agent-facing search tool.
 *
 * @param args - Validated user search arguments
 * @param deps - Universal tool executor dependencies (search retrieval service)
 * @returns MCP CallToolResult with search results
 */
export async function runUserSearchTool(
  args: UserSearchArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  // Delegate to the existing search SDK — revalidates through its pipeline
  const searchInput = {
    query: args.query,
    scope: args.scope,
    subject: args.subject,
    keyStage: args.keyStage,
    size: args.size,
  };

  const validation = validateSearchSdkArgs(searchInput);
  if (!validation.ok) {
    return formatError(validation.message);
  }

  return runSearchSdkTool(validation.value, deps);
}

/**
 * Aggregated handler for user-search and user-search-query tools.
 *
 * Validates raw MCP input and delegates to the search SDK execution pipeline.
 * Used by both tools — the visibility distinction is metadata-level, not
 * execution-level.
 *
 * @param input - Raw MCP tool call input (unknown)
 * @param deps - Universal tool executor dependencies
 * @returns MCP CallToolResult with search results or validation error
 */
export async function handleUserSearchExecution(
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const validation = validateUserSearchArgs(input);
  if (!validation.ok) {
    return formatError(validation.message);
  }
  return runUserSearchTool(validation.value, deps);
}
