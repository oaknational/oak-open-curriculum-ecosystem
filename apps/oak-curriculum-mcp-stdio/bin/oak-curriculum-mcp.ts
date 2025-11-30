#!/usr/bin/env tsx
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Updated path after mechanical renaming: app wiring centralised under src/app
import { createStartupLogger, defaultStartupLoggerDeps } from '../src/app/startup.js';
import { toolNames } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';
import { loadRootEnv, findRepoRoot } from '@oaknational/mcp-env';
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

const thisDir = dirname(fileURLToPath(import.meta.url));
// Resolve repo root reliably
const rootDir = findRepoRoot(thisDir);

// Create logger with ROOT directory for logs
// Override console to only write to stderr to keep stdout clean for MCP protocol
console.debug('Creating startup logger from bin/oak-curriculum-mcp.ts...');
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

// Load environment variables from repo root (.env.local then .env) if needed
const loaded = loadRootEnv({
  requiredKeys: ['OAK_API_KEY'],
  startDir: rootDir,
  env: { ...process.env },
});
if (loaded.loaded && loaded.path) {
  log(`[START-MCP] Loaded env from: ${loaded.path}`);
}
const hasApiKey = typeof process.env.OAK_API_KEY === 'string' && process.env.OAK_API_KEY.length > 0;
const logLevelValue = typeof process.env.LOG_LEVEL === 'string' ? process.env.LOG_LEVEL : 'not set';
log(`[START-MCP] OAK_API_KEY present: ${hasApiKey ? 'true' : 'false'}`);
log(`[START-MCP] LOG_LEVEL: ${logLevelValue}`);

// Emit tool diagnostics early so issues are visible even if startup fails later
try {
  const toolCount = toolNames.length;
  log(`[START-MCP] Tool count: ${String(toolCount)}`);
  const preview = toolNames.slice(0, 3).join(', ');

  log(`[START-MCP] Tools: ${String(toolCount)} (${preview}${toolCount > 3 ? ', …' : ''})`);
} catch (err: unknown) {
  log(
    `[START-MCP ERROR] Failed to read tool list: ${err instanceof Error ? err.message : String(err)}`,
    true,
  );
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
    if (typeof value !== 'string') {
      return false;
    }
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
