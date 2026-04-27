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

/**
 * Registers unauthenticated MCP routes (when DANGEROUSLY_DISABLE_AUTH=true).
 * Rate limiting is still applied — abuse is possible even without auth.
 *
 * Both `/mcp` registrations attach the injected `mcpRateLimiter` as the
 * first middleware. The limiter is constructed in
 * `rate-limiting/create-rate-limiters.ts` from the `MCP_RATE_LIMIT`
 * profile (120 req/min/IP) and reaches this function via DI per
 * ADR-078. CodeQL's `js/missing-rate-limiting` static analysis cannot
 * trace the limiter through the `RequestHandler`-typed parameter (it
 * looks structurally identical to any other middleware); dismissals of
 * its alerts on these registrations cite this attestation.
 *
 * @param mcpRateLimiter - Per-IP limiter; see create-rate-limiters.ts.
 */
function registerUnauthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
  observability: HttpObservability,
  mcpRateLimiter: RequestHandler,
): void {
  log.warn('⚠️  AUTH DISABLED - DANGEROUSLY_DISABLE_AUTH=true (DO NOT USE IN PRODUCTION)');
  log.debug('Registering POST /mcp route (auth disabled)');
  app.post('/mcp', mcpRateLimiter, createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (auth disabled)');
  app.get('/mcp', mcpRateLimiter, createMcpHandler(mcpFactory, observability, log));
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
 * Each registered route attaches the injected `metadataRateLimiter`
 * before its handler. The limiter is constructed in
 * `rate-limiting/create-rate-limiters.ts` from the
 * `METADATA_RATE_LIMIT` profile (60 req/min/IP, OAuth error shape) —
 * not the OAuth-flow `OAUTH_RATE_LIMIT` profile, because protocol
 * discovery and OAuth flow are semantically distinct traffic
 * categories. Closes CodeQL `js/missing-rate-limiting` alert #5.
 *
 * **Convention for new `/.well-known/*` routes**: any new metadata
 * route registered in this function MUST receive `metadataRateLimiter`
 * as its first middleware, otherwise CodeQL will (correctly) flag the
 * registration as missing rate limiting.
 *
 * @param upstreamMetadata - Upstream AS metadata, fetched from Clerk and
 *   injected by the caller. Endpoint URLs are rewritten per-request to
 *   point to this server's origin; capability fields are passed through.
 * @param metadataRateLimiter - Per-IP rate-limiter for OAuth metadata
 *   discovery routes. Constructed from `METADATA_RATE_LIMIT`; injected
 *   via the same DI chain as `oauthRateLimiter` (ADR-078).
 */
export function registerPublicOAuthMetadataEndpoints(
  app: Express,
  runtimeConfig: RuntimeConfig,
  upstreamMetadata: UpstreamAuthServerMetadata,
  log: Logger,
  allowedHosts: readonly string[],
  metadataRateLimiter: RequestHandler,
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

  app.get('/.well-known/oauth-protected-resource', metadataRateLimiter, servePrm);
  app.get('/.well-known/oauth-protected-resource/mcp', metadataRateLimiter, servePrm);

  app.get('/.well-known/oauth-authorization-server', metadataRateLimiter, (req, res) => {
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
    app.get('/.well-known/mcp-stub-mode', metadataRateLimiter, (_req, res) => {
      res.json({ stubMode: true });
    });
  }
}

/**
 * Registers /mcp routes with HTTP-level auth (HTTP 401 for unauthenticated).
 * Both `/mcp` registrations attach the injected `mcpRateLimiter` as the
 * first middleware (before `mcpRouter` and `createMcpHandler`). The
 * limiter is constructed in `rate-limiting/create-rate-limiters.ts`
 * from the `MCP_RATE_LIMIT` profile and reaches this function via DI
 * per ADR-078. Closes — at the source-of-truth level — the architectural
 * concern CodeQL alerts #70 (line 113) and #71 (line 115) raise: the
 * static analyser cannot trace the limiter through the
 * `RequestHandler`-typed parameter, but the wiring is in fact present
 * and tested via `rate-limiter-di.integration.test.ts`. Dismissals of
 * those alerts cite this attestation.
 *
 * @param mcpRateLimiter - Per-IP limiter; see create-rate-limiters.ts.
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 */
function registerAuthenticatedRoutes(
  app: Express,
  mcpFactory: McpServerFactory,
  log: Logger,
  allowedHosts: readonly string[],
  observability: HttpObservability,
  mcpRateLimiter: RequestHandler,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'mcp-auth' }) : log;
  const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(authLog, allowedHosts) });
  log.debug('Registering POST /mcp route (HTTP-level auth via mcpRouter)');
  app.post('/mcp', mcpRateLimiter, mcpRouter, createMcpHandler(mcpFactory, observability, log));
  log.debug('Registering GET /mcp route (HTTP-level auth via mcpRouter)');
  app.get('/mcp', mcpRateLimiter, mcpRouter, createMcpHandler(mcpFactory, observability, log));
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
  mcpRateLimiter: RequestHandler,
): void {
  const authLog = typeof log.child === 'function' ? log.child({ scope: 'auth' }) : log;

  if (runtimeConfig.dangerouslyDisableAuth) {
    measureAuthSetupStep(authLog, 'auth.disabled.register', () => {
      registerUnauthenticatedRoutes(app, mcpFactory, authLog, observability, mcpRateLimiter);
    });
    return;
  }

  // OAuth metadata endpoints are registered BEFORE clerkMiddleware (in Phase 2.5)
  // This function registers /mcp routes with HTTP-level auth enforcement
  // Auth middleware returns HTTP 401 per MCP spec and OpenAI Apps docs
  authLog.debug('Registering MCP routes (HTTP-level auth enforcement)');
  measureAuthSetupStep(authLog, 'mcp.routes.register', () => {
    registerAuthenticatedRoutes(
      app,
      mcpFactory,
      authLog,
      allowedHosts,
      observability,
      mcpRateLimiter,
    );
  });
}
