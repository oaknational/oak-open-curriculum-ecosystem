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
import {
  isToolName,
  UndocumentedResponseError,
  type ToolName,
  type ToolResultForName,
  callTool,
} from '@oaknational/sdk-codegen/mcp-tools';
import { err, ok, type Result } from '@oaknational/result';

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
  readonly toolName: string;
  readonly code: string;
  readonly pathParameterName?: string;
  readonly queryParameterName?: string;

  constructor(
    message: string,
    toolName: string,
    pathParameterName?: string,
    queryParameterName?: string,
    options?: { cause?: Error; code?: string },
  ) {
    super(message, options);
    this.name = 'McpParameterError';
    this.toolName = toolName;
    this.pathParameterName = pathParameterName;
    this.queryParameterName = queryParameterName;
    this.code = options?.code ?? 'PARAMETER_ERROR';
  }
}

/**
 * Result type for tool execution.
 *
 * @remarks Specialise the `value` shape per tool by threading the OpenAPI-derived
 * response types through the executor layer along with Zod validators.
 */
export type ToolExecutionSuccess<TName extends ToolName = ToolName> = ToolResultForName<TName>;

export type ToolExecutionResult = Result<ToolExecutionSuccess, McpToolError | McpParameterError>;

/**
 * Detect upstream content-blocking responses (third-party copyright gate).
 *
 * The upstream Oak API returns 400 for lessons blocked by a licensing gate
 * (`queryGate.ts` in `oaknational/oak-openapi`). The response body includes
 * a `data.cause` string containing "blocked" when the content is restricted.
 *
 * This pattern is brittle — always log the full upstream message alongside
 * the classification so breakage in the pattern match is visible in logs.
 */
function isContentBlockedResponse(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  if (!('data' in body)) {
    return false;
  }
  const data = body.data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  if (!('cause' in data)) {
    return false;
  }
  if (typeof data.cause !== 'string') {
    return false;
  }
  return data.cause.includes('blocked');
}

type UpstreamErrorCode = 'UPSTREAM_SERVER_ERROR' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR';

const UPSTREAM_MESSAGE_PREFIX: Readonly<Record<UpstreamErrorCode, string>> = {
  UPSTREAM_SERVER_ERROR: 'Upstream server error',
  CONTENT_NOT_AVAILABLE:
    'Resource unavailable due to copyright restrictions. The original may be viewed at www.thenational.academy',
  UPSTREAM_API_ERROR: 'Upstream API error',
};

function classifyUpstreamErrorCode(error: UndocumentedResponseError): UpstreamErrorCode {
  if (error.status >= 500) {
    return 'UPSTREAM_SERVER_ERROR';
  }
  if (isContentBlockedResponse(error.responseBody)) {
    return 'CONTENT_NOT_AVAILABLE';
  }
  return 'UPSTREAM_API_ERROR';
}

/**
 * Classify an `UndocumentedResponseError` into an `McpToolError`.
 *
 * Distinguishes three categories:
 * - Content blocked by licensing gate (400 + "blocked" in cause) → `CONTENT_NOT_AVAILABLE`
 * - Other 4xx upstream errors → `UPSTREAM_API_ERROR`
 * - 5xx upstream errors → `UPSTREAM_SERVER_ERROR`
 */
function classifyUndocumentedResponse(
  error: UndocumentedResponseError,
  toolName: ToolName,
): McpToolError {
  const code = classifyUpstreamErrorCode(error);
  const prefix = UPSTREAM_MESSAGE_PREFIX[code];
  const statusStr = String(error.status);

  const message = error.upstreamMessage
    ? `${prefix} (${statusStr}): ${error.upstreamMessage}`
    : `${prefix}: status ${statusStr}`;

  return new McpToolError(message, toolName, { cause: error, code });
}

/**
 * Ultra-thin executor - just validation and delegation to embedded executor
 */
function mapErrorToResult(error: unknown, toolName: ToolName): ToolExecutionResult {
  if (error instanceof McpParameterError || error instanceof McpToolError) {
    return err(error);
  }
  if (error instanceof UndocumentedResponseError) {
    return err(classifyUndocumentedResponse(error, toolName));
  }
  if (error instanceof TypeError) {
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

export async function executeToolCall(
  maybeToolName: unknown,
  maybeParams: unknown,
  client: OakApiPathBasedClient,
): Promise<ToolExecutionResult> {
  if (!isToolName(maybeToolName)) {
    return err(
      new McpToolError(`Unknown tool: ${String(maybeToolName)}`, String(maybeToolName), {
        code: 'UNKNOWN_TOOL',
      }),
    );
  }

  const toolName: ToolName = maybeToolName;
  try {
    const result = await callTool(toolName, client, maybeParams);
    return ok(result);
  } catch (error) {
    return mapErrorToResult(error, toolName);
  }
}
