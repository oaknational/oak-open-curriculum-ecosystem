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
import { verifyClerkKeyPairing } from './clerk-key-pairing.js';

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

/**
 * Resolves upstream metadata, either from injection or a live Clerk fetch.
 *
 * The injection branch is test-only DI (ADR-078) and bypasses the RFC 8414
 * Section 3.3 issuer check, so a production caller must route through
 * `fetchUpstreamMetadata`, where the check applies (MCP-655).
 */
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
    throw new Error(metadataResult.error.message, { cause: metadataResult.error });
  }

  // The secret key must verify tokens the publishable key's instance issues;
  // a mispaired deployment fails here, not after every sign-in (MCP-655).
  const secretKey = runtimeConfig.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is required for OAuth proxy');
  }
  const publicJwksUrl = metadataResult.value.jwks_uri ?? `${upstreamBaseUrl}/.well-known/jwks.json`;
  const pairingResult = await runAsyncBootstrapPhase(
    log,
    bootstrapTimer,
    'verifyClerkKeyPairing',
    appCounter,
    () => verifyClerkKeyPairing({ publicJwksUrl, secretKey }, fetch, observability),
    observability,
  );
  if (!pairingResult.ok) {
    throw new Error(pairingResult.error.message, { cause: pairingResult.error });
  }
  log.info('Clerk keys paired', { instanceId: pairingResult.value.instanceId });

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
  canonicalOrigin?: string,
): void {
  runBootstrapPhase(
    log,
    bootstrapTimer,
    'registerPublicOAuthMetadata',
    appCounter,
    () => {
      registerPublicOAuthMetadataEndpoints(
        app,
        runtimeConfig,
        upstreamMetadata,
        log,
        allowedHosts,
        canonicalOrigin,
      );
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
      app.use(
        createOAuthProxyRoutes({
          config: { upstreamBaseUrl, logger: log, observability },
        }),
      );
    },
    observability,
  );
}

/**
 * Sets up OAuth metadata endpoints, proxy routes, and error caching prevention.
 */
// observability-emission-exempt: orchestration wrapper; concrete emissions live
// in runBootstrapPhase/runAsyncBootstrapPhase and the nested route setup.
export async function setupOAuthAndCaching(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
  allowedHosts: readonly string[],
  observability: HttpObservability,
  injectedMetadata: UpstreamAuthServerMetadata | undefined,
  canonicalOrigin?: string,
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
      canonicalOrigin,
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
