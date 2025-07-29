import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (args: any) => Promise<CallToolResult>;
}

export type McpToolResult = CallToolResult;
