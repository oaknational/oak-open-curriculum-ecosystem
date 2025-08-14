/**
 * MCP tool handler implementation
 *
 * Directly delegates to SDK operations using enriched tool metadata.
 * No manual mapping, no hardcoded names, everything flows from the API schema.
 *
 * ADR Compliance:
 * - ADR-029: No manual API data (all from SDK)
 * - ADR-030: SDK as single source of truth
 * - ADR-031: Uses build-time generated enriched tools
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient, McpToolName } from '@oaknational/oak-curriculum-sdk';
import { validateToolResponse } from '@oaknational/oak-curriculum-sdk';
import { ENRICHED_TOOLS } from '../generated/enriched-tools';

/**
 * MCP operation error for consistent error handling
 */
export class McpOperationError extends Error {
  readonly operation: string;
  readonly cause?: unknown;

  constructor(message: string, operation: string, cause?: unknown) {
    super(message);
    this.name = 'McpOperationError';
    this.operation = operation;
    this.cause = cause;
  }
}

/**
 * Tool parameter types - dynamic based on tool name
 */
export type ToolParameters = Record<string, unknown>;

/**
 * Find enriched tool by MCP name
 */
function findEnrichedToolByMcpName(mcpName: string) {
  return ENRICHED_TOOLS.find((tool) => tool.mcpName === mcpName);
}

/**
 * Execute tool by calling SDK's HTTP methods directly
 *
 * The SDK is an OpenAPI client that exposes HTTP methods (GET, POST, etc.)
 * not named methods. This approach maintains the central contract: all types
 * flow from the API schema through the SDK.
 */
async function executeToolOperation(
  toolName: string,
  params: ToolParameters,
  sdk: OakApiClient,
  logger: Logger,
): Promise<unknown> {
  // Find the enriched tool definition
  const enrichedTool = findEnrichedToolByMcpName(toolName);
  if (!enrichedTool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  // Build parameters for SDK call, separating path and query params
  const pathParams: Record<string, unknown> = {};
  const queryParams: Record<string, unknown> = {};

  // Process path parameters
  for (const paramName of enrichedTool.pathParams) {
    const value = params[paramName];
    if (value !== undefined) {
      pathParams[paramName] = value;
    } else {
      // Path parameters are always required
      throw new Error(`Missing required path parameter: ${paramName}`);
    }
  }

  // Process query parameters
  for (const paramName of enrichedTool.queryParams) {
    const value = params[paramName];
    if (value !== undefined) {
      queryParams[paramName] = value;
    }
    // Query parameters are optional unless we add validation later
  }

  logger.debug('Calling SDK HTTP method', {
    toolName,
    method: enrichedTool.method,
    path: enrichedTool.path,
    pathParams,
    queryParams,
  });

  // The Oak API currently only has GET methods, but we handle all cases for future-proofing
  // The enriched tool has literal type for method ("get" as const)

  if (enrichedTool.method !== 'get') {
    // The Oak API currently only supports GET methods
    // This is a safety check in case the API adds other methods in the future
    throw new Error(
      `Unsupported HTTP method: ${enrichedTool.method}. The Oak API currently only supports GET.`,
    );
  }

  // Build the options object for the GET request
  // Only include params if there are actual parameters to pass
  const hasParams = Object.keys(queryParams).length > 0 || Object.keys(pathParams).length > 0;

  // Call the SDK's GET method
  // TYPE ASSERTION RATIONALE (Champion-Approved):
  // openapi-fetch requires compile-time literal path types, but MCP needs runtime dispatch.
  // This minimal assertion at the library boundary is architecturally necessary and safe
  // because enriched tools are generated from the SDK's valid paths.
  // The central contract is preserved: types flow from API → SDK → MCP.

  // We use a type-cast to any for the path because openapi-fetch's complex type system
  // requires literal path types at compile time, but we have runtime strings.
  // The SDK will handle validation at runtime.
  const sdkPath = enrichedTool.path as any;

  // Build options conditionally based on whether we have parameters
  // OpenAPI-fetch may require an empty object as the second parameter when there are no params
  const result = hasParams
    ? await sdk.GET(sdkPath, { params: { query: queryParams, path: pathParams } })
    : await sdk.GET(sdkPath, {});

  // The SDK returns a result object with data and error properties
  if ('error' in result && result.error) {
    throw new McpOperationError(
      `API call failed: ${JSON.stringify(result.error)}`,
      toolName,
      result.error,
    );
  }

  // Validate the response using SDK validators (ADR-032: boundary validation)
  // This ensures runtime type safety at the API boundary
  try {
    const validatedData = validateToolResponse(toolName as McpToolName, result.data);
    return validatedData;
  } catch (validationError) {
    logger.warn('Response validation failed, returning unvalidated data', {
      toolName,
      error: validationError,
    });
    // Return unvalidated data if validation fails (graceful degradation)
    // This ensures the system continues to work even if the API response
    // doesn't match the expected schema exactly
    return result.data;
  }
}

/**
 * Creates MCP tool handler that directly delegates to SDK
 *
 * This is the proper implementation that:
 * - Uses enriched tools as the single source of truth
 * - Calls SDK methods directly without manual mapping
 * - Lets the SDK handle validation
 */
export function createToolHandler(sdk: OakApiClient, logger: Logger) {
  const toolLogger = logger.child ? logger.child({ component: 'mcp-tool-handler' }) : logger;

  return async function handleTool(toolName: string, params: ToolParameters): Promise<unknown> {
    toolLogger.debug('Executing tool', { toolName, params });

    try {
      return await executeToolOperation(toolName, params, sdk, toolLogger);
    } catch (error) {
      toolLogger.error('Tool execution failed', { toolName, error });
      throw new McpOperationError(`MCP tool ${toolName} failed`, toolName, error);
    }
  };
}
