import type { Express } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { clerkMiddleware } from '@clerk/express';
import { generateClerkProtectedResourceMetadata } from '@clerk/mcp-tools/server';
import { SCOPES_SUPPORTED } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-logger';
import { measureAuthSetupStep } from './auth-instrumentation.js';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';

import { createMcpHandler } from './handlers.js';
import { createMcpRouter } from './mcp-router.js';
import { createMcpAuthClerk } from './auth/mcp-auth/index.js';
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
 * Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware.
 *
 * These endpoints MUST be publicly accessible without authentication per RFC 9470.
 * They are registered BEFORE clerkMiddleware to avoid any authentication checks.
 *
 * Standard HTTP caching applies (no evidence that preventing caching helps).
 * RFC 9728 has no requirements regarding cache headers.
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  authLog.debug('Registering PUBLIC OAuth metadata endpoints (before auth middleware)');

  // Custom handler that sets resource field to canonical MCP server URI per MCP spec
  app.get('/.well-known/oauth-protected-resource', (req, res) => {
    const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('CLERK_PUBLISHABLE_KEY environment variable is required');
    }

    const host = req.get('host');
    if (!host) {
      throw new Error('Cannot generate OAuth metadata: missing host header');
    }

    // Per MCP Authorization Spec: resource field must be the canonical URI of the MCP server
    // Examples: https://mcp.example.com/mcp, http://localhost:3333/mcp
    // Use http for localhost development, https for all other hosts
    const protocol = host.startsWith('localhost:') || host === 'localhost' ? 'http' : 'https';
    const resourceUrl = `${protocol}://${host}/mcp`;

    // Scopes flow from mcp-security-policy.ts → type-gen → SCOPES_SUPPORTED constant
    const metadata = generateClerkProtectedResourceMetadata({
      publishableKey,
      resourceUrl,
      properties: {
        scopes_supported: [...SCOPES_SUPPORTED],
      },
    });

    res.json(metadata);
  });

  if (runtimeConfig.useStubTools) {
    // In stub mode we expose additional metadata for tooling to detect bypass scenarios
    app.get('/.well-known/mcp-stub-mode', (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers MCP routes with HTTP-level auth middleware.
 *
 * Per MCP spec and OpenAI Apps docs, authentication is enforced at HTTP level:
 * - Discovery methods (initialize, tools/list): Skip auth, return HTTP 200
 * - Protected tools without token: Return HTTP 401 + WWW-Authenticate
 * - Protected tools with valid token: Proceed to tool handler
 * - Public tools (noauth): Skip auth, proceed to tool handler
 *
 * The method-aware router routes based on MCP method and tool security metadata.
 * Auth middleware returns HTTP 401 BEFORE the request reaches the MCP SDK.
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
 * @see https://platform.openai.com/docs/guides/apps-authentication
 */
function registerAuthenticatedRoutes(
  app: Express,
  coreTransport: StreamableHTTPServerTransport,
  log: Logger,
): void {
  // Create method-aware router with HTTP-level auth
  // This router checks method/tool and conditionally applies auth middleware
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(authLog) });

  // POST /mcp - main MCP endpoint
  // Router runs BEFORE SDK handler to enable HTTP 401 responses
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRouter, createMcpHandler(coreTransport, log));

  // GET /mcp - for SSE connections and initial requests
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRouter, createMcpHandler(coreTransport, log));
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
 * - Actual enforcement happens later via createMcpAuthClerk on specific routes
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
    // Selective protection is then applied via createMcpAuthClerk on /mcp routes.
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
 * - Protected /mcp routes with createMcpAuthClerk enforcement (if auth enabled)
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

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes(app, coreTransport, authLog);
  });
}
