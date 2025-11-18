import type { Express, RequestHandler } from 'express';
import type { Logger, PhasedTimer } from '@oaknational/mcp-logger';
import { registerPublicOAuthMetadataEndpoints } from '../auth-routes.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { runBootstrapPhase } from './bootstrap-helpers.js';

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
 * Sets up OAuth metadata endpoints and error caching prevention.
 *
 * Phase 2.5: Registers PUBLIC OAuth metadata endpoints BEFORE clerkMiddleware
 * Phase 2.6: Adds no-cache headers to error responses (4xx/5xx only)
 *
 * @param app - Express application instance
 * @param runtimeConfig - Runtime configuration
 * @param log - Logger instance
 * @param bootstrapTimer - Phased timer for tracking duration
 * @param appCounter - Application counter for logging
 */
export function setupOAuthAndCaching(
  app: Express,
  runtimeConfig: RuntimeConfig,
  log: Logger,
  bootstrapTimer: PhasedTimer,
  appCounter: number,
): void {
  // Phase 2.5: PUBLIC OAuth metadata endpoints (MUST be before clerkMiddleware)
  if (!runtimeConfig.dangerouslyDisableAuth) {
    runBootstrapPhase(log, bootstrapTimer, 'registerPublicOAuthMetadata', appCounter, () => {
      registerPublicOAuthMetadataEndpoints(app, runtimeConfig, log);
    });
  }

  // Phase 2.6: Add no-cache headers to error responses (status >= 400)
  runBootstrapPhase(log, bootstrapTimer, 'addNoCacheToErrors', appCounter, () => {
    app.use(createNoCacheErrorMiddleware());
  });
}
