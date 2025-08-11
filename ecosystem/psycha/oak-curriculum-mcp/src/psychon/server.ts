/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { CallToolRequest, ListToolsRequest } from '@modelcontextprotocol/sdk/types.js';
import { wireDependencies } from './wiring';
import type { ServerConfig } from './wiring';

/**
 * Creates and starts the Oak Curriculum MCP server
 */
export async function createServer(config?: ServerConfig): Promise<void> {
  // Wire dependencies
  const { logger, mcpOrgan, config: serverConfig } = wireDependencies(config);

  // Create MCP server
  const server = new Server(
    {
      name: serverConfig.serverName,
      version: serverConfig.serverVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Register tool list handler
  server.setRequestHandler('tools/list', async (_request: ListToolsRequest) => {
    logger.debug('Listing available tools');
    return {
      tools: mcpOrgan.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Register tool call handler
  server.setRequestHandler('tools/call', async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    logger.info('Executing tool', { tool: name, args });

    try {
      const result = await mcpOrgan.handleTool(name as any, args as any);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Tool execution failed', { tool: name, error });
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Create transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);

  logger.info('Oak Curriculum MCP server started', {
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });

  // Handle shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down server');
    await server.close();
    process.exit(0);
  });
}

/**
 * Start server if run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: (process.env.LOG_LEVEL as any) ?? 'info',
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
