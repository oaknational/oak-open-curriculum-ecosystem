import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Logger } from '@oaknational/mcp-core';
import type { Client } from '@notionhq/client';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import runtimeConfig from '../config/runtime.json' with { type: 'json' };
import { parseLogLevel, createAdaptiveLogger } from '@oaknational/mcp-histos-logger';
import { createRuntime, type CoreLogger } from '@oaknational/mcp-core';
import { createInMemoryStorage, createNodeClock } from '@oaknational/mcp-providers-node';

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
function createLoggerFromConfig() {
  return createAdaptiveLogger({
    level: parseLogLevel(
      typeof runtimeConfig.logLevel === 'string' ? runtimeConfig.logLevel : undefined,
    ),
    name: runtimeConfig.serverName,
    consolaOptions: {
      stdout: process.stderr,
      stderr: process.stderr,
    },
  });
}

function createCoreRuntime(logger: Logger) {
  const coreLogger: CoreLogger = {
    debug: (message, context) => {
      logger.debug(message, context);
    },
    info: (message, context) => {
      logger.info(message, context);
    },
    warn: (message, context) => {
      logger.warn(message, context);
    },
    error: (message, context) => {
      logger.error(message, undefined, context);
    },
  };
  return createRuntime({
    logger: coreLogger,
    clock: createNodeClock(),
    storage: createInMemoryStorage(),
  });
}

function validateRuntimeConfig(): void {
  if (!runtimeConfig.serverName || typeof runtimeConfig.serverName !== 'string') {
    throw new Error('runtime.serverName must be a non-empty string');
  }
  if (!runtimeConfig.serverVersion || typeof runtimeConfig.serverVersion !== 'string') {
    throw new Error('runtime.serverVersion must be a non-empty string');
  }
}

async function createServerDependencies(log: ServerSetupDependencies['log']): Promise<{
  logger: Logger;
  notionClient: Client;
  server: Server;
  runtime: ReturnType<typeof createRuntime>;
}> {
  log('[STARTUP] Importing dependencies...');

  const { getNotionConfig } = await import('../config/notion-config/notion-config');
  const { env: notionEnv } = await import('../config/notion-config/environment');
  const { Client } = await import('@notionhq/client');
  const { createMcpServer } = await import('./server');
  const { createNotionOperations } = await import('../integrations/notion');

  // Minimal runtime config validation (mechanical, no external deps)
  validateRuntimeConfig();

  log('[STARTUP] Creating logger...');
  const logger = createLoggerFromConfig();

  // Bridge histos (Moria) logger to core logger for runtime composition
  const runtime = createCoreRuntime(logger);

  log('[STARTUP] Creating Notion client...');
  const notionConfig = getNotionConfig(notionEnv);
  const notionClient = new Client({ auth: notionConfig.apiKey });

  const serverConfig = { name: runtimeConfig.serverName, version: runtimeConfig.serverVersion };

  log('[STARTUP] Creating Notion operations...');
  const notionOperations = createNotionOperations();

  log('[STARTUP] Creating MCP server...');
  const server = createMcpServer({ notionClient, logger, notionOperations, config: serverConfig });

  return { logger, notionClient, server, runtime };
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
