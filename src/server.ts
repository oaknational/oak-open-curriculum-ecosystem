import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListResourcesRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { NotionClientWrapper } from './notion/client.js';
import type { Logger } from './logging/logger.js';
import { createResourceHandlers } from './mcp/handlers.js';

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

  server.setRequestHandler(ListResourcesRequestSchema, resourceHandlers.handleListResources);

  deps.logger.info('MCP server created with handlers');

  return server;
}
