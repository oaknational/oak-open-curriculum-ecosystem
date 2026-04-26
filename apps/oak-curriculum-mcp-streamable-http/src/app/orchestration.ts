/**
 * Composition-root orchestration helpers extracted from
 * `application.ts` to keep `createApp` under the
 * `max-lines-per-function` threshold.
 *
 * @remarks Pure orchestration: every parameter is injected by the
 * caller (DI per ADR-078). No new behaviour vs the previous inline
 * code in `createApp` — only structural extraction.
 */

import type { RequestHandler } from 'express';

import type { Logger, PhasedTimer } from '@oaknational/logger';

import { setupGlobalAuthContext } from '../auth-routes.js';
import type { HttpObservability } from '../observability/http-observability.js';
import type { RuntimeConfig } from '../runtime-config-support.js';
import type { UpstreamAuthServerMetadata } from '../oauth-proxy/index.js';
import { runBootstrapPhase } from './bootstrap-helpers.js';
import type { ExpressWithAppId } from './bootstrap-helpers.js';
import { setupOAuthAndCaching } from './oauth-and-caching-setup.js';

interface RunOAuthAndAuthContextDeps {
  readonly app: ExpressWithAppId;
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly clerkMiddlewareFactory?: () => RequestHandler;
  readonly upstreamMetadata?: UpstreamAuthServerMetadata;
  readonly log: Logger;
  readonly bootstrapTimer: PhasedTimer;
  readonly appId: number;
  readonly allowedHosts: readonly string[];
  readonly oauthRateLimiter: RequestHandler;
}

/**
 * Runs the OAuth-proxy + caching phase, then the global Clerk
 * auth-context phase, in the order required by the middleware
 * contract.
 *
 * @param deps - Injected dependencies.
 */
// observability-emission-exempt: orchestration wrapper; both nested
// calls (setupOAuthAndCaching and the runBootstrapPhase below) emit
// their own structured events.
export async function runOAuthAndAuthContextPhases(
  deps: RunOAuthAndAuthContextDeps,
): Promise<void> {
  await setupOAuthAndCaching(
    deps.app,
    deps.runtimeConfig,
    deps.log,
    deps.bootstrapTimer,
    deps.appId,
    deps.allowedHosts,
    deps.observability,
    deps.upstreamMetadata,
    deps.oauthRateLimiter,
  );

  runBootstrapPhase(
    deps.log,
    deps.bootstrapTimer,
    'setupGlobalAuthContext',
    deps.appId,
    () => {
      setupGlobalAuthContext(deps.app, deps.runtimeConfig, deps.log, deps.clerkMiddlewareFactory);
    },
    deps.observability,
  );
}
