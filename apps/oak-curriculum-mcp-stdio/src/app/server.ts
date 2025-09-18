/**
 * MCP Server implementation for Oak Curriculum API
 * The living whole that integrates all organs
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { wireDependencies } from './wiring.js';
import type { ServerConfig, Logger } from './wiring.js';
import {
  MCP_TOOLS,
  zodRawShapeFromToolInputJsonSchema,
  createOakPathBasedClient,
  executeToolCall,
  isToolName,
  typeSafeEntries,
  validateResponse,
  type HttpMethod,
} from '@oaknational/oak-curriculum-sdk';

function toHttpMethod(methodUpper: string): HttpMethod {
  if (methodUpper === 'GET') {
    return 'get';
  }
  if (methodUpper === 'POST') {
    return 'post';
  }
  if (methodUpper === 'PUT') {
    return 'put';
  }
  if (methodUpper === 'DELETE') {
    return 'delete';
  }
  if (methodUpper === 'PATCH') {
    return 'patch';
  }
  throw new Error('Unsupported method: ' + methodUpper);
}

function validateOutput(
  path: string,
  methodUpper: string,
  data: unknown,
): { ok: true } | { ok: false; message: string } {
  const httpMethod = toHttpMethod(methodUpper);
  const validation = validateResponse(path, httpMethod, 200, data);
  return validation.ok
    ? { ok: true }
    : { ok: false, message: validation.issues[0]?.message ?? 'Output validation failed' };
}

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
  const { logger, config: serverConfig } = wireDependencies(config);

  logToolDiscovery(logger);

  // Create McpServer and register tools with Zod validation and SDK execution
  const server = new McpServer({
    name: serverConfig.serverName,
    version: serverConfig.serverVersion,
  });
  const client = createOakPathBasedClient(serverConfig.apiKey);
  registerMcpTools(server, client);

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
    const toolNames = Object.keys(MCP_TOOLS).sort();
    logger.info('MCP tool module initialised', {
      tools: toolNames.length,
      sample: toolNames.slice(0, 3),
    });
  } catch (err: unknown) {
    logger.error('Failed to inspect tools', { error: err });
  }
}

function registerMcpTools(
  server: McpServer,
  client: ReturnType<typeof createOakPathBasedClient>,
): void {
  for (const [name, def] of typeSafeEntries(MCP_TOOLS)) {
    const input = zodRawShapeFromToolInputJsonSchema(def.inputSchema);
    const description = def.method.toUpperCase() + ' ' + def.path;
    server.registerTool(
      name,
      { title: name, description, inputSchema: input },
      async (params: unknown) => {
        if (!isToolName(name)) {
          throw new Error('Unknown tool');
        }
        const execResult = await executeToolCall(name, params, client);
        if (execResult.error) {
          const e = execResult.error;
          const message = e instanceof Error ? e.message : 'Unknown error';
          const errorPayload = { error: { message } };
          return {
            content: [{ type: 'text', text: JSON.stringify(errorPayload) }],
            isError: true,
          };
        }
        const out = validateOutput(def.path, def.method, execResult.data);
        if (!out.ok) {
          const errorPayload = { error: { message: out.message } };
          return {
            content: [{ type: 'text', text: JSON.stringify(errorPayload) }],
            isError: true,
          };
        }
        return { content: [{ type: 'text', text: JSON.stringify(execResult.data) }] };
      },
    );
  }
}
