import type { RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import type { UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import listRoutes from 'express-list-routes';

import type { ToolHandlerOverrides } from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';
import { setupGlobalAuthContext, setupAuthRoutes } from './auth-routes.js';
import { createEnsureMcpAcceptHeader } from './mcp-middleware.js';
import {
  runBootstrapPhase,
  setupBaseMiddleware,
  createMcpReadinessMiddleware,
  logBootstrapComplete,
  logRegisteredRoutes,
  initializeAppInstance,
  type ExpressWithAppId,
} from './app/bootstrap-helpers.js';
import { setupSecurityMiddleware } from './app/bootstrap-security.js';
import { setupOAuthAndCaching } from './app/oauth-and-caching-setup.js';
import { mountStaticContentRoutes } from './app/static-content.js';
import { initializeCoreEndpoints } from './app/core-endpoints.js';
import type { HttpObservability } from './observability/http-observability.js';

import {
  type RateLimiterFactory,
  createDefaultRateLimiterFactory,
  MCP_RATE_LIMIT,
  OAUTH_RATE_LIMIT,
  ASSET_RATE_LIMIT,
} from './rate-limiting/index.js';

export type { McpRequestContext, McpServerFactory } from './mcp-request-context.js';

export interface CreateAppOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly logger?: Logger;
  readonly resourceUrl?: string;
  /**
   * Upstream AS metadata for the OAuth proxy. When provided, `createApp`
   * skips the network fetch to Clerk's `/.well-known/oauth-authorization-server`
   * and uses this value directly. Required for tests; production callers
   * omit this so the metadata is fetched at startup.
   */
  readonly upstreamMetadata?: UpstreamAuthServerMetadata;
  /**
   * Factory for creating the global Clerk authentication middleware.
   * When provided, replaces the hard import of `clerkMiddleware` from
   * `@clerk/express`, enabling tests to inject a no-op middleware
   * without `vi.mock`. Production callers omit this.
   *
   * @see ADR-078 for the dependency injection rationale
   */
  readonly clerkMiddlewareFactory?: () => RequestHandler;
  /**
   * Factory for creating per-IP rate limiting middleware. When provided,
   * replaces the default `express-rate-limit` factory, enabling tests to
   * inject a no-op or recording fake. Production callers omit this.
   *
   * @see ADR-078 for the dependency injection rationale
   * @see ADR-144 for the multi-layer security architecture
   */
  readonly rateLimiterFactory?: RateLimiterFactory;
}

let appCounter = 0;

function setupPreAuthPhases(
  app: ExpressWithAppId,
  options: CreateAppOptions,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appId: number,
): { dnsRebindingMiddleware: RequestHandler; allowedHosts: readonly string[] } {
  runBootstrapPhase(
    log,
    bootstrapTimer,
    'setupBaseMiddleware',
    appId,
    () => {
      setupBaseMiddleware(app, log, options.observability);
    },
    options.observability,
  );

  return setupSecurityMiddleware(
    app,
    options.runtimeConfig,
    log,
    bootstrapTimer,
    appId,
    options.observability,
  );
}

/** Creates rate limiter middleware instances for all three route profiles. */
function createRateLimiters(options: CreateAppOptions): {
  mcpRateLimiter: RequestHandler;
  oauthRateLimiter: RequestHandler;
  assetRateLimiter: RequestHandler;
} {
  const factory = options.rateLimiterFactory ?? createDefaultRateLimiterFactory();
  return {
    mcpRateLimiter: factory(MCP_RATE_LIMIT),
    oauthRateLimiter: factory(OAUTH_RATE_LIMIT),
    assetRateLimiter: factory(ASSET_RATE_LIMIT),
  };
}

function setupPostAuthPhases(
  app: ExpressWithAppId,
  options: CreateAppOptions,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appId: number,
  allowedHosts: readonly string[],
  dnsRebindingMiddleware: RequestHandler,
  mcpRateLimiter: RequestHandler,
  assetRateLimiter: RequestHandler,
): void {
  const { mcpFactory, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, options, log, assetRateLimiter),
    options.observability,
  );

  mountStaticContentRoutes(app, dnsRebindingMiddleware, log, options.runtimeConfig.displayHostname);
  app.use('/mcp', createEnsureMcpAcceptHeader(log), createMcpReadinessMiddleware(ready, log));

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'setupAuthRoutes',
    appId,
    () => {
      setupAuthRoutes(
        app,
        mcpFactory,
        options.runtimeConfig,
        log,
        allowedHosts,
        options.observability,
        mcpRateLimiter,
      );
    },
    options.observability,
  );
}

/**
 * Creates and configures an Express application instance for MCP over HTTP.
 * Middleware order: base → security → OAuth metadata → auth context → core → static → /mcp → auth routes.
 */
export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const log =
    options.logger ?? options.observability.createLogger({ name: 'streamable-http:app-instance' });
  const { app, timer: bootstrapTimer, appId } = initializeAppInstance(appCounter, log);
  appCounter = appId;

  const { mcpRateLimiter, oauthRateLimiter, assetRateLimiter } = createRateLimiters(options);
  const { dnsRebindingMiddleware, allowedHosts } = setupPreAuthPhases(
    app,
    options,
    log,
    bootstrapTimer,
    appId,
  );

  await setupOAuthAndCaching(
    app,
    options.runtimeConfig,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    options.observability,
    options.upstreamMetadata,
    oauthRateLimiter,
  );

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'setupGlobalAuthContext',
    appId,
    () => {
      setupGlobalAuthContext(app, options.runtimeConfig, log, options.clerkMiddlewareFactory);
    },
    options.observability,
  );

  setupPostAuthPhases(
    app,
    options,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    dnsRebindingMiddleware,
    mcpRateLimiter,
    assetRateLimiter,
  );

  const routes = listRoutes(app);
  logBootstrapComplete(log, appId, bootstrapTimer, routes.length);
  logRegisteredRoutes(log, appId, routes);

  return app;
}
