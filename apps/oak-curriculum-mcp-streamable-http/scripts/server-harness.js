#!/usr/bin/env node
/**
 * Production Build Server Harness
 *
 * Runs the built production deploy bundle (dist/server.js) locally with configurable
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

import { createServer } from 'node:http';
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
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

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
};

log.info('Configuration snapshot', configSnapshot);

// Import and start server
const startTime = Date.now();

log.info('Importing production bundle', {
  bundlePath: 'dist/server.js',
});

try {
  const bundle = await import(`${rootDir}/dist/server.js`);

  if (typeof bundle.default !== 'function') {
    throw new Error('default export is not a function in production deploy bundle');
  }

  const handler = bundle.default;

  log.info('Production bundle loaded', {
    defaultExportType: typeof handler,
    loadTimeMs: Date.now() - startTime,
  });

  // Start server
  const port = process.env.PORT || 3001;
  const server = createServer((req, res) => {
    void Promise.resolve(handler(req, res)).catch((error) => {
      log.error('Deploy handler failed', {
        message: error instanceof Error ? error.message : String(error),
      });
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });

  server.listen(port, () => {
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
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    totalTimeMs: Date.now() - startTime,
  });
  process.exit(1);
}
