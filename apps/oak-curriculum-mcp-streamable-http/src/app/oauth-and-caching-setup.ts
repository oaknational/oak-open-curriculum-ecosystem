import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/logger';
import { registerPublicOAuthMetadataEndpoints } from '../auth-routes.js';
import { registerOpenAiDomainVerificationChallenge } from '../openai-domain-verification.js';
import { registerRobotsTxt } from '../robots-txt.js';
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
 * The bootstrap context the OAuth-and-caching phase runs in: the app under
 * construction, its runtime config and bootstrap instrumentation, and the
 * auth inputs the OAuth surfaces are registered with.
 */
export interface OAuthAndCachingSetupOptions {
  readonly app: Express;
  readonly runtimeConfig: RuntimeConfig;
  readonly log: Logger;
  readonly bootstrapTimer: PhasedTimer;
  readonly appCounter: number;
  readonly allowedHosts: readonly string[];
  readonly observability: HttpObservability;
  /**
   * Upstream authorization-server metadata supplied by a test (ADR-078). When
   * present it bypasses the live Clerk fetch and the RFC 8414 Section 3.3
   * issuer check, so a production caller leaves it undefined and routes
   * through `fetchUpstreamMetadata`, where the check applies (MCP-655).
   */
  readonly injectedMetadata?: UpstreamAuthServerMetadata;
  readonly canonicalOrigin?: string;
}

/** The upstream authorization server the OAuth routes proxy to. */
interface ResolvedUpstream {
  readonly upstreamBaseUrl: string;
  readonly upstreamMetadata: UpstreamAuthServerMetadata;
}

/**
 * Adds no-cache headers to error responses.
 *
 * This prevents Vercel and other CDNs from caching error responses (4xx, 5xx)
 * which can block proper diagnosis of authentication and application issues.
 */
const addNoCacheHeadersToErrors: RequestHandler = (_req, res, next) => {
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

/**
 * Resolves upstream metadata, either from injection or a live Clerk fetch.
 *
 * The injection branch is test-only DI (ADR-078) and bypasses the RFC 8414
 * Section 3.3 issuer check, so a production caller must route through
 * `fetchUpstreamMetadata`, where the check applies (MCP-655).
 */
async function resolveUpstreamMetadata(
  options: OAuthAndCachingSetupOptions,
): Promise<ResolvedUpstream> {
  const { runtimeConfig, log, bootstrapTimer, appCounter, observability, injectedMetadata } =
    options;
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
 * Registers the PUBLIC OAuth metadata endpoints and the proxy routes against
 * the resolved upstream, BEFORE clerkMiddleware (phase 2.5).
 */
function registerOAuthRoutes(
  options: OAuthAndCachingSetupOptions,
  upstream: ResolvedUpstream,
): void {
  const { app, runtimeConfig, log, bootstrapTimer, appCounter, allowedHosts } = options;
  const { observability, canonicalOrigin } = options;
  const { upstreamBaseUrl, upstreamMetadata } = upstream;
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
 *
 * Phase 2.5: Registers PUBLIC OAuth metadata endpoints and proxy routes
 *   BEFORE clerkMiddleware.
 * Phase 2.6: Adds no-cache headers to error responses (4xx/5xx only).
 */
// observability-emission-exempt: orchestration wrapper; concrete emissions live
// in runBootstrapPhase/runAsyncBootstrapPhase and the nested route setup.
export async function setupOAuthAndCaching(options: OAuthAndCachingSetupOptions): Promise<void> {
  const { app, runtimeConfig, log, bootstrapTimer, appCounter, observability } = options;
  // Public in every auth mode: the challenge proves domain control to the
  // OpenAI plugin-submission portal and is not an OAuth surface (MCP-700).
  registerOpenAiDomainVerificationChallenge(app, log);
  // Public in every auth mode: a crawler arrives with no credentials, and a
  // robots.txt reachable only through the auth vendor is an unfetchable one
  // (MCP-703). Not an OAuth surface, so it does not sit behind the
  // auth-enabled branch below.
  registerRobotsTxt(app, log);

  if (!runtimeConfig.dangerouslyDisableAuth) {
    registerOAuthRoutes(options, await resolveUpstreamMetadata(options));
  }

  runBootstrapPhase(
    log,
    bootstrapTimer,
    'addNoCacheToErrors',
    appCounter,
    () => {
      app.use(addNoCacheHeadersToErrors);
    },
    observability,
  );
}
