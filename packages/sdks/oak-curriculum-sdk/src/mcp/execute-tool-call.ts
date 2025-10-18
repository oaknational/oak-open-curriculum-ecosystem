/**
 * Ultra-thin MCP tool executor using MCP_TOOLS executors
 *
 * This implementation uses the MCP_TOOLS executor pattern:
 * - MCP_TOOLS contains complete tool definitions with embedded executors
 * - Executors have exact parameter types from schema
 * - Direct property access avoids dynamic dispatch
 * - ZERO type assertions - perfect type flow
 *
 * @remarks Specialise the `data` shape per tool (e.g. `ToolExecutionResult<ToolName>`) by
 * threading the OpenAPI-derived response types through the executor layer along with Zod validators.
 * @remarks make it clearer where and how the tool responses are validated and narrowed to the specific tool response type.
 */

import type { OakApiPathBasedClient } from '../client/index.js';
import { isToolName, type ToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import { callTool } from '../types/generated/api-schema/mcp-tools/generated/runtime/execute.js';

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
 * Result type for tool execution.
 *
 * @remarks Specialise the `data` shape per tool (e.g. `ToolExecutionResult<ToolName>`) by
 * threading the OpenAPI-derived response types through the executor layer along with Zod validators.
 */
export type ToolExecutionResult =
  | { readonly data: unknown; readonly error?: never }
  | { readonly data?: never; readonly error: McpToolError | McpParameterError };

/**
 * Ultra-thin executor - just validation and delegation to embedded executor
 */
function mapErrorToResult(error: unknown, toolName: ToolName): ToolExecutionResult {
  if (error instanceof McpParameterError || error instanceof McpToolError) {
    return { error };
  }
  if (error instanceof TypeError) {
    if (error.message.startsWith('Output validation error: ')) {
      const message = error.message.replace('Output validation error: ', '');
      return {
        error: new McpToolError('Execution failed: ' + message, toolName, {
          code: 'OUTPUT_VALIDATION_ERROR',
          cause: error,
        }),
      };
    }
    return {
      error: new McpParameterError(error.message, toolName, undefined, undefined, {
        cause: error,
      }),
    };
  }
  if (error instanceof Error) {
    return {
      error: new McpToolError(`Execution failed: ${error.message}`, toolName, {
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

export async function executeToolCall(
  maybeToolName: unknown,
  maybeParams: unknown,
  client: OakApiPathBasedClient,
): Promise<ToolExecutionResult> {
  if (!isToolName(maybeToolName)) {
    return {
      error: new McpToolError(`Unknown tool: ${String(maybeToolName)}`, String(maybeToolName), {
        code: 'UNKNOWN_TOOL',
      }),
    };
  }

  const toolName: ToolName = maybeToolName;
  try {
    const data = await callTool(toolName, client, maybeParams);
    return { data };
  } catch (error) {
    return mapErrorToResult(error, toolName);
  }
}
