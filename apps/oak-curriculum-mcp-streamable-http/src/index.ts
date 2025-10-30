import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { renderLandingPageHtml } from './landing-page.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { parseCsv } from './env.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler, type ToolHandlerOverrides } from './handlers.js';
import { logger } from './logging.js';

function addHealthEndpoints(app: express.Express, corsMw: express.RequestHandler): void {
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

export function createApp(options?: CreateAppOptions): express.Express {
  const app = express();
  // eslint-disable-next-line import-x/no-named-as-default-member -- allow since we already import the default express (no treeshaking advantage)
  app.use(express.json({ limit: '1mb' }));

  const { mode, allowedHosts, allowedOrigins } = readSecurityEnv();
  const corsMw = applySecurity(app, mode, allowedHosts, allowedOrigins);

  const { transport: coreTransport, ready } = initializeCoreEndpoints(app, corsMw, options);
  mountStaticAssets(app); // Static assets for favicon/logo (works locally and on Vercel)
  addRootLandingPage(app);
  app.use('/mcp', ensureMcpAcceptHeader); // Ensure proper Accept header for MCP requests

  setupAuthRoutes(app, coreTransport);

  // Gate request handling on readiness
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });
  return app;
}

function setupAuthRoutes(app: express.Express, coreTransport: StreamableHTTPServerTransport): void {
  // Auth enforcement: disable ONLY when explicitly requested via DANGEROUSLY_DISABLE_AUTH=true
  const authDisabled = process.env.DANGEROUSLY_DISABLE_AUTH === 'true';

  logger.debug('Auth decision', {
    DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH ?? null,
    authDisabled,
  });

  if (authDisabled) {
    logger.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
    app.post('/mcp', createMcpHandler(coreTransport));
    app.get('/mcp', createMcpHandler(coreTransport));
  } else {
    logger.info('🔒 OAuth enforcement enabled via Clerk');

    // OAuth metadata endpoints (RFC 9728 - Protected Resource Metadata)
    app.get(
      '/.well-known/oauth-protected-resource',
      protectedResourceHandlerClerk({
        scopes_supported: ['mcp:invoke', 'mcp:read'],
      }),
    );

    // Authorization Server Metadata (for older MCP clients)
    app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk);

    app.use(clerkMiddleware()); // Clerk middleware (attaches auth to req.auth if authenticated)
    app.post('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
    app.get('/mcp', mcpAuthClerk, createMcpHandler(coreTransport));
  }
}

function initializeCoreEndpoints(
  app: express.Express,
  corsMw: express.RequestHandler,
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

function addRootLandingPage(app: express.Express): void {
  app.get('/', (_req, res) => {
    res.type('text/html').send(renderLandingPageHtml());
  });
}

/**
 * Middleware to ensure MCP requests have the required Accept header.
 * This improves UX by automatically adding the header if missing.
 */
function ensureMcpAcceptHeader(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
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
function mountStaticAssets(app: express.Express): void {
  const candidates = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/oak-curriculum-mcp-streamable-http/public'),
  ];
  const chosen = candidates.find((p) => fs.existsSync(p));
  if (chosen) {
    // eslint-disable-next-line import-x/no-named-as-default-member -- allow since we already import the default express (no treeshaking advantage)
    app.use(express.static(chosen, { etag: true, maxAge: '1d' }));
  }
}

function readSecurityEnv(): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const mode = (process.env.REMOTE_MCP_MODE ?? 'stateless') === 'session' ? 'session' : 'stateless';
  const allowedHosts = parseCsv(process.env.ALLOWED_HOSTS) ?? ['localhost', '127.0.0.1', '::1'];
  const allowedOrigins = parseCsv(process.env.ALLOWED_ORIGINS);
  return { mode, allowedHosts, allowedOrigins };
}

function applySecurity(
  app: express.Express,
  mode: 'stateless' | 'session',
  allowedHosts: readonly string[],
  allowedOrigins: readonly string[] | undefined,
): express.RequestHandler {
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

export default createApp();
