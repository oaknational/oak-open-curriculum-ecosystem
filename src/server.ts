import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createResourceHandlers } from './organa/mcp/resources/handlers/index.js';
import { createToolHandlers } from './organa/mcp/tools/handlers.js';
import type { ServerDependencies } from './chora/stroma/types/dependencies.js';

/**
 * Set up tool-related request handlers
 */
function setupToolHandlers(
  server: Server,
  toolHandlers: ReturnType<typeof createToolHandlers>,
  deps: ServerDependencies,
): void {
  server.setRequestHandler(ListToolsRequestSchema, () => {
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
}

export function createMcpServer(deps: ServerDependencies): Server {
  deps.logger.info('Creating MCP server', { config: deps.config });

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
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return resourceHandlers.handleListResources();
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return resourceHandlers.handleReadResource(request.params.uri);
  });

  // Tool handlers
  setupToolHandlers(server, toolHandlers, deps);

  // Prompt handlers (empty for now)
  server.setRequestHandler(ListPromptsRequestSchema, () => {
    deps.logger.debug('Listing prompts (none available yet)');
    return { prompts: [] };
  });

  deps.logger.info('MCP server created with handlers');

  return server;
}
