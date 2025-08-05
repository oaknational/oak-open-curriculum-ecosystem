import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Environment, Logger } from '@oaknational/mcp-core';
import type { Client } from '@notionhq/client';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';

export interface ServerSetupDependencies {
  transport: StdioServerTransport;
  log: (message: string, isError?: boolean) => void;
}

/**
 * Loads environment configuration with error handling
 */
async function loadEnvironment(log: ServerSetupDependencies['log']): Promise<Environment> {
  log('[STARTUP] Loading environment configuration...');
  try {
    const { env } = await import('@oaknational/mcp-core');
    return env;
  } catch (error) {
    log('[STARTUP ERROR] Environment validation failed:', true);
    if (error instanceof Error) {
      log(error.message, true);
    }
    throw error;
  }
}

/**
 * Creates all server dependencies
 */
async function createServerDependencies(
  environment: Environment,
  log: ServerSetupDependencies['log'],
): Promise<{
  logger: Logger;
  notionClient: Client;
  server: Server;
}> {
  log('[STARTUP] Importing dependencies...');

  const { createConsoleLogger } = await import('@oaknational/mcp-core');
  const { getLogLevelValue } = await import('@oaknational/mcp-core');
  const { getNotionConfig } = await import('../chora/phaneron/notion-config/notion-config.js');
  const { env: notionEnv } = await import('../chora/phaneron/notion-config/environment.js');
  const { Client } = await import('@notionhq/client');
  const { createMcpServer } = await import('./server.js');
  const { createNotionOperations } = await import('../organa/notion/index.js');

  log('[STARTUP] Creating logger...');
  const logLevel = getLogLevelValue(environment.LOG_LEVEL);
  const logger = createConsoleLogger(logLevel);

  log('[STARTUP] Creating Notion client...');
  const notionConfig = getNotionConfig(notionEnv);
  const notionClient = new Client({ auth: notionConfig.apiKey });

  const serverConfig = {
    name: 'oak-notion-mcp',
    version: '0.0.0-development',
  };

  log('[STARTUP] Creating Notion operations...');
  const notionOperations = createNotionOperations();

  log('[STARTUP] Creating MCP server...');
  const server = createMcpServer({ notionClient, logger, notionOperations, config: serverConfig });

  return { logger, notionClient, server };
}

/**
 * Sets up and starts the MCP server with all dependencies
 * This is an integration point that orchestrates the server startup
 */
export async function setupAndStartServer(deps: ServerSetupDependencies): Promise<void> {
  const environment = await loadEnvironment(deps.log);
  const { logger, server } = await createServerDependencies(environment, deps.log);

  deps.log('[STARTUP] Connecting to stdio transport...');
  await server.connect(deps.transport);

  logger.info('MCP server started successfully');
}
