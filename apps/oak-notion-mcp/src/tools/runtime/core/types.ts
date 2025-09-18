/**
 * Core abstractions for MCP tools following Dependency Inversion Principle
 * These now inherit from the pure abstractions in the core package
 */

import type { JsonObject } from '@oaknational/mcp-logger';

/**
 * Minimal local executor type to avoid coupling to core generics
 */
export interface ToolExecutor<TInput = unknown, TOutput = unknown> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Minimal local definition type aligned with core base tool shape
 */
export interface ToolDefinition {
  readonly name: string;
  readonly description?: string;
  readonly inputSchema: Readonly<{
    readonly type: 'object';
    readonly properties: JsonObject;
    readonly required?: readonly string[];
  }>;
}

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
 * Core tool registry for MCP tools
 * Named explicitly to avoid collisions with schema-level types
 */
export interface CoreToolRegistry {
  register(tool: McpTool): void;
  get(name: string): McpTool | undefined;
  getAll(): McpTool[];
  has(name: string): boolean;
  clear(): void;
}
