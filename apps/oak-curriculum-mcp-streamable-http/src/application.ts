import { static as expressStatic } from 'express';
import type { Express, RequestHandler } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from '@oaknational/logger';
import type { UpstreamAuthServerMetadata } from './oauth-proxy/index.js';
import listRoutes from 'express-list-routes';

import { renderLandingPageHtml } from './landing-page/index.js';
import { registerHandlers, type ToolHandlerOverrides } from './handlers.js';
import { preserveSchemaExamplesInToolsList } from './preserve-schema-examples.js';
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { mountAssetDownloadProxy } from './asset-download/asset-download-route.js';
import { createHttpLogger } from './logging/index.js';
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
import { createSearchRetrieval } from './search-retrieval-factory.js';

import type { McpServerFactory } from './mcp-request-context.js';
export type { McpRequestContext, McpServerFactory } from './mcp-request-context.js';

export interface CreateAppOptions {
  readonly runtimeConfig: RuntimeConfig;
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
}

let appCounter = 0;

/**
 * Creates and configures an Express application instance for MCP over HTTP.
 *
 * Middleware Registration Order (critical for OAuth to work correctly):
 * 1. Base middleware - JSON parsing, correlation, logging, error handling
 * 2. Security - CORS applied globally to ALL routes, DNS rebinding for landing page only
 * 2.5. PUBLIC OAuth metadata endpoints - registered BEFORE auth middleware
 * 2.6. Global no-cache headers on errors - prevent Vercel caching
 * 3. Global auth context - clerkMiddleware for auth context (before path-specific middleware!)
 * 4. Core endpoints - MCP server initialization, health checks
 * 5. Static assets & landing page (DNS rebinding protection applied to landing page)
 * 6. Path-specific /mcp middleware - Accept header validation, readiness checks
 * 7. Auth routes - protected /mcp routes (OAuth metadata now in Phase 2.5)
 *
 * @param options - Optional configuration for tool handlers, runtime config, and logger
 * @returns Configured Express application instance
 */

export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const { runtimeConfig } = options;
  const log =
    options.logger ?? createHttpLogger(runtimeConfig, { name: 'streamable-http:app-instance' });

  const { app, timer: bootstrapTimer, appId } = initializeAppInstance(appCounter, log);
  appCounter = appId;

  // Phase 1: Base middleware (request entry, JSON parsing, correlation, logging, error handling)
  runBootstrapPhase(log, bootstrapTimer, 'setupBaseMiddleware', appId, () => {
    setupBaseMiddleware(app, log);
  });

  // Phase 2: Security - Create CORS and DNS rebinding protection middleware
  // CORS: Applied globally to ALL routes (protocol routes need it for browser clients)
  // DNS rebinding: Only applied to browser-accessible routes (landing page)
  // Phase 2.1: Security headers (CSP, X-Content-Type-Options, etc.) - safe for JSON, required for HTML
  const { dnsRebindingMiddleware, allowedHosts } = setupSecurityMiddleware(
    app,
    runtimeConfig,
    log,
    bootstrapTimer,
    appId,
  );

  // Phase 2.5 & 2.6: OAuth metadata (public, before auth) per RFC 9728
  await setupOAuthAndCaching(
    app,
    runtimeConfig,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    options.upstreamMetadata,
  );

  // Phase 3: Global auth context (before path-specific middleware)
  runBootstrapPhase(log, bootstrapTimer, 'setupGlobalAuthContext', appId, () => {
    setupGlobalAuthContext(app, runtimeConfig, log, options.clerkMiddlewareFactory);
  });

  // Phase 4: Core endpoints (MCP factory, health checks)
  const { mcpFactory, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, options, runtimeConfig, log),
  );

  // Phase 5: Static assets and landing page (DNS rebinding on landing page only)
  mountStaticContentRoutes(app, dnsRebindingMiddleware, log, runtimeConfig.displayHostname);

  // Phase 6: /mcp middleware (Accept header validation, readiness check)
  app.use('/mcp', createEnsureMcpAcceptHeader(log), createMcpReadinessMiddleware(ready, log));

  // Phase 7: Auth routes (protected /mcp handlers, after mcpFactory)
  runBootstrapPhase(log, bootstrapTimer, 'setupAuthRoutes', appId, () => {
    setupAuthRoutes(app, mcpFactory, runtimeConfig, log, allowedHosts);
  });

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
): { mcpFactory: McpServerFactory; ready: Promise<void> } {
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
  );

  const handlerOptions = {
    overrides: options?.toolHandlerOverrides,
    runtimeConfig,
    logger: log,
    resourceUrl,
    searchRetrieval,
    createAssetDownloadUrl,
  };

  log.debug('bootstrap.mcp.factory.created');

  // Factory creates a fresh McpServer + transport per request
  const mcpFactory: McpServerFactory = () => {
    const server = new McpServer(
      { name: 'oak-curriculum-http', version: '0.1.0' },
      { instructions: SERVER_INSTRUCTIONS },
    );
    registerHandlers(server, handlerOptions);
    preserveSchemaExamplesInToolsList(server);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    return { server, transport };
  };

  addHealthEndpoints(app, log);

  return { mcpFactory, ready: Promise.resolve() };
}

function addHealthEndpoints(app: Express, log: Logger): void {
  // CORS applied globally - no additional security needed
  app.head('/healthz', (req, res) => {
    log.debug('healthz.head', { path: req.path, method: req.method });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  });
  app.get('/healthz', (req, res) => {
    log.debug('healthz.get', { path: req.path, method: req.method });
    res
      .type('application/json')
      .send(JSON.stringify({ status: 'ok', mode: 'streamable-http', auth: 'required-for-post' }));
  });
}

function mountStaticContentRoutes(
  app: Express,
  dnsRebindingMw: RequestHandler,
  log: Logger,
  vercelHostname?: string,
): void {
  addRootLandingPage(app, dnsRebindingMw, log, vercelHostname); // DNS protection ONLY here - register route first
  mountStaticAssets(app); // No additional security - register static middleware after routes
}

function addRootLandingPage(
  app: Express,
  dnsRebindingMw: RequestHandler,
  log: Logger,
  vercelHostname?: string,
): void {
  // Landing page is the ONLY browser-accessible route that needs DNS rebinding protection
  // CORS is already applied globally
  app.get('/', dnsRebindingMw, (req, res) => {
    log.debug('landing.get', { path: req.path, method: req.method });
    res.type('text/html').send(renderLandingPageHtml(vercelHostname));
  });
}

function mountStaticAssets(app: Express): void {
  const candidates = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/oak-curriculum-mcp-streamable-http/public'),
  ];
  const chosen = candidates.find((p) => fs.existsSync(p));
  if (chosen) {
    app.use(expressStatic(chosen, { etag: true, maxAge: '1d' }));
  }
}
