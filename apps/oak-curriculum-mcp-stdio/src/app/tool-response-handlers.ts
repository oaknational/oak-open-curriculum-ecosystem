/**
 * Shared helpers for formatting MCP tool responses with structured logging.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolResult, ToolName } from '@oaknational/oak-curriculum-sdk';

import type { Logger } from './wiring.js';
import type { ToolExecutionSuccessEnvelope } from './validation.js';

type ToolResponse = CallToolResult;

export interface ToolHandlerContext {
  readonly name: string;
  readonly description: string;
  readonly inputSchemaRaw: unknown;
  readonly inputSchemaZod: unknown;
  readonly outputSchemaRaw: unknown;
  readonly outputSchemaZod: unknown;
}

export interface ToolResponseHandlers {
  handleExecutionError(params: unknown, error: unknown): ToolResponse;
  handleValidationError(
    params: unknown,
    output: ToolExecutionSuccessEnvelope,
    message: string,
  ): ToolResponse;
  handleSuccess<TName extends ToolName>(result: ToolResult<TName>): ToolResponse;
}

type LoggerForToolHandlers = Pick<Logger, 'info' | 'error'>;

interface ToolExecutionErrorPayload {
  readonly toolName: string;
  readonly toolDescription: string;
  readonly toolInputSchemaRaw: unknown;
  readonly toolInputSchemaZod: unknown;
  readonly toolInput: unknown;
  readonly toolExecutionError: { message: string };
}

interface ToolValidationErrorPayload extends Omit<ToolExecutionErrorPayload, 'toolExecutionError'> {
  readonly toolOutputSchemaRaw: unknown;
  readonly toolOutputSchemaZod: unknown;
  readonly toolOutput: unknown;
  readonly outputValidationFailed: { message: string };
}

function serialisePayload(payload: unknown): string {
  try {
    return JSON.stringify(payload);
  } catch (error) {
    const fallback = {
      serialisationFailed: true,
      reason: String(error),
    } as const;
    return JSON.stringify(fallback);
  }
}

function createErrorResponse(
  logger: LoggerForToolHandlers,
  prefix: string,
  payload: ToolExecutionErrorPayload | ToolValidationErrorPayload,
): ToolResponse {
  const serialised = serialisePayload(payload);
  logger.error(`${prefix}: ${serialised}`);
  return { content: [{ type: 'text', text: serialised }], isError: true };
}

function createSuccessResponse(
  logger: LoggerForToolHandlers,
  result: ToolExecutionSuccessEnvelope,
): ToolResponse {
  const serialised = serialisePayload({ status: result.status, data: result.data });
  logger.info(`Tool output validated successfully: ${serialised}`);
  return { content: [{ type: 'text', text: serialised }] };
}

export function createToolResponseHandlers(
  logger: LoggerForToolHandlers,
  context: ToolHandlerContext,
): ToolResponseHandlers {
  const sharedMetadata = {
    toolName: context.name,
    toolDescription: context.description,
    toolInputSchemaRaw: context.inputSchemaRaw,
    toolInputSchemaZod: context.inputSchemaZod,
  };

  return {
    handleExecutionError(params: unknown, error: unknown): ToolResponse {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return createErrorResponse(logger, 'Tool execution failed', {
        ...sharedMetadata,
        toolInput: params,
        toolExecutionError: { message },
      });
    },
    handleValidationError(
      params: unknown,
      output: ToolExecutionSuccessEnvelope,
      message: string,
    ): ToolResponse {
      return createErrorResponse(logger, 'Tool output validation failed', {
        ...sharedMetadata,
        toolInput: params,
        toolOutputSchemaRaw: context.outputSchemaRaw,
        toolOutputSchemaZod: context.outputSchemaZod,
        toolOutput: output,
        outputValidationFailed: { message },
      });
    },
    handleSuccess(result: ToolExecutionSuccessEnvelope): ToolResponse {
      return createSuccessResponse(logger, result);
    },
  };
}
