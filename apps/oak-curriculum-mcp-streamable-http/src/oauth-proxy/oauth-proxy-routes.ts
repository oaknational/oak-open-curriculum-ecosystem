/**
 * Express router wiring for the OAuth proxy passthrough layer.
 *
 * Route handlers live in `./oauth-proxy-handlers.ts`; this module is
 * responsible only for Express router construction and async error wrapping.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import type {
  Request as ExpressRequest,
  RequestHandler,
  Response as ExpressResponse,
} from 'express';
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

/** Options for creating the OAuth proxy router, including rate limiting. */
interface CreateOAuthProxyRoutesOptions {
  readonly config: OAuthProxyConfig;
  /** Per-IP rate limiter applied to all three OAuth proxy routes. */
  readonly oauthRateLimiter: RequestHandler;
}

/**
 * Builds the OAuth proxy router with all three flow endpoints
 * (`/oauth/register`, `/oauth/authorize`, `/oauth/token`) wired with
 * the injected `oauthRateLimiter` as their first middleware.
 *
 * The limiter is constructed in
 * `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/create-rate-limiters.ts:44-50`
 * from the `OAUTH_RATE_LIMIT` profile (30 req/15min/IP — strict, since
 * `GET /oauth/authorize` is an upstream amplification vector) and
 * reaches this function via DI per ADR-078. CodeQL's
 * `js/missing-rate-limiting` static analysis cannot trace the limiter
 * through the `RequestHandler`-typed property of
 * {@link CreateOAuthProxyRoutesOptions} (it looks structurally
 * identical to any other middleware); dismissal of alert #72
 * (line 68, `GET /oauth/authorize`) cites this attestation.
 *
 * @param options - Proxy config and the per-IP rate-limiter; see
 *   `create-rate-limiters.ts:44-50` for construction.
 */
export function createOAuthProxyRoutes(options: CreateOAuthProxyRoutesOptions): Router {
  const { config, oauthRateLimiter } = options;
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

  // Rate limiter goes first — reject abusive traffic before parsing bodies
  // or making upstream calls.
  router.post(
    '/oauth/register',
    oauthRateLimiter,
    asyncRoute((req, res) => handleRegister(req, res, config, timeout, fetchFn)),
  );

  router.get('/oauth/authorize', oauthRateLimiter, (req, res) => {
    handleAuthorize(req, res, config);
  });

  router.post(
    '/oauth/token',
    oauthRateLimiter,
    text({ type: 'application/x-www-form-urlencoded' }),
    asyncRoute((req, res) => handleToken(req, res, config, timeout, fetchFn)),
  );

  return router;
}
