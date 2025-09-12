/**
 * Oak Curriculum MCP Server
 *
 * This is the main entry point for the Oak Curriculum MCP server.
 * It provides AI assistants with access to Oak National Academy's curriculum content.
 */

import { createServer } from './app/server.js';
import { createStartupLogger, defaultStartupLoggerDeps } from './app/startup.js';

export { createServer } from './app/server.js';
export type { ServerConfig } from './app/wiring.js';

// Re-export types for external use
// Compatibility type re-export removed per unified plan. Use createMcpToolsModule and associated types instead.

// Main entry point when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.debug('Creating startup logger from curriculum mcp index.ts...');
  const startupLog = createStartupLogger(defaultStartupLoggerDeps);
  startupLog('[STARTUP] Oak Curriculum MCP server starting...');

  // Parse log level from environment
  const logLevel = process.env.LOG_LEVEL;
  const validLogLevels = ['debug', 'info', 'warn', 'error'] as const;
  type ValidLogLevel = (typeof validLogLevels)[number];

  function isValidLogLevel(value: unknown): value is ValidLogLevel {
    if (typeof value !== 'string') return false;
    const stringValidLogLevels: readonly string[] = validLogLevels;
    return stringValidLogLevels.includes(value);
  }

  const parsedLogLevel = isValidLogLevel(logLevel) ? logLevel : 'info';

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
