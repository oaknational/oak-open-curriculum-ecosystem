import type { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ProcessEnv } from './types/environment.js';

export interface ServerSetupDependencies {
  env: ProcessEnv;
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
  const { validateEnvironmentVariables, parseNotionConfig } = await import(
    './config/environment.js'
  );
  const { createConsoleLogger } = await import('./logging/logger.js');
  const { Client } = await import('@notionhq/client');
  const { createMcpServer } = await import('./server.js');

  // Validate environment
  deps.log('[STARTUP] Validating environment variables...');
  const validation = validateEnvironmentVariables(deps.env);
  if (!validation.valid) {
    deps.log('[STARTUP ERROR] Environment validation failed:', true);
    const errors = validation.errors || ['Unknown validation error'];
    deps.log('Configuration errors: ' + errors.join(', '), true);
    throw new Error('Environment validation failed: ' + errors.join(', '));
  }

  // Create logger
  deps.log('[STARTUP] Creating logger...');
  const envLogLevel = deps.env['LOG_LEVEL'];
  const logLevel =
    envLogLevel === 'debug' ||
    envLogLevel === 'info' ||
    envLogLevel === 'warn' ||
    envLogLevel === 'error'
      ? envLogLevel
      : 'info';
  const logger = createConsoleLogger(logLevel);

  // Check API key
  deps.log('[STARTUP] Checking API key...');
  const apiKey = deps.env['NOTION_API_KEY'];
  if (!apiKey) {
    deps.log('[STARTUP ERROR] NOTION_API_KEY environment variable is not set', true);
    throw new Error('NOTION_API_KEY is required but not found');
  }

  // Create Notion client
  deps.log('[STARTUP] Creating Notion client...');
  const notionConfig = parseNotionConfig(apiKey);
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
