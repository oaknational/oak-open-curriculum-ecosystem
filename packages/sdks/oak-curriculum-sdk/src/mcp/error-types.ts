/**
 * MCP tool execution error types with proper cause chains.
 *
 * These error classes are used by both the executor ({@link executeToolCall})
 * and the error classification module ({@link classifyDocumentedErrorResponse}).
 * They are extracted here to avoid circular dependencies.
 */

/**
 * Error thrown when an MCP tool execution fails.
 *
 * The `code` field provides a machine-readable classification for
 * downstream error handling and presentation.
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

/**
 * Error thrown when MCP tool parameters are invalid.
 *
 * Carries optional path/query parameter names to help identify which
 * specific parameter caused the validation failure.
 */
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
