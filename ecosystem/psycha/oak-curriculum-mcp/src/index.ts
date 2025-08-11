/**
 * Oak Curriculum MCP Server
 *
 * This is the main entry point for the Oak Curriculum MCP server.
 * It provides AI assistants with access to Oak National Academy's curriculum content.
 */

import { createServer } from './psychon/server';

export { createServer } from './psychon/server';
export type { ServerConfig } from './psychon/wiring';

// Re-export types for external use
export type { CurriculumOrgan } from './organa/curriculum';
export type { McpOrgan } from './organa/mcp';

// Main entry point when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: (process.env.LOG_LEVEL as any) ?? 'info',
  }).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
