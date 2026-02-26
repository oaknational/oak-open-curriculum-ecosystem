/**
 * Oak Curriculum MCP Server
 *
 * This is the main entry point for the Oak Curriculum MCP server.
 * It provides AI assistants with access to Oak National Academy's curriculum content.
 */

import { createServer } from './app/server.js';
import { loadRuntimeConfig } from './runtime-config.js';

export { createServer } from './app/server.js';
export type { ServerConfig } from './app/wiring.js';
export type { RuntimeConfig, LoadRuntimeConfigOptions, ConfigError } from './runtime-config.js';
export { loadRuntimeConfig } from './runtime-config.js';

if (import.meta.url === `file://${process.argv[1]}`) {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: import.meta.dirname,
  });

  if (!configResult.ok) {
    console.error('Environment validation failed:', configResult.error.message);
    process.exit(1);
  }

  const runtimeConfig = configResult.value;

  createServer(runtimeConfig, {
    apiKey: runtimeConfig.env.OAK_API_KEY,
  }).catch((error: unknown) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
