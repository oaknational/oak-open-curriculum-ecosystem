#!/usr/bin/env tsx
import { join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { createStartupLogger, createDefaultStartupLoggerDeps } from '../src/app/startup.js';
import { requireRepoRoot } from '../src/app/require-repo-root.js';
import { toolNames } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

const rootDir = requireRepoRoot();

console.debug('Creating startup logger from bin/oak-curriculum-mcp.ts...');
const log = createStartupLogger({
  ...createDefaultStartupLoggerDeps(),
  rootDir,
  console: {
    log: (msg: string) => process.stderr.write(msg + '\n'),
    error: (msg: string) => process.stderr.write(msg + '\n'),
  },
});

log('[START-MCP] Starting oak-curriculum-mcp...');
log(`[START-MCP] Root directory: ${rootDir}`);

// Load environment variables from repo root (.env.local then .env)
dotenvConfig({ path: join(rootDir, '.env.local') });
dotenvConfig({ path: join(rootDir, '.env') });
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
