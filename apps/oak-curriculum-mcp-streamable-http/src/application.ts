import { static as expressStatic } from 'express';
import type { Express, RequestHandler } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { startTimer, type Duration, type Logger } from '@oaknational/mcp-logger';
import listRoutes from 'express-list-routes';

import { renderLandingPageHtml } from './landing-page/index.js';
import { createCorsMiddleware, dnsRebindingProtection } from './security.js';
import { createSecurityHeadersMiddleware } from './security-headers.js';
import { registerHandlers, type ToolHandlerOverrides } from './handlers.js';
import { overrideToolsListHandler } from './tools-list-override.js';
import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig, type RuntimeConfig } from './runtime-config.js';
import { createSecurityConfig } from './security-config.js';
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
import { setupOAuthAndCaching } from './app/oauth-and-caching-setup.js';

export interface CreateAppOptions {
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly runtimeConfig?: RuntimeConfig;
  readonly logger?: Logger;
  readonly resourceUrl?: string;
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

export function createApp(options?: CreateAppOptions): ExpressWithAppId {
  const runtimeConfig = options?.runtimeConfig ?? loadRuntimeConfig();
  const log =
    options?.logger ?? createHttpLogger(runtimeConfig, { name: 'streamable-http:app-instance' });

  const { app, timer: bootstrapTimer, appId } = initializeAppInstance(appCounter, log);
  appCounter = appId;

  // Phase 1: Base middleware (request entry, JSON parsing, correlation, logging, error handling)
  runBootstrapPhase(log, bootstrapTimer, 'setupBaseMiddleware', appId, () => {
    setupBaseMiddleware(app, log);
  });

  // Phase 2: Security - Create CORS and DNS rebinding protection middleware
  // CORS: Applied globally to ALL routes (protocol routes need it for browser clients)
  // DNS rebinding: Only applied to browser-accessible routes (landing page)
  const securityConfig = createSecurityConfig(runtimeConfig);
  const corsMiddleware = runBootstrapPhase(log, bootstrapTimer, 'createCorsMiddleware', appId, () =>
    createCorsMiddleware(securityConfig.mode, securityConfig.allowedOrigins),
  );
  const dnsRebindingMiddleware = runBootstrapPhase(
    log,
    bootstrapTimer,
    'createDnsRebindingMiddleware',
    appId,
    () => dnsRebindingProtection(log, securityConfig.allowedHosts),
  );

  // Apply CORS globally to ALL routes
  app.use(corsMiddleware);
  // Phase 2.1: Security headers (CSP, X-Content-Type-Options, etc.) - safe for JSON, required for HTML
  runBootstrapPhase(log, bootstrapTimer, 'createSecurityHeaders', appId, () => {
    app.use(createSecurityHeadersMiddleware());
  });

  // Phase 2.5 & 2.6: OAuth metadata endpoints and error caching prevention
  // These endpoints MUST be publicly accessible without authentication per RFC 9470.
  // Registering them before clerkMiddleware ensures they never go through auth checks.
  setupOAuthAndCaching(app, runtimeConfig, log, bootstrapTimer, appId);

  // Phase 3: Global auth context (clerkMiddleware registered globally - BEFORE path-specific middleware)
  // CRITICAL: This must run early so auth context is available to all subsequent middleware.
  // Per Clerk best practices, clerkMiddleware is applied globally but doesn't block any requests.
  // Actual enforcement happens later via createMcpAuthClerk on specific routes.
  runBootstrapPhase(log, bootstrapTimer, 'setupGlobalAuthContext', appId, () => {
    setupGlobalAuthContext(app, runtimeConfig, log);
  });

  // Phase 4: Core endpoints (MCP server init, health checks, OAuth metadata discovery)
  // Health checks have NO web security middleware
  const { transport: coreTransport, ready } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, options, runtimeConfig, log),
  );

  // Phase 5: Static assets and landing page
  // DNS rebinding protection applied ONLY to landing page (/)
  // CORS is already applied globally in Phase 2
  // Pass display hostname for landing page (prefers custom domain in production)
  mountStaticContentRoutes(app, dnsRebindingMiddleware, log, runtimeConfig.displayHostname);

  // Phase 6: Path-specific /mcp middleware (Accept header validation, MCP readiness check)
  // This runs AFTER clerkMiddleware, so auth context is available here.
  app.use('/mcp', createEnsureMcpAcceptHeader(log), createMcpReadinessMiddleware(ready, log));

  // Phase 7: Auth routes (OAuth metadata endpoints, protected /mcp route handlers)
  // Needs coreTransport, so must run after initializeCoreEndpoints.
  runBootstrapPhase(log, bootstrapTimer, 'setupAuthRoutes', appId, () => {
    setupAuthRoutes(app, coreTransport, runtimeConfig, log);
  });

  const routes = listRoutes(app);
  logBootstrapComplete(log, appId, bootstrapTimer, routes.length);
  logRegisteredRoutes(log, appId, routes);

  return app;
}

function initializeCoreEndpoints(
  app: Express,
  options: CreateAppOptions | undefined,
  runtimeConfig: RuntimeConfig,
  log: Logger,
): { transport: StreamableHTTPServerTransport; ready: Promise<void> } {
  const { transport, server } = initializeCoreMcpServer();
  registerHandlers(server, {
    overrides: options?.toolHandlerOverrides,
    runtimeConfig,
    logger: log,
    resourceUrl: options?.resourceUrl,
  });
  overrideToolsListHandler(server);
  log.debug('bootstrap.mcp.tools-list-override.registered');

  log.debug('bootstrap.mcp.transport.connect.start');
  const connectionTimer = startTimer();
  let connectionDuration: Duration | undefined;
  const ensureConnectionDuration = (): Duration => {
    connectionDuration ??= connectionTimer.end();
    return connectionDuration;
  };
  const serverReady = server.connect(transport).then(
    () => {
      const duration = ensureConnectionDuration();
      log.info('bootstrap.mcp.transport.connect.finish', {
        duration: duration.formatted,
        durationMs: duration.ms,
      });
    },
    (error: unknown) => {
      const duration = ensureConnectionDuration();
      const errorAsError =
        error instanceof Error
          ? error
          : new Error(`MCP transport connect failed with non-error value: ${String(error)}`);
      log.error('bootstrap.mcp.transport.connect.error', errorAsError, {
        duration: duration.formatted,
        durationMs: duration.ms,
      });
      throw error;
    },
  );

  addHealthEndpoints(app, log);

  return { transport, ready: serverReady };
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
function initializeCoreMcpServer(): {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
} {
  const server = new McpServer({ name: 'oak-curriculum-http', version: '0.1.0' });
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  return { server, transport };
}
