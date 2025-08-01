import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// Tool interface
export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: unknown) => Promise<CallToolResult>;
}

export type McpToolResult = CallToolResult;
