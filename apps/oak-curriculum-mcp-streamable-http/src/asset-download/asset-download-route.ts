/**
 * Express route handler for the asset download proxy.
 *
 * Validates HMAC-signed URLs and proxies authenticated requests to the
 * Oak API, streaming the binary response back to the user's browser.
 * No Clerk auth required — the HMAC signature IS the authentication.
 */
import type { Express, RequestHandler, Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';
import { Readable } from 'node:stream';
import {
  isAssetType,
  createDownloadSignature,
  validateDownloadSignature,
  deriveSigningSecret,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/** Regex matching a 64-character lowercase hex string (SHA-256 output). */
const HEX_SHA256_PATTERN = /^[a-f0-9]{64}$/;

/**
 * Dependencies injected into the asset download route.
 * All external capabilities are injected for testability per ADR-078.
 */
export interface AssetDownloadRouteDeps {
  readonly validateSignature: (
    lesson: string,
    type: string,
    signature: string,
    expiresAt: number,
    secret: string,
    nowMs: number,
  ) => { readonly valid: true } | { readonly valid: false; readonly reason: string };
  readonly oakApiKey: string;
  readonly signingSecret: string;
  readonly oakApiBaseUrl: string;
  readonly logger: Logger;
  readonly fetch: typeof globalThis.fetch;
  readonly now: () => number;
}

interface ValidatedParams {
  readonly lesson: string;
  readonly type: string;
  readonly sig: string;
  readonly expiresAt: number;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function validateRequestParams(req: Request): ValidatedParams | string {
  const { lesson, type } = req.params;
  const { sig, exp } = req.query;
  if (!isNonEmptyString(lesson)) {
    return 'Missing lesson parameter';
  }
  if (!isNonEmptyString(type) || !isAssetType(type)) {
    return 'Invalid asset type';
  }
  if (!isNonEmptyString(sig) || !HEX_SHA256_PATTERN.test(sig)) {
    return 'Invalid sig parameter';
  }
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt)) {
    return 'Invalid exp parameter';
  }
  return { lesson, type, sig, expiresAt };
}

function forwardResponseHeaders(upstream: globalThis.Response, res: Response): void {
  const contentType = upstream.headers.get('content-type');
  const contentDisposition = upstream.headers.get('content-disposition');
  const contentLength = upstream.headers.get('content-length');
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
  if (contentDisposition) {
    res.setHeader('Content-Disposition', contentDisposition);
  }
  if (contentLength) {
    res.setHeader('Content-Length', contentLength);
  }
}

/** Logs upstream errors classified by HTTP status for operational observability. */
function logUpstreamError(
  deps: AssetDownloadRouteDeps,
  params: ValidatedParams,
  status: number,
): void {
  const context = { lesson: params.lesson, type: params.type, status };
  if (status === 401 || status === 403) {
    deps.logger.error('asset-download.auth-error', context);
  } else if (status === 404) {
    deps.logger.warn('asset-download.not-found', context);
  } else if (status >= 500) {
    deps.logger.warn('asset-download.upstream-service-error', context);
  } else {
    deps.logger.warn('asset-download.upstream.error', context);
  }
}

async function proxyUpstreamAsset(
  params: ValidatedParams,
  deps: AssetDownloadRouteDeps,
  res: Response,
): Promise<void> {
  const url = `${deps.oakApiBaseUrl}/lessons/${encodeURIComponent(params.lesson)}/assets/${encodeURIComponent(params.type)}`;
  const controller = new AbortController();
  res.once('close', () => {
    if (!res.writableEnded) {
      controller.abort();
    }
  });

  // Combine client-disconnect abort with a 30s upstream timeout guard (FD exhaustion defence)
  const timeout = AbortSignal.timeout(30_000);
  const combined = AbortSignal.any([controller.signal, timeout]);
  const upstream = await deps.fetch(url, {
    headers: { Authorization: `Bearer ${deps.oakApiKey}` },
    redirect: 'follow',
    signal: combined,
  });

  if (!upstream.ok) {
    logUpstreamError(deps, params, upstream.status);
    // Map all upstream errors to 502 — never forward internal API status codes to the client
    res.status(502).json({ error: 'Upstream error' });
    return;
  }

  forwardResponseHeaders(upstream, res);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (upstream.body) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions -- Node ReadableStream ↔ web ReadableStream type gap; runtime-safe
    const readable = Readable.fromWeb(upstream.body as any);
    readable.on('error', (error) => {
      deps.logger.error('asset-download.stream.error', { error });
      if (!res.headersSent) {
        res.status(502).json({ error: 'Download stream error' });
      }
      res.destroy();
    });
    res.on('error', (error) => {
      deps.logger.error('asset-download.response.error', { error });
    });
    readable.pipe(res);
  } else {
    res.status(502).json({ error: 'Upstream response has no body' });
  }
}

/** Creates an Express request handler for the asset download proxy. */
export function createAssetDownloadRoute(deps: AssetDownloadRouteDeps): RequestHandler {
  return async (req, res) => {
    const validated = validateRequestParams(req);
    if (typeof validated === 'string') {
      res.status(400).json({ error: validated });
      return;
    }
    const result = deps.validateSignature(
      validated.lesson,
      validated.type,
      validated.sig,
      validated.expiresAt,
      deps.signingSecret,
      deps.now(),
    );
    if (!result.valid) {
      deps.logger.warn('asset-download.signature.invalid', {
        lesson: validated.lesson,
        type: validated.type,
        reason: result.reason,
      });
      res.status(403).json({ error: result.reason });
      return;
    }
    try {
      await proxyUpstreamAsset(validated, deps, res);
    } catch (error: unknown) {
      deps.logger.error('asset-download.proxy.error', { error });
      if (!res.headersSent) {
        res.status(502).json({ error: 'Proxy error' });
      }
    }
  };
}

/** Default TTL for download URLs: 5 minutes. */
export const DOWNLOAD_TTL_MS = 5 * 60 * 1000;

/** Creates the URL factory function for generating signed download URLs. */
export function createAssetDownloadUrlFactory(
  baseUrl: string,
  createSignature: (lesson: string, type: string, expiresAt: number, secret: string) => string,
  secret: string,
  ttlMs: number = DOWNLOAD_TTL_MS,
  clock: () => number = Date.now,
): (lesson: string, type: string) => string {
  return (lesson: string, type: string): string => {
    const exp = clock() + ttlMs;
    const sig = createSignature(lesson, type, exp, secret);
    return `${baseUrl}/assets/download/${encodeURIComponent(lesson)}/${encodeURIComponent(type)}?sig=${sig}&exp=${String(exp)}`;
  };
}

/**
 * Mounts the asset download proxy route and returns the URL factory for
 * generating signed download URLs.
 */
export function mountAssetDownloadProxy(
  app: Express,
  baseUrl: string,
  oakApiKey: string,
  log: Logger,
  oakApiBaseUrl: string,
): (lesson: string, type: string) => string {
  const signingSecret = deriveSigningSecret(oakApiKey);
  app.get(
    '/assets/download/:lesson/:type',
    createAssetDownloadRoute({
      validateSignature: validateDownloadSignature,
      oakApiKey,
      signingSecret,
      oakApiBaseUrl,
      logger: log,
      fetch: globalThis.fetch,
      now: Date.now,
    }),
  );
  log.info('bootstrap.asset-download.route.mounted', { baseUrl });
  return createAssetDownloadUrlFactory(baseUrl, createDownloadSignature, signingSecret);
}
