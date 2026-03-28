/**
 * Express route handler for the asset download proxy.
 *
 * Validates HMAC-signed URLs and proxies authenticated requests to the
 * Oak API, streaming the binary response back to the user's browser.
 * No Clerk auth required — the HMAC signature IS the authentication.
 */
import type { Express, RequestHandler, Request } from 'express';
import { normalizeError } from '@oaknational/logger';
import type { Logger } from '@oaknational/logger';
import {
  isAssetType,
  createDownloadSignature,
  validateDownloadSignature,
  deriveSigningSecret,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { HttpObservability } from '../observability/http-observability.js';
import { proxyUpstreamAsset, type ValidatedParams } from './asset-proxy.js';

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
  readonly observability?: Pick<HttpObservability, 'captureHandledError' | 'withSpan'>;
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
      deps.logger.error('asset-download.proxy.error', normalizeError(error));
      deps.observability?.captureHandledError(error, {
        boundary: 'asset_download_proxy',
        lesson: validated.lesson,
        type: validated.type,
      });
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
  observability?: Pick<HttpObservability, 'captureHandledError' | 'withSpan'>,
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
      observability,
    }),
  );
  log.info('bootstrap.asset-download.route.mounted', { baseUrl });
  return createAssetDownloadUrlFactory(baseUrl, createDownloadSignature, signingSecret);
}
