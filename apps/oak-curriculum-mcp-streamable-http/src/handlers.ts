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

export interface ToolHandlerDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly executeOpenAiTool: typeof executeOpenAiToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
}

const defaultDependencies: ToolHandlerDependencies = {
  createClient: createOakPathBasedClient,
  executeMcpTool: executeToolCall,
  executeOpenAiTool: executeOpenAiToolCall,
  createExecutor: createUniversalToolExecutor,
};

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;

export function registerHandlers(server: McpServer, overrides?: ToolHandlerOverrides): void {
  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    ...(overrides ?? {}),
  };
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    server.registerTool(
      tool.name,
      { title: tool.name, description: tool.description ?? tool.name, inputSchema: input },
      async (params: unknown) => {
        const env = readEnv();
        const client = deps.createClient(env.OAK_API_KEY);
        const executor = deps.createExecutor({
          executeMcpTool: (name, args) => deps.executeMcpTool(name, args, client),
          executeOpenAiTool: (name, args) => deps.executeOpenAiTool(name, args, client),
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
