import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { renderLandingPageHtml } from './landing-page.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { parseCsv } from './env.js';
import { bearerAuth } from './auth.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler } from './handlers.js';
import { registerOpenAiConnectorHandlers } from './openai/connector.js';
import { setupOAuthMetadata, setupLocalAuthorizationServer } from './oauth-metadata.js';
import { loadRootEnv } from '@oaknational/mcp-env';
import { logger } from './logging.js';

// Ensure critical env is available in local/dev by loading from repo root when missing
/** @todo this should be handled by the mcp-env package or the shared MCP library, fix */
(() => {
  if (!process.env.OAK_API_KEY) {
    try {
      loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Failed to load OAK_API_KEY from ENV variables and from dotenv, exiting: ${message}`,
        { cause: err },
      );
    }
  }
})();

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

export function createApp(): express.Express {
  const app = express();
  // eslint-disable-next-line import-x/no-named-as-default-member -- allow since we already import the default express (no treeshaking advantage)
  app.use(express.json({ limit: '1mb' }));

  const { mode, allowedHosts, allowedOrigins } = readSecurityEnv();
  const corsMw = applySecurity(app, mode, allowedHosts, allowedOrigins);

  const { transport: coreTransport, ready } = initializeCoreEndpoints(app, corsMw);
  // Static assets for favicon/logo (works locally and on Vercel)
  mountStaticAssets(app);
  addRootLandingPage(app);
  app.use(bearerAuth);
  // Add middleware to ensure proper Accept header for MCP requests
  app.use('/mcp', ensureMcpAcceptHeader);
  app.post('/mcp', createMcpHandler(coreTransport));
  app.get('/mcp', createMcpHandler(coreTransport));

  // OpenAI Connector: mirror security and Accept handling, separate server+transport
  const openAi = initializeServer();
  registerOpenAiConnectorHandlers(openAi.server);
  app.use('/openai_connector', ensureMcpAcceptHeader);
  app.post('/openai_connector', createMcpHandler(openAi.transport));
  app.get('/openai_connector', createMcpHandler(openAi.transport));

  // Gate request handling on readiness
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });
  return app;
}

function initializeCoreEndpoints(
  app: express.Express,
  corsMw: express.RequestHandler,
): { transport: StreamableHTTPServerTransport; ready: Promise<void> } {
  const { transport, server } = initializeCoreMcpServer();
  // Register tools BEFORE connecting the transport to satisfy MCP SDK constraints
  registerHandlers(server);
  const serverReady = server.connect(transport);
  // Expose resource metadata immediately
  setupOAuthMetadata(app, corsMw);
  // Lightweight unauthenticated health endpoints for tooling/UI probes
  addHealthEndpoints(app, corsMw);
  // Ensure local AS endpoints are registered before handling requests
  const asReady = setupLocalAuthorizationServer(app, corsMw).catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Error setting up local authorization server:', err.message);
    } else {
      console.error('Error setting up local authorization server:', err);
    }
  });
  return { transport, ready: Promise.all([serverReady, asReady]).then(() => undefined) };
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

function initializeServer(): {
  server: Server;
  transport: StreamableHTTPServerTransport;
  ready: Promise<void>;
} {
  const server = new Server(
    { name: 'oak-curriculum-http', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const ready = server.connect(transport);
  return { server, transport, ready };
}

// handlers are registered via handlers.ts

// http handler moved to handlers.ts

export async function startDevServer(): Promise<void> {
  const app = createApp();
  const port = Number(process.env.PORT ?? 3333);
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve();
    });
    server.on('error', reject);
  });

  logger.info('Streaming HTTP MCP dev server listening', {
    url: `http://localhost:${String(port)}`,
    allowNoAuth: process.env.REMOTE_MCP_ALLOW_NO_AUTH === 'true',
    nodeEnv: process.env.NODE_ENV ?? 'unset',
  });
}

export default createApp();
