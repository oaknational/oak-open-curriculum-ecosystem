import type express from 'express';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, Tool, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { getMcpTools } from './mcp-tools.js';
import { readEnv } from './env.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
} from '@oaknational/oak-curriculum-sdk';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export function formatToolResponse(
  result: unknown,
  isError = false,
): {
  content: readonly TextContent[];
  isError?: true;
} {
  return {
    content: [
      {
        type: 'text',
        text: isError
          ? `Error: ${result instanceof Error ? result.message : 'Unknown error'}`
          : JSON.stringify(result, null, 2),
      },
    ],
    ...(isError && { isError: true }),
  };
}

export function findTool(name: string, tools: readonly Tool[]): Tool {
  for (const tool of tools) {
    if (tool.name === name) {
      return tool;
    }
  }
  throw new Error(`Unknown tool: ${name}`);
}

export function registerHandlers(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: getMcpTools() }));

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    try {
      const tools = getMcpTools();
      findTool(name, tools);
      if (!isToolName(name)) {
        return formatToolResponse(new Error(`Unknown tool: ${name}`), true);
      }
      const env = readEnv();
      const client = createOakPathBasedClient(env.OAK_API_KEY);
      const result = await executeToolCall(name, args, client);
      if (result.error) {
        return formatToolResponse(new Error(result.error.message), true);
      }
      return formatToolResponse(result.data);
    } catch (error) {
      const safeError = error instanceof Error ? error : new Error('Unknown error');
      return formatToolResponse(safeError, true);
    }
  });
}

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    await transport.handleRequest(req, res, req.body);
  };
}
