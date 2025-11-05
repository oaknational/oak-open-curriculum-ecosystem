import express, { static as expressStatic, json as expressJson } from 'express';
import type { Express, RequestHandler, NextFunction, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import {
  createRequestLogger,
  createErrorLogger,
  convertLogLevel,
  type Logger,
} from '@oaknational/mcp-logger';

import { renderLandingPageHtml } from './landing-page.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler, type ToolHandlerOverrides } from './handlers.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig, type RuntimeConfig } from './runtime-config.js';
import { createSecurityConfig } from './security-config.js';

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
  app.use(expressJson({ limit: '1mb' }));

  const debugEnabled = log.isLevelEnabled?.(convertLogLevel('DEBUG')) ?? false;
  if (debugEnabled) {
    app.use(createRequestLogger(log, { level: 'debug' }));
  }
  app.use(createErrorLogger(log));

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

function registerUnauthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(coreTransport));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(coreTransport));
}

function registerOAuthMetadataEndpoints(app: Express, runtimeConfig: RuntimeConfig): void {
  app.get(
    '/.well-known/oauth-protected-resource',
    protectedResourceHandlerClerk({ scopes_supported: ['mcp:invoke', 'mcp:read'] }),
  );
  app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);

  if (runtimeConfig.useStubTools) {
    // In stub mode we expose additional metadata for tooling to detect bypass scenarios
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

function registerAuthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.debug('Registering global clerkMiddleware');
  app.use(clerkMiddleware());
  log.debug('Registering POST /mcp route (auth ENABLED with mcpAuthClerk)');
  app.post('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
  log.debug('Registering GET /mcp route (auth ENABLED with mcpAuthClerk)');
  app.get('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
}

function setupAuthRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  log.debug(
    `Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(runtimeConfig.dangerouslyDisableAuth)}`,
  );

  if (runtimeConfig.dangerouslyDisableAuth) {
    registerUnauthenticatedRoutes(app, coreTransport, log);
    return;
  }

  log.info('🔒 OAuth enforcement enabled via Clerk');
  log.debug('Registering OAuth routes (auth ENABLED)');
  registerOAuthMetadataEndpoints(app, runtimeConfig);
  registerAuthenticatedRoutes(app, coreTransport, log);
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

function createEnsureMcpAcceptHeader(
  log: Logger,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    const accept = req.get('Accept') ?? '';
    const hasJson = accept.includes('application/json');
    const hasEventStream = accept.includes('text/event-stream');
    const requiresJson = req.method !== 'GET';

    log.debug('ensureMcpAcceptHeader evaluating request', {
      method: req.method,
      path: req.path,
      acceptHeader: accept,
      hasJson,
      hasEventStream,
      requiresJson,
    });

    if (!hasEventStream) {
      log.warn('ensureMcpAcceptHeader rejecting request: missing text/event-stream', {
        method: req.method,
        path: req.path,
        acceptHeader: accept,
      });
      res
        .status(406)
        .type('application/json')
        .send({ error: 'Accept header must include text/event-stream' });
      return;
    }

    if (requiresJson && !hasJson) {
      log.warn('ensureMcpAcceptHeader rejecting request: missing application/json', {
        method: req.method,
        path: req.path,
        acceptHeader: accept,
      });
      res
        .status(406)
        .type('application/json')
        .send({ error: 'Accept header must include application/json and text/event-stream' });
      return;
    }

    log.debug('ensureMcpAcceptHeader allowing request', {
      method: req.method,
      path: req.path,
    });
    next();
  };
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
