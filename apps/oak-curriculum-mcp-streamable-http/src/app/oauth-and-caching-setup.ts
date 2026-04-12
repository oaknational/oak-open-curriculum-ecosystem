import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import { registerPublicOAuthMetadataEndpoints } from '../auth-routes.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase, runAsyncBootstrapPhase } from './bootstrap-helpers.js';
import {
  createOAuthProxyRoutes,
  deriveUpstreamOAuthBaseUrl,
  type UpstreamAuthServerMetadata,
} from '../oauth-proxy/index.js';
import type { HttpObservability } from '../observability/http-observability.js';
import { fetchUpstreamMetadata } from './upstream-metadata-fetch.js';

export type { FetchFn } from './upstream-metadata-fetch.js';
export { fetchUpstreamMetadata } from './upstream-metadata-fetch.js';

/**
 * Creates middleware that adds no-cache headers to error responses.
 *
 * This prevents Vercel and other CDNs from caching error responses (4xx, 5xx)
 * which can block proper diagnosis of authentication and application issues.
 */
function createNoCacheErrorMiddleware(): RequestHandler {
  return (_req, res, next) => {
    const originalStatus = res.status.bind(res);
    res.status = function (code: number) {
      if (code >= 400) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      return originalStatus(code);
    };
    next();
  };
}

/** Resolves upstream metadata, either from injection or a live Clerk fetch. */
async function resolveUpstreamMetadata(
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  observability: HttpObservability,
  injectedMetadata?: UpstreamAuthServerMetadata,
): Promise<{ upstreamBaseUrl: string; upstreamMetadata: UpstreamAuthServerMetadata }> {
  if (injectedMetadata) {
    return { upstreamBaseUrl: injectedMetadata.issuer, upstreamMetadata: injectedMetadata };
  }

  const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('CLERK_PUBLISHABLE_KEY is required for OAuth proxy');
  }
  const upstreamBaseUrl = deriveUpstreamOAuthBaseUrl(publishableKey);
  log.info('OAuth proxy: deriving upstream', { upstreamBaseUrl });
  const metadataResult = await runAsyncBootstrapPhase(
    log,
    bootstrapTimer,
    'fetchUpstreamMetadata',
    appCounter,
    () => fetchUpstreamMetadata(upstreamBaseUrl, fetch, { observability }),
    observability,
  );
  if (!metadataResult.ok) {
    throw new Error(metadataResult.error.message);
  }
  return { upstreamBaseUrl, upstreamMetadata: metadataResult.value };
}

/**
 * Sets up OAuth metadata endpoints, proxy routes, and error caching prevention.
 *
 * Phase 2.5: Registers PUBLIC OAuth metadata endpoints and proxy routes
 *   BEFORE clerkMiddleware.
 * Phase 2.6: Adds no-cache headers to error responses (4xx/5xx only).
 */
function registerOAuthRoutes(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  allowedHosts: readonly string[],
  observability: HttpObservability,
  upstreamBaseUrl: string,
  upstreamMetadata: UpstreamAuthServerMetadata,
): void {
  runBootstrapPhase(
    log,
    bootstrapTimer,
    'registerPublicOAuthMetadata',
    appCounter,
    () => {
      registerPublicOAuthMetadataEndpoints(app, runtimeConfig, upstreamMetadata, log, allowedHosts);
    },
    observability,
  );

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'registerOAuthProxy',
    appCounter,
    () => {
      log.info('OAuth proxy enabled', { upstreamBaseUrl });
      app.use(createOAuthProxyRoutes({ upstreamBaseUrl, logger: log, observability }));
    },
    observability,
  );
}

/** Sets up OAuth metadata endpoints, proxy routes, and error caching prevention. */
export async function setupOAuthAndCaching(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  allowedHosts: readonly string[],
  observability: HttpObservability,
  injectedMetadata?: UpstreamAuthServerMetadata,
): Promise<void> {
  if (!runtimeConfig.dangerouslyDisableAuth) {
    const { upstreamBaseUrl, upstreamMetadata } = await resolveUpstreamMetadata(
      runtimeConfig,
      log,
      bootstrapTimer,
      appCounter,
      observability,
      injectedMetadata,
    );
    registerOAuthRoutes(
      app,
      runtimeConfig,
      log,
      bootstrapTimer,
      appCounter,
      allowedHosts,
      observability,
      upstreamBaseUrl,
      upstreamMetadata,
    );
  }

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'addNoCacheToErrors',
    appCounter,
    () => {
      app.use(createNoCacheErrorMiddleware());
    },
    observability,
  );
}
