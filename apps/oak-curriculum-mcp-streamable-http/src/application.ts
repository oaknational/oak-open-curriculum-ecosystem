import type { Express, RequestHandler } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import type { UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import listRoutes from 'express-list-routes';

import { registerHandlers, type ToolHandlerOverrides } from './handlers.js';
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { mountAssetDownloadProxy } from './asset-download/asset-download-route.js';
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
import { addHealthEndpoints } from './app/health-endpoints.js';
import { setupOAuthAndCaching } from './app/oauth-and-caching-setup.js';
import { mountStaticContentRoutes } from './app/static-content.js';
import { createSearchRetrieval } from './search-retrieval-factory.js';
import type { HttpObservability } from './observability/http-observability.js';
import { validateWidgetHtmlExists } from './validate-widget-html.js';
import { WIDGET_HTML_PATH } from './register-resources.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { OAK_SERVER_BRANDING } from './server-branding.js';
export type { McpRequestContext, McpServerFactory } from './mcp-request-context.js';
export { loadRuntimeConfig } from './runtime-config.js';

export interface CreateAppOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly logger?: Logger;
  readonly resourceUrl?: string;
  /**
   * Validates the built widget HTML path before core endpoints are initialised.
   * Production callers omit this so the real startup validation runs; in-process
   * tests inject a no-op validator so they do not depend on build artefacts.
   */
  readonly validateWidgetHtml?: (widgetHtmlPath: string) => void;
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

function setupPostAuthPhases(
  app: ExpressWithAppId,
  options: CreateAppOptions,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appId: number,
  allowedHosts: readonly string[],
  dnsRebindingMiddleware: RequestHandler,
): void {
  const { mcpFactory, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, options, options.runtimeConfig, log, options.observability),
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
  );

  const routes = listRoutes(app);
  logBootstrapComplete(log, appId, bootstrapTimer, routes.length);
  logRegisteredRoutes(log, appId, routes);

  return app;
}

/** Initialises core MCP endpoints, returns a per-request factory. @see ADR-112 */
function initializeCoreEndpoints(
  app: Express,
  options: CreateAppOptions,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  observability: HttpObservability,
): { mcpFactory: McpServerFactory; ready: Promise<void> } {
  (options.validateWidgetHtml ?? validateWidgetHtmlExists)(WIDGET_HTML_PATH);

  const searchRetrieval = runtimeConfig.useStubTools
    ? createStubSearchRetrieval()
    : createSearchRetrieval(runtimeConfig.env, log);
  const resourceUrl = options?.resourceUrl ?? 'http://localhost:3333/mcp';
  const assetBaseUrl = runtimeConfig.displayHostname
    ? `https://${runtimeConfig.displayHostname}`
    : new URL(resourceUrl).origin;
  const createAssetDownloadUrl = mountAssetDownloadProxy(
    app,
    assetBaseUrl,
    runtimeConfig.env.OAK_API_KEY,
    log,
    runtimeConfig.env.OAK_API_BASE_URL ?? 'https://open-api.thenational.academy/api/v0',
    observability,
  );

  const handlerOptions = {
    overrides: options?.toolHandlerOverrides,
    runtimeConfig,
    logger: log,
    observability,
    resourceUrl,
    searchRetrieval,
    createAssetDownloadUrl,
  };

  log.debug('bootstrap.mcp.factory.created');

  // Factory creates a fresh McpServer + transport per request
  const mcpFactory: McpServerFactory = () => {
    const server = new McpServer(
      { name: 'oak-curriculum-http', version: '0.1.0', ...OAK_SERVER_BRANDING },
      { instructions: SERVER_INSTRUCTIONS },
    );
    registerHandlers(server, handlerOptions);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    return { server, transport };
  };

  addHealthEndpoints(app, log);

  return { mcpFactory, ready: Promise.resolve() };
}
