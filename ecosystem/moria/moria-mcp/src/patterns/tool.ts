/**
 * @fileoverview Tool patterns - pure abstractions for tool creation and management
 * @module moria/patterns/tool
 *
 * Zero-dependency tool patterns that define the essence of what tools are.
 * These are Platonic forms that all concrete tools instantiate.
 */

/**
 * ToolExecutor - The essence of tool execution
 * A pure abstraction that transforms input to output
 *
 * @template TInput The type of input the tool accepts
 * @template TOutput The type of output the tool produces
 */
export interface ToolExecutor<TInput = unknown, TOutput = unknown> {
  /**
   * Execute the tool with the given input
   * @param input - The input to process
   * @returns A promise resolving to the output
   */
  execute(input: TInput): Promise<TOutput>;
}

/**
 * ToolDefinition - The form of tool metadata
 * Pure description of a tool's nature and requirements
 */
export interface ToolDefinition {
  /**
   * The unique name of the tool
   */
  readonly name: string;

  /**
   * Human-readable description of what the tool does
   */
  readonly description: string;

  /**
   * JSON Schema describing the tool's input structure
   */
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties: Record<string, unknown>;
    readonly required?: readonly string[];
    readonly additionalProperties?: boolean;
  };
}

/**
 * Tool - The composition of definition and execution
 * Unites metadata with behavior to form a complete tool
 *
 * @template TInput The type of input the tool accepts
 * @template TOutput The type of output the tool produces
 */
export interface Tool<TInput = unknown, TOutput = unknown> {
  /**
   * The tool's metadata and schema
   */
  readonly definition: ToolDefinition;

  /**
   * The tool's execution logic
   */
  readonly executor: ToolExecutor<TInput, TOutput>;
}

/**
 * ToolFactory - Pattern for creating tools from components
 *
 * @template TContext The type of context needed to create tools
 */
export type ToolFactory<TContext = unknown> = (
  definition: ToolDefinition,
  executor: ToolExecutor,
  context: TContext,
) => Tool;

/**
 * ToolRegistry - Pattern for managing tool collections
 *
 * @template T The type of tools stored in the registry
 */
export interface ToolRegistry<T extends Tool = Tool> {
  /**
   * Register a new tool
   * @param tool - The tool to register
   */
  register(tool: T): void;

  /**
   * Get a tool by name
   * @param name - The name of the tool
   * @returns The tool if found, undefined otherwise
   */
  get(name: string): T | undefined;

  /**
   * Get all registered tools
   * @returns Array of all tools
   */
  getAll(): readonly T[];

  /**
   * Check if a tool is registered
   * @param name - The name of the tool
   * @returns True if the tool exists
   */
  has(name: string): boolean;

  /**
   * Clear all registered tools
   */
  clear(): void;

  /**
   * Unregister a tool (optional)
   * @param name - The name of the tool to remove
   * @returns True if the tool was removed
   */
  unregister?(name: string): boolean;

  /**
   * Get the count of registered tools (optional)
   * @returns The number of tools
   */
  size?(): number;
}

/**
 * ToolValidator - Pattern for validating tool inputs
 *
 * @template TInput The expected input type
 */
export interface ToolValidator<TInput = unknown> {
  /**
   * Validate that input matches the expected type
   * @param input - The input to validate
   * @returns Type predicate indicating if input is valid
   */
  validate(input: unknown): input is TInput;

  /**
   * Get validation errors (optional)
   * @param input - The input that failed validation
   * @returns Array of error messages
   */
  getErrors?(input: unknown): string[];
}
