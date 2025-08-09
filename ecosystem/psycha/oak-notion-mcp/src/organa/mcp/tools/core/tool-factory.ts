/**
 * Generic tool factory following Dependency Inversion Principle
 * Creates MCP tools from clean abstractions
 */

import type { ToolDefinition, ToolExecutor, ErrorHandler, ToolFactory } from './types';
import type { McpTool } from '../../types';

/**
 * Creates a generic tool factory
 * Separates tool creation from implementation details
 */
export function createToolFactory(): ToolFactory {
  return (
    definition: ToolDefinition,
    executor: ToolExecutor,
    errorHandler: ErrorHandler,
  ): McpTool => {
    return {
      name: definition.name,
      description: definition.description,
      inputSchema: {
        ...definition.inputSchema,
        required: definition.inputSchema.required
          ? [...definition.inputSchema.required]
          : undefined,
      },

      async handler(args: unknown) {
        try {
          // Pass args directly - executor is responsible for validation
          // This maintains type safety by letting the executor handle
          // the runtime type checking rather than using unsafe assertions
          const result = await executor.execute(args);

          return {
            content: [{ type: 'text', text: result }],
          };
        } catch (error) {
          return errorHandler.handle(error, {
            toolName: definition.name,
          });
        }
      },
    };
  };
}
