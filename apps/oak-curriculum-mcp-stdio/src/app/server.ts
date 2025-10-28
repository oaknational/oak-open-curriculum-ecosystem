/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  toolNames,
  getToolFromToolName,
  type ToolDescriptorForName,
  zodRawShapeFromToolInputJsonSchema,
  executeToolCall,
  createOakPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';
import { wireDependencies } from './wiring.js';
import type { ServerConfig, Logger } from './wiring.js';
import { createToolResponseHandlers } from './tool-response-handlers.js';
import type { UniversalToolExecutors } from '../tools/index.js';
import { validateOutput } from './validation.js';

/**
 * Setup shutdown handler
 */
function setupShutdownHandler(server: { close: () => Promise<void> }, logger: Logger): void {
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
  const { logger, config: serverConfig, toolExecutors } = wireDependencies(config);

  logToolDiscovery(logger);

  // Create McpServer and register tools with Zod validation and SDK execution
  const server = new McpServer({
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });
  const client = createOakPathBasedClient(serverConfig.apiKey);
  registerMcpTools(server, client, logger, toolExecutors);

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
    if (typeof value !== 'string') {
      return false;
    }
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

function logToolDiscovery(logger: Logger): void {
  try {
    const sortedToolNames = [...toolNames].toSorted((a, b) => a.localeCompare(b));
    logger.info('MCP tool module initialised', {
      tools: sortedToolNames.length,
      sample: sortedToolNames.slice(0, 3),
    });
  } catch (err: unknown) {
    logger.error('Failed to inspect tools', { error: err });
  }
}

function ensureDescriptorDescription(
  descriptor: { readonly description?: string },
  toolName: string,
): string {
  if (typeof descriptor.description !== 'string' || descriptor.description.trim().length === 0) {
    throw new Error(`Tool descriptor missing description for ${toolName}`);
  }
  return descriptor.description;
}

function registerMcpTools(
  server: McpServer,
  client: ReturnType<typeof createOakPathBasedClient>,
  logger: Logger,
  toolExecutors?: UniversalToolExecutors,
): void {
  for (const name of toolNames) {
    const descriptor: ToolDescriptorForName<typeof name> = getToolFromToolName(name);
    const input = zodRawShapeFromToolInputJsonSchema(descriptor.inputSchema);
    const description = ensureDescriptorDescription(descriptor, name);
    const handlers = createToolResponseHandlers(logger, {
      name,
      description,
      inputSchemaRaw: descriptor.inputSchema,
      inputSchemaZod: input,
      outputSchemaRaw: descriptor.toolOutputJsonSchema,
      outputSchemaZod: descriptor.zodOutputSchema,
    });
    server.registerTool(
      name,
      { title: name, description, inputSchema: input },
      async (params: unknown) => {
        const execResult = toolExecutors?.executeMcpTool
          ? await toolExecutors.executeMcpTool(name, params ?? {})
          : await executeToolCall(name, params, client);
        if (execResult.error) {
          return handlers.handleExecutionError(params, execResult.error);
        }
        const validation = validateOutput(descriptor, execResult);
        if (!validation.ok) {
          return handlers.handleValidationError(params, execResult, validation.message);
        }
        return handlers.handleSuccess(execResult);
      },
    );
  }
}

export { logToolDiscovery, registerMcpTools };
