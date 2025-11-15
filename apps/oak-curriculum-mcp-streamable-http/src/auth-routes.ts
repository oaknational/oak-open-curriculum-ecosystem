import type { Express, RequestHandler } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
import { mcpAuthClerk } from './auth/mcp-auth/index.js';
import type { Logger } from '@oaknational/mcp-logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(coreTransport, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(coreTransport, log));
}

/**
 * Middleware that adds explicit no-cache headers to prevent caching at any level.
 *
 * These headers ensure that OAuth metadata is never cached by:
 * - Origin servers
 * - CDN/proxy layers
 * - Client browsers
 * - Any intermediate caches
 *
 * This is critical for OAuth metadata endpoints to ensure clients always receive
 * current authentication configuration.
 */
function addNoCacheHeaders(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    // Prevent caching at all levels (origin, CDN, browser, proxies)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache'); // HTTP/1.0 compatibility
    res.setHeader('Expires', '0'); // Legacy clients

    handler(req, res, next);
  };
}

/**
 * Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware.
 *
 * These endpoints MUST be publicly accessible without authentication per RFC 9470.
 * They are registered BEFORE clerkMiddleware to avoid any authentication checks.
 *
 * NOTE: All OAuth metadata endpoints explicitly set no-cache headers to prevent
 * caching at origin, CDN, client, or any intermediate layer (including Vercel).
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  authLog.debug('Registering PUBLIC OAuth metadata endpoints (before auth middleware)');

  const metadataHandler = addNoCacheHeaders(
    protectedResourceHandlerClerk({
      scopes_supported: ['mcp:invoke', 'mcp:read'],
    }),
  );

  // RFC 9470 compliant OAuth Protected Resource Metadata endpoint
  app.get('/.well-known/oauth-protected-resource', metadataHandler);

  // RFC 8414 OAuth Authorization Server Metadata endpoint
  app.get(
    '/.well-known/oauth-authorization-server',
    addNoCacheHeaders(authServerMetadataHandlerClerk),
  );

  if (runtimeConfig.useStubTools) {
    // In stub mode we expose additional metadata for tooling to detect bypass scenarios
    app.get(
      '/.well-known/mcp-stub-mode',
      addNoCacheHeaders((_req, res) => {
        res.json({ stubMode: true });
      }),
    );
  }
}

/**
 * Registers authenticated MCP routes with Clerk OAuth protection
 */
function registerAuthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
  authMiddleware: RequestHandler,
): void {
  log.debug('Registering POST /mcp route (auth ENABLED with mcpAuthClerk)');
  app.post('/mcp', authMiddleware, createMcpHandler(coreTransport, log));
  log.debug('Registering GET /mcp route (auth ENABLED with mcpAuthClerk)');
  app.get('/mcp', authMiddleware, createMcpHandler(coreTransport, log));
}

/**
 * Sets up global authentication context early in the middleware chain.
 *
 * This function MUST be called before path-specific middleware to ensure
 * Clerk's authentication context is available throughout the request lifecycle.
 *
 * Per Clerk best practices:
 * - clerkMiddleware() is applied globally to all routes
 * - It provides auth context without blocking any requests
 * - Actual enforcement happens later via mcpAuthClerk on specific routes
 *
 * @param app - Express application instance
 * @param runtimeConfig - Runtime configuration including auth settings
 * @param log - Logger instance for auth-related events
 *
 * @see {@link setupAuthRoutes} for route registration (called after core initialization)
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
    clerkMiddleware(),
  );
  const clerkMw = instrumentMiddleware('clerkMiddleware', rawClerkMiddleware, authLog);
  measureAuthSetupStep(authLog, 'clerkMiddleware.install', () => {
    // Apply clerkMiddleware() globally to all routes per Clerk best practices.
    // This provides authentication context without blocking access.
    // Selective protection is then applied via mcpAuthClerk on /mcp routes.
    // OAuth metadata endpoints (/.well-known/*) remain publicly accessible.
    authLog.info('Installing Clerk middleware globally (all routes)');
    app.use(clerkMw);
  });
}

/**
 * Registers PROTECTED MCP routes with authentication.
 *
 * This function is called AFTER OAuth metadata endpoints are registered (in Phase 2.5)
 * and AFTER clerkMiddleware is installed (in Phase 3).
 *
 * Registers:
 * - Protected /mcp routes with mcpAuthClerk enforcement (if auth enabled)
 * - Unprotected /mcp routes (if DANGEROUSLY_DISABLE_AUTH is true)
 *
 * NOTE: OAuth metadata endpoints are registered separately in Phase 2.5 by
 * registerPublicOAuthMetadataEndpoints() to ensure they are publicly accessible.
 *
 * @param app - Express application instance
 * @param coreTransport - MCP StreamableHTTP transport for request handling
 * @param runtimeConfig - Runtime configuration including auth settings
 * @param log - Logger instance for auth-related events
 *
 * @see {@link setupGlobalAuthContext} for global auth middleware (called earlier)
 * @see {@link registerPublicOAuthMetadataEndpoints} for OAuth metadata endpoints (called before auth middleware)
 */
export function setupAuthRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, coreTransport, authLog);
    });
    return;
  }

  // OAuth metadata endpoints are now registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function ONLY registers the protected /mcp routes
  authLog.debug('Registering protected MCP routes (with auth enforcement)');
  const mcpAuthMw = instrumentMiddleware('mcpAuthClerk', mcpAuthClerk, authLog);
  measureAuthSetupStep(authLog, 'mcp.auth.register', () => {
    registerAuthenticatedRoutes(app, coreTransport, authLog, mcpAuthMw);
  });
}
