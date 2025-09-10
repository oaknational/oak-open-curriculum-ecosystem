import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { readEnv, parseCsv } from './env.js';
import { exportJWK, generateKeyPair } from 'jose';
import { bearerAuth } from './auth.js';
import { dnsRebindingProtection, createCorsMiddleware } from './security.js';
import { registerHandlers, createMcpHandler } from './handlers.js';

export function createApp(): express.Express {
  const app = express();
  // eslint-disable-next-line import-x/no-named-as-default-member -- allow since we already import the default express (no treeshaking advantage)
  app.use(express.json({ limit: '1mb' }));

  const { mode, allowedHosts, allowedOrigins } = readSecurityEnv();
  const corsMw = applySecurity(app, mode, allowedHosts, allowedOrigins);

  const { transport, ready, server } = initializeServer();
  registerHandlers(server);
  app.use(async (_req, _res, next) => {
    await ready;
    next();
  });

  setupOAuthMetadata(app, corsMw);
  setupLocalAuthorizationServer(app, corsMw).catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Error setting up local authorization server:', err.message);
    } else {
      console.error('Error setting up local authorization server:', err);
    }
  });
  app.use(bearerAuth);
  app.post('/mcp', createMcpHandler(transport));

  return app;
}

function readSecurityEnv(): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const env = readEnv();
  const mode = (env.REMOTE_MCP_MODE ?? 'stateless') === 'session' ? 'session' : 'stateless';
  const allowedHosts = parseCsv(env.ALLOWED_HOSTS) ?? ['localhost', '127.0.0.1', '::1'];
  const allowedOrigins = parseCsv(env.ALLOWED_ORIGINS);
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
    { name: 'oak-curriculum-mcp-streamable-http', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const ready = server.connect(transport);
  return { server, transport, ready };
}

function setupOAuthMetadata(app: express.Express, corsMw: express.RequestHandler): void {
  app.options('/.well-known/oauth-protected-resource', corsMw);
  app.get('/.well-known/oauth-protected-resource', (_req, res) => {
    const env = readEnv();
    const envCanonicalUri = env.MCP_CANONICAL_URI;
    const defaultCanonicalUri = 'http://localhost/mcp';
    res.json({
      resource: envCanonicalUri ?? defaultCanonicalUri,
      authorization_servers: env.BASE_URL ? [env.BASE_URL] : [],
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:invoke', 'mcp:read'],
    });
  });
}

async function setupLocalAuthorizationServer(
  app: express.Express,
  corsMw: express.RequestHandler,
): Promise<void> {
  const env = readEnv();
  if (env.ENABLE_LOCAL_AS !== 'true') return;

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
    const base = env.BASE_URL ?? 'http://localhost:3333';
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
