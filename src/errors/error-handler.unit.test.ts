import { describe, it, expect } from 'vitest';
import {
  classifyNotionError,
  createMcpError,
  formatErrorForUser,
  ErrorClassification,
  McpError,
} from './error-handler.js';

describe('classifyNotionError', () => {
  it('should classify rate limit errors', () => {
    const error = {
      code: 'rate_limited',
      message: 'You have exceeded the rate limit',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'rate_limit',
      code: 'rate_limited',
      message: 'You have exceeded the rate limit',
      retryable: true,
      statusCode: 429,
    });
  });

  it('should classify authentication errors', () => {
    const error = {
      code: 'unauthorized',
      message: 'API token is invalid',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'authentication',
      code: 'unauthorized',
      message: 'API token is invalid',
      retryable: false,
      statusCode: 401,
    });
  });

  it('should classify not found errors', () => {
    const error = {
      code: 'object_not_found',
      message: 'Could not find page with ID: abc123',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'not_found',
      code: 'object_not_found',
      message: 'Could not find page with ID: abc123',
      retryable: false,
      statusCode: 404,
    });
  });

  it('should classify validation errors', () => {
    const error = {
      code: 'validation_error',
      message: 'Invalid request parameters',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'validation',
      code: 'validation_error',
      message: 'Invalid request parameters',
      retryable: false,
      statusCode: 400,
    });
  });

  it('should classify permission errors', () => {
    const error = {
      code: 'restricted_resource',
      message: 'You do not have permission to access this resource',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'permission',
      code: 'restricted_resource',
      message: 'You do not have permission to access this resource',
      retryable: false,
      statusCode: 403,
    });
  });

  it('should classify server errors as retryable', () => {
    const error = {
      code: 'internal_server_error',
      message: 'An unexpected error occurred',
    };

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'server_error',
      code: 'internal_server_error',
      message: 'An unexpected error occurred',
      retryable: true,
      statusCode: 500,
    });
  });

  it('should handle unknown error structures', () => {
    const error = new Error('Something went wrong');

    const result = classifyNotionError(error);

    expect(result).toEqual({
      type: 'unknown',
      code: 'unknown_error',
      message: 'Something went wrong',
      retryable: false,
      statusCode: 500,
    });
  });

  it('should handle null/undefined errors', () => {
    const result = classifyNotionError(null);

    expect(result).toEqual({
      type: 'unknown',
      code: 'unknown_error',
      message: 'An unknown error occurred',
      retryable: false,
      statusCode: 500,
    });
  });
});

describe('createMcpError', () => {
  it('should create MCP error from rate limit classification', () => {
    const classification: ErrorClassification = {
      type: 'rate_limit',
      code: 'rate_limited',
      message: 'Too many requests',
      retryable: true,
      statusCode: 429,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32000,
      message: 'Rate limit exceeded: Too many requests',
      data: {
        type: 'rate_limit',
        notionCode: 'rate_limited',
        retryable: true,
      },
    });
  });

  it('should create MCP error from authentication classification', () => {
    const classification: ErrorClassification = {
      type: 'authentication',
      code: 'unauthorized',
      message: 'Invalid API key',
      retryable: false,
      statusCode: 401,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32001,
      message: 'Authentication failed: Invalid API key',
      data: {
        type: 'authentication',
        notionCode: 'unauthorized',
        retryable: false,
      },
    });
  });

  it('should create MCP error from not found classification', () => {
    const classification: ErrorClassification = {
      type: 'not_found',
      code: 'object_not_found',
      message: 'Page not found',
      retryable: false,
      statusCode: 404,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32002,
      message: 'Resource not found: Page not found',
      data: {
        type: 'not_found',
        notionCode: 'object_not_found',
        retryable: false,
      },
    });
  });

  it('should create MCP error from validation classification', () => {
    const classification: ErrorClassification = {
      type: 'validation',
      code: 'validation_error',
      message: 'Invalid parameters',
      retryable: false,
      statusCode: 400,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32602,
      message: 'Invalid parameters: Invalid parameters',
      data: {
        type: 'validation',
        notionCode: 'validation_error',
        retryable: false,
      },
    });
  });

  it('should create MCP error from permission classification', () => {
    const classification: ErrorClassification = {
      type: 'permission',
      code: 'restricted_resource',
      message: 'Access denied',
      retryable: false,
      statusCode: 403,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32003,
      message: 'Permission denied: Access denied',
      data: {
        type: 'permission',
        notionCode: 'restricted_resource',
        retryable: false,
      },
    });
  });

  it('should create MCP error from server error classification', () => {
    const classification: ErrorClassification = {
      type: 'server_error',
      code: 'internal_server_error',
      message: 'Server error',
      retryable: true,
      statusCode: 500,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32603,
      message: 'Internal error: Server error',
      data: {
        type: 'server_error',
        notionCode: 'internal_server_error',
        retryable: true,
      },
    });
  });

  it('should create MCP error from unknown classification', () => {
    const classification: ErrorClassification = {
      type: 'unknown',
      code: 'unknown_error',
      message: 'Unknown error',
      retryable: false,
      statusCode: 500,
    };

    const result = createMcpError(classification);

    expect(result).toEqual({
      code: -32603,
      message: 'Internal error: Unknown error',
      data: {
        type: 'unknown',
        notionCode: 'unknown_error',
        retryable: false,
      },
    });
  });
});

describe('formatErrorForUser', () => {
  it('should format rate limit error for user', () => {
    const error: McpError = {
      code: -32000,
      message: 'Rate limit exceeded: Too many requests',
      data: {
        type: 'rate_limit',
        notionCode: 'rate_limited',
        retryable: true,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe('Rate limit exceeded. Please wait a moment and try again.');
  });

  it('should format authentication error for user', () => {
    const error: McpError = {
      code: -32001,
      message: 'Authentication failed: Invalid API key',
      data: {
        type: 'authentication',
        notionCode: 'unauthorized',
        retryable: false,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe('Authentication failed. Please check your Notion API key configuration.');
  });

  it('should format not found error for user', () => {
    const error: McpError = {
      code: -32002,
      message: 'Resource not found: Page not found',
      data: {
        type: 'not_found',
        notionCode: 'object_not_found',
        retryable: false,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe('The requested resource was not found in your Notion workspace.');
  });

  it('should format validation error for user', () => {
    const error: McpError = {
      code: -32602,
      message: 'Invalid parameters: Missing required field',
      data: {
        type: 'validation',
        notionCode: 'validation_error',
        retryable: false,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe('Invalid request parameters. Please check your input and try again.');
  });

  it('should format permission error for user', () => {
    const error: McpError = {
      code: -32003,
      message: 'Permission denied: Access restricted',
      data: {
        type: 'permission',
        notionCode: 'restricted_resource',
        retryable: false,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe(
      'You do not have permission to access this resource. Please check your Notion integration permissions.',
    );
  });

  it('should format server error for user', () => {
    const error: McpError = {
      code: -32603,
      message: 'Internal error: Server error',
      data: {
        type: 'server_error',
        notionCode: 'internal_server_error',
        retryable: true,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe('An error occurred while processing your request. Please try again.');
  });

  it('should handle missing data field gracefully', () => {
    const error: McpError = {
      code: -32603,
      message: 'Some error occurred',
    };

    const result = formatErrorForUser(error);

    expect(result).toBe(
      'An unexpected error occurred. Please try again or contact support if the issue persists.',
    );
  });

  it('should format unknown error for user', () => {
    const error: McpError = {
      code: -32603,
      message: 'Internal error: Unknown error',
      data: {
        type: 'unknown',
        notionCode: 'unknown_error',
        retryable: false,
      },
    };

    const result = formatErrorForUser(error);

    expect(result).toBe(
      'An unexpected error occurred. Please try again or contact support if the issue persists.',
    );
  });
});
