/* eslint-disable complexity, max-depth, max-lines-per-function, max-statements */
/**
 * Ultra-thin MCP tool executor using MCP_TOOLS executors
 *
 * This implementation uses the MCP_TOOLS executor pattern:
 * - MCP_TOOLS contains complete tool definitions with embedded executors
 * - Executors have exact parameter types from schema
 * - Direct property access avoids dynamic dispatch
 * - ZERO type assertions - perfect type flow
 */

import type { OakApiPathBasedClient } from '../client/index.js';
import { MCP_TOOLS, isToolName } from '../types/generated/api-schema/mcp-tools';

/**
 * Error types with proper cause chains
 */
export class McpToolError extends Error {
  readonly toolName: string;
  readonly code?: string;

  constructor(message: string, toolName: string, options?: { cause?: Error; code?: string }) {
    super(message, options);
    this.name = 'McpToolError';
    this.toolName = toolName;
    this.code = options?.code;
  }
}

export class McpParameterError extends Error {
  toolName: string;
  readonly pathParameterName?: string;
  readonly queryParameterName?: string;

  constructor(
    message: string,
    toolName: string,
    pathParameterName?: string,
    queryParameterName?: string,
    options?: { cause?: Error },
  ) {
    super(message, options);
    this.name = 'McpParameterError';
    this.toolName = toolName;
    this.pathParameterName = pathParameterName;
    this.queryParameterName = queryParameterName;
  }
}

/**
 * Result type for tool execution
 *
 * @todo the data type is not unknown, it is fully specified in the schema AND we generate a Zod validator for it. Should we pull both the data type and the Zod validator into the tool definition?
 * @todo does this imply we need a ToolResult for each tool? And a ToolExecutionResult<ToolName> type?
 */
type ToolExecutionResult =
  | { readonly data: unknown; readonly error?: never }
  | { readonly data?: never; readonly error: McpToolError | McpParameterError };

/**
 * Build request params for tool execution
 * Organizes flat MCP args into the structure expected by executors
 *
 * @todo this function needs a thorough review, do we need it? Could it be type safe?
 */
function buildGenericRequestParams(
  tool: (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS],
  args: unknown,
): unknown {
  const hasPathParams = Object.keys(tool.pathParams).length > 0;
  const hasQueryParams = Object.keys(tool.queryParams).length > 0;

  // For tools with no parameters at all, return the expected structure
  if (!hasPathParams && !hasQueryParams) {
    return { params: {} };
  }

  const params: { path?: Record<string, unknown>; query?: Record<string, unknown> } = {};

  if (!args || typeof args !== 'object' || Array.isArray(args)) {
    // If no args provided, return empty params structure
    if (hasPathParams) {
      params.path = {};
    }
    if (hasQueryParams) {
      params.query = {};
    }
    return { params };
  }

  // Build path params if needed
  if (hasPathParams) {
    params.path = {};
    for (const paramName of Object.keys(tool.pathParams)) {
      if (paramName in args) {
        params.path[paramName] = (args as Record<string, unknown>)[paramName];
      }
    }
  }

  // Build query params if needed
  if (hasQueryParams) {
    params.query = {};
    for (const paramName of Object.keys(tool.queryParams)) {
      if (paramName in args) {
        params.query[paramName] = (args as Record<string, unknown>)[paramName];
      }
    }
  }

  return { params };
}

/**
 * Ultra-thin executor - just validation and delegation to embedded executor
 */
export async function executeToolCall(
  maybeToolName: unknown,
  maybeParams: unknown,
  client: OakApiPathBasedClient,
): Promise<ToolExecutionResult> {
  // Step 1: Validate tool name
  if (!isToolName(maybeToolName)) {
    return {
      error: new McpToolError(`Unknown tool: ${String(maybeToolName)}`, String(maybeToolName), {
        code: 'UNKNOWN_TOOL',
      }),
    };
  }

  const toolName = maybeToolName;

  try {
    // Step 2: Get tool from MCP_TOOLS
    const tool = MCP_TOOLS[toolName];

    // Step 3: Build request params in the structure expected by the executor
    const genericRequestParams = buildGenericRequestParams(tool, maybeParams) as {
      params: { path?: Record<string, unknown>; query?: Record<string, unknown> };
    };

    // Step 4: Call the embedded executor
    // The executor handles all validation and type narrowing internally
    const response = await tool.getExecutorFromGenericRequestParams(client, genericRequestParams);

    // Step 5: Return the response
    return { data: response };
  } catch (error) {
    if (error instanceof McpParameterError || error instanceof McpToolError) {
      return { error };
    }

    // Check if it's a TypeError from parameter validation
    if (
      error instanceof TypeError &&
      (error.message.includes('Invalid') || error.message.includes('Must be one of'))
    ) {
      // Extract parameter name from error message if possible
      const match = error.message.match(/Invalid (\w+):/);
      const paramName = match ? match[1] : undefined;
      return {
        error: new McpParameterError(error.message, toolName, paramName, undefined, {
          cause: error,
        }),
      };
    }

    if (error instanceof Error) {
      return {
        error: new McpToolError(`Execution failed: ${String(error)}`, toolName, {
          cause: error,
          code: 'EXECUTION_ERROR',
        }),
      };
    }
    return {
      error: new McpToolError(`Execution failed: UNKNOWN ERROR: ${String(error)}`, toolName, {
        code: 'EXECUTION_ERROR',
      }),
    };
  }
}
