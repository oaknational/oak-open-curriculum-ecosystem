/**
 * MCP tools module - minimal bridge to SDK
 *
 * Provides MCP tools and handlers by delegating to SDK.
 * All tool logic and validation is handled by the SDK.
 */

import { createHandleToolCall, type SdkClient } from './handlers/tool-handler.js';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
// Removed unused import

/**
 * MCP tools module interface
 */
export interface McpToolsModule {
  /** Handle tool execution */
  handleTool: (name: string, args: unknown) => Promise<unknown>;
}

/**
 * Creates MCP tools module that delegates to SDK
 */
export function createMcpToolsModule(deps: { client: SdkClient }): McpToolsModule {
  const handler = createHandleToolCall(deps.client);
  type McpArguments = NonNullable<CallToolRequest['params']['arguments']>;
  function isMcpArguments(value: unknown): value is McpArguments {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  function decodeResult(result: Awaited<ReturnType<typeof handler>>): unknown {
    if (result.isError === true) {
      return result;
    }
    const first = result.content.length > 0 ? result.content[0] : undefined;
    if (first && first.type === 'text') {
      try {
        const parsed: unknown = JSON.parse(first.text);
        return parsed;
      } catch {
        return first.text;
      }
    }
    return { content: [] };
  }
  return {
    handleTool: async (name: string, args: unknown) => {
      const request = {
        method: 'tools/call',
        params: {
          name,
          arguments: isMcpArguments(args) ? args : undefined,
        },
      } as const;
      const result = await handler(request);
      return decodeResult(result);
    },
  };
}
