/**
 * MCP organ membrane - public interface
 * Provides MCP tools and handlers for Oak Curriculum API
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { CurriculumOrgan } from '../curriculum';
import { createToolHandler } from './handlers/tool-handler';
import { tools } from './tools';

// Re-export tool definitions
export { tools } from './tools';
export type { ToolName } from './tools';

// Re-export handler types
export type { ToolParameters } from './handlers/tool-handler';

/**
 * MCP organ interface
 */
export interface McpOrgan {
  /** Available MCP tools */
  readonly tools: typeof tools;
  /** Handle tool execution */
  handleTool: ReturnType<typeof createToolHandler>;
}

/**
 * Creates MCP organ that provides tools and handlers
 */
export function createMcpOrgan(curriculumOrgan: CurriculumOrgan, logger: Logger): McpOrgan {
  const mcpLogger = logger.child ? logger.child({ organ: 'mcp' }) : logger;

  return {
    tools,
    handleTool: createToolHandler(curriculumOrgan, mcpLogger),
  };
}
