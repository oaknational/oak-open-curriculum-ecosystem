import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { MinimalNotionClient } from '../types/notion-types/notion-client.js';
import runtimeConfig from '../config/runtime.json' with { type: 'json' };
import {
  UnifiedLogger,
  buildResourceAttributes,
  parseLogLevel,
  logLevelToSeverityNumber,
  type Logger,
} from '@oaknational/mcp-logger';
import { createNodeStdoutSink } from '@oaknational/mcp-logger/node';

interface CoreLogger {
  debug: (message: string, context?: unknown) => void;
  info: (message: string, context?: unknown) => void;
  warn: (message: string, context?: unknown) => void;
  error: (message: string, context?: unknown) => void;
}

function createRuntime(providers: {
  logger: CoreLogger;
  clock: { now: () => number };
  storage: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
  };
}) {
  return {
    logger: providers.logger,
    clock: providers.clock,
    storage: providers.storage,
  };
}
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
  const levelInput =
    typeof runtimeConfig.logLevel === 'string' ? runtimeConfig.logLevel : undefined;
  const level = parseLogLevel(levelInput, 'INFO');
  const minSeverity = logLevelToSeverityNumber(level);

  const resourceAttributes = buildResourceAttributes(
    process.env,
    runtimeConfig.serverName,
    process.env.npm_package_version ?? '0.0.0',
  );

  return new UnifiedLogger({
    minSeverity,
    resourceAttributes,
    context: {},
    stdoutSink: createNodeStdoutSink(),
    fileSink: null,
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

/**
 * Creates Notion client - either real or mock depending on environment
 */
async function createNotionClient(
  notionConfig: { apiKey: string },
  log: ServerSetupDependencies['log'],
): Promise<MinimalNotionClient> {
  if (process.env.NOTION_USE_MOCK_CLIENT === 'true') {
    log('[STARTUP] Using MOCK Notion client for E2E testing (no real API calls)');
    const { createMockNotionClientForE2E } = await import('../test/mocks/mock-notion-client.js');
    return createMockNotionClientForE2E();
  }

  log('[STARTUP] Using REAL Notion client');
  const { Client } = await import('@notionhq/client');
  return new Client({ auth: notionConfig.apiKey });
}

async function createServerDependencies(log: ServerSetupDependencies['log']): Promise<{
  logger: Logger;
  notionClient: MinimalNotionClient;
  server: McpServer;
  runtime: ReturnType<typeof createRuntime>;
}> {
  log('[STARTUP] Importing dependencies...');

  const { getNotionConfig } = await import('../config/notion-config/notion-config');
  const { env: notionEnv } = await import('../config/notion-config/environment');
  const { createMcpServer } = await import('./server');
  const { createNotionOperations } = await import('../integrations/notion');

  validateRuntimeConfig();

  log('[STARTUP] Creating logger...');
  const logger = createLoggerFromConfig();
  const runtime = createCoreRuntime(logger);

  log('[STARTUP] Creating Notion client...');
  const notionConfig = getNotionConfig(notionEnv);
  const notionClient = await createNotionClient(notionConfig, log);

  const serverConfig = { name: runtimeConfig.serverName, version: runtimeConfig.serverVersion };

  log('[STARTUP] Creating Notion operations...');
  const notionOperations = createNotionOperations();

  log('[STARTUP] Creating MCP server...');
  const server = createMcpServer({
    notionClient,
    logger,
    notionOperations,
    config: serverConfig,
    runtime,
  });

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
