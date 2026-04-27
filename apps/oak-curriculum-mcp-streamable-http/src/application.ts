import type { RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import type { UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import listRoutes from 'express-list-routes';
import type { ToolHandlerOverrides } from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';
import { setupAuthRoutes } from './auth-routes.js';
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
import {
  setupErrorHandlers,
  type SentryExpressErrorHandlerSetup,
} from './app/bootstrap-error-handlers.js';
import { createAppVersionHeaders } from './app/app-version-header.js';
import { setupSecurityMiddleware } from './app/bootstrap-security.js';
import { mountStaticContentRoutes } from './app/static-content.js';
import type { HttpObservability } from './observability/http-observability.js';
import { createRateLimiters } from './rate-limiting/create-rate-limiters.js';
import type { RateLimiterFactory } from './rate-limiting/index.js';
import { initializeCoreEndpoints } from './app/core-endpoints.js';
import { runOAuthAndAuthContextPhases } from './app/orchestration.js';
import { registerDiagnosticRoutesIfEnabled } from './test-error/register-diagnostic-routes.js';
export type { McpRequestContext, McpServerFactory } from './mcp-request-context.js';
export { loadRuntimeConfig } from './runtime-config.js';
export interface CreateAppOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly logger?: Logger;
  readonly resourceUrl?: string;
  /** Returns built widget HTML for the MCP App resource. Prod: codegen constant; tests: trivial fake. (ADR-078) */
  readonly getWidgetHtml: () => string;
  /** Upstream AS metadata for OAuth proxy; provided by tests, fetched at startup in prod. */
  readonly upstreamMetadata?: UpstreamAuthServerMetadata;
  /** Factory for global Clerk middleware (tests inject no-op; prod omits). (ADR-078) */
  readonly clerkMiddlewareFactory?: () => RequestHandler;
  /** Factory for per-IP rate-limit middleware (tests inject fake; prod omits). (ADR-078, ADR-158) */
  readonly rateLimiterFactory?: RateLimiterFactory;
  /** Sentry Express error-handler registration; live mode only, not fixture/off. (ADR-078) */
  readonly setupSentryErrorHandler?: SentryExpressErrorHandlerSetup;
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

function mountAppVersionHeader(app: ExpressWithAppId, appVersion: string): void {
  app.use((_req, res, next) => {
    res.set(createAppVersionHeaders(appVersion));
    next();
  });
}

interface SetupPostAuthPhasesDeps {
  readonly app: ExpressWithAppId;
  readonly options: CreateAppOptions;
  readonly log: Logger;
  readonly bootstrapTimer: PhasedTimer;
  readonly appId: number;
  readonly allowedHosts: readonly string[];
  readonly dnsRebindingMiddleware: RequestHandler;
  readonly mcpRateLimiter: RequestHandler;
  readonly assetRateLimiter: RequestHandler;
}

function setupPostAuthPhases(deps: SetupPostAuthPhasesDeps): void {
  const { app, options, log, bootstrapTimer, appId, allowedHosts } = deps;
  const { dnsRebindingMiddleware, mcpRateLimiter, assetRateLimiter } = deps;

  const { mcpFactory, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, options, log, assetRateLimiter),
    options.observability,
  );

  mountAppVersionHeader(app, options.runtimeConfig.version);
  mountStaticContentRoutes(
    app,
    dnsRebindingMiddleware,
    log,
    options.runtimeConfig.displayHostname,
    options.runtimeConfig.version,
  );
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

function logBootstrapSummary(
  app: ExpressWithAppId,
  log: Logger,
  appId: number,
  bootstrapTimer: PhasedTimer,
): void {
  const routes = listRoutes(app);
  logBootstrapComplete(log, appId, bootstrapTimer, routes.length);
  logRegisteredRoutes(log, appId, routes);
}

/** Creates an Express MCP-over-HTTP app. See ADR-143 / ADR-160 for middleware order. */
// observability-emission-exempt: orchestration wrapper; emissions live in nested helpers.
export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const log =
    options.logger ?? options.observability.createLogger({ name: 'streamable-http:app-instance' });
  const { app, timer: bootstrapTimer, appId } = initializeAppInstance(appCounter, log);
  appCounter = appId;

  const { mcpRateLimiter, oauthRateLimiter, metadataRateLimiter, assetRateLimiter } =
    createRateLimiters(options.rateLimiterFactory);

  const { dnsRebindingMiddleware, allowedHosts } = setupPreAuthPhases(
    app,
    options,
    log,
    bootstrapTimer,
    appId,
  );

  await runOAuthAndAuthContextPhases({
    app,
    runtimeConfig: options.runtimeConfig,
    observability: options.observability,
    clerkMiddlewareFactory: options.clerkMiddlewareFactory,
    upstreamMetadata: options.upstreamMetadata,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    oauthRateLimiter,
    metadataRateLimiter,
  });

  setupPostAuthPhases({
    app,
    options,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    dnsRebindingMiddleware,
    mcpRateLimiter,
    assetRateLimiter,
  });

  registerDiagnosticRoutesIfEnabled({
    app,
    env: options.runtimeConfig.env,
    oauthRateLimiter,
    observability: options.observability,
    log,
  });

  // Error handlers registered AFTER all routes (Sentry docs).
  setupErrorHandlers(app, log, options.observability, options.setupSentryErrorHandler);

  logBootstrapSummary(app, log, appId, bootstrapTimer);
  return app;
}
