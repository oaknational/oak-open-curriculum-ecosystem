import type { Logger, PhasedTimer } from '@oaknational/logger';
import { setupAuthRoutes } from './auth-routes.js';
import { createEnsureMcpAcceptHeader } from './mcp-middleware.js';
import {
  runBootstrapPhase,
  setupBaseMiddleware,
  initializeAppInstance,
  type ExpressWithAppId,
} from './app/bootstrap-helpers.js';
import { finalizeApp } from './app/bootstrap-finalize.js';
import { mountAppVersionHeader } from './app/app-version-header.js';
import { setupSecurityMiddleware } from './app/bootstrap-security.js';
import { mountStaticContentRoutes } from './app/static-content.js';
import { initializeCoreEndpoints } from './app/core-endpoints.js';
import { resolveServedMcpUrl } from './served-origin.js';
import { runOAuthAndAuthContextPhases } from './app/orchestration.js';
import type { CreateAppOptions } from './app/create-app-options.js';
export type { McpRequestContext, McpServerFactory } from './mcp-request-context.js';
export { loadRuntimeConfig } from './runtime-config.js';
export type { CreateAppOptions } from './app/create-app-options.js';

function setupPreAuthPhases(
  app: ExpressWithAppId,
  options: CreateAppOptions,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appId: number,
): {
  allowedHosts: readonly string[];
  canonicalOrigin?: string;
} {
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

interface SetupPostAuthPhasesDeps {
  readonly app: ExpressWithAppId;
  readonly options: CreateAppOptions;
  readonly log: Logger;
  readonly bootstrapTimer: PhasedTimer;
  readonly appId: number;
  readonly allowedHosts: readonly string[];
  readonly canonicalOrigin?: string;
}

/**
 * Derives the served MCP endpoint URL ONCE, at the composition root, to be
 * threaded as a required field — no downstream layer may re-default it
 * (MCP-351: a scattered localhost default once reached production error
 * payloads).
 */
function deriveResourceUrl(options: CreateAppOptions, canonicalOrigin?: string): string {
  return resolveServedMcpUrl({
    canonicalOrigin,
    displayHostname: options.runtimeConfig.displayHostname,
    portEnv: options.runtimeConfig.env.PORT,
  });
}

function setupPostAuthPhases(deps: SetupPostAuthPhasesDeps): void {
  const { app, options, log, bootstrapTimer, appId, allowedHosts, canonicalOrigin } = deps;

  const resourceUrl = deriveResourceUrl(options, canonicalOrigin);
  const { mcpFactory } = runBootstrapPhase(
    log,
    bootstrapTimer,
    'initializeCoreEndpoints',
    appId,
    () => initializeCoreEndpoints(app, { ...options, resourceUrl }, log),
    options.observability,
  );

  mountAppVersionHeader(app, options.runtimeConfig.version);
  mountStaticContentRoutes(app, log, {
    staticRoot: options.staticRoot,
  });
  app.use('/mcp', createEnsureMcpAcceptHeader(log));

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'setupAuthRoutes',
    appId,
    () => {
      setupAuthRoutes({
        app,
        mcpFactory,
        runtimeConfig: options.runtimeConfig,
        log,
        allowedHosts,
        canonicalOrigin,
        observability: options.observability,
        mcpAuthClerkDeps: options.mcpAuthClerkDeps,
      });
    },
    options.observability,
  );
}

/**
 * Creates an Express MCP-over-HTTP app. See ADR-143 / ADR-160 for middleware order.
 */
// observability-emission-exempt: orchestration wrapper; emissions live in nested helpers.
export async function createApp(options: CreateAppOptions): Promise<ExpressWithAppId> {
  const log =
    options.logger ?? options.observability.createLogger({ name: 'streamable-http:app-instance' });
  const { app, timer: bootstrapTimer, appId } = initializeAppInstance(log);

  const { allowedHosts, canonicalOrigin } = setupPreAuthPhases(
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
    canonicalOrigin,
  });

  setupPostAuthPhases({
    app,
    options,
    log,
    bootstrapTimer,
    appId,
    allowedHosts,
    canonicalOrigin,
  });

  finalizeApp({ app, options, log, appId, bootstrapTimer });
  return app;
}
