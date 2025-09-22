import type express from 'express';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { readEnv } from './env.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  zodRawShapeFromToolInputJsonSchema,
  executeOpenAiToolCall,
  listUniversalTools,
  createUniversalToolExecutor,
} from '@oaknational/oak-curriculum-sdk';

export function registerHandlers(server: McpServer): void {
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    server.registerTool(
      tool.name,
      { title: tool.name, description: tool.description ?? tool.name, inputSchema: input },
      async (params: unknown) => {
        const env = readEnv();
        const client = createOakPathBasedClient(env.OAK_API_KEY);
        const executor = createUniversalToolExecutor({
          executeMcpTool: (name, args) => executeToolCall(name, args, client),
          executeOpenAiTool: (name, args) => executeOpenAiToolCall(name, args, client),
        });
        return executor(tool.name, params ?? {});
      },
    );
  }
}

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    await transport.handleRequest(req, res, req.body);
  };
}
