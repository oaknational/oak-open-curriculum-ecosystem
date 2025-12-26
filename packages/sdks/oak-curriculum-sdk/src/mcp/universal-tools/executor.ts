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
  formatDataWithContext,
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
import { runKnowledgeGraphTool } from '../aggregated-knowledge-graph.js';
import { runThreadProgressionsTool } from '../aggregated-thread-progressions.js';
import { runPrerequisiteGraphTool } from '../aggregated-prerequisite-graph.js';
import type { AggregatedToolName, UniversalToolName } from './types.js';
import { isAggregatedToolName, isUniversalToolName } from './type-guards.js';
import {
  getToolFromToolName,
  type ToolName,
} from '../../types/generated/api-schema/mcp-tools/index.js';

/**
 * Maps a generated tool execution result to an MCP CallToolResult.
 *
 * Extracts the data from the execution result and formats it appropriately
 * for the MCP response, handling both success and error cases.
 *
 * Includes context grounding hint in structuredContent for tools that
 * benefit from domain context (curriculum content tools).
 *
 * @param result - Execution result from a generated tool
 * @param toolName - Name of the tool (to look up requiresDomainContext)
 * @returns Formatted CallToolResult for MCP
 */
function mapExecutionResult(result: ToolExecutionResult, toolName: ToolName): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }

  // Look up requiresDomainContext from the tool descriptor
  const descriptor = getToolFromToolName(toolName);
  const includeContextHint = descriptor.requiresDomainContext;

  return formatDataWithContext({
    status: outcome.status,
    data: outcome.data,
    includeContextHint,
  });
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
/**
 * Handles search tool validation and execution.
 */
async function handleSearchTool(
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const validation = validateSearchArgs(input);
  if (!validation.ok) {
    return formatError(validation.message);
  }
  return runSearchTool(validation.value, deps);
}

/**
 * Handles help tool validation and execution.
 */
function handleHelpTool(input: unknown): CallToolResult {
  const validation = validateHelpArgs(input);
  if (!validation.ok) {
    return formatError(validation.message);
  }
  return runHelpTool(validation.value);
}

/**
 * Handles fetch tool validation and execution.
 */
async function handleFetchTool(
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const validation = validateFetchArgs(input);
  if (!validation.ok) {
    return formatError(validation.message);
  }
  return runFetchTool(validation.value, deps);
}

function executeAggregatedTool(
  name: AggregatedToolName,
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  switch (name) {
    case 'search':
      return handleSearchTool(input, deps);
    case 'get-ontology':
      return Promise.resolve(runOntologyTool());
    case 'get-help':
      return Promise.resolve(handleHelpTool(input));
    case 'get-knowledge-graph':
      return Promise.resolve(runKnowledgeGraphTool());
    case 'get-thread-progressions':
      return Promise.resolve(runThreadProgressionsTool());
    case 'get-prerequisite-graph':
      return Promise.resolve(runPrerequisiteGraphTool());
    case 'fetch':
      return handleFetchTool(input, deps);
    default: {
      // Exhaustive check - TypeScript ensures all cases are handled
      const exhaustiveCheck: never = name;
      return Promise.reject(new Error(`Unknown aggregated tool: ${exhaustiveCheck}`));
    }
  }
}

/**
 * Creates a universal tool executor for MCP tool invocations.
 *
 * The executor handles both aggregated tools (search, fetch, get-ontology, get-help,
 * get-knowledge-graph) and generated tools from the OpenAPI schema. It performs
 * the following steps:
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
    // The name is already validated as a ToolName at this point
    const result = await deps.executeMcpTool(name, input);
    return mapExecutionResult(result, name);
  };
}

// Re-export dependencies type for convenience
export type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
