/**
 * Core abstractions for MCP tools following Dependency Inversion Principle
 * These now inherit from the morphai in the genotype
 */

import type {
  ToolExecutor as MorphaiToolExecutor,
  ToolDefinition as MorphaiToolDefinition,
  ErrorHandler as MorphaiErrorHandler,
  ErrorContext as MorphaiErrorContext,
} from '@oaknational/mcp-core';

/**
 * Re-export morphai patterns for backward compatibility
 * The phenotype instantiates the morphai forms
 */
export type ToolExecutor<TOutput = string> = MorphaiToolExecutor<unknown, TOutput>;
export type ToolDefinition = MorphaiToolDefinition;

/**
 * Error handler extends morphai pattern with MCP-specific result type
 */
export interface ErrorHandler extends MorphaiErrorHandler<unknown, ToolResult> {
  handle(error: unknown, context?: ErrorContext): ToolResult;
}

/**
 * Error context extends morphai with tool-specific fields
 */
export interface ErrorContext extends MorphaiErrorContext {
  readonly toolName: string;
}

/**
 * Import existing MCP types - single source of truth
 */
import type { McpTool, McpToolResult } from '../../types.js';

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
  debug(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
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
