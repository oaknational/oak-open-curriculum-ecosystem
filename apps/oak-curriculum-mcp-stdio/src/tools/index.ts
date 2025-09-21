/**
 * MCP tools module - minimal bridge to SDK
 *
 * Provides MCP tools and handlers by delegating to SDK.
 * All tool logic and validation is handled by the SDK.
 */

import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import {
  executeToolCall,
  executeOpenAiToolCall,
  createUniversalToolExecutor,
  isUniversalToolName,
  type ToolExecutionResult,
  type OpenAiToolName,
  type AllToolNames,
  type OakApiPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';

/**
 * MCP tools module interface
 */
export interface McpToolsModule {
  handleTool: (name: string, args: unknown) => Promise<unknown>;
}

export interface UniversalToolExecutors {
  readonly executeMcpTool?: (name: AllToolNames, args: unknown) => Promise<ToolExecutionResult>;
  readonly executeOpenAiTool?: (name: OpenAiToolName, args: unknown) => Promise<unknown>;
}

function formatError(message: string): CallToolResult {
  const content: TextContent = { type: 'text', text: `Error: ${message}` };
  return { content: [content], isError: true };
}

function decodeSuccessfulResult(result: CallToolResult): unknown {
  const first = result.content.length > 0 ? result.content[0] : undefined;
  if (first?.type === 'text') {
    try {
      return JSON.parse(first.text);
    } catch {
      return first.text;
    }
  }
  return { content: [] };
}

export function createMcpToolsModule(
  deps: { client: OakApiPathBasedClient } & UniversalToolExecutors,
): McpToolsModule {
  const executeMcpTool =
    deps.executeMcpTool ??
    ((name: AllToolNames, args: unknown) => executeToolCall(name, args, deps.client));

  const executeOpenAiTool =
    deps.executeOpenAiTool ??
    ((name: OpenAiToolName, args: unknown) => executeOpenAiToolCall(name, args, deps.client));

  const executor = createUniversalToolExecutor({
    executeMcpTool: (name, args) => executeMcpTool(name, args),
    executeOpenAiTool: (name, args) => executeOpenAiTool(name, args),
  });

  return {
    handleTool: async (name: string, args: unknown) => {
      if (!isUniversalToolName(name)) {
        return formatError(`Unknown tool: ${name}`);
      }
      try {
        const result = await executor(name, args ?? {});
        if (result.isError) {
          return result;
        }
        return decodeSuccessfulResult(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return formatError(message);
      }
    },
  };
}
