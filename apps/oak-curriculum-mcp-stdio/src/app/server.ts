/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, Tool } from '@modelcontextprotocol/sdk/types.js';
import { wireDependencies } from './wiring.js';
import type { ServerConfig } from './wiring.js';
import type { McpToolsModule } from '../tools/index.js';
import type { Logger } from '@oaknational/mcp-core';

/**
 * Find a tool by name from the available tools
 * Tools are guaranteed to have a name property by the MCP SDK types
 */
function findTool(name: string, tools: readonly Tool[]): Tool {
  for (const tool of tools) {
    if (tool.name === name) return tool;
  }
  throw new Error(`Unknown tool: ${name}`);
}

function isErrorResultShape(value: unknown): value is { isError?: unknown; content?: unknown } {
  if (typeof value !== 'object' || value === null) return false;
  return 'isError' in value && 'content' in value;
}

/**
 * Validate arguments are an object
 */
function validateArgsObject(args: unknown): unknown {
  if (typeof args !== 'object' || args === null || Array.isArray(args)) {
    throw new Error('Arguments must be an object');
  }
  return args;
}

/**
 * Execute a tool based on its name
 */
async function executeTool(
  toolName: string,
  args: unknown,
  mcpOrgan: McpToolsModule,
): Promise<unknown> {
  // For now, delegate all tools to the generic handler
  // The handler will be responsible for routing to the correct implementation
  const validatedArgs = validateArgsObject(args ?? {});
  return await mcpOrgan.handleTool(toolName, validatedArgs);
}

/**
 * Format tool execution result as MCP response
 */
function formatToolResponse(result: unknown, isError = false) {
  function textContent(text: string): { type: 'text'; text: string } {
    return { type: 'text', text };
  }
  if (!isError) {
    return {
      content: [textContent(JSON.stringify(result, null, 2))],
    };
  }

  const message = result instanceof Error ? result.message : 'Unknown error';
  // Split multi-line messages to surface a concise first line for Inspector, with details following
  const lines = message.split('\n');
  const [first, ...rest] = lines;
  const content = [textContent(`Error: ${first}`), ...rest.map((t) => textContent(t))];
  return { content, isError: true };
}

/**
 * Register MCP request handlers
 */
function registerHandlers(server: Server, mcpOrgan: McpToolsModule, logger: Logger): void {
  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, () => {
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
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    logger.info('Executing tool', { tool: name, args });

    try {
      // Validate the tool exists
      findTool(name, mcpOrgan.tools);

      // Execute the tool
      const result = await executeTool(name, args, mcpOrgan);

      // If handler returned a CallToolResult-like error, pass through
      if (isErrorResultShape(result) && result.isError === true && result.content !== undefined) {
        return { isError: true, content: result.content };
      }

      // Otherwise, format as success response
      return formatToolResponse(result);
    } catch (error) {
      logger.error('Tool execution failed', { tool: name, error });
      // Format and return error response
      return formatToolResponse(error, true);
    }
  });
}

/**
 * Setup shutdown handler
 */
function setupShutdownHandler(server: Server, logger: Logger): void {
  process.on('SIGINT', () => {
    logger.info('Shutting down server');
    void server.close().then(() => {
      process.exit(0);
    });
  });
}

/**
 * Creates and starts the Oak Curriculum MCP server
 */
export async function createServer(config?: ServerConfig): Promise<void> {
  // Wire dependencies
  const { logger, mcpOrgan, config: serverConfig } = wireDependencies(config);

  // Log tools discovered at startup for diagnostics
  try {
    logger.info('MCP tool module initialised', {
      tools: mcpOrgan.tools.length,
      sample: mcpOrgan.tools.slice(0, 3).map((t) => t.name),
    });
  } catch (err: unknown) {
    logger.error('Failed to inspect tools', { error: err });
  }

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

  // Register handlers
  registerHandlers(server, mcpOrgan, logger);

  // Create transport and connect
  const transport = new StdioServerTransport();
  logger.debug('Connecting STDIO transport...');
  await server.connect(transport);
  logger.debug('STDIO transport connected');

  logger.info('Oak Curriculum MCP server started', {
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });

  // Setup shutdown handler
  setupShutdownHandler(server, logger);
}

/**
 * Start server if run directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  // Parse log level from environment
  const logLevel = process.env.LOG_LEVEL;
  const validLogLevels = ['debug', 'info', 'warn', 'error'] as const;
  type ValidLogLevel = (typeof validLogLevels)[number];

  function isValidLogLevel(value: unknown): value is ValidLogLevel {
    if (typeof value !== 'string') return false;
    const stringValidLogLevels: readonly string[] = validLogLevels;
    return stringValidLogLevels.includes(value);
  }

  const parsedLogLevel = isValidLogLevel(logLevel) ? logLevel : 'info';

  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: parsedLogLevel,
  }).catch((error: unknown) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
