/**
 * Validation Failure Logging
 *
 * Utilities for logging tool validation failures with comprehensive context.
 */

import type { Logger } from '@oaknational/mcp-logger';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

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
  if (!('error' in execution) || !execution.error) {
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
