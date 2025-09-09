import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

export function getMcpTools(): Tool[] {
  return Object.entries(MCP_TOOLS).map(([name, tool]) => ({
    name,
    description: `${tool.method.toUpperCase()} ${tool.path} - ${tool.operationId}`,
    // Keep schema minimal; parameter validation is performed by the SDK executors
    inputSchema: { type: 'object' },
  }));
}
