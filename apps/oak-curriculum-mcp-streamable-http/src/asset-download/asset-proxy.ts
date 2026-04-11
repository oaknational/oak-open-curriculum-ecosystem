/**
 * Upstream asset proxy logic: fetches from Oak API and streams to the client.
 *
 * Extracted from `asset-download-route.ts` to keep each module under the
 * file-length lint ceiling.
 */

import { normalizeError } from '@oaknational/logger';
import type { Logger } from '@oaknational/logger';
import { Readable } from 'node:stream';
import type { Response } from 'express';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

interface AssetProxyDeps {
  readonly oakApiKey: string;
  readonly oakApiBaseUrl: string;
  readonly logger: Logger;
  readonly fetch: typeof globalThis.fetch;
  readonly observability?: Pick<HttpObservability, 'captureHandledError' | 'withSpan'>;
}

export interface ValidatedParams {
  readonly lesson: string;
  readonly type: string;
  readonly sig: string;
  readonly expiresAt: number;
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
function logUpstreamError(logger: Logger, params: ValidatedParams, status: number): void {
  const context = { lesson: params.lesson, type: params.type, status };
  if (status === 401 || status === 403) {
    logger.error('asset-download.auth-error', context);
  } else if (status === 404) {
    logger.warn('asset-download.not-found', context);
  } else if (status >= 500) {
    logger.warn('asset-download.upstream-service-error', context);
  } else {
    logger.warn('asset-download.upstream.error', context);
  }
}

const noopSpanHandle: HttpSpanHandle = {
  setAttribute(): void {
    // No-op in tests and observability-off wiring.
  },
  setAttributes(): void {
    // No-op in tests and observability-off wiring.
  },
};

async function pipeUpstreamBody(
  upstreamBody: NonNullable<globalThis.Response['body']>,
  logger: Logger,
  res: Response,
): Promise<void> {
  const readable = Readable.fromWeb(upstreamBody);

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const settle = (callback: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      callback();
    };

    readable.on('end', () => {
      settle(() => resolve());
    });
    readable.on('error', (error) => {
      logger.error('asset-download.stream.error', normalizeError(error));
      if (!res.headersSent) {
        res.status(502).json({ error: 'Download stream error' });
      }
      res.destroy();
      settle(() => reject(error));
    });
    res.on('error', (error) => {
      logger.error('asset-download.response.error', normalizeError(error));
      settle(() => reject(error));
    });
    readable.pipe(res);
  });
}

function buildAssetUrl(deps: AssetProxyDeps, params: ValidatedParams): string {
  return `${deps.oakApiBaseUrl}/lessons/${encodeURIComponent(params.lesson)}/assets/${encodeURIComponent(params.type)}`;
}

function createAbortOnClose(res: Response): AbortSignal {
  const controller = new AbortController();
  res.once('close', () => {
    if (!res.writableEnded) {
      controller.abort();
    }
  });
  return AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]);
}

function buildRouteAttributes(params: ValidatedParams, deps: AssetProxyDeps) {
  return {
    'http.route': '/assets/download/:lesson/:type',
    'oak.asset.type': params.type,
    'oak.upstream.host': new URL(deps.oakApiBaseUrl).host,
  } as const;
}

async function handleUpstreamResponse(
  upstream: globalThis.Response,
  params: ValidatedParams,
  deps: AssetProxyDeps,
  res: Response,
  routeAttributes: ReturnType<typeof buildRouteAttributes>,
  span: HttpSpanHandle,
): Promise<void> {
  span.setAttribute('oak.upstream.status', upstream.status);
  if (!upstream.ok) {
    logUpstreamError(deps.logger, params, upstream.status);
    res.status(502).json({ error: 'Upstream error' });
    return;
  }
  forwardResponseHeaders(upstream, res);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const upstreamBody = upstream.body;
  if (upstreamBody) {
    await (deps.observability
      ? deps.observability.withSpan({
          name: 'oak.http.asset-download.stream',
          attributes: routeAttributes,
          run: async (streamSpan) => {
            streamSpan.setAttribute('oak.upstream.status', upstream.status);
            await pipeUpstreamBody(upstreamBody, deps.logger, res);
          },
        })
      : pipeUpstreamBody(upstreamBody, deps.logger, res));
    return;
  }
  deps.observability?.captureHandledError(new Error('Upstream response has no body'), {
    boundary: 'asset_download_no_body',
    lesson: params.lesson,
    type: params.type,
  });
  res.status(502).json({ error: 'Upstream response has no body' });
}

export async function proxyUpstreamAsset(
  params: ValidatedParams,
  deps: AssetProxyDeps,
  res: Response,
): Promise<void> {
  const url = buildAssetUrl(deps, params);
  const combined = createAbortOnClose(res);
  const routeAttributes = buildRouteAttributes(params, deps);

  const runFetch = async (span: HttpSpanHandle): Promise<void> => {
    const upstream = await deps.fetch(url, {
      headers: { Authorization: `Bearer ${deps.oakApiKey}` },
      redirect: 'follow',
      signal: combined,
    });
    await handleUpstreamResponse(upstream, params, deps, res, routeAttributes, span);
  };

  if (deps.observability) {
    await deps.observability.withSpan({
      name: 'oak.http.asset-download.fetch',
      attributes: routeAttributes,
      run: runFetch,
    });
    return;
  }
  await runFetch(noopSpanHandle);
}
