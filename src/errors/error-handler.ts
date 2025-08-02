/**
 * Error handling utilities for classifying and transforming Notion API errors
 * into MCP-compliant error responses
 */

export type ErrorType =
  | 'rate_limit'
  | 'authentication'
  | 'not_found'
  | 'validation'
  | 'permission'
  | 'server_error'
  | 'unknown';

export interface ErrorClassification {
  type: ErrorType;
  code: string;
  message: string;
  retryable: boolean;
  statusCode: number;
}

export interface McpError {
  code: number;
  message: string;
  data?: {
    type: ErrorType;
    notionCode: string;
    retryable: boolean;
  };
}

/**
 * Classifies a Notion API error into a standardized error type
 */
export function classifyNotionError(error: unknown): ErrorClassification {
  // Handle null/undefined
  if (!error) {
    return {
      type: 'unknown',
      code: 'unknown_error',
      message: 'An unknown error occurred',
      retryable: false,
      statusCode: 500,
    };
  }

  // Extract error properties
  let code = 'unknown_error';
  let message = 'An unknown error occurred';

  if (typeof error === 'object' && 'code' in error) {
    code = String(error.code);
  }

  if (typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Classify based on error code
  switch (code) {
    case 'rate_limited':
      return {
        type: 'rate_limit',
        code,
        message,
        retryable: true,
        statusCode: 429,
      };

    case 'unauthorized':
      return {
        type: 'authentication',
        code,
        message,
        retryable: false,
        statusCode: 401,
      };

    case 'object_not_found':
      return {
        type: 'not_found',
        code,
        message,
        retryable: false,
        statusCode: 404,
      };

    case 'validation_error':
      return {
        type: 'validation',
        code,
        message,
        retryable: false,
        statusCode: 400,
      };

    case 'restricted_resource':
      return {
        type: 'permission',
        code,
        message,
        retryable: false,
        statusCode: 403,
      };

    case 'internal_server_error':
      return {
        type: 'server_error',
        code,
        message,
        retryable: true,
        statusCode: 500,
      };

    default:
      return {
        type: 'unknown',
        code,
        message,
        retryable: false,
        statusCode: 500,
      };
  }
}

/**
 * Creates an MCP-compliant error from an error classification
 */
export function createMcpError(classification: ErrorClassification): McpError {
  // Map error types to MCP error codes
  const errorCodeMap: Record<ErrorType, number> = {
    rate_limit: -32000, // Server error range
    authentication: -32001, // Server error range
    not_found: -32002, // Server error range
    validation: -32602, // Invalid params (standard JSON-RPC)
    permission: -32003, // Server error range
    server_error: -32603, // Internal error (standard JSON-RPC)
    unknown: -32603, // Internal error (standard JSON-RPC)
  };

  // Create error message prefix based on type
  const messagePrefixes: Record<ErrorType, string> = {
    rate_limit: 'Rate limit exceeded',
    authentication: 'Authentication failed',
    not_found: 'Resource not found',
    validation: 'Invalid parameters',
    permission: 'Permission denied',
    server_error: 'Internal error',
    unknown: 'Internal error',
  };

  return {
    code: errorCodeMap[classification.type],
    message: `${messagePrefixes[classification.type]}: ${classification.message}`,
    data: {
      type: classification.type,
      notionCode: classification.code,
      retryable: classification.retryable,
    },
  };
}

/**
 * Formats an MCP error into a user-friendly message
 */
export function formatErrorForUser(error: McpError): string {
  // If no data field, return generic message
  if (!error.data) {
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }

  // Map error types to user-friendly messages
  const userMessages: Record<ErrorType, string> = {
    rate_limit: 'Rate limit exceeded. Please wait a moment and try again.',
    authentication: 'Authentication failed. Please check your Notion API key configuration.',
    not_found: 'The requested resource was not found in your Notion workspace.',
    validation: 'Invalid request parameters. Please check your input and try again.',
    permission:
      'You do not have permission to access this resource. Please check your Notion integration permissions.',
    server_error: 'An error occurred while processing your request. Please try again.',
    unknown:
      'An unexpected error occurred. Please try again or contact support if the issue persists.',
  };

  return userMessages[error.data.type];
}
