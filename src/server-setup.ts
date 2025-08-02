import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Environment } from './config/env.js';

export interface ServerSetupDependencies {
  transport: StdioServerTransport;
  log: (message: string, isError?: boolean) => void;
}

/**
 * Sets up and starts the MCP server with all dependencies
 * This is an integration point that orchestrates the server startup
 */
export async function setupAndStartServer(deps: ServerSetupDependencies): Promise<void> {
  // Import dependencies
  deps.log('[STARTUP] Importing dependencies...');

  // Import environment (validates on module load)
  deps.log('[STARTUP] Loading environment configuration...');
  let environment: Environment;
  try {
    const { env } = await import('./config/env.js');
    environment = env;
  } catch (error) {
    deps.log('[STARTUP ERROR] Environment validation failed:', true);
    if (error instanceof Error) {
      deps.log(error.message, true);
    }
    throw error;
  }

  const { getNotionConfig } = await import('./config/environment.js');
  const { createConsoleLogger } = await import('./logging/logger.js');
  const { getLogLevelValue } = await import('./logging/logger-interface.js');
  const { Client } = await import('@notionhq/client');
  const { createMcpServer } = await import('./server.js');

  // Create logger
  deps.log('[STARTUP] Creating logger...');
  const logLevel = getLogLevelValue(environment.LOG_LEVEL);
  const logger = createConsoleLogger(logLevel);

  // Create Notion client
  deps.log('[STARTUP] Creating Notion client...');
  const notionConfig = getNotionConfig();
  const notionClient = new Client({ auth: notionConfig.apiKey });

  // Server configuration
  const serverConfig = {
    name: 'oak-notion-mcp',
    version: '0.0.0-development',
  };

  // Create and connect server
  deps.log('[STARTUP] Creating MCP server...');
  const server = createMcpServer({ notionClient, logger, config: serverConfig });

  deps.log('[STARTUP] Connecting to stdio transport...');
  await server.connect(deps.transport);

  logger.info('MCP server started successfully');
}
