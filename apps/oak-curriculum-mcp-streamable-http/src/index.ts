import http from 'node:http';

import { createApp } from './application.js';
import { bootstrapApp } from './bootstrap-app.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

const result = loadRuntimeConfig({
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  console.error(result.error.message);
  process.exit(1);
}

const config = result.value;
const bootstrapLog = createHttpLogger(config, { name: 'streamable-http:bootstrap' });

const app = await bootstrapApp({
  startApp: () => createApp({ runtimeConfig: config }),
  logger: bootstrapLog,
  exit: (code) => process.exit(code),
});

const port = config.env.PORT ? Number(config.env.PORT) : 3333;
bootstrapLog.debug(`Running locally, starting server on port ${String(port)}`);

/**
 * Express 5's app.listen() wraps the callback with once() and registers it
 * for both 'listening' and 'error' events. This means EADDRINUSE fires the
 * callback without the error argument, the server never binds, and the
 * process exits silently. Using http.createServer directly lets us handle
 * startup errors explicitly.
 */
const server = http.createServer(app);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${String(port)} is already in use.`);
    console.error(`  A previous dev server may still be running.`);
    console.error(`\n  To fix: kill the process holding the port, then retry:`);
    console.error(`    lsof -i :${String(port)}`);
    console.error(`    kill <PID>\n`);
  } else {
    console.error(`\n  Server failed to start: ${err.message}\n`);
  }
  process.exit(1);
});

server.listen(port, () => {
  console.log(`🚀 Oak Curriculum MCP Server listening on port ${String(port)}`);
  console.log(`   MCP endpoint: http://localhost:${String(port)}/mcp`);
  if (config.dangerouslyDisableAuth) {
    console.log(`   ⚠️  AUTH DISABLED (DANGEROUSLY_DISABLE_AUTH=true)`);
  } else {
    console.log(`   🔒 OAuth enforced via Clerk`);
  }
});
