import express, { static as expressStatic } from 'express';
import type { Express, RequestHandler } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createPhasedTimer, startTimer, type Duration, type Logger } from '@oaknational/mcp-logger';

import { renderLandingPageHtml } from './landing-page.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, type ToolHandlerOverrides } from './handlers.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig, type RuntimeConfig } from './runtime-config.js';
import { createSecurityConfig } from './security-config.js';
import { setupAuthRoutes } from './auth-routes.js';
import { createEnsureMcpAcceptHeader } from './mcp-middleware.js';
import {
  runBootstrapPhase,
  setupBaseMiddleware,
  createMcpReadinessMiddleware,
} from './app/bootstrap-helpers.js';

export interface CreateAppOptions {
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly runtimeConfig?: RuntimeConfig;
  readonly logger?: Logger;
}

type ExpressWithAppId = Express & { __appId?: number };

let appCounter = 0;

export function createApp(options?: CreateAppOptions): ExpressWithAppId {
  appCounter++;
  const runtimeConfig = options?.runtimeConfig ?? loadRuntimeConfig();
  const log =
    options?.logger ?? createHttpLogger(runtimeConfig, { name: 'streamable-http:app-instance' });

  log.debug(`Creating app #${String(appCounter)}`);
  const app: ExpressWithAppId = express();
  app.__appId = appCounter;

  const bootstrapTimer = createPhasedTimer();

  runBootstrapPhase(log, bootstrapTimer, 'setupBaseMiddleware', appCounter, () => {
    setupBaseMiddleware(app, log);
  });

  const security = createSecurityConfig(runtimeConfig);
  const corsMw = runBootstrapPhase(log, bootstrapTimer, 'applySecurity', appCounter, () =>
    applySecurity(app, security.mode, security.allowedHosts, security.allowedOrigins),
  );

  const { transport: coreTransport, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appCounter,
    () => initializeCoreEndpoints(app, corsMw, options, runtimeConfig, log),
  );

  mountStaticAssets(app);
  addRootLandingPage(app, runtimeConfig.vercelHostname);

  const ensureMcpReady = createMcpReadinessMiddleware(ready, log);
  app.use('/mcp', createEnsureMcpAcceptHeader(log), ensureMcpReady);

  runBootstrapPhase(log, bootstrapTimer, 'setupAuthRoutes', appCounter, () => {
    setupAuthRoutes(app, coreTransport, runtimeConfig, log);
  });

  const totalDuration = bootstrapTimer.end();
  log.info('bootstrap.complete', {
    appId: appCounter,
    duration: totalDuration.formatted,
    durationMs: totalDuration.ms,
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
  log.debug('bootstrap.mcp.transport.connect.start');
  const connectionTimer = startTimer();
  let connectionDuration: Duration | undefined;
  const ensureConnectionDuration = (): Duration => {
    connectionDuration ??= connectionTimer.end();
    return connectionDuration;
  };
  const serverReady = server.connect(transport).then(
    () => {
      const duration = ensureConnectionDuration();
      log.info('bootstrap.mcp.transport.connect.finish', {
        duration: duration.formatted,
        durationMs: duration.ms,
      });
    },
    (error: unknown) => {
      const duration = ensureConnectionDuration();
      const errorAsError =
        error instanceof Error
          ? error
          : new Error(`MCP transport connect failed with non-error value: ${String(error)}`);
      log.error('bootstrap.mcp.transport.connect.error', errorAsError, {
        duration: duration.formatted,
        durationMs: duration.ms,
      });
      throw error;
    },
  );

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
