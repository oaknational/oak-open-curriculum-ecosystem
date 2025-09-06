import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Logger } from '@oaknational/mcp-moria';
import type { Client } from '@notionhq/client';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import runtimeConfig from '../config/runtime.json' with { type: 'json' };
import { parseLogLevel } from '@oaknational/mcp-histos-logger';

export interface ServerSetupDependencies {
  transport: StdioServerTransport;
  log: (message: string, isError?: boolean) => void;
}

/**
 * Loads environment configuration with error handling
 */
async function loadEnvironment(log: ServerSetupDependencies['log']) {
  log('[STARTUP] Loading environment configuration...');
  try {
    const { env } = await import('../config/notion-config/environment');
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
async function createServerDependencies(log: ServerSetupDependencies['log']): Promise<{
  logger: Logger;
  notionClient: Client;
  server: Server;
}> {
  log('[STARTUP] Importing dependencies...');

  const { createAdaptiveLogger } = await import('@oaknational/mcp-histos-logger');
  const { getNotionConfig } = await import('../config/notion-config/notion-config');
  const { env: notionEnv } = await import('../config/notion-config/environment');
  const { Client } = await import('@notionhq/client');
  const { createMcpServer } = await import('./server');
  const { createNotionOperations } = await import('../integrations/notion');

  log('[STARTUP] Creating logger...');
  const logger = createAdaptiveLogger({
    level: parseLogLevel(
      typeof runtimeConfig.logLevel === 'string' ? runtimeConfig.logLevel : undefined,
    ),
    name: runtimeConfig.serverName,
    consolaOptions: {
      // MCP servers must use stderr for ALL logs to keep stdout clean for JSON-RPC
      stdout: process.stderr,
      stderr: process.stderr,
    },
  });

  log('[STARTUP] Creating Notion client...');
  const notionConfig = getNotionConfig(notionEnv);
  const notionClient = new Client({ auth: notionConfig.apiKey });

  const serverConfig = { name: runtimeConfig.serverName, version: runtimeConfig.serverVersion };

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
  await loadEnvironment(deps.log);
  const { logger, server } = await createServerDependencies(deps.log);

  deps.log('[STARTUP] Connecting to stdio transport...');
  await server.connect(deps.transport);

  logger.info('MCP server started successfully');
}
