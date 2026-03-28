import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import type { LogContextInput } from '@oaknational/logger';
import { createAssetDownloadRoute, type AssetDownloadRouteDeps } from './asset-download-route.js';
import type { HttpObservability } from '../observability/http-observability.js';

const VALID_HEX_SIG = 'a'.repeat(64);
function createStubLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    child: vi.fn().mockReturnThis(),
  };
}
function createStubDeps(overrides?: Partial<AssetDownloadRouteDeps>): AssetDownloadRouteDeps {
  return {
    validateSignature: () => ({ valid: true }),
    oakApiKey: 'test-api-key',
    signingSecret: 'test-signing-secret',
    oakApiBaseUrl: 'https://test-api.example.com/api/v0',
    logger: createStubLogger() as unknown as AssetDownloadRouteDeps['logger'],
    fetch: vi.fn(),
    now: () => Date.now(),
    ...overrides,
  };
}

interface ObservabilitySpy extends Pick<HttpObservability, 'captureHandledError' | 'withSpan'> {
  readonly handledErrors: readonly {
    readonly error: unknown;
    readonly context?: LogContextInput;
  }[];
  readonly setAttribute: ReturnType<typeof vi.fn>;
  readonly spanCalls: readonly {
    readonly name: string;
    readonly attributes?: Record<string, unknown>;
  }[];
}

function createObservabilitySpy(): ObservabilitySpy {
  const handledErrors: { readonly error: unknown; readonly context?: LogContextInput }[] = [];
  const setAttribute = vi.fn<(name: string, value: unknown) => void>();
  const spanCalls: {
    readonly name: string;
    readonly attributes?: Record<string, unknown>;
  }[] = [];
  const withSpan: HttpObservability['withSpan'] = async ({ name, attributes, run }) => {
    spanCalls.push({ name, attributes });

    return await run({
      setAttribute,
      setAttributes(): void {
        // No-op in integration test.
      },
    });
  };
  const captureHandledError: HttpObservability['captureHandledError'] = (error, context) => {
    handledErrors.push({ error, context });
  };

  return {
    captureHandledError,
    handledErrors,
    setAttribute,
    spanCalls,
    withSpan,
  };
}
function createMockReqRes(params: Record<string, string>, query: Record<string, string>) {
  const req = { params, query } as unknown as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn(),
    end: vi.fn(),
    headersSent: false,
    writableEnded: false,
    once: vi.fn(),
    on: vi.fn(),
    destroy: vi.fn(),
  } as unknown as Response;
  const next: NextFunction = vi.fn();
  return { req, res, next };
}
function createUpstreamResponse(
  status: number,
  body: string | null,
  headers?: Record<string, string>,
): globalThis.Response {
  const headerMap = new Map<string, string>();
  if (headers) {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) {
        headerMap.set(key, value);
      }
    }
  }
  const responseBody =
    body !== null
      ? new ReadableStream({
          start(c) {
            c.enqueue(new TextEncoder().encode(body));
            c.close();
          },
        })
      : null;
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => headerMap.get(name) ?? null },
    body: responseBody,
  } as unknown as globalThis.Response;
}
describe('createAssetDownloadRoute — parameter validation', () => {
  it('returns 400 for missing lesson parameter', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes({}, { sig: VALID_HEX_SIG, exp: '999999999999' });
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing lesson parameter' });
  });

  it('returns 400 for invalid asset type', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'invalidType' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid asset type' });
  });

  it('returns 400 for missing sig parameter', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sig parameter' });
  });

  it('returns 400 for non-hex sig parameter', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: 'not-hex-and-wrong-length', exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid sig parameter' });
  });

  it('returns 400 for invalid exp parameter', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: 'not-a-number' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid exp parameter' });
  });

  it('returns 400 for missing exp parameter', async () => {
    const handler = createAssetDownloadRoute(createStubDeps());
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid exp parameter' });
  });
});
describe('createAssetDownloadRoute — signature validation', () => {
  it('returns 403 when signature validation fails', async () => {
    const deps = createStubDeps({
      validateSignature: () => ({ valid: false, reason: 'Download link has expired' }),
    });
    const handler = createAssetDownloadRoute(deps);
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Download link has expired' });
  });

  it('logs a warning when signature validation fails', async () => {
    const logger = createStubLogger();
    const deps = createStubDeps({
      validateSignature: () => ({ valid: false, reason: 'Invalid signature' }),
      logger: logger as unknown as AssetDownloadRouteDeps['logger'],
    });
    const handler = createAssetDownloadRoute(deps);
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(logger.warn).toHaveBeenCalledWith(
      'asset-download.signature.invalid',
      expect.objectContaining({
        lesson: 'my-lesson',
        type: 'worksheet',
        reason: 'Invalid signature',
      }),
    );
  });
});
describe('createAssetDownloadRoute — upstream proxy', () => {
  it('proxies a successful upstream response with correct headers', async () => {
    const observability = createObservabilitySpy();
    const stubFetch = vi.fn().mockResolvedValue(
      createUpstreamResponse(200, 'file-content', {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="lesson.pdf"',
        'content-length': '12',
      }),
    );
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch, observability }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(stubFetch).toHaveBeenCalledWith(
      'https://test-api.example.com/api/v0/lessons/my-lesson/assets/worksheet',
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-api-key' },
        redirect: 'follow',
      }),
    );
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="lesson.pdf"',
    );
    expect(res.setHeader).toHaveBeenCalledWith('Content-Length', '12');
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    const expectedFetchAttrs: unknown = expect.objectContaining({
      'http.route': '/assets/download/:lesson/:type',
      'oak.asset.type': 'worksheet',
      'oak.upstream.host': 'test-api.example.com',
    });
    const expectedStreamAttrs: unknown = expect.objectContaining({
      'http.route': '/assets/download/:lesson/:type',
      'oak.asset.type': 'worksheet',
      'oak.upstream.host': 'test-api.example.com',
    });
    expect(observability.spanCalls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'oak.http.asset-download.fetch',
          attributes: expectedFetchAttrs,
        }),
        expect.objectContaining({
          name: 'oak.http.asset-download.stream',
          attributes: expectedStreamAttrs,
        }),
      ]),
    );
    expect(observability.setAttribute).toHaveBeenCalledWith('oak.upstream.status', 200);
  });

  it('never calls next (handler is terminal)', async () => {
    const stubFetch = vi.fn().mockResolvedValue(
      createUpstreamResponse(200, 'file-content', {
        'content-type': 'application/pdf',
      }),
    );
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('maps non-2xx upstream responses to 502', async () => {
    const observability = createObservabilitySpy();
    const stubFetch = vi.fn().mockResolvedValue(createUpstreamResponse(404, null));
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch, observability }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'Upstream error' });
    expect(observability.handledErrors).toHaveLength(0);
  });

  it('returns 502 when upstream fetch throws', async () => {
    const observability = createObservabilitySpy();
    const stubFetch = vi.fn().mockRejectedValue(new Error('network failure'));
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch, observability }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'Proxy error' });
    const expectedProxyError: unknown = expect.any(Error);
    const expectedProxyContext: unknown = expect.objectContaining({
      boundary: 'asset_download_proxy',
      lesson: 'my-lesson',
      type: 'worksheet',
    });
    expect(observability.handledErrors).toEqual([
      expect.objectContaining({
        error: expectedProxyError,
        context: expectedProxyContext,
      }),
    ]);
  });

  it('returns 502 when upstream response has no body', async () => {
    const observability = createObservabilitySpy();
    const stubFetch = vi.fn().mockResolvedValue(createUpstreamResponse(200, null));
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch, observability }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'Upstream response has no body' });
    const expectedNoBodyError: unknown = expect.any(Error);
    const expectedNoBodyContext: unknown = expect.objectContaining({
      boundary: 'asset_download_no_body',
      lesson: 'my-lesson',
      type: 'worksheet',
    });
    expect(observability.handledErrors).toEqual([
      expect.objectContaining({
        error: expectedNoBodyError,
        context: expectedNoBodyContext,
      }),
    ]);
  });

  it('classifies upstream 401 as auth error in logs', async () => {
    const logger = createStubLogger();
    const stubFetch = vi.fn().mockResolvedValue(createUpstreamResponse(401, null));
    const deps = createStubDeps({
      fetch: stubFetch,
      logger: logger as unknown as AssetDownloadRouteDeps['logger'],
    });
    const handler = createAssetDownloadRoute(deps);
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(logger.error).toHaveBeenCalledWith(
      'asset-download.auth-error',
      expect.objectContaining({ status: 401 }),
    );
  });

  it('classifies upstream 500 as service error in logs', async () => {
    const logger = createStubLogger();
    const stubFetch = vi.fn().mockResolvedValue(createUpstreamResponse(500, null));
    const deps = createStubDeps({
      fetch: stubFetch,
      logger: logger as unknown as AssetDownloadRouteDeps['logger'],
    });
    const handler = createAssetDownloadRoute(deps);
    const { req, res, next } = createMockReqRes(
      { lesson: 'my-lesson', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(logger.warn).toHaveBeenCalledWith(
      'asset-download.upstream-service-error',
      expect.objectContaining({ status: 500 }),
    );
  });

  it('URL-encodes lesson and type in upstream request', async () => {
    const stubFetch = vi.fn().mockResolvedValue(createUpstreamResponse(200, null));
    const handler = createAssetDownloadRoute(createStubDeps({ fetch: stubFetch }));
    const { req, res, next } = createMockReqRes(
      { lesson: 'lesson/with spaces', type: 'worksheet' },
      { sig: VALID_HEX_SIG, exp: '999999999999' },
    );
    await handler(req, res, next);
    expect(stubFetch).toHaveBeenCalledWith(
      expect.stringContaining('lesson%2Fwith%20spaces'),
      expect.anything(),
    );
  });
});
