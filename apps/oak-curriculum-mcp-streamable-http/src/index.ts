/* eslint max-lines: ["error", { "max": 300 }] */

import express, { static as expressStatic, json as expressJson } from 'express';
import type { Express, RequestHandler, NextFunction, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { renderLandingPageHtml } from './landing-page.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler, type ToolHandlerOverrides } from './handlers.js';
import { logger } from './logging.js';
import {
  isTracingEnabled,
  createTracingMiddleware,
  dumpRouteStack,
  logRequestRoute,
} from './trace-mcp-flow.js';
import { readSecurityEnv } from './security-config.js';

function addHealthEndpoints(app: Express, corsMw: RequestHandler): void {
  app.head('/healthz', corsMw, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  });
  app.get('/healthz', corsMw, (_req, res) => {
    res
      .type('application/json')
      .send(JSON.stringify({ status: 'ok', mode: 'streamable-http', auth: 'required-for-post' }));
  });
}

export interface CreateAppOptions {
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
}

type ExpressWithAppId = Express & { __appId?: number };

let appCounter = 0;
// eslint-disable-next-line max-statements -- disable while debugging.
export function createApp(options?: CreateAppOptions): ExpressWithAppId {
  appCounter++;
  const appId = appCounter;
  logger.debug(`[TRACE] createApp() called - creating app #${String(appId)}`);
  const app: ExpressWithAppId = express();
  app.__appId = appId;
  app.use(expressJson({ limit: '1mb' }));

  // Add tracing middleware if enabled
  if (isTracingEnabled()) {
    logger.debug(`[TRACE] Registering global request logger on app #${String(appId)}`);
    app.use((req, res, next) => {
      logger.debug(
        `[TRACE] -> GLOBAL on app #${String(appId)}: ${req.method} ${req.path} - accept: ${req.get('Accept') ?? 'undefined'}, contentType: ${req.get('Content-Type') ?? 'undefined'}`,
      );
      const originalStatus = res.status.bind(res);
      res.status = (code: number) => {
        logger.debug(`[TRACE] <- GLOBAL: ${req.method} ${req.path} -> ${String(code)}`);
        return originalStatus(code);
      };
      next();
    });
    app.use(createTracingMiddleware('express.json'));
  } else {
    console.debug('Tracing disabled');
  }

  const { mode, allowedHosts, allowedOrigins } = readSecurityEnv();
  const corsMw = applySecurity(app, mode, allowedHosts, allowedOrigins);

  const { transport: coreTransport, ready } = initializeCoreEndpoints(app, corsMw, options);
  mountStaticAssets(app); // Static assets for favicon/logo (works locally and on Vercel)
  addRootLandingPage(app);
  // Add tracing middleware to /mcp path BEFORE any other middleware
  if (isTracingEnabled()) {
    logger.debug('[TRACE] Registering /mcp tracing middleware');
    app.use('/mcp', createTracingMiddleware('ensureMcpAcceptHeader'));
  }

  app.use('/mcp', ensureMcpAcceptHeader); // Ensure proper Accept header for MCP requests

  setupAuthRoutes(app, coreTransport);

  // Gate request handling on readiness
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });

  // Add tracing around readiness gate
  if (isTracingEnabled()) {
    app.use(createTracingMiddleware('readiness-gate'));
  }

  // Dump route stack if tracing enabled
  if (isTracingEnabled()) {
    dumpRouteStack(app);
  }

  return app;
}

function setupAuthRoutes(app: Express, coreTransport: StreamableHTTPServerTransport): void {
  // Auth enforcement: disable ONLY when explicitly requested via DANGEROUSLY_DISABLE_AUTH=true
  const authDisabled = (process.env.DANGEROUSLY_DISABLE_AUTH ?? 'false') === 'true';

  logger.debug(`Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(authDisabled)}`);

  if (authDisabled) {
    logger.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
    logger.debug('[TRACE] Registering POST /mcp route (auth disabled)');
    app.post(
      '/mcp',
      (_req, _res, next) => {
        logger.debug('🔓 POST /mcp route hit (auth disabled)');
        if (isTracingEnabled()) {
          logger.debug('[TRACE] -> POST /mcp route handler (auth disabled)');
          logRequestRoute(logger, _req);
        }
        next();
      },
      createMcpHandler(coreTransport),
    );
    logger.debug('[TRACE] Registering GET /mcp route (auth disabled)');
    app.get(
      '/mcp',
      (_req, _res, next) => {
        if (isTracingEnabled()) {
          logger.debug('[TRACE] -> GET /mcp route handler (auth disabled)');
          logRequestRoute(logger, _req);
        }
        next();
      },
      createMcpHandler(coreTransport),
    );
  } else {
    logger.info('🔒 OAuth enforcement enabled via Clerk');
    logger.debug('[TRACE] Registering OAuth routes (auth ENABLED)');

    // OAuth metadata endpoints (RFC 9728 - Protected Resource Metadata)
    app.get(
      '/.well-known/oauth-protected-resource',
      protectedResourceHandlerClerk({
        scopes_supported: ['mcp:invoke', 'mcp:read'],
      }),
    );

    // Authorization Server Metadata (for older MCP clients)
    app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);

    logger.debug('[TRACE] Registering global clerkMiddleware');
    app.use(clerkMiddleware()); // Clerk middleware (attaches auth to req.auth if authenticated)
    logger.debug('[TRACE] Registering POST /mcp route (auth ENABLED with mcpAuthClerk)');
    app.post('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
    logger.debug('[TRACE] Registering GET /mcp route (auth ENABLED with mcpAuthClerk)');
    app.get('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
  }
}

function initializeCoreEndpoints(
  app: Express,
  corsMw: RequestHandler,
  options?: CreateAppOptions,
): { transport: StreamableHTTPServerTransport; ready: Promise<void> } {
  const { transport, server } = initializeCoreMcpServer();
  // Register tools BEFORE connecting the transport to satisfy MCP SDK constraints
  registerHandlers(server, options?.toolHandlerOverrides);
  const serverReady = server.connect(transport);

  // Lightweight unauthenticated health endpoints for tooling/UI probes
  addHealthEndpoints(app, corsMw);

  return { transport, ready: serverReady };
}

function addRootLandingPage(app: Express): void {
  app.get('/', (_req, res) => {
    res.type('text/html').send(renderLandingPageHtml());
  });
}

/**
 * Middleware to ensure MCP requests have the required Accept header.
 * This improves UX by automatically adding the header if missing.
 */
function ensureMcpAcceptHeader(req: Request, res: Response, next: NextFunction): void {
  const accept = req.get('Accept') ?? '';
  const hasJson = accept.includes('application/json');
  const hasEventStream = accept.includes('text/event-stream');
  const requiresJson = req.method !== 'GET';

  logger.debug('ensureMcpAcceptHeader evaluating request', {
    method: req.method,
    path: req.path,
    acceptHeader: accept,
    hasJson,
    hasEventStream,
    requiresJson,
  });

  if (!hasEventStream) {
    logger.warn('ensureMcpAcceptHeader rejecting request: missing text/event-stream', {
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
    logger.warn('ensureMcpAcceptHeader rejecting request: missing application/json', {
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

  logger.debug('ensureMcpAcceptHeader allowing request', {
    method: req.method,
    path: req.path,
  });
  next();
}

/**
 * Mount static assets for favicon/logo (works locally and on Vercel (and probably would without this complexity))
 */
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

// handlers are registered via handlers.ts

// http handler moved to handlers.ts

// Note: Vercel expects a default export
// We export the createApp FUNCTION (not a call) to avoid module-level side effects
// Vercel will call this function when handling requests
export default createApp;
