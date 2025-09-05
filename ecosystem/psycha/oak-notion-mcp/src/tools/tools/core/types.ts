/**
 * Core abstractions for MCP tools following Dependency Inversion Principle
 * These now inherit from the pure abstractions in Moria
 */

import type {
  ToolExecutor as MorphaiToolExecutor,
  ToolDefinition as MorphaiToolDefinition,
  JsonObject,
} from '@oaknational/mcp-moria';

/**
 * Re-export morphai patterns for backward compatibility
 * The phenotype instantiates the morphai forms
 */
export type ToolExecutor<TOutput = string> = MorphaiToolExecutor<unknown, TOutput>;
export type ToolDefinition = MorphaiToolDefinition;

/**
 * Error context for tool-specific error handling
 */
export interface ErrorContext {
  readonly toolName: string;
  readonly operation?: string;
  readonly metadata?: JsonObject;
}

/**
 * Error handler for MCP tools
 * Returns ToolResult instead of HandlerResult for MCP compatibility
 */
export interface ErrorHandler {
  handle(error: unknown, context?: ErrorContext): ToolResult;
}

/**
 * Import existing MCP types - single source of truth
 */
import type { McpTool, McpToolResult } from '../../types';

/**
 * Tool result structure
 * Alias for consistency
 */
export type ToolResult = McpToolResult;

/**
 * Logger abstraction for tools
 * Subset of logger interface needed by tools
 */
export interface ToolLogger {
  debug(message: string, context?: JsonObject): void;
  error(message: string, context?: JsonObject): void;
}

/**
 * Tool factory function type
 * Creates an MCP tool from executor and definition
 */
export type ToolFactory = (
  definition: ToolDefinition,
  executor: ToolExecutor,
  errorHandler: ErrorHandler,
) => McpTool;

/**
 * Tool registry for MCP tools
 * Follows the morphai pattern but adapted for MCP tool structure
 */
export interface ToolRegistry {
  register(tool: McpTool): void;
  get(name: string): McpTool | undefined;
  getAll(): McpTool[];
  has(name: string): boolean;
  clear(): void;
}
