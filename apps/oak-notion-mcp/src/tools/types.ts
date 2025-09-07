import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { JsonObject } from '@oaknational/mcp-core';

// Tool interface
export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: JsonObject;
    required?: string[];
  };
  handler: (args: unknown) => Promise<CallToolResult>;
}

export type McpToolResult = CallToolResult;
