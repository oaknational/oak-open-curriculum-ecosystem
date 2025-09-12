/* eslint-disable complexity, max-lines-per-function, max-statements */
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
import { MCP_TOOLS, isToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import { typeSafeKeys, isPlainObject, getOwnValue, typeSafeFromEntries } from '../types/helpers.js';

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
): { params: { path?: object; query?: object } } {
  // Helper: derive required path/query parameter names from generated meta
  function getRequiredParamNames(meta: object): readonly string[] {
    const out: string[] = [];
    for (const name of typeSafeKeys(meta)) {
      const m = getOwnValue(meta, name);
      if (isPlainObject(m) && getOwnValue(m, 'required') === true) out.push(name);
    }
    return out;
  }

  // Helper: safe JSON parse to a record
  function tryParseJsonObject(input: string): object | undefined {
    try {
      const parsed: unknown = JSON.parse(input);
      if (isPlainObject(parsed)) return parsed;
    } catch {
      // ignore
    }
    return undefined;
  }

  // Helper: normalize string arguments
  function normalizeStringArgs(value: string): object | undefined {
    const trimmed = value.trim();
    const parsedObj = tryParseJsonObject(trimmed);
    if (parsedObj) return parsedObj;

    // Narrow with an intermediate local binding to satisfy lint rule without assertions
    const requiredPath = getRequiredParamNames(tool.pathParams);
    const requiredQuery = getRequiredParamNames(tool.queryParams);

    // Map plain string to a single required parameter when unambiguous
    if (requiredPath.length === 1 && requiredQuery.length === 0) {
      return { [requiredPath[0]]: trimmed };
    }
    if (requiredQuery.length === 1 && requiredPath.length === 0) {
      return { [requiredQuery[0]]: trimmed };
    }
    return undefined;
  }

  const hasPathParams = typeSafeKeys(tool.pathParams).length > 0;
  const hasQueryParams = typeSafeKeys(tool.queryParams).length > 0;

  // For tools with no parameters at all, return the expected structure
  if (!hasPathParams && !hasQueryParams) {
    return { params: {} };
  }

  const params: { path?: object; query?: object } = {};

  // Normalize string arguments (supports JSON string and single param mapping)
  if (typeof args === 'string') {
    const normalized = normalizeStringArgs(args);
    if (normalized) {
      args = normalized;
    }
  }

  if (!isPlainObject(args)) {
    // If no args provided, return empty params structure
    if (hasPathParams) params.path = {};
    if (hasQueryParams) params.query = {};
    return { params };
  }

  // Build path params if needed
  if (hasPathParams) {
    const entries: (readonly [string, unknown])[] = [];
    for (const paramName of typeSafeKeys(tool.pathParams)) {
      const v = getOwnValue(args, paramName);
      if (v !== undefined) entries.push([paramName, v]);
    }
    params.path = typeSafeFromEntries(entries);
  }

  // Build query params if needed
  if (hasQueryParams) {
    const entries: (readonly [string, unknown])[] = [];
    for (const paramName of typeSafeKeys(tool.queryParams)) {
      const v = getOwnValue(args, paramName);
      if (v !== undefined) entries.push([paramName, v]);
    }
    params.query = typeSafeFromEntries(entries);
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
    const genericRequestParams = buildGenericRequestParams(tool, maybeParams);

    // Step 4: Call the generated invoke wrapper (unknown → validated)
    const response = await tool.invoke(client, genericRequestParams);

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
      const match = /Invalid (\w+):/.exec(error.message);
      const paramName = match ? match[1] : undefined;
      return {
        error: new McpParameterError(error.message, toolName, paramName, undefined, {
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
}
