/**
 * Tool Execution Logging
 *
 * Utilities for logging tool execution diagnostics: validation failures
 * and undocumented upstream responses.
 */

import type { Logger } from '@oaknational/logger';
import {
  McpToolError,
  UndocumentedResponseError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Logs validation failure if present in tool execution result.
 *
 * Extracts and logs structured validation error details including
 * raw payload and validation issues for debugging.
 *
 * @param name - Tool name
 * @param execution - Tool execution result
 * @param logger - Logger instance
 *
 * @public
 */
export function logValidationFailureIfPresent(
  name: string,
  execution: ToolExecutionResult,
  logger: Logger,
): void {
  const cause = extractValidationCause(execution);
  if (!cause) {
    return;
  }

  const { error, details } = cause;
  const rawForLog = truncateForLog(details.raw);
  const issuesForLog = truncateForLog(details.issues);

  logger.warn('MCP tool validation failed', {
    toolName: name,
    message: error.message,
    issues: issuesForLog ?? null,
    rawPayload: rawForLog ?? null,
  });
}

interface ValidationDetails {
  readonly raw?: unknown;
  readonly issues?: unknown;
}

function isValidationDetails(value: unknown): value is ValidationDetails {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'raw' in value || 'issues' in value;
}

function extractValidationCause(
  execution: ToolExecutionResult,
): { readonly error: McpToolError; readonly details: ValidationDetails } | undefined {
  if (execution.ok) {
    return undefined;
  }

  const { error } = execution;

  if (!(error instanceof McpToolError) || error.code !== 'OUTPUT_VALIDATION_ERROR') {
    return undefined;
  }

  if (!(error.cause instanceof TypeError)) {
    return undefined;
  }

  const details = isValidationDetails(error.cause.cause) ? error.cause.cause : undefined;

  if (!details) {
    return undefined;
  }

  return { error, details };
}

/**
 * Logs undocumented upstream API response if present in execution result.
 *
 * When the upstream Oak API returns a status code not documented in the
 * OpenAPI spec (e.g. 400 from the copyright gate), the SDK classifies it
 * as an `McpToolError` with an `UndocumentedResponseError` cause.
 *
 * This function always logs the upstream details so that breakage in the
 * SDK's content-blocking pattern match is visible in production logs.
 *
 * @param name - Tool name
 * @param execution - Tool execution result
 * @param logger - Logger instance
 */
export function logUpstreamErrorIfPresent(
  name: string,
  execution: ToolExecutionResult,
  logger: Logger,
): void {
  if (execution.ok) {
    return;
  }

  const { error } = execution;
  if (!(error instanceof McpToolError)) {
    return;
  }

  if (!(error.cause instanceof UndocumentedResponseError)) {
    return;
  }

  const upstream = error.cause;
  logger.warn('Undocumented upstream response', {
    toolName: name,
    status: upstream.status,
    operationId: upstream.operationId,
    classified: error.code,
    upstreamMessage: upstream.upstreamMessage ?? null,
  });
}

function truncateForLog(value: unknown, maxLength = 2000): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  let serialised: string | undefined;

  if (typeof value === 'string') {
    serialised = value;
  } else {
    try {
      serialised = JSON.stringify(value);
    } catch {
      serialised = undefined;
    }
  }

  if (!serialised) {
    return '[unserialisable]';
  }

  if (serialised.length <= maxLength) {
    return serialised;
  }

  return `${serialised.slice(0, maxLength)}...`;
}
