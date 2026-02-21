import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/mcp-logger';
import { registerPublicOAuthMetadataEndpoints } from '../auth-routes.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase, runAsyncBootstrapPhase } from './bootstrap-helpers.js';
import {
  createOAuthProxyRoutes,
  deriveUpstreamOAuthBaseUrl,
  isUpstreamAuthServerMetadata,
  type UpstreamAuthServerMetadata,
} from '../oauth-proxy/index.js';

/**
 * Creates middleware that adds no-cache headers to error responses.
 *
 * This prevents Vercel and other CDNs from caching error responses (4xx, 5xx)
 * which can block proper diagnosis of authentication and application issues.
 *
 * @returns Express middleware that intercepts status code setting
 */
function createNoCacheErrorMiddleware(): RequestHandler {
  return (_req, res, next) => {
    const originalStatus = res.status.bind(res);
    res.status = function (code: number) {
      // Add no-cache headers to error responses (4xx client errors, 5xx server errors)
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

/**
 * Fetches and validates upstream AS metadata from Clerk's well-known endpoint.
 * Called once at startup; the result is cached for the process lifetime.
 */
async function fetchUpstreamMetadata(upstreamBaseUrl: string): Promise<UpstreamAuthServerMetadata> {
  const metadataUrl = `${upstreamBaseUrl}/.well-known/oauth-authorization-server`;
  const response = await fetch(metadataUrl);
  const data: unknown = await response.json();
  if (!isUpstreamAuthServerMetadata(data)) {
    throw new Error(`Upstream AS metadata at ${metadataUrl} does not match expected shape`);
  }
  return data;
}

/**
 * Sets up OAuth metadata endpoints, proxy routes, and error caching prevention.
 *
 * Phase 2.5: Registers PUBLIC OAuth metadata endpoints and proxy routes
 *   BEFORE clerkMiddleware. When `injectedMetadata` is provided (tests), the
 *   upstream fetch is skipped. When omitted (production), metadata is fetched
 *   from Clerk's `/.well-known/oauth-authorization-server` at startup.
 * Phase 2.6: Adds no-cache headers to error responses (4xx/5xx only).
 *
 * @param app - Express application instance
 * @param runtimeConfig - Runtime configuration
 * @param log - Logger instance
 * @param bootstrapTimer - Phased timer for tracking duration
 * @param appCounter - Application counter for logging
 * @param injectedMetadata - Optional upstream metadata for DI (tests). When
 *   provided, no network call is made to Clerk.
 */
export async function setupOAuthAndCaching(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  injectedMetadata?: UpstreamAuthServerMetadata,
): Promise<void> {
  if (!runtimeConfig.dangerouslyDisableAuth) {
    let upstreamBaseUrl: string;
    let upstreamMetadata: UpstreamAuthServerMetadata;

    if (injectedMetadata) {
      upstreamMetadata = injectedMetadata;
      upstreamBaseUrl = injectedMetadata.issuer;
    } else {
      const publishableKey = runtimeConfig.env.CLERK_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error('CLERK_PUBLISHABLE_KEY is required for OAuth proxy');
      }
      upstreamBaseUrl = deriveUpstreamOAuthBaseUrl(publishableKey);
      log.info('OAuth proxy: deriving upstream', { upstreamBaseUrl });
      upstreamMetadata = await runAsyncBootstrapPhase(
        log,
        bootstrapTimer,
        'fetchUpstreamMetadata',
        appCounter,
        () => fetchUpstreamMetadata(upstreamBaseUrl),
      );
    }

    runBootstrapPhase(log, bootstrapTimer, 'registerPublicOAuthMetadata', appCounter, () => {
      registerPublicOAuthMetadataEndpoints(app, runtimeConfig, upstreamMetadata, log);
    });

    runBootstrapPhase(log, bootstrapTimer, 'registerOAuthProxy', appCounter, () => {
      log.info('OAuth proxy enabled', { upstreamBaseUrl });
      app.use(createOAuthProxyRoutes({ upstreamBaseUrl, logger: log }));
    });
  }

  runBootstrapPhase(log, bootstrapTimer, 'addNoCacheToErrors', appCounter, () => {
    app.use(createNoCacheErrorMiddleware());
  });
}
