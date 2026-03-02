/**
 * Express route handlers for the OAuth proxy passthrough layer.
 *
 * This is a transparent passthrough proxy, NOT a service. It exists solely
 * to place Clerk's OAuth AS on the same origin as the MCP resource server,
 * working around a confirmed Cursor client bug (forum #151331) where the
 * `resource_metadata` URL is lost when RS and AS are on different origins.
 *
 * **Primary design constraint**: the proxy MUST NOT alter, filter, or lose
 * information in either direction. Clerk is the real authorization server;
 * it handles all security, validation, and rate limiting. The proxy adds
 * nothing of its own — it forwards requests and returns responses verbatim.
 *
 * Error handling uses `Result<Response, ProxyFetchError>` for explicit,
 * discriminated error paths. Timeout errors (504) and network errors (502)
 * are distinguished at the point of failure via `ProxyFetchError.kind`.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Router, text } from 'express';

import { type Result, ok, err } from '@oaknational/result';

import { buildAuthorizeRedirectUrl, formatProxyErrorResponse } from './oauth-proxy-upstream.js';

/** Minimal structured logger interface for the proxy. */
interface ProxyLogger {
  readonly info: (message: string, context?: unknown) => void;
  readonly warn: (message: string, context?: unknown) => void;
  readonly error: (message: string, context?: unknown) => void;
  readonly debug: (message: string, context?: unknown) => void;
}

/** Configuration for the OAuth proxy route handlers. */
export interface OAuthProxyConfig {
  readonly upstreamBaseUrl: string;
  readonly logger: ProxyLogger;
  readonly timeoutMs?: number;
  /** Injected fetch function for testability. Defaults to `globalThis.fetch`. */
  readonly fetch?: typeof globalThis.fetch;
}

/** Upstream timed out (AbortError from AbortController). */
interface ProxyTimeoutError {
  readonly kind: 'timeout';
}

/** Upstream unreachable (DNS failure, connection refused, etc.). */
interface ProxyNetworkError {
  readonly kind: 'network';
  readonly cause: Error;
}

/** Discriminated union of proxy-level fetch failures. */
type ProxyFetchError = ProxyTimeoutError | ProxyNetworkError;

/**
 * Fetches from the upstream AS with a timeout, returning a typed Result.
 * Timeout and network failures are captured as discriminated error variants
 * rather than thrown as `unknown`.
 */
async function fetchUpstream(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetchFn: typeof globalThis.fetch,
): Promise<Result<globalThis.Response, ProxyFetchError>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(url, { ...init, signal: controller.signal });
    return ok(response);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return err({ kind: 'timeout' });
    }
    return err({ kind: 'network', cause: e instanceof Error ? e : new Error(String(e)) });
  } finally {
    clearTimeout(timer);
  }
}

function respondProxyError(
  proxyError: ProxyFetchError,
  res: ExpressResponse,
  log: ProxyLogger,
  context: { readonly upstreamUrl: string; readonly duration: number },
): void {
  const status = proxyError.kind === 'timeout' ? 504 : 502;
  log.error('oauth-proxy.upstream.error', { ...context, status, errorKind: proxyError.kind });
  res
    .status(status)
    .json(
      formatProxyErrorResponse(
        'temporarily_unavailable',
        'Upstream authorization server is not responding',
      ),
    );
}

async function handleRegister(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
  timeout: number,
  fetchFn: typeof globalThis.fetch,
): Promise<void> {
  const upstreamUrl = `${config.upstreamBaseUrl}/oauth/register`;
  const start = Date.now();
  config.logger.info('oauth-proxy.register.start', { upstreamUrl });

  const result = await fetchUpstream(
    upstreamUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    },
    timeout,
    fetchFn,
  );

  if (!result.ok) {
    respondProxyError(result.error, res, config.logger, {
      upstreamUrl,
      duration: Date.now() - start,
    });
    return;
  }

  const body: unknown = await result.value.json();
  config.logger.info('oauth-proxy.register.complete', {
    upstreamUrl,
    status: result.value.status,
    duration: Date.now() - start,
  });
  res.status(result.value.status).json(body);
}

function handleAuthorize(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
): void {
  const upstreamAuthorizeUrl = `${config.upstreamBaseUrl}/oauth/authorize`;
  // req.url (not req.originalUrl) — identical here because the router mounts at '/'.
  const queryStart = req.url.indexOf('?');
  const rawQuery = queryStart >= 0 ? req.url.substring(queryStart + 1) : '';
  const queryParams = new URLSearchParams(rawQuery);
  const redirectUrl = buildAuthorizeRedirectUrl(upstreamAuthorizeUrl, queryParams);
  config.logger.info('oauth-proxy.authorize.redirect', {
    upstreamUrl: upstreamAuthorizeUrl,
    paramCount: queryParams.size,
  });
  res.redirect(redirectUrl);
}

async function handleToken(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
  timeout: number,
  fetchFn: typeof globalThis.fetch,
): Promise<void> {
  const rawBody = typeof req.body === 'string' ? req.body : '';
  const upstreamUrl = `${config.upstreamBaseUrl}/oauth/token`;
  const start = Date.now();
  config.logger.info('oauth-proxy.token.start', { upstreamUrl });

  const result = await fetchUpstream(
    upstreamUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: rawBody,
    },
    timeout,
    fetchFn,
  );

  if (!result.ok) {
    respondProxyError(result.error, res, config.logger, {
      upstreamUrl,
      duration: Date.now() - start,
    });
    return;
  }

  const responseBody: unknown = await result.value.json();
  config.logger.info('oauth-proxy.token.complete', {
    upstreamUrl,
    status: result.value.status,
    duration: Date.now() - start,
  });
  res.status(result.value.status).json(responseBody);
}

export function createOAuthProxyRoutes(config: OAuthProxyConfig): Router {
  const router = Router();
  const timeout = config.timeoutMs ?? 10000;
  const fetchFn = config.fetch ?? globalThis.fetch;

  function asyncRoute(
    handler: (req: ExpressRequest, res: ExpressResponse) => Promise<void>,
  ): (req: ExpressRequest, res: ExpressResponse) => void {
    return (req, res) => {
      handler(req, res).catch((err: unknown) => {
        config.logger.error('oauth-proxy.unhandled-error', { err, path: req.path });
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
