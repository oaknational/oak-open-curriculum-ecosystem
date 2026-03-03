#!/usr/bin/env tsx

/**
 * Entry point for the Oak Curriculum STDIO MCP server.
 *
 * This is a composition root: `process.env` is read here and nowhere
 * else. The validated `RuntimeConfig` is threaded through all downstream
 * modules via function parameters (ADR-078).
 */

import { createStartupLogger, createDefaultStartupLoggerDeps } from '../src/app/startup.js';
import { toolNames } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { createStdioLogger } from '../src/logging/index.js';

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

function writeStderrLine(message: string): void {
  process.stderr.write(`${message}\n`);
}

const configResult = loadRuntimeConfig({
  processEnv: process.env,
  startDir: import.meta.dirname,
});

if (!configResult.ok) {
  writeStderrLine(`[START-MCP ERROR] Environment validation failed: ${configResult.error.message}`);
  for (const d of configResult.error.diagnostics) {
    const detail = `[START-MCP]   ${d.key}: ${d.present ? 'present' : 'MISSING'}`;
    if (d.present) {
      writeStderrLine(detail);
    } else {
      writeStderrLine(`[START-MCP ERROR] ${detail}`);
    }
  }
  process.exit(1);
}

const runtimeConfig = configResult.value;
const startupDeps = createDefaultStartupLoggerDeps(createStdioLogger(runtimeConfig));
const log = createStartupLogger(startupDeps);

log('[START-MCP] Starting oak-curriculum-mcp...');
log(`[START-MCP] Root directory: ${startupDeps.rootDir}`);

log(
  `[START-MCP] OAK_API_KEY present: ${runtimeConfig.env.OAK_API_KEY.length > 0 ? 'true' : 'false'}`,
);
log(`[START-MCP] LOG_LEVEL: ${runtimeConfig.logLevel}`);

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

  log(`[START-MCP] Starting server with log level: ${runtimeConfig.logLevel}`);

  await createServer(runtimeConfig, {
    apiKey: runtimeConfig.env.OAK_API_KEY,
  });

  log('[START-MCP] Server started successfully');
} catch (error: unknown) {
  log(`[START-MCP ERROR] Failed to start server: ${String(error)}`, true);

  if (error instanceof Error) {
    log(`[START-MCP ERROR] Stack trace: ${String(error.stack)}`, true);
    logCauseChain(error, log);
  }

  log(`[START-MCP ERROR] Server error details: ${String(error)}`, true);
  process.exit(1);
}

function logCauseChain(err: Error, log: (message: string, isError?: boolean) => void): void {
  let currentCause = err.cause;
  for (let i = 0; i < 3 && currentCause; i += 1) {
    if (currentCause instanceof Error) {
      log(`[START-MCP ERROR] Caused by: ${currentCause.message}`, true);
      currentCause = currentCause.cause;
    } else {
      log(`[START-MCP ERROR] Caused by: ${safeStringify(currentCause)}`, true);
      break;
    }
  }
}
