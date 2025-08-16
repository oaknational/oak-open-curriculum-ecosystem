#!/usr/bin/env tsx
import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStartupLogger, defaultStartupLoggerDeps } from '../src/psychon/startup.js';
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
// Detect if running from source (bin/) or built (dist/bin/)
// Source: ecosystem/psycha/oak-curriculum-mcp/bin -> 4 levels up
// Built: ecosystem/psycha/oak-curriculum-mcp/dist/bin -> 5 levels up
const isBuilt = __dirname.includes('/dist/bin');
const rootDir = resolve(__dirname, isBuilt ? '../../../../..' : '../../../..');

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
const noop = (): void => {
  /* intentionally no-op to keep MCP stdout clean */
};
console.log = noop;
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
  const { createServer } = await import('../src/index.js');
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
    log(`[START-MCP ERROR] Stack trace: ${String(error.stack)}`, true);
    logCauseChain(error);
  }

  // Also output to stderr for immediate visibility
  console.error('Server error details:', error);
  process.exit(1);
}

// helper added by lint refactor
function logCauseChain(err: Error): void {
  let currentCause = err.cause;
  for (let i = 0; i < 3 && currentCause; i += 1) {
    if (currentCause instanceof Error) {
      console.error(`[START-MCP ERROR] Caused by: ${currentCause.message}`);
      currentCause = currentCause.cause;
    } else {
      console.error(`[START-MCP ERROR] Caused by: ${safeStringify(currentCause)}`);
      break;
    }
  }
}
