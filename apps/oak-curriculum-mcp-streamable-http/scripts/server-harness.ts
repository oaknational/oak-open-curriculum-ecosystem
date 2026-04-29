#!/usr/bin/env node
/**
 * Local Source Server Harness
 *
 * Loads environment from a selected file, then starts the same DI-friendly
 * source server path used by `src/index.ts`. This keeps the harness on the
 * repo's supported testability seam rather than dynamically loading the built
 * deploy bundle.
 *
 * Usage:
 *   ENV_FILE=.env.harness.auth-enabled pnpm prod:harness
 *   ENV_FILE=.env.harness.auth-disabled pnpm prod:harness
 *   ENV_FILE=.env.harness.missing-clerk pnpm prod:harness
 *
 * Environment:
 *   ENV_FILE - Path to .env file (default: .env.harness)
 *   PORT - Server port (default: 3001)
 */

import http from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupExpressErrorHandler } from '@sentry/node';

import { createApp } from '../src/application.js';
import { bootstrapApp } from '../src/bootstrap-app.js';
import { WIDGET_HTML_CONTENT } from '../src/generated/widget-html-content.js';
import {
  createHttpObservability,
  describeHttpObservabilityError,
} from '../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { startConfiguredHttpServer } from '../src/server-runtime.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(thisDir, '..');

type LogLevel = 'INFO' | 'ERROR' | 'DEBUG';
type LogMeta = Readonly<Record<string, unknown>>;

function emit(level: LogLevel, message: string, meta: LogMeta = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const out = level === 'ERROR' ? process.stderr : process.stdout;
  out.write(`${JSON.stringify(entry)}\n`);
}

const log = {
  info(message: string, meta?: LogMeta) {
    emit('INFO', message, meta);
  },
  error(message: string, meta?: LogMeta) {
    emit('ERROR', message, meta);
  },
  debug(message: string, meta?: LogMeta) {
    emit('DEBUG', message, meta);
  },
};

function loadEnvFile(envFile: string): void {
  const envPath = resolve(rootDir, envFile);

  if (!existsSync(envPath)) {
    log.info('No environment file found, using process.env', {
      fileLoaded: false,
      searched: envPath,
    });
    return;
  }

  log.info('Loading environment from file', { path: envPath });

  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, value] = match;
    const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
    process.env[key] = cleanValue;
    log.debug('Loaded environment variable', {
      key,
      valuePreview: key.includes('SECRET') || key.includes('KEY') ? '[REDACTED]' : cleanValue,
    });
  }

  log.info('Environment loaded successfully', { fileLoaded: true });
}

function logConfigSnapshot() {
  log.info('Configuration snapshot', {
    PORT: process.env.PORT || '3001',
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY
      ? `[REDACTED-${process.env.CLERK_PUBLISHABLE_KEY.substring(0, 10)}...]`
      : undefined,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? '[REDACTED]' : undefined,
    OAK_API_KEY: process.env.OAK_API_KEY ? '[REDACTED]' : undefined,
    ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
  });
}

async function main() {
  const envFile = process.env.ENV_FILE || '.env.harness';

  log.info('Server harness starting', {
    harness: 'source-di',
    envFile,
    envPath: resolve(rootDir, envFile),
    nodeVersion: process.version,
    platform: process.platform,
  });

  loadEnvFile(envFile);
  logConfigSnapshot();

  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: rootDir,
  });

  if (!configResult.ok) {
    log.error('Failed to load runtime config', {
      error: configResult.error.message,
      diagnostics: configResult.error.diagnostics,
    });
    process.exit(1);
  }

  const runtimeConfig = configResult.value;
  const observabilityResult = createHttpObservability(runtimeConfig);

  if (!observabilityResult.ok) {
    log.error('Failed to create observability', {
      error: describeHttpObservabilityError(observabilityResult.error),
    });
    process.exit(1);
  }

  const observability = observabilityResult.value;
  const startTime = Date.now();

  await startConfiguredHttpServer({
    runtimeConfig,
    observability,
    createApp: async (options) =>
      await createApp({
        ...options,
        getWidgetHtml: () => WIDGET_HTML_CONTENT,
        setupSentryErrorHandler:
          runtimeConfig.env.SENTRY_MODE !== 'off' ? setupExpressErrorHandler : undefined,
      }),
    bootstrapApp,
    createServer: (app) => http.createServer(app),
    onSignal: (signal, handler) => {
      process.once(signal, handler);
    },
    exit: (code) => process.exit(code),
  });

  log.info('Harness ready for requests', {
    bootstrapMs: Date.now() - startTime,
    healthCheck: `http://localhost:${runtimeConfig.env.PORT ?? '3333'}/healthz`,
    landingPage: `http://localhost:${runtimeConfig.env.PORT ?? '3333'}/`,
    mcpEndpoint: `http://localhost:${runtimeConfig.env.PORT ?? '3333'}/mcp`,
  });
}

await main();
