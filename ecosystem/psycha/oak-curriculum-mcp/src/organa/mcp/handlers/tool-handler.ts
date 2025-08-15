/**
 * Clean MCP tool handler implementation
 *
 * Uses generated executor from SDK with type predicates.
 * NO type assertions, NO any, everything flows from the schema.
 *
 * ADR Compliance:
 * - ADR-029: No manual API data (all from SDK)
 * - ADR-030: SDK as single source of truth
 * - ADR-032: Runtime validation at boundaries
 * - ADR-035: Unified SDK-MCP type generation
 */

import type { Logger } from '@oaknational/mcp-moria';
// CRITICAL: Import ONLY the path-based client type, NEVER OakApiClient
import type { OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';
import {
  isToolName,
  executeToolCall,
  McpToolError,
  McpParameterError,
} from '@oaknational/oak-curriculum-sdk';

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
 * Execute tool using SDK's data-driven executeToolCall
 *
 * This delegates to the SDK's static executeToolCall function
 * which uses the path-based client for pure data-driven execution.
 * CRITICAL: MUST use OakApiPathBasedClient, NEVER OakApiClient
 */
async function executeToolOperation(
  toolName: string,
  params: ToolParameters,
  sdk: OakApiPathBasedClient, // MUST be path-based client
  logger: Logger,
): Promise<unknown> {
  // Validate tool name first for better error messages
  if (!isToolName(toolName)) {
    throw new McpOperationError(`Unknown tool: ${toolName}`, toolName);
  }

  logger.debug('Executing tool via SDK', { toolName, params });

  // Delegate to SDK's executeToolCall which handles:
  // 1. Parameter validation
  // 2. Path-based client routing
  // 3. Response validation
  const result = await executeToolCall(toolName, params, sdk);

  if (result.error) {
    // Log different error types with appropriate context
    if (result.error instanceof McpParameterError) {
      logger.error('Parameter validation failed', {
        toolName,
        parameterName: result.error.parameterName,
        error: result.error.message,
      });
    } else if (result.error instanceof McpToolError) {
      // Extract full cause chain for logging
      const causeChain: string[] = [result.error.message];
      let currentCause = result.error.cause;
      while (currentCause) {
        if (currentCause instanceof Error) {
          causeChain.push(`Caused by: ${currentCause.message}`);
          currentCause = (currentCause as unknown).cause;
        } else {
          causeChain.push(`Caused by: ${String(currentCause)}`);
          break;
        }
      }

      logger.error('Tool execution failed', {
        toolName,
        code: result.error.code,
        error: result.error.message,
        causeChain: causeChain.join(' -> '),
        fullCause: result.error.cause,
      });
    } else {
      logger.error('Unknown error', {
        toolName,
        error: result.error,
      });
    }

    // Re-throw with MCP operation error wrapper
    throw new McpOperationError(
      result.error instanceof Error ? result.error.message : `Tool ${toolName} failed`,
      toolName,
      result.error,
    );
  }

  logger.debug('Tool execution successful', { toolName });
  return result.data;
}

/**
 * Creates MCP tool handler using PATH-BASED CLIENT
 *
 * This implementation:
 * - Uses PATH-BASED CLIENT for pure data-driven execution
 * - Routes requests via client[path][method](params)
 * - Uses type predicates instead of assertions
 * - Maintains the central principle: everything flows from the schema
 * CRITICAL: MUST use OakApiPathBasedClient, NEVER OakApiClient
 */
export function createToolHandler(sdk: OakApiPathBasedClient, logger: Logger) {
  const toolLogger = logger.child ? logger.child({ component: 'mcp-tool-handler' }) : logger;

  return async function handleTool(toolName: string, params: ToolParameters): Promise<unknown> {
    toolLogger.debug('Handling tool request', { toolName, params });

    try {
      return await executeToolOperation(toolName, params, sdk, toolLogger);
    } catch (error) {
      // Extract cause chain for better error logging
      const errorDetails: Record<string, unknown> = { toolName };
      if (error instanceof Error) {
        errorDetails.message = error.message;
        errorDetails.stack = error.stack;

        // Build cause chain
        const causeChain: string[] = [error.message];
        let currentCause = (error as unknown).cause;
        while (currentCause) {
          if (currentCause instanceof Error) {
            causeChain.push(`Caused by: ${currentCause.message}`);
            currentCause = (currentCause as unknown).cause;
          } else {
            causeChain.push(`Caused by: ${String(currentCause)}`);
            break;
          }
        }
        errorDetails.causeChain = causeChain.join(' -> ');
      } else {
        errorDetails.error = error;
      }

      toolLogger.error('Tool execution failed', errorDetails);
      throw new McpOperationError(`MCP tool ${toolName} failed`, toolName, error);
    }
  };
}
