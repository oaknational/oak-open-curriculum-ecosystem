/**
 * Core abstractions for MCP tools
 * Public API for tool infrastructure
 */

// Re-export types
export type {
  ToolExecutor,
  ToolDefinition,
  ErrorHandler,
  ErrorContext,
  ToolResult,
  ToolLogger,
  ToolFactory,
  ToolRegistry,
} from './types.js';

// Re-export McpTool from its single source of truth
export type { McpTool } from '../../types.js';

// Re-export implementations
export { createErrorHandler } from './error-handler';
export { createToolFactory } from './tool-factory';
export { createToolRegistry } from './tool-registry';
