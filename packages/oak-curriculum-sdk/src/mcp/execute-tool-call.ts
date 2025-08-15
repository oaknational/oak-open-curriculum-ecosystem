/**
 * Minimal MCP tool executor using TOOL_LOOKUP pattern
 *
 * This implementation uses the minimal lookup approach:
 * - TOOL_LOOKUP maps tool names to path/method coordinates
 * - Schema contains all parameter definitions
 * - Direct client access without intermediate functions
 * - NO type assertions - everything flows from the schema
 */

import type { OakApiPathBasedClient } from '../client/index.js';
import { TOOL_LOOKUP, isToolName } from '../types/generated/api-schema/mcp-tools.js';
import { validateParams } from './param-validator.js';

/**
 * Error types with proper cause chains
 */
export class McpToolError extends Error {
  readonly toolName: string;
  readonly code?: string;

  constructor(message: string, toolName: string, options?: { cause?: unknown; code?: string }) {
    super(message);
    this.name = 'McpToolError';
    this.toolName = toolName;
    this.code = options?.code;
    // Set cause if available (ES2022+)
    if (options?.cause !== undefined && 'cause' in this) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

export class McpParameterError extends Error {
  toolName: string;
  readonly parameterName?: string;

  constructor(message: string, toolName: string, parameterName?: string) {
    super(message);
    this.name = 'McpParameterError';
    this.toolName = toolName;
    this.parameterName = parameterName;
  }
}

/**
 * Type predicate for parameters object
 */
function isParametersObject(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type predicate for API response shape
 */
interface ApiResponse {
  readonly data?: unknown;
  readonly error?: unknown;
}

function isApiResponse(value: unknown): value is ApiResponse {
  return isParametersObject(value);
}

/**
 * Type predicate for error with message
 */
interface ErrorWithMessage {
  readonly message: string;
  readonly code?: string;
}

function hasErrorMessage(value: unknown): value is ErrorWithMessage {
  // First narrow to object
  if (!isParametersObject(value)) {
    return false;
  }

  // Check for message property existence
  if (!('message' in value)) {
    return false;
  }

  // Now TypeScript knows value is Record<string, unknown> with 'message' key
  // We can safely access the message property
  const maybeMessage = value.message;

  // Check if message is a string
  return typeof maybeMessage === 'string';
}

/**
 * Result type for tool execution
 */
type ToolExecutionResult =
  | { readonly data: object; readonly error?: never }
  | { readonly data?: never; readonly error: McpToolError | McpParameterError };

/**
 * Main executor - using minimal lookup approach
 */
export async function executeToolCall(
  maybeToolName: string,
  maybeParams: unknown,
  client: OakApiPathBasedClient,
): Promise<ToolExecutionResult> {
  // Step 1: Validate tool name
  if (!isToolName(maybeToolName)) {
    return {
      error: new McpToolError(`Unknown tool: ${maybeToolName}`, maybeToolName, {
        code: 'UNKNOWN_TOOL',
      }),
    };
  }

  const toolName = maybeToolName;

  try {
    // Step 2: Get coordinates from lookup
    const { path, method } = TOOL_LOOKUP[toolName];

    // Step 3: Validate parameters using schema
    const validatedParams = validateParams(path, method, maybeParams);
    if (validatedParams === null) {
      return {
        error: new McpParameterError('Invalid parameters for tool', toolName),
      };
    }

    // Step 4: Access client with path/method
    // Direct access without type assertions - the plan shows this is the way
    const pathObj = client[path];
    const methodFunc = pathObj[method];

    // Step 5: Execute with validated parameters
    const response = await methodFunc(validatedParams);

    // Step 6: Handle response
    if (!isApiResponse(response)) {
      throw new McpToolError('Invalid API response shape', toolName, { code: 'INVALID_RESPONSE' });
    }

    if (response.error) {
      const errorMessage = hasErrorMessage(response.error)
        ? response.error.message
        : 'API request failed';

      return {
        error: new McpToolError(errorMessage, toolName, {
          cause: response.error,
          code: hasErrorMessage(response.error) ? response.error.code : 'API_ERROR',
        }),
      };
    }

    // Step 7: Return data
    // Check if we have valid object data
    if (
      typeof response.data === 'object' &&
      response.data !== null &&
      !Array.isArray(response.data)
    ) {
      // Type guard proves response.data is object (non-null, non-array)
      const objectData: object = response.data;
      return { data: objectData };
    }

    // Data is not a valid object
    return {
      error: new McpToolError('Invalid response data type', toolName, {
        code: 'INVALID_DATA_TYPE',
      }),
    };
  } catch (error) {
    if (error instanceof McpParameterError || error instanceof McpToolError) {
      return { error };
    }

    return {
      error: new McpToolError(`Execution failed: ${String(error)}`, toolName, {
        cause: error,
        code: 'EXECUTION_ERROR',
      }),
    };
  }
}
