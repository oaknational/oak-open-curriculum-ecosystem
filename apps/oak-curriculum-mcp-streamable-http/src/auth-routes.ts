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
import type { HttpObservability } from './observability/http-observability.js';
import { deriveSelfOrigin, hostValidationErrorMessage } from './host-validation-error.js';

export { deriveSelfOrigin };

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true)
 */
function registerUnauthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
  observability: HttpObservability,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', createMcpHandler(mcpFactory, observability, log));
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
    const originResult = deriveSelfOrigin(req, allowedHosts);
    if (!originResult.ok) {
      const msg = hostValidationErrorMessage(originResult.error);
      authLog.warn('Host validation failed for OAuth metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
      return;
    }
    const selfOrigin = originResult.value;
    res.json({
      resource: `${selfOrigin}/mcp`,
      authorization_servers: [selfOrigin],
      scopes_supported: SCOPES_SUPPORTED,
    });
  };

  app.get('/.well-known/oauth-protected-resource', servePrm);
  app.get('/.well-known/oauth-protected-resource/mcp', servePrm);

  app.get('/.well-known/oauth-authorization-server', (req, res) => {
    const originResult = deriveSelfOrigin(req, allowedHosts);
    if (!originResult.ok) {
      const msg = hostValidationErrorMessage(originResult.error);
      authLog.warn('Host validation failed for OAuth AS metadata', { error: msg });
      res.status(403).json({ error: 'forbidden', error_description: msg });
      return;
    }
    res.json(rewriteAuthServerMetadata(upstreamMetadata, originResult.value));
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
  observability: HttpObservability,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(authLog, allowedHosts) });
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRouter, createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRouter, createMcpHandler(mcpFactory, observability, log));
}

/**
 * Installs global Clerk middleware early in the chain. MUST be called before
 * path-specific middleware. Actual auth enforcement happens via createMcpAuthClerk.
 *
 * @param clerkMiddlewareFactory - Optional factory for creating the Clerk middleware.
 *   When provided (tests), replaces the hard import from `@clerk/express`.
 *   When absent (production), uses the real `clerkMiddleware` with runtime config keys.
 * @see ADR-078 for the dependency injection rationale
 */
export function setupGlobalAuthContext(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  clerkMiddlewareFactory?: () => RequestHandler,
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
    clerkMiddlewareFactory
      ? clerkMiddlewareFactory()
      : clerkMiddleware({
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
  observability: HttpObservability,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, mcpFactory, authLog, observability);
    });
    return;
  }

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes(app, mcpFactory, authLog, allowedHosts, observability);
  });
}
