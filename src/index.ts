import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Application entry point - orchestrates server startup (has side effects)
export async function main(): Promise<void> {
  // Load environment variables when running as CLI
  const dotenv = await import('dotenv');
  dotenv.config();

  // Import dependencies
  const { validateEnvironmentVariables, parseNotionConfig } = await import(
    './config/environment.js'
  );
  const { createConsoleLogger } = await import('./logging/logger.js');
  const { createNotionClient } = await import('./notion/client.js');
  const { createMcpServer } = await import('./server.js');

  // Validate environment
  const validation = validateEnvironmentVariables(process.env);
  if (!validation.valid) {
    console.error('Configuration errors:', validation.errors);
    process.exit(1);
  }

  // Create dependencies
  const envLogLevel = process.env['LOG_LEVEL'];
  const logLevel =
    envLogLevel === 'debug' ||
    envLogLevel === 'info' ||
    envLogLevel === 'warn' ||
    envLogLevel === 'error'
      ? envLogLevel
      : 'info';
  const logger = createConsoleLogger(logLevel);

  const apiKey = process.env['NOTION_API_KEY'];
  if (!apiKey) {
    throw new Error('NOTION_API_KEY is required but not found');
  }
  const notionConfig = parseNotionConfig(apiKey);
  const notionClient = createNotionClient(notionConfig.apiKey);

  const serverConfig = {
    name: 'oak-notion-mcp',
    version: '0.0.0-development',
  };

  // Create and start server
  const server = createMcpServer({ notionClient, logger, config: serverConfig });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logger.info('MCP server started successfully');
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}
