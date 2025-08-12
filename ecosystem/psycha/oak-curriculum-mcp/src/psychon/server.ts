/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolRequest, Tool } from '@modelcontextprotocol/sdk/types.js';
import { wireDependencies } from './wiring';
import type { ServerConfig } from './wiring';
import type { McpOrgan } from '../organa/mcp';
import type { Logger } from '@oaknational/mcp-moria';

/**
 * Check if an object has a property
 */
function hasProperty<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Find a tool by name from the available tools
 * Tools are guaranteed to have a name property by the MCP SDK types
 */
function findTool(name: string, tools: readonly Tool[]): Tool {
  // Tools from MCP SDK are guaranteed to have name property
  // The Tool type from @modelcontextprotocol/sdk includes name: string
  for (const tool of tools) {
    if (hasProperty(tool, 'name')) {
      const toolName = tool.name;
      if (typeof toolName === 'string' && toolName === name) {
        return tool;
      }
    }
  }
  throw new Error(`Unknown tool: ${name}`);
}

/**
 * Type guard for object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Validate arguments are an object
 */
function validateArgsObject(args: unknown): Record<string, unknown> {
  if (!isObject(args)) {
    throw new Error('Arguments must be an object');
  }
  return args;
}

/**
 * Extract optional string field
 */
function getOptionalStringField(obj: Record<string, unknown>, field: string): string | undefined {
  if (hasProperty(obj, field) && typeof obj[field] === 'string') {
    return obj[field];
  }
  return undefined;
}

/**
 * Parse and validate search lesson arguments
 */
function parseSearchLessonArgs(args: unknown): {
  query: string;
  keyStage?: string;
  subject?: string;
} {
  const searchArgs = validateArgsObject(args ?? {});

  if (!hasProperty(searchArgs, 'query') || typeof searchArgs.query !== 'string') {
    throw new Error('Missing or invalid required parameter: query');
  }

  return {
    query: searchArgs.query,
    keyStage: getOptionalStringField(searchArgs, 'keyStage'),
    subject: getOptionalStringField(searchArgs, 'subject'),
  };
}

/**
 * Parse and validate get lesson arguments
 */
function parseGetLessonArgs(args: unknown): { lessonSlug: string } {
  const lessonArgs = validateArgsObject(args ?? {});

  if (!hasProperty(lessonArgs, 'lessonSlug') || typeof lessonArgs.lessonSlug !== 'string') {
    throw new Error('Missing or invalid required parameter: lessonSlug');
  }

  return { lessonSlug: lessonArgs.lessonSlug };
}

/**
 * Execute a tool based on its name
 */
async function executeTool(toolName: string, args: unknown, mcpOrgan: McpOrgan): Promise<unknown> {
  switch (toolName) {
    case 'oak-search-lessons': {
      const params = parseSearchLessonArgs(args);
      return await mcpOrgan.handleTool('oak-search-lessons', params);
    }
    case 'oak-get-lesson': {
      const params = parseGetLessonArgs(args);
      return await mcpOrgan.handleTool('oak-get-lesson', params);
    }
    case 'oak-list-key-stages':
      return await mcpOrgan.handleTool('oak-list-key-stages', {});
    case 'oak-list-subjects':
      return await mcpOrgan.handleTool('oak-list-subjects', {});
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

/**
 * Format tool execution result as MCP response
 */
function formatToolResponse(result: unknown, isError = false) {
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

/**
 * Register MCP request handlers
 */
function registerHandlers(server: Server, mcpOrgan: McpOrgan, logger: Logger): void {
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

      // Format and return success response
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
  await server.connect(transport);

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
  const parsedLogLevel = validLogLevels.includes(logLevel as (typeof validLogLevels)[number])
    ? (logLevel as (typeof validLogLevels)[number])
    : 'info';

  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: parsedLogLevel,
  }).catch((error: unknown) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
