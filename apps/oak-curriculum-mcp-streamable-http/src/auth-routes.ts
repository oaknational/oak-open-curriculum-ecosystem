import type { Express, RequestHandler } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import {
  mcpAuthClerk,
  protectedResourceHandlerClerk,
  authServerMetadataHandlerClerk,
} from '@clerk/mcp-tools/express';
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
 * Registers OAuth 2.0 metadata endpoints required by MCP spec
 *
 * WORKAROUND: Serves metadata at both /.well-known/oauth-protected-resource
 * and /.well-known/oauth-protected-resource/mcp due to Clerk bug.
 *
 * Bug in @clerk/mcp-tools@0.3.1:
 * The getPRMUrl() function incorrectly appends req.originalUrl to the metadata path:
 * - Request to /mcp generates: /.well-known/oauth-protected-resource/mcp (404)
 * - Should generate: /.well-known/oauth-protected-resource (200)
 *
 * This workaround serves the OAuth metadata at both locations so clients can
 * fetch metadata regardless of which URL they receive in the WWW-Authenticate header.
 *
 * Bug location: @clerk/mcp-tools@0.3.1/dist/express/index.js getPRMUrl()
 * RFC 9470: https://www.rfc-editor.org/rfc/rfc9470.html#section-3
 *
 * TODO: Remove /mcp route when Clerk fixes upstream bug
 *
 * NOTE: All OAuth metadata endpoints explicitly set no-cache headers to prevent
 * caching at origin, CDN, client, or any intermediate layer.
 */
function registerOAuthMetadataEndpoints(app: Express, runtimeConfig: RuntimeConfig): void {
  const metadataHandler = addNoCacheHeaders(
    protectedResourceHandlerClerk({
      scopes_supported: ['mcp:invoke', 'mcp:read'],
    }),
  );

  // Correct OAuth metadata location per RFC 9470
  app.get('/.well-known/oauth-protected-resource', metadataHandler);

  // HACK: Also serve at /mcp suffix due to something insisting on calling this route
  // This allows clients to fetch metadata from the broken URL the _something_ is caching
  app.get('/.well-known/oauth-protected-resource/mcp', metadataHandler);

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
 * Registers authentication-related routes and endpoint protection.
 *
 * This function is called AFTER core MCP endpoints are initialized because
 * it needs the transport instance to create MCP handlers.
 *
 * Registers:
 * - OAuth 2.0 metadata endpoints (/.well-known/*)
 * - Protected /mcp routes with mcpAuthClerk enforcement (if auth enabled)
 * - Unprotected /mcp routes (if DANGEROUSLY_DISABLE_AUTH is true)
 *
 * @param app - Express application instance
 * @param coreTransport - MCP StreamableHTTP transport for request handling
 * @param runtimeConfig - Runtime configuration including auth settings
 * @param log - Logger instance for auth-related events
 *
 * @see {@link setupGlobalAuthContext} for global auth middleware (called earlier)
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

  // Register OAuth metadata endpoints (publicly accessible)
  authLog.debug('Registering OAuth metadata endpoints');
  measureAuthSetupStep(authLog, 'oauth.metadata.register', () => {
    registerOAuthMetadataEndpoints(app, runtimeConfig);
  });

  // Register protected MCP routes with OAuth enforcement
  authLog.debug('Registering protected MCP routes');
  const mcpAuthMw = instrumentMiddleware('mcpAuthClerk', mcpAuthClerk, authLog);
  measureAuthSetupStep(authLog, 'mcp.auth.register', () => {
    registerAuthenticatedRoutes(app, coreTransport, authLog, mcpAuthMw);
  });
}
