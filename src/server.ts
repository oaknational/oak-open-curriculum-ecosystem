import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
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

  // Add empty handlers for tools and prompts (required by MCP)
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    deps.logger.debug('Listing tools (none available yet)');
    return { tools: [] };
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    deps.logger.debug('Listing prompts (none available yet)');
    return { prompts: [] };
  });

  deps.logger.info('MCP server created with handlers');

  return server;
}
