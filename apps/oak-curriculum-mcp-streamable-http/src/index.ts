import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { renderLandingPageHtml } from './landing-page.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { parseCsv } from './env.js';
import { exportJWK, generateKeyPair } from 'jose';
import { bearerAuth } from './auth.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler } from './handlers.js';
import { loadRootEnv } from '@oaknational/mcp-env';

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
  app.options('/mcp', corsMw);
  app.head('/mcp', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  });
  app.get('/mcp', (_req, res) => {
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

  const { transport, ready: serverReady, server } = initializeServer();
  registerHandlers(server);
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
  const ready = Promise.all([serverReady, asReady]).then(() => undefined);
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });
  // Static assets for favicon/logo (works locally and on Vercel)
  mountStaticAssets(app);
  addRootLandingPage(app);
  app.use(bearerAuth);
  // Add middleware to ensure proper Accept header for MCP requests
  app.use('/mcp', ensureMcpAcceptHeader);
  app.post('/mcp', createMcpHandler(transport));

  return app;
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
  _res: express.Response,
  next: express.NextFunction,
): void {
  const accept = req.get('Accept');
  const requiredAccept = 'application/json, text/event-stream';

  // Check if Accept header is missing, is wildcard, or doesn't contain both required types
  if (
    !accept ||
    accept === '*/*' ||
    !accept.includes('application/json') ||
    !accept.includes('text/event-stream')
  ) {
    req.headers.accept = requiredAccept;
  }

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

function setupOAuthMetadata(app: express.Express, corsMw: express.RequestHandler): void {
  app.options('/.well-known/oauth-protected-resource', corsMw);
  app.get('/.well-known/oauth-protected-resource', (_req, res) => {
    const envCanonicalUri = process.env.MCP_CANONICAL_URI;
    const defaultCanonicalUri = 'http://localhost/mcp';
    res.json({
      resource: envCanonicalUri ?? defaultCanonicalUri,
      authorization_servers: process.env.BASE_URL ? [process.env.BASE_URL] : [],
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:invoke', 'mcp:read'],
    });
  });
}

async function setupLocalAuthorizationServer(
  app: express.Express,
  corsMw: express.RequestHandler,
): Promise<void> {
  if (process.env.ENABLE_LOCAL_AS !== 'true') return;

  let publicJwk: unknown;
  if (!process.env.LOCAL_AS_JWK) {
    const { publicKey } = await generateKeyPair('RS256');
    const jwk = await exportJWK(publicKey);
    jwk.alg = 'RS256';
    jwk.use = 'sig';
    process.env.LOCAL_AS_JWK = JSON.stringify(jwk);
    publicJwk = jwk;
  } else {
    publicJwk = parseLocalJwk(process.env.LOCAL_AS_JWK);
  }

  app.options('/.well-known/openid-configuration', corsMw);
  app.get('/.well-known/openid-configuration', (_req, res) => {
    const base = process.env.BASE_URL ?? 'http://localhost:3333';
    res.json({
      issuer: base,
      authorization_endpoint: `${base}/oauth/authorize`,
      token_endpoint: `${base}/oauth/token`,
      jwks_uri: `${base}/.well-known/jwks.json`,
      grant_types_supported: ['authorization_code'],
      response_types_supported: ['code'],
      token_endpoint_auth_methods_supported: ['none'],
    });
  });

  app.options('/.well-known/jwks.json', corsMw);
  app.get('/.well-known/jwks.json', (_req, res) => {
    const jwk = process.env.LOCAL_AS_JWK ? parseLocalJwk(process.env.LOCAL_AS_JWK) : publicJwk;
    res.json({ keys: jwk ? [jwk] : [] });
  });
}

function parseLocalJwk(value: string | undefined): unknown {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.warn('Error parsing local JWK:', err.message);
    } else {
      console.warn('Error parsing local JWK:', err);
    }
    console.warn('Returning undefined local JWK');
    return undefined;
  }
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

  console.log(`Streaming HTTP MCP listening on http://localhost:${String(port)}`);
}

// Default export for Vercel Express runtime
export default createApp();
