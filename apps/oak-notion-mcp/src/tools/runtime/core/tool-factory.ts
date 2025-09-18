/**
 * Generic tool factory following Dependency Inversion Principle
 * Creates MCP tools from clean abstractions
 */

import type { ToolDefinition, ToolExecutor, ErrorHandler, ToolFactory } from '../../../types';
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
          const result = await executor.execute(args);
          const text = typeof result === 'string' ? result : JSON.stringify(result);
          return {
            content: [{ type: 'text', text }],
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
