/**
 * Oak Curriculum MCP Server
 *
 * This is the main entry point for the Oak Curriculum MCP server.
 * It provides AI assistants with access to Oak National Academy's curriculum content.
 */

import { createServer } from './psychon/server';
import { createStartupLogger, defaultStartupLoggerDeps } from './psychon/startup';

export { createServer } from './psychon/server';
export type { ServerConfig } from './psychon/wiring';

// Re-export types for external use
export type { CurriculumOrgan } from './organa/curriculum';
export type { McpOrgan } from './organa/mcp';

// Main entry point when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const startupLog = createStartupLogger(defaultStartupLoggerDeps);
  startupLog('[STARTUP] Oak Curriculum MCP server starting...');

  // Parse log level from environment
  const logLevel = process.env.LOG_LEVEL;
  const validLogLevels = ['debug', 'info', 'warn', 'error'] as const;
  const parsedLogLevel = validLogLevels.includes(logLevel as (typeof validLogLevels)[number])
    ? (logLevel as (typeof validLogLevels)[number])
    : 'info';

  startupLog(`[STARTUP] Log level: ${parsedLogLevel}`);
  startupLog(`[STARTUP] API key configured: ${process.env.OAK_API_KEY ? 'Yes' : 'No'}`);

  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: parsedLogLevel,
  }).catch((error: unknown) => {
    startupLog(`[STARTUP ERROR] Failed to start server: ${String(error)}`, true);
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
