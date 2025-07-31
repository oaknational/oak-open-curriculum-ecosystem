import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { NotionClientWrapper } from './notion/client.js';
import type { Logger } from './logging/logger.js';
import { createResourceHandlers } from './mcp/resources/handlers.js';
import { createToolHandlers } from './mcp/tools/handlers.js';

export interface ServerConfig {
  name: string;
  version: string;
}

export function createMcpServer(deps: {
  notionClient: NotionClientWrapper;
  logger: Logger;
  config: ServerConfig;
}): Server {
  deps.logger.info('Creating MCP server', deps.config);

  const server = new Server(
    {
      name: deps.config.name,
      version: deps.config.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    },
  );

  // Wire up handlers
  const resourceHandlers = createResourceHandlers(deps);
  const toolHandlers = createToolHandlers(deps);

  // Resource handlers
  server.setRequestHandler(ListResourcesRequestSchema, resourceHandlers.handleListResources);

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return resourceHandlers.handleReadResource(request.params.uri);
  });

  // Tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    deps.logger.debug('Listing available tools');
    const tools = toolHandlers.getTools();
    return {
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    deps.logger.debug('Calling tool', { name, args });

    const tool = name in toolHandlers && name !== 'getTools' ? toolHandlers[name] : undefined;
    if (!tool || typeof tool !== 'object' || !('handler' in tool)) {
      throw new Error(`Tool not found: ${name}`);
    }

    const result = await tool.handler(args);
    return result;
  });

  // Prompt handlers (empty for now)
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    deps.logger.debug('Listing prompts (none available yet)');
    return { prompts: [] };
  });

  deps.logger.info('MCP server created with handlers');

  return server;
}
