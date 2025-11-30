/**
 * Universal tool executor for MCP tool invocations.
 *
 * This module provides the execution logic for both aggregated tools
 * (hand-written) and generated tools (from OpenAPI spec). It handles
 * validation, dispatch, and result formatting.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolExecutionResult } from '../execute-tool-call.js';
import {
  formatData,
  formatError,
  formatUnknownTool,
  extractExecutionData,
  toErrorMessage,
  type UniversalToolExecutorDependencies,
} from '../universal-tool-shared.js';
import { validateSearchArgs, runSearchTool } from '../aggregated-search/index.js';
import { validateFetchArgs, runFetchTool } from '../aggregated-fetch.js';
import { runOntologyTool } from '../aggregated-ontology.js';
import { validateHelpArgs, runHelpTool } from '../aggregated-help/index.js';
import type { AggregatedToolName, UniversalToolName } from './types.js';
import { isAggregatedToolName, isUniversalToolName } from './type-guards.js';

/**
 * Maps a generated tool execution result to an MCP CallToolResult.
 *
 * Extracts the data from the execution result and formats it appropriately
 * for the MCP response, handling both success and error cases.
 *
 * @param result - Execution result from a generated tool
 * @returns Formatted CallToolResult for MCP
 */
function mapExecutionResult(result: ToolExecutionResult): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatData({ status: outcome.status, data: outcome.data });
}

/**
 * Executes an aggregated tool by name.
 *
 * Aggregated tools combine multiple API calls into a single operation.
 * Each tool has its own validation and execution logic. This function
 * dispatches to the appropriate handler based on the tool name.
 *
 * @param name - The aggregated tool name (already validated via type guard)
 * @param input - Raw input from tool invocation (will be validated)
 * @param deps - Dependencies for tool execution (API client, etc.)
 * @returns CallToolResult from the aggregated tool
 *
 * @example
 * ```typescript
 * if (isAggregatedToolName(name)) {
 *   return executeAggregatedTool(name, input, deps);
 * }
 * ```
 */
async function executeAggregatedTool(
  name: AggregatedToolName,
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  if (name === 'search') {
    const validation = validateSearchArgs(input);
    if (!validation.ok) {
      return formatError(validation.message);
    }
    return runSearchTool(validation.value, deps);
  }

  if (name === 'get-ontology') {
    return runOntologyTool();
  }

  if (name === 'get-help') {
    const validation = validateHelpArgs(input);
    if (!validation.ok) {
      return formatError(validation.message);
    }
    return runHelpTool(validation.value);
  }

  // name === 'fetch' (exhaustive handling - TypeScript knows this is the only remaining case)
  const validation = validateFetchArgs(input);
  if (!validation.ok) {
    return formatError(validation.message);
  }
  return runFetchTool(validation.value, deps);
}

/**
 * Creates a universal tool executor for MCP tool invocations.
 *
 * The executor handles both aggregated tools (search, fetch, get-ontology, get-help)
 * and generated tools from the OpenAPI schema. It performs the following steps:
 *
 * 1. Validates the tool name is known
 * 2. Dispatches to the appropriate handler based on tool type
 * 3. Validates input for the specific tool
 * 4. Executes the tool and returns formatted results
 *
 * @param deps - Dependencies including:
 *   - `executeMcpTool`: Function to execute generated tools via API client
 *   - Other dependencies as needed by aggregated tools
 * @returns Async function that executes a tool by name with arguments
 *
 * @example
 * ```typescript
 * const executor = createUniversalToolExecutor({
 *   executeMcpTool: async (name, args) => apiClient.call(name, args),
 * });
 *
 * const result = await executor('search', { query: 'photosynthesis' });
 * ```
 */
export function createUniversalToolExecutor(
  deps: UniversalToolExecutorDependencies,
): (name: UniversalToolName, args: unknown) => Promise<CallToolResult> {
  return async (name: UniversalToolName, args: unknown): Promise<CallToolResult> => {
    if (!isUniversalToolName(name)) {
      return formatUnknownTool(name);
    }

    const input = args === undefined ? {} : args;

    if (isAggregatedToolName(name)) {
      return executeAggregatedTool(name, input, deps);
    }

    // Generated tool - dispatch to the MCP tool executor
    const result = await deps.executeMcpTool(name, input);
    return mapExecutionResult(result);
  };
}

// Re-export dependencies type for convenience
export type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
