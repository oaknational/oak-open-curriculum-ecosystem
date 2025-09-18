/**
 * Ultra-thin MCP tool executor using MCP_TOOLS executors
 *
 * This implementation uses the MCP_TOOLS executor pattern:
 * - MCP_TOOLS contains complete tool definitions with embedded executors
 * - Executors have exact parameter types from schema
 * - Direct property access avoids dynamic dispatch
 * - ZERO type assertions - perfect type flow
 *
 * @todo Specialise the `data` shape per tool (e.g. `ToolExecutionResult<ToolName>`) by
 * threading the OpenAPI-derived response types through the executor layer along with Zod validators.
 * @todo make it clearer where and how the tool responses are validated and narrowed to the specific tool response type.
 */

import type { OakApiPathBasedClient } from '../client/index.js';
import { MCP_TOOLS, isToolName } from '../types/generated/api-schema/mcp-tools/index.js';
import type { AllToolNames } from '../types/generated/api-schema/mcp-tools/types.js';
import {
  isPlainObject,
  getOwnBoolean,
  typeSafeFromEntries,
  typeSafeKeys,
  getOwnValue,
} from '../types/helpers.js';

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
 * @todo Specialise the `data` shape per tool (e.g. `ToolExecutionResult<ToolName>`) by
 * threading the OpenAPI-derived response types through the executor layer along with Zod validators.
 */
export type ToolExecutionResult =
  | { readonly data: unknown; readonly error?: never }
  | { readonly data?: never; readonly error: McpToolError | McpParameterError };

/**
 * Build request params for tool execution.
 * Organises flat MCP args into the structure expected by executors.
 *
 * @remarks
 * This generic normaliser is intentionally conservative. It accepts either a JSON string or an
 * object and maps required single-parameter cases to a minimal `{ [name]: value }` structure.
 * The tool-specific validators enforce the exact types at the executor boundary.
 *
 * @todo import the proper types from the generated tool files
 */
function tryParseJsonObject(input: string): object | undefined {
  try {
    const parsed: unknown = JSON.parse(input);
    return isPlainObject(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function ownKeys(obj: unknown): string[] {
  return isPlainObject(obj) ? typeSafeKeys(obj) : [];
}

function extractToolMeta(tool: (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS]): {
  pathKeys: readonly string[];
  queryKeys: readonly string[];
  requiredPath: readonly string[];
  requiredQuery: readonly string[];
} {
  const pathMeta = tool.pathParams;
  const queryMeta = tool.queryParams;
  const pathKeys = ownKeys(pathMeta);
  const queryKeys = ownKeys(queryMeta);
  const requiredPath: string[] = [];
  for (const k of pathKeys) {
    if (getOwnBoolean(pathMeta[k], 'required')) {
      requiredPath.push(k);
    }
  }
  const requiredQuery: string[] = [];
  for (const k of queryKeys) {
    if (getOwnBoolean(queryMeta[k], 'required')) {
      requiredQuery.push(k);
    }
  }
  return { pathKeys, queryKeys, requiredPath, requiredQuery };
}

function coerceArgsToObject(
  args: unknown,
  requiredPath: readonly string[],
  requiredQuery: readonly string[],
): unknown {
  if (typeof args !== 'string') {
    return args;
  }
  const trimmed = args.trim();
  const parsedObj = tryParseJsonObject(trimmed);
  if (parsedObj) {
    return parsedObj;
  }
  if (requiredPath.length === 1 && requiredQuery.length === 0) {
    return { [requiredPath[0]]: trimmed };
  }
  if (requiredQuery.length === 1 && requiredPath.length === 0) {
    return { [requiredQuery[0]]: trimmed };
  }
  return args;
}

function splitParams(
  argsObject: unknown,
  pathKeys: readonly string[],
  queryKeys: readonly string[],
): { path?: object; query?: object } {
  const result: { path?: object; query?: object } = {};
  if (pathKeys.length > 0) {
    const pathEntries: (readonly [string, unknown])[] = [];
    for (const key of pathKeys) {
      const v = getOwnValue(argsObject, key);
      if (v !== undefined) {
        pathEntries.push([key, v]);
      }
    }
    result.path = typeSafeFromEntries(pathEntries);
  }
  if (queryKeys.length > 0) {
    const queryEntries: (readonly [string, unknown])[] = [];
    for (const key of queryKeys) {
      const v = getOwnValue(argsObject, key);
      if (v !== undefined) {
        queryEntries.push([key, v]);
      }
    }
    result.query = typeSafeFromEntries(queryEntries);
  }
  return result;
}

function buildGenericRequestParams(
  tool: (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS],
  args: unknown,
): { params: { path?: object; query?: object } } {
  const { pathKeys, queryKeys, requiredPath, requiredQuery } = extractToolMeta(tool);
  const maybeObject = coerceArgsToObject(args, requiredPath, requiredQuery);
  if (!isPlainObject(maybeObject)) {
    return { params: {} };
  }
  const params = splitParams(maybeObject, pathKeys, queryKeys);
  return { params };
}

/**
 * Ultra-thin executor - just validation and delegation to embedded executor
 */
function mapErrorToResult(error: unknown, toolName: string): ToolExecutionResult {
  if (error instanceof McpParameterError || error instanceof McpToolError) {
    return { error };
  }
  if (
    error instanceof TypeError &&
    (error.message.includes('Invalid') || error.message.includes('Must be one of'))
  ) {
    const match = /Invalid (\w+):/.exec(error.message);
    const paramName = match ? match[1] : undefined;
    return {
      error: new McpParameterError(error.message, toolName, paramName, undefined, { cause: error }),
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
  const toolName: AllToolNames = maybeToolName;
  try {
    const tool = MCP_TOOLS[toolName];
    const genericRequestParams = buildGenericRequestParams(tool, maybeParams);
    const response = await tool.invoke(client, genericRequestParams);
    return { data: response };
  } catch (error) {
    return mapErrorToResult(error, toolName);
  }
}
