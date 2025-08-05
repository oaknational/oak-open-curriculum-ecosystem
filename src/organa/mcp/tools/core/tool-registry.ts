/**
 * Tool registry implementation
 * Manages collection of MCP tools
 */

import type { ToolRegistry } from './types.js';
import type { McpTool } from '../../types.js';

/**
 * Creates a tool registry for managing MCP tools
 */
export function createToolRegistry(): ToolRegistry {
  const tools = new Map<string, McpTool>();

  return {
    register(tool: McpTool): void {
      if (tools.has(tool.name)) {
        throw new Error(`Tool with name "${tool.name}" is already registered`);
      }
      tools.set(tool.name, tool);
    },

    get(name: string): McpTool | undefined {
      return tools.get(name);
    },

    getAll(): McpTool[] {
      return Array.from(tools.values());
    },
  };
}
