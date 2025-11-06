import express, { static as expressStatic, json as expressJson } from 'express';
import type { Express, RequestHandler } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  createRequestLogger,
  createErrorLogger,
  convertLogLevel,
  type Logger,
} from '@oaknational/mcp-logger';

import { createCorrelationMiddleware } from './correlation/middleware.js';

import { renderLandingPageHtml } from './landing-page.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, type ToolHandlerOverrides } from './handlers.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig, type RuntimeConfig } from './runtime-config.js';
import { createSecurityConfig } from './security-config.js';
import { setupAuthRoutes } from './auth-routes.js';
import { createEnsureMcpAcceptHeader } from './mcp-middleware.js';

export interface CreateAppOptions {
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly runtimeConfig?: RuntimeConfig;
  readonly logger?: Logger;
}

type ExpressWithAppId = Express & { __appId?: number };

let appCounter = 0;

function setupBaseMiddleware(app: Express, log: Logger): void {
  app.use(expressJson({ limit: '1mb' }));
  app.use(createCorrelationMiddleware(log));

  const debugEnabled = log.isLevelEnabled?.(convertLogLevel('DEBUG')) ?? false;
  if (debugEnabled) {
    app.use(createRequestLogger(log, { level: 'debug' }));
  }
  app.use(createErrorLogger(log));
}

export function createApp(options?: CreateAppOptions): ExpressWithAppId {
  appCounter++;
  const runtimeConfig = options?.runtimeConfig ?? loadRuntimeConfig();
  const log =
    options?.logger ?? createHttpLogger(runtimeConfig, { name: 'streamable-http:app-instance' });

  log.debug(`Creating app #${String(appCounter)}`);
  const app: ExpressWithAppId = express();
  app.__appId = appCounter;
  setupBaseMiddleware(app, log);

  const security = createSecurityConfig(runtimeConfig);
  const corsMw = applySecurity(app, security.mode, security.allowedHosts, security.allowedOrigins);

  const { transport: coreTransport, ready } = initializeCoreEndpoints(
    app,
    corsMw,
    options,
    runtimeConfig,
    log,
  );

  mountStaticAssets(app);
  addRootLandingPage(app, runtimeConfig.vercelHostname);

  app.use('/mcp', createEnsureMcpAcceptHeader(log));

  setupAuthRoutes(app, coreTransport, runtimeConfig, log);

  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });

  return app;
}

function initializeCoreEndpoints(
  app: Express,
  corsMw: RequestHandler,
  options: CreateAppOptions | undefined,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): { transport: StreamableHTTPServerTransport; ready: Promise<void> } {
  const { transport, server } = initializeCoreMcpServer();
  registerHandlers(server, {
    overrides: options?.toolHandlerOverrides,
    runtimeConfig,
    logger: log,
  });
  const serverReady = server.connect(transport);

  addHealthEndpoints(app, corsMw);

  return { transport, ready: serverReady };
}

function addHealthEndpoints(app: Express, corsMw: RequestHandler): void {
  app.head('/healthz', corsMw, (req, res) => {
    void req;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  });
  app.get('/healthz', corsMw, (req, res) => {
    void req;
    res
      .type('application/json')
      .send(JSON.stringify({ status: 'ok', mode: 'streamable-http', auth: 'required-for-post' }));
  });
}

function addRootLandingPage(app: Express, vercelHostname?: string): void {
  app.get('/', (_req, res) => {
    res.type('text/html').send(renderLandingPageHtml(vercelHostname));
  });
}

function mountStaticAssets(app: Express): void {
  const candidates = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/oak-curriculum-mcp-streamable-http/public'),
  ];
  const chosen = candidates.find((p) => fs.existsSync(p));
  if (chosen) {
    app.use(expressStatic(chosen, { etag: true, maxAge: '1d' }));
  }
}

function applySecurity(
  app: Express,
  mode: 'stateless' | 'session',
  allowedHosts: readonly string[],
  allowedOrigins: readonly string[] | undefined,
): RequestHandler {
  app.use(dnsRebindingProtection(allowedHosts));
  const corsMw = createCorsMiddleware(mode, allowedOrigins);
  app.use(corsMw);
  return corsMw;
}

function initializeCoreMcpServer(): {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
} {
  const server = new McpServer({ name: 'oak-curriculum-http', version: '0.1.0' });
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  return { server, transport };
}

export default createApp;
