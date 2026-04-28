/**
 * Handler functions for the OAuth proxy passthrough layer.
 *
 * Extracted from `oauth-proxy-routes.ts` to keep each module under the
 * file-length lint ceiling while preserving the transparent-proxy contract.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import type { Logger } from '@oaknational/logger';

import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';

import { buildAuthorizeRedirectUrl, formatProxyErrorResponse } from './oauth-proxy-upstream.js';
import { applyParsedResponse, readUpstreamBody } from './oauth-proxy-response.js';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

/** Minimal structured logger interface for the proxy. */
export type ProxyLogger = Pick<Logger, 'debug' | 'error' | 'info' | 'warn'>;

/** Configuration for the OAuth proxy route handlers. */
export interface OAuthProxyConfig {
  readonly upstreamBaseUrl: string;
  readonly logger: ProxyLogger;
  readonly timeoutMs?: number;
  /** Injected fetch function for testability. Defaults to `globalThis.fetch`. */
  readonly fetch?: typeof globalThis.fetch;
  readonly observability?: Pick<HttpObservability, 'captureHandledError' | 'withSpan'>;
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

async function runWithOptionalSpan(
  observability: Pick<HttpObservability, 'withSpan'> | undefined,
  name: string,
  attributes: Record<string, string>,
  run: (span: HttpSpanHandle) => Promise<void>,
): Promise<void> {
  if (observability) {
    await observability.withSpan({ name, attributes, run });
    return;
  }
  await run(noopSpanHandle);
}

const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op when observability is not wired.
  },
  setAttributes(): void {
    // No-op when observability is not wired.
  },
};

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
  context: { readonly route: string; readonly upstreamUrl: string; readonly duration: number },
  observability?: Pick<HttpObservability, 'captureHandledError'>,
): void {
  const status = proxyError.kind === 'timeout' ? 504 : 502;
  log.error('oauth-proxy.upstream.error', { ...context, status, errorKind: proxyError.kind });
  observability?.captureHandledError(
    proxyError.kind === 'timeout'
      ? new Error(`OAuth proxy upstream timeout: ${context.route}`)
      : proxyError.cause,
    {
      boundary: 'oauth_proxy_upstream',
      route: context.route,
      upstreamUrl: context.upstreamUrl,
      status,
      errorKind: proxyError.kind,
    },
  );
  res
    .status(status)
    .json(
      formatProxyErrorResponse(
        'temporarily_unavailable',
        'Upstream authorization server is not responding',
      ),
    );
}

export async function handleRegister(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
  timeout: number,
  fetchFn: typeof globalThis.fetch,
): Promise<void> {
  const upstreamUrl = `${config.upstreamBaseUrl}/oauth/register`;
  const start = Date.now();
  config.logger.info('oauth-proxy.register.start', { upstreamUrl });
  const upstreamHost = new URL(upstreamUrl).host;
  const route = '/oauth/register';

  const runRegister = async (span: HttpSpanHandle): Promise<void> => {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    };
    const result = await fetchUpstream(upstreamUrl, init, timeout, fetchFn);
    if (!result.ok) {
      span.setAttribute('oak.upstream.status', result.error.kind === 'timeout' ? 504 : 502);
      const ctx = { route, upstreamUrl, duration: Date.now() - start };
      respondProxyError(result.error, res, config.logger, ctx, config.observability);
      return;
    }
    span.setAttribute('oak.upstream.status', result.value.status);
    const parsed = await readUpstreamBody(result.value, config.logger, { route, upstreamUrl });
    config.logger.info('oauth-proxy.register.complete', {
      upstreamUrl,
      status: parsed.status,
      upstreamStatus: result.value.status,
      duration: Date.now() - start,
    });
    applyParsedResponse(parsed, res);
  };

  await runWithOptionalSpan(
    config.observability,
    'oak.http.oauth-proxy.register',
    { 'http.route': route, 'oak.upstream.host': upstreamHost },
    runRegister,
  );
}

export function handleAuthorize(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
): void {
  const upstreamAuthorizeUrl = `${config.upstreamBaseUrl}/oauth/authorize`;
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

export async function handleToken(
  req: ExpressRequest,
  res: ExpressResponse,
  config: OAuthProxyConfig,
  timeout: number,
  fetchFn: typeof globalThis.fetch,
): Promise<void> {
  const rawBody = typeof req.body === 'string' ? req.body : '';
  const route = '/oauth/token';
  const upstreamUrl = `${config.upstreamBaseUrl}${route}`;
  const upstreamHost = new URL(upstreamUrl).host;
  const start = Date.now();
  config.logger.info('oauth-proxy.token.start', { upstreamUrl });

  const runToken = async (span: HttpSpanHandle): Promise<void> => {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const result = await fetchUpstream(
      upstreamUrl,
      { method: 'POST', headers, body: rawBody },
      timeout,
      fetchFn,
    );
    if (!result.ok) {
      span.setAttribute('oak.upstream.status', result.error.kind === 'timeout' ? 504 : 502);
      respondProxyError(
        result.error,
        res,
        config.logger,
        { route, upstreamUrl, duration: Date.now() - start },
        config.observability,
      );
      return;
    }
    span.setAttribute('oak.upstream.status', result.value.status);
    const parsed = await readUpstreamBody(result.value, config.logger, { route, upstreamUrl });
    config.logger.info('oauth-proxy.token.complete', {
      upstreamUrl,
      status: parsed.status,
      upstreamStatus: result.value.status,
      duration: Date.now() - start,
    });
    applyParsedResponse(parsed, res);
  };

  await runWithOptionalSpan(
    config.observability,
    'oak.http.oauth-proxy.token',
    { 'http.route': route, 'oak.upstream.host': upstreamHost },
    runToken,
  );
}
