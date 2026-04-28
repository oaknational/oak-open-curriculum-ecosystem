/**
 * Ultra-thin MCP tool executor using MCP_TOOLS executors
 *
 * This implementation uses the MCP_TOOLS executor pattern:
 * - MCP_TOOLS contains complete tool definitions with embedded executors
 * - Executors have exact parameter types from schema
 * - Direct property access avoids dynamic dispatch
 * - ZERO type assertions - perfect type flow
 *
 * @remarks Specialise the success `value` shape per tool by threading the
 * OpenAPI-derived response types through the executor layer along with Zod validators.
 * @remarks make it clearer where and how the tool responses are validated and narrowed to the specific tool response type.
 */

import type { OakApiPathBasedClient } from '../client/index.js';
import type { Logger } from '@oaknational/logger';
import {
  isToolName,
  UndocumentedResponseError,
  DOCUMENTED_ERROR_PREFIX,
  type ToolName,
  type ToolResultForName,
  callTool,
} from '@oaknational/sdk-codegen/mcp-tools';
import { err, ok, type Result } from '@oaknational/result';
import {
  classifyDocumentedErrorResponse,
  classifyUndocumentedResponse,
} from './classify-error-response.js';
import { McpToolError, McpParameterError } from './error-types.js';
import { createNoopLogger } from './noop-logger.js';

export { McpToolError, McpParameterError } from './error-types.js';

/**
 * Result type for tool execution.
 *
 * @remarks Specialise the `value` shape per tool by threading the OpenAPI-derived
 * response types through the executor layer along with Zod validators.
 */
export type ToolExecutionSuccess<TName extends ToolName = ToolName> = ToolResultForName<TName>;

export type ToolExecutionResult = Result<ToolExecutionSuccess, McpToolError | McpParameterError>;

/**
 * Map a caught error to a classified {@link ToolExecutionResult}.
 *
 * Handles four error categories:
 * 1. Already-classified errors (McpToolError / McpParameterError)
 * 2. Undocumented HTTP statuses (UndocumentedResponseError)
 * 3. TypeErrors from the generated executor pipeline
 * 4. Generic errors
 */
function mapErrorToResult(error: unknown, toolName: ToolName): ToolExecutionResult {
  if (error instanceof McpParameterError || error instanceof McpToolError) {
    return err(error);
  }
  if (error instanceof UndocumentedResponseError) {
    return err(classifyUndocumentedResponse(error, toolName));
  }
  return mapTypeErrorOrGeneric(error, toolName);
}

function mapTypeErrorOrGeneric(error: unknown, toolName: ToolName): ToolExecutionResult {
  if (error instanceof TypeError) {
    return mapTypeError(error, toolName);
  }
  if (error instanceof Error) {
    return err(
      new McpToolError(`Execution failed: ${error.message}`, toolName, {
        cause: error,
        code: 'EXECUTION_ERROR',
      }),
    );
  }
  return err(
    new McpToolError(`Execution failed: UNKNOWN ERROR: ${String(error)}`, toolName, {
      code: 'EXECUTION_ERROR',
    }),
  );
}

function mapTypeError(error: TypeError, toolName: ToolName): ToolExecutionResult {
  if (error.message.startsWith(DOCUMENTED_ERROR_PREFIX)) {
    return mapDocumentedErrorResponse(error, toolName);
  }
  if (error.message.startsWith('Output validation error: ')) {
    const message = error.message.replace('Output validation error: ', '');
    return err(
      new McpToolError('Execution failed: ' + message, toolName, {
        code: 'OUTPUT_VALIDATION_ERROR',
        cause: error,
      }),
    );
  }
  return err(
    new McpParameterError(error.message, toolName, undefined, undefined, {
      cause: error,
      code: 'PARAMETER_ERROR',
    }),
  );
}

function mapDocumentedErrorResponse(error: TypeError, toolName: ToolName): ToolExecutionResult {
  const cause = error.cause;
  if (
    typeof cause === 'object' &&
    cause !== null &&
    'httpStatus' in cause &&
    typeof cause.httpStatus === 'number' &&
    'payload' in cause
  ) {
    return err(classifyDocumentedErrorResponse(cause.httpStatus, cause.payload, toolName));
  }
  return err(
    new McpToolError(`Execution failed: ${error.message}`, toolName, {
      cause: error,
      code: 'EXECUTION_ERROR',
    }),
  );
}

export async function executeToolCall(
  maybeToolName: unknown,
  maybeParams: unknown,
  client: OakApiPathBasedClient,
  logger?: Logger,
): Promise<ToolExecutionResult> {
  const executionLogger = logger ?? createNoopLogger();
  executionLogger.debug('mcp-tool.generated.execute', {
    toolName: typeof maybeToolName === 'string' ? maybeToolName : '<unknown>',
    hasParams: maybeParams !== undefined,
  });

  if (!isToolName(maybeToolName)) {
    return err(
      new McpToolError(`Unknown tool: ${String(maybeToolName)}`, String(maybeToolName), {
        code: 'UNKNOWN_TOOL',
      }),
    );
  }

  const toolName: ToolName = maybeToolName;
  try {
    const result = await callTool(toolName, client, maybeParams, executionLogger);
    return ok(result);
  } catch (error) {
    return mapErrorToResult(error, toolName);
  }
}
