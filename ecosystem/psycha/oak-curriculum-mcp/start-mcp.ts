#!/usr/bin/env tsx
import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStartupLogger, defaultStartupLoggerDeps } from './src/psychon/startup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../../..');

// Create logger with ROOT directory for logs
const log = createStartupLogger({
  ...defaultStartupLoggerDeps,
  rootDir: rootDir, // Override to use repo root
});

log('[START-MCP] Starting oak-curriculum-mcp...');
log(`[START-MCP] Root directory: ${rootDir}`);

// Load environment variables from root .env file
const envPath = resolve(rootDir, '.env');
log(`[START-MCP] Loading .env from: ${envPath}`);
const result = config({ path: envPath });

if (result.error) {
  log(`[START-MCP ERROR] Failed to load .env: ${result.error.message}`, true);
} else {
  log(`[START-MCP] Loaded .env successfully`);
  log(`[START-MCP] OAK_API_KEY present: ${(!!process.env.OAK_API_KEY).toString()}`);
  log(`[START-MCP] LOG_LEVEL: ${process.env.LOG_LEVEL ?? 'not set'}`);
}

// Now import and start the server
log('[START-MCP] Importing server module...');
try {
  const { createServer } = await import('./src/index.js');
  log('[START-MCP] Server module imported successfully');

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

  log(`[START-MCP] Starting server with log level: ${parsedLogLevel}`);

  await createServer({
    apiKey: process.env.OAK_API_KEY,
    logLevel: parsedLogLevel,
  });

  log('[START-MCP] Server started successfully');
} catch (error: unknown) {
  log(`[START-MCP ERROR] Failed to start server: ${String(error)}`, true);
  console.error('Server error details:', error);
  process.exit(1);
}
