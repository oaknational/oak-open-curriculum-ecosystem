/**
 * MCP tools module - minimal bridge to SDK
 *
 * Provides MCP tools and handlers by delegating to SDK.
 * All tool logic and validation is handled by the SDK.
 */

import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import {
  executeToolCall,
  createUniversalToolExecutor,
  isUniversalToolName,
  generatedToolRegistry,
  type ToolExecutionResult,
  type ToolName,
  type OakApiPathBasedClient,
  type SearchRetrievalService,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

export interface McpToolsModule {
  handleTool: (name: string, args: unknown) => Promise<CallToolResult>;
}

export interface UniversalToolExecutors {
  readonly executeMcpTool?: (name: ToolName, args: unknown) => Promise<ToolExecutionResult>;
  readonly searchRetrieval: SearchRetrievalService;
}

/**
 * Subset of UniversalToolExecutors for executor overrides only.
 *
 * Used by `resolveToolExecutors` which only provides `executeMcpTool`
 * overrides — `searchRetrieval` is constructed separately in wiring.
 */
export type ToolExecutorOverrides = Pick<UniversalToolExecutors, 'executeMcpTool'>;

function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: `Error: ${message}` };
  return { content: [content], isError: true };
}

export function createMcpToolsModule(
  deps: { client: OakApiPathBasedClient } & UniversalToolExecutors,
): McpToolsModule {
  const executeMcpTool =
    deps.executeMcpTool ??
    ((name: ToolName, args: unknown) => executeToolCall(name, args, deps.client));

  const executor = createUniversalToolExecutor({
    executeMcpTool,
    searchRetrieval: deps.searchRetrieval,
    generatedTools: generatedToolRegistry,
  });

  return {
    handleTool: async (name: string, args: unknown) => {
      if (!isUniversalToolName(name, generatedToolRegistry.isToolName)) {
        return formatError(`Unknown tool: ${name}`);
      }
      try {
        return await executor(name, args ?? {});
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return formatError(message);
      }
    },
  };
}
