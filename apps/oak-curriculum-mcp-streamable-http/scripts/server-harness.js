#!/usr/bin/env node
/**
 * Production Build Server Harness
 *
 * Runs the built production bundle (dist/src/index.js) locally with configurable
 * environment to diagnose deployment issues and validate instrumentation.
 *
 * Usage:
 *   ENV_FILE=.env.harness.auth-enabled node scripts/server-harness.js
 *   ENV_FILE=.env.harness.auth-disabled node scripts/server-harness.js
 *   ENV_FILE=.env.harness.missing-clerk node scripts/server-harness.js
 *
 * Environment:
 *   ENV_FILE - Path to .env file (default: .env.harness)
 *   PORT - Server port (default: 3001)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Logging utilities
const log = {
  info: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: msg,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  },
  error: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: msg,
      ...meta,
    };
    console.error(JSON.stringify(entry));
  },
  debug: (msg, meta = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      message: msg,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  },
};

// Load environment file
const envFile = process.env.ENV_FILE || '.env.harness';
const envPath = resolve(rootDir, envFile);

log.info('Server harness starting', {
  harness: 'production-build',
  envFile,
  envPath,
  nodeVersion: process.version,
  platform: process.platform,
});

if (existsSync(envPath)) {
  log.info('Loading environment from file', { path: envPath });
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Remove quotes if present
      const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
      process.env[key] = cleanValue;
      log.debug('Loaded environment variable', {
        key,
        valuePreview: key.includes('SECRET') || key.includes('KEY') ? '[REDACTED]' : cleanValue,
      });
    }
  }
  log.info('Environment loaded successfully', { fileLoaded: true });
} else {
  log.info('No environment file found, using process.env', {
    fileLoaded: false,
    searched: envPath,
  });
}

// Log current configuration (redact secrets)
const configSnapshot = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY
    ? '[REDACTED-' + process.env.CLERK_PUBLISHABLE_KEY.substring(0, 10) + '...]'
    : undefined,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? '[REDACTED]' : undefined,
  OAK_API_KEY: process.env.OAK_API_KEY ? '[REDACTED]' : undefined,
  ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
};

log.info('Configuration snapshot', configSnapshot);

// Import and start server
const startTime = Date.now();

log.info('Importing production bundle', {
  bundlePath: 'dist/src/index.js',
});

try {
  const { createApp } = await import(`${rootDir}/dist/src/application.js`);
  const { loadRuntimeConfig } = await import(`${rootDir}/dist/src/runtime-config.js`);

  if (typeof createApp !== 'function') {
    throw new Error('createApp is not a function in production bundle');
  }

  log.info('Production bundle loaded', {
    createAppType: typeof createApp,
    loadTimeMs: Date.now() - startTime,
  });

  // Load runtime config from process.env (loaded from ENV_FILE above)
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: rootDir,
  });

  if (!configResult.ok) {
    log.error('Failed to load runtime config', {
      message: configResult.error.message,
      diagnostics: configResult.error.diagnostics,
    });
    process.exit(1);
  }

  // Create Express app
  const appCreationStart = Date.now();
  const app = createApp({ runtimeConfig: configResult.value });
  const appCreationTime = Date.now() - appCreationStart;

  log.info('Express app created', {
    appCreationTimeMs: appCreationTime,
    totalTimeMs: Date.now() - startTime,
  });

  // Start server
  const port = process.env.PORT || 3001;
  const server = app.listen(port, () => {
    const listenTime = Date.now() - startTime;
    log.info('Server listening', {
      port,
      host: 'localhost',
      listenTimeMs: listenTime,
      totalBootstrapMs: listenTime,
      url: `http://localhost:${port}`,
    });
    log.info('Harness ready for requests', {
      healthCheck: `http://localhost:${port}/healthz`,
      landingPage: `http://localhost:${port}/`,
      mcpEndpoint: `http://localhost:${port}/mcp`,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    log.info('Shutdown signal received', { signal });

    server.close(() => {
      log.info('Server closed');
      process.exit(0);
    });

    // Force exit after 5 seconds
    setTimeout(() => {
      log.error('Forced shutdown after timeout');
      process.exit(1);
    }, 5000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} catch (error) {
  log.error('Failed to start server', {
    error: error.message,
    stack: error.stack,
    totalTimeMs: Date.now() - startTime,
  });
  process.exit(1);
}
