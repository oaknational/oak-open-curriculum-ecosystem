/**
 * Core abstractions for MCP tools following Dependency Inversion Principle
 */

/**
 * Generic tool executor interface
 * Separates execution logic from MCP protocol concerns
 *
 * The executor is responsible for validating the input at runtime
 * since MCP tools receive unknown input from external sources
 */
export interface ToolExecutor<TOutput = string> {
  execute(input: unknown): Promise<TOutput>;
}

/**
 * Tool definition metadata
 * Pure data structure with no behavior
 */
export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Error handler abstraction
 * Converts errors into MCP-compatible responses
 */
export interface ErrorHandler {
  handle(error: unknown, context?: ErrorContext): ToolResult;
}

/**
 * Error context for better error reporting
 */
export interface ErrorContext {
  readonly toolName: string;
  readonly operation?: string;
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
 * Tool registry interface
 * Manages collection of tools
 */
export interface ToolRegistry {
  register(tool: McpTool): void;
  get(name: string): McpTool | undefined;
  getAll(): McpTool[];
}
