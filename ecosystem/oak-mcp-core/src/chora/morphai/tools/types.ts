/**
 * @fileoverview Abstract tool patterns - the hidden forms of tool creation
 * @module morphai/tools
 *
 * These are the Platonic forms that all tools instantiate.
 * They define the essential nature of what it means to be a tool.
 */

/**
 * The essence of tool execution
 * A pure abstraction that transforms input to output
 */
export interface ToolExecutor<TInput = unknown, TOutput = unknown> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * The form of tool definition
 * Pure metadata describing a tool's nature
 */
export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties: Record<string, unknown>;
    readonly required?: readonly string[];
  };
}

/**
 * The pattern of tool composition
 * How definition and execution unite to form a tool
 */
export interface Tool<TInput = unknown, TOutput = unknown> {
  readonly definition: ToolDefinition;
  readonly executor: ToolExecutor<TInput, TOutput>;
}

/**
 * The factory pattern - creating concrete from abstract
 */
export type ToolFactory<TContext = unknown> = (
  definition: ToolDefinition,
  executor: ToolExecutor,
  context: TContext,
) => Tool;

/**
 * The registry pattern - managing tool collections
 */
export interface ToolRegistry<T extends Tool = Tool> {
  register(tool: T): void;
  get(name: string): T | undefined;
  getAll(): readonly T[];
  has(name: string): boolean;
  clear(): void;
}

/**
 * Tool validation pattern
 */
export interface ToolValidator<TInput = unknown> {
  validate(input: unknown): input is TInput;
}
