/**
 * MCP Server for Notion integration.
 *
 * Note: This server uses the low-level McpServer API for tool/resource/prompt
 * registration because:
 * 1. Tool definitions use JSON Schema (not Zod) - McpServer.registerTool()
 *    expects Zod schemas for validation
 * 2. Resources are static (not URI templates) - McpServer.registerResource()
 *    is designed for ResourceTemplate patterns
 *
 * The low-level API is accessed via server.server.setRequestHandler().
 * This is the same pattern used in apps that need custom handler behavior.
 *
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  type CallToolRequest,
  type ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { createResourceHandlers, createToolHandlers } from '../tools/index';
import type { McpTool } from '../tools/types';
import type { NotionServerDependencies } from '../types/notion-types/dependencies';

/**
 * Register tool handlers using the low-level API.
 *
 * Uses setRequestHandler because tools have JSON Schema definitions,
 * not Zod schemas required by McpServer.registerTool().
 */
function registerToolHandlers(
  server: McpServer,
  toolHandlers: ReturnType<typeof createToolHandlers>,
  deps: NotionServerDependencies,
): void {
  server.server.setRequestHandler(ListToolsRequestSchema, () => {
    deps.logger.debug('Listing available tools');
    const tools = toolHandlers.getTools();
    return {
      tools: tools.map((tool: McpTool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
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

/**
 * Register resource handlers using the low-level API.
 *
 * Uses setRequestHandler because resources are static (not URI templates).
 */
function registerResourceHandlers(
  server: McpServer,
  resourceHandlers: ReturnType<typeof createResourceHandlers>,
): void {
  server.server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return resourceHandlers.handleListResources();
  });

  server.server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {
      return resourceHandlers.handleReadResource(request.params.uri);
    },
  );
}

/**
 * Register prompt handlers (empty for now).
 */
function registerPromptHandlers(server: McpServer, deps: NotionServerDependencies): void {
  server.server.setRequestHandler(ListPromptsRequestSchema, () => {
    deps.logger.debug('Listing prompts (none available yet)');
    return { prompts: [] };
  });
}

/**
 * Creates the MCP server for Notion integration.
 *
 * @param deps - Server dependencies including Notion client and logger
 * @returns Configured McpServer instance
 */
export function createMcpServer(deps: NotionServerDependencies): McpServer {
  deps.logger.info('Creating MCP server', { config: deps.config });

  const server = new McpServer(
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

  registerResourceHandlers(server, resourceHandlers);
  registerToolHandlers(server, toolHandlers, deps);
  registerPromptHandlers(server, deps);

  deps.logger.info('MCP server created with handlers');

  return server;
}
