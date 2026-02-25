import type { Express, RequestHandler } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { SCOPES_SUPPORTED } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { Logger } from '@oaknational/logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import { createMcpRouter } from './mcp-router.js';
import { createMcpAuthClerk } from './auth/mcp-auth/index.js';
import type { RuntimeConfig } from './runtime-config.js';
import { createConditionalClerkMiddleware } from './conditional-clerk-middleware.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { rewriteAuthServerMetadata, type UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import { extractHostname } from './security.js';
import { isAllowedHostname, isValidHostHeader } from './host-header-validation.js';

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(mcpFactory, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(mcpFactory, log));
}

/**
 * Returns true if the host string represents a loopback address.
 * Handles `localhost`, `127.0.0.1`, and IPv6 `[::1]` with optional port.
 */
function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.toLowerCase();
  if (normalizedHost.startsWith('[')) {
    return normalizedHost.startsWith('[::1]');
  }
  const colonIdx = normalizedHost.indexOf(':');
  const hostname = colonIdx >= 0 ? normalizedHost.substring(0, colonIdx) : normalizedHost;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Derives the self-origin from a request's Host header after validating
 * it against the allowed hosts list.
 *
 * Uses `http` for loopback addresses, `https` for everything else.
 *
 * @throws Error if the host header is missing or not in the allowed list
 */
export function deriveSelfOrigin(
  req: { get(name: string): string | undefined },
  allowedHosts: readonly string[],
): string {
  const host = req.get('host');
  if (!host) {
    throw new Error('Cannot generate OAuth metadata: missing host header');
  }
  if (!isValidHostHeader(host)) {
    throw new Error(`Rejected Host header '${host}': invalid host header format`);
  }
  const hostname = extractHostname(host).toLowerCase();
  if (!hostname || !isAllowedHostname(hostname, allowedHosts)) {
    throw new Error(`Rejected Host header '${hostname}': not in allowed hosts list`);
  }
  const protocol = isLoopbackHost(host) ? 'http' : 'https';
  return `${protocol}://${host}`;
}

/**
 * Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware.
 * Publicly accessible without authentication per RFC 9728.
 *
 * PRM is served at both the unqualified path (`/.well-known/oauth-protected-resource`)
 * for backwards compatibility and the path-qualified path
 * (`/.well-known/oauth-protected-resource/mcp`) per RFC 9728 Section 3.1.
 * Both serve identical responses.
 *
 * @param upstreamMetadata - Upstream AS metadata, fetched from Clerk and
 *   injected by the caller. Endpoint URLs are rewritten per-request to
 *   point to this server's origin; capability fields are passed through.
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  upstreamMetadata: UpstreamAuthServerMetadata,
  log: Logger,
  allowedHosts: readonly string[],
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;
  authLog.debug('Registering PUBLIC OAuth metadata endpoints (before auth middleware)');

  const servePrm: RequestHandler = (req, res) => {
    try {
      const selfOrigin = deriveSelfOrigin(req, allowedHosts);
      res.json({
        resource: `${selfOrigin}/mcp`,
        authorization_servers: [selfOrigin],
        scopes_supported: SCOPES_SUPPORTED,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      authLog.warn('Host validation failed for OAuth metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
    }
  };

  app.get('/.well-known/oauth-protected-resource', servePrm);
  app.get('/.well-known/oauth-protected-resource/mcp', servePrm);

  app.get('/.well-known/oauth-authorization-server', (req, res) => {
    try {
      const selfOrigin = deriveSelfOrigin(req, allowedHosts);
      res.json(rewriteAuthServerMetadata(upstreamMetadata, selfOrigin));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      authLog.warn('Host validation failed for OAuth AS metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
    }
  });

  if (runtimeConfig.useStubTools) {
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers /mcp routes with HTTP-level auth (HTTP 401 for unauthenticated).
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 */
function registerAuthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
  allowedHosts: readonly string[],
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(authLog, allowedHosts) });
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRouter, createMcpHandler(mcpFactory, log));
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRouter, createMcpHandler(mcpFactory, log));
}

/**
 * Installs global Clerk middleware early in the chain. MUST be called before
 * path-specific middleware. Actual auth enforcement happens via createMcpAuthClerk.
 */
export function setupGlobalAuthContext(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  authLog.debug(
    `Auth decision: DANGEROUSLY_DISABLE_AUTH=${String(runtimeConfig.dangerouslyDisableAuth)}`,
  );

  if (runtimeConfig.dangerouslyDisableAuth) {
    authLog.warn('⚠️  AUTH DISABLED - clerkMiddleware will not be installed');
    return;
  }

  authLog.info('🔒 OAuth enforcement enabled via Clerk');
  authLog.debug('Creating and installing global clerkMiddleware');
  const rawClerkMiddleware = measureAuthSetupStep(authLog, 'clerkMiddleware.create', () =>
    clerkMiddleware({
      // Avoid hidden coupling to process.env so apps/tests can inject RuntimeConfig deterministically.
      // Clerk options are still the source-of-truth for request authentication behaviour.
      publishableKey: runtimeConfig.env.CLERK_PUBLISHABLE_KEY,
      secretKey: runtimeConfig.env.CLERK_SECRET_KEY,
    }),
  );
  const instrumentedClerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);

  // Wrap with conditional middleware to skip Clerk for non-MCP paths
  // (/.well-known/*, /healthz) and public resource reads
  const conditionalClerkMw = measureAuthSetupStep(
    authLog,
    'conditionalClerkMiddleware.create',
    () => createConditionalClerkMiddleware(instrumentedClerkMw, authLog),
  );

  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // Apply conditional clerkMiddleware globally to all routes.
    // Non-MCP paths (/.well-known/*, /healthz) and public resource
    // reads skip Clerk. All MCP methods get full Clerk auth context.
    // Actual enforcement happens via createMcpAuthClerk on /mcp routes.
    authLog.info('Installing conditional Clerk middleware globally (all routes)');
    app.use(conditionalClerkMw);
  });
}

/**
 * Registers /mcp routes -- protected (auth enabled) or unprotected (bypass mode).
 * Called AFTER OAuth metadata endpoints and clerkMiddleware are installed.
 */
export function setupAuthRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  allowedHosts: readonly string[],
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, mcpFactory, authLog);
    });
    return;
  }

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes(app, mcpFactory, authLog, allowedHosts);
  });
}
