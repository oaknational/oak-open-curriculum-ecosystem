/**
 * Conditional registration helper for diagnostic-only routes.
 *
 * @remarks Encapsulates the env-gate check + registration call so
 * `application.ts` stays under the max-lines threshold. Production
 * safety is enforced at env-validation time (`HttpEnvSchema`
 * super-refine forbids `TEST_ERROR_SECRET` in production); here we
 * just check presence.
 */

import type { Express, RequestHandler } from 'express';

import type { Logger } from '@oaknational/logger';

import type { Env } from '../env.js';
import type { HttpObservability } from '../observability/http-observability.js';
import { registerTestErrorRoute } from './test-error-route.js';

interface RegisterDiagnosticRoutesDeps {
  readonly app: Express;
  readonly env: Env;
  readonly oauthRateLimiter: RequestHandler;
  readonly observability: HttpObservability;
  readonly log: Logger;
}

/**
 * Registers diagnostic routes when their env-gates are set.
 *
 * Currently the only gated route is `POST /test-error`; future
 * diagnostic routes plug in through this helper rather than
 * cluttering `application.ts`'s composition root.
 *
 * @param deps - Injected dependencies (DI per ADR-078).
 */
export function registerDiagnosticRoutesIfEnabled(deps: RegisterDiagnosticRoutesDeps): void {
  const { app, env, oauthRateLimiter, observability, log } = deps;

  if (env.TEST_ERROR_SECRET) {
    registerTestErrorRoute({
      app,
      secret: env.TEST_ERROR_SECRET,
      rateLimiter: oauthRateLimiter,
      observability,
      log,
    });
  }
}
