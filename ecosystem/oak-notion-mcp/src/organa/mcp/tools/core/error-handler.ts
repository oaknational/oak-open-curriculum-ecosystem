/**
 * Default error handler implementation
 * Converts errors into user-friendly MCP responses
 */

import type { ErrorHandler, ErrorContext, ToolResult, ToolLogger } from './types.js';

/**
 * Creates a default error handler with logging
 */
export function createErrorHandler(logger: ToolLogger): ErrorHandler {
  return {
    handle(error: unknown, context?: ErrorContext): ToolResult {
      const errorMessage = extractErrorMessage(error);
      const contextInfo = context
        ? ` in ${context.toolName}${context.operation ? `: ${context.operation}` : ''}`
        : '';

      logger.error(`Error${contextInfo}`, {
        error: errorMessage,
        context,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Error${contextInfo}: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    },
    canHandle(): boolean {
      // This handler can handle any error
      return true;
    },
  };
}

/**
 * Extracts a user-friendly error message from any error type
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
}
