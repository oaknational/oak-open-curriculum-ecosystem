#!/usr/bin/env tsx
import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStartupLogger, defaultStartupLoggerDeps } from './src/psychon/startup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../../..');

// Create logger with ROOT directory for logs
// Override console to only write to stderr to keep stdout clean for MCP protocol
const log = createStartupLogger({
  ...defaultStartupLoggerDeps,
  rootDir: rootDir, // Override to use repo root
  console: {
    log: (msg: string) => process.stderr.write(msg + '\n'),
    error: (msg: string) => process.stderr.write(msg + '\n'),
  },
});

log('[START-MCP] Starting oak-curriculum-mcp...');
log(`[START-MCP] Root directory: ${rootDir}`);

// Load environment variables from root .env file
const envPath = resolve(rootDir, '.env');
log(`[START-MCP] Loading .env from: ${envPath}`);

// Suppress dotenv's debug output to keep stdout clean for MCP protocol
const originalConsoleLog = console.log;
console.log = () => {};
const result = config({ path: envPath });
console.log = originalConsoleLog;

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

  // Log full error details including stack trace to startup log
  if (error instanceof Error) {
    log(`[START-MCP ERROR] Stack trace: ${error.stack}`, true);

    // Extract cause chain if present
    let currentCause = (error as unknown).cause;
    while (currentCause) {
      if (currentCause instanceof Error) {
        log(`[START-MCP ERROR] Caused by: ${currentCause.message}`, true);
        currentCause = (currentCause as unknown).cause;
      } else {
        log(`[START-MCP ERROR] Caused by: ${String(currentCause)}`, true);
        break;
      }
    }
  }

  // Also output to stderr for immediate visibility
  console.error('Server error details:', error);
  process.exit(1);
}
