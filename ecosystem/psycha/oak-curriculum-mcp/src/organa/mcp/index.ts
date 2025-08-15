/**
 * MCP organ membrane - public interface
 *
 * Provides MCP tools and handlers for Oak Curriculum API.
 * Uses SDK directly - no intermediate organ layer needed.
 *
 * ADR Compliance:
 * - All data flows from API schema through SDK
 * - No manual mapping or compatibility layers
 * - Direct SDK delegation for all operations
 */

import type { Logger } from '@oaknational/mcp-moria';
// CRITICAL: Import ONLY the path-based client type, NEVER OakApiClient
import type { OakApiPathBasedClient } from '@oaknational/oak-curriculum-sdk';
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
 * Creates MCP organ using PATH-BASED CLIENT
 * Uses SDK path-based client for pure data-driven execution
 * CRITICAL: MUST use OakApiPathBasedClient, NEVER OakApiClient
 */
export function createMcpOrgan(sdk: OakApiPathBasedClient, logger: Logger): McpOrgan {
  const mcpLogger = logger.child ? logger.child({ organ: 'mcp' }) : logger;

  return {
    tools,
    handleTool: createToolHandler(sdk, mcpLogger),
  };
}
