/**
 * Errors - The pain/alert system of the organism
 *
 * Public API for error handling
 */

export { classifyNotionError, createMcpError, formatErrorForUser } from './error-handler.js';
export type { ErrorType, ErrorClassification, McpError } from './error-handler.js';
