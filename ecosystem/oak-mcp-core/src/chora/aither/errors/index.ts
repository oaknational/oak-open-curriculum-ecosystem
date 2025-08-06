/**
 * Errors - The pain/alert system of the organism
 *
 * Public API for error handling
 */

// Error handling utilities
export {
  classifyNotionError,
  createMcpError,
  formatErrorForUser,
  createChainedNotionError,
  wrapNotionOperation,
} from './error-handler.js';
export type { ErrorType, ErrorClassification, McpError } from './error-handler.js';

// New error framework components
export { ChainedError } from './chained-error.js';
export { Result } from './result.js';
export type { Result as ResultType, ValidationResult } from './result.js';
export { ErrorContextManager, getDefaultErrorContextManager } from './error-context.js';
export {
  createContextStorage,
  getErrorContextStorage,
  registerContextStorageFactory,
  type ErrorContext,
  type ContextStorage,
} from './context-storage.js';
