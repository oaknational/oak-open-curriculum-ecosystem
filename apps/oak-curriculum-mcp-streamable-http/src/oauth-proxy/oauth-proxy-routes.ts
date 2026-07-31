/**
 * Express router wiring for the OAuth proxy passthrough layer.
 *
 * Route handlers live in `./oauth-proxy-handlers.ts`; this module is
 * responsible only for Express router construction and async error wrapping.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Router, text } from 'express';
import { normalizeError } from '@oaknational/logger';

import { formatProxyErrorResponse } from './oauth-proxy-upstream.js';
import {
  handleRegister,
  handleAuthorize,
  handleToken,
  type OAuthProxyConfig,
} from './oauth-proxy-handlers.js';

export type { OAuthProxyConfig } from './oauth-proxy-handlers.js';

/** Options for creating the OAuth proxy router. */
interface CreateOAuthProxyRoutesOptions {
  readonly config: OAuthProxyConfig;
}

/**
 * Builds the OAuth proxy router with all three flow endpoints
 * (`/oauth/register`, `/oauth/authorize`, `/oauth/token`).
 *
 * Volumetric control is owned at the Cloudflare/Vercel edge (ADR-219);
 * `js/missing-rate-limiting` findings on these registrations are
 * dispositioned against that ADR. `GET /oauth/authorize` builds a 302
 * redirect and makes no upstream call, so it is not an amplification
 * vector; upstream throttling on the register/token legs surfaces
 * through the preserved 429 mapping in `oauth-proxy-response.ts`.
 *
 * @param options - Proxy config.
 */
export function createOAuthProxyRoutes(options: CreateOAuthProxyRoutesOptions): Router {
  const { config } = options;
  const router = Router();
  const timeout = config.timeoutMs ?? 10000;
  const fetchFn = config.fetch ?? globalThis.fetch;

  function asyncRoute(
    handler: (req: ExpressRequest, res: ExpressResponse) => Promise<void>,
  ): (req: ExpressRequest, res: ExpressResponse) => void {
    return (req, res) => {
      handler(req, res).catch((err: unknown) => {
        config.logger.error('oauth-proxy.unhandled-error', normalizeError(err), {
          path: req.path,
        });
        config.observability?.captureHandledError(err, {
          boundary: 'oauth_proxy_unhandled',
          route: req.path,
        });
        if (!res.headersSent) {
          res.status(500).json(formatProxyErrorResponse('server_error', 'Internal proxy error'));
        }
      });
    };
  }

  router.post(
    '/oauth/register',
    asyncRoute((req, res) => handleRegister(req, res, config, timeout, fetchFn)),
  );

  router.get('/oauth/authorize', (req, res) => {
    handleAuthorize(req, res, config);
  });

  router.post(
    '/oauth/token',
    text({ type: 'application/x-www-form-urlencoded' }),
    asyncRoute((req, res) => handleToken(req, res, config, timeout, fetchFn)),
  );

  return router;
}
