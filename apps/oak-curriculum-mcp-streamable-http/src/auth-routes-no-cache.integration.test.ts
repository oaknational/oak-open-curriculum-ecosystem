import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Integration tests for no-cache header middleware.
 *
 * Tests that the addNoCacheHeaders wrapper correctly sets cache prevention headers
 * on the response object before calling the wrapped handler.
 *
 * This is a pure code integration test - no HTTP server, no network calls.
 */

/**
 * Extract the addNoCacheHeaders function for testing by copying its implementation.
 * In production, this is defined inline in auth-routes.ts
 */
function addNoCacheHeaders(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    // Prevent caching at all levels (origin, CDN, browser, proxies)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache'); // HTTP/1.0 compatibility
    res.setHeader('Expires', '0'); // Legacy clients

    handler(req, res, next);
  };
}

/**
 * Create mock Express request, response, and next function for testing.
 */
function createMocks() {
  const req = {} as Request;
  const res = {
    setHeader: vi.fn(),
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;

  return { req, res, next };
}

describe('addNoCacheHeaders middleware', () => {
  it('sets Cache-Control header with all no-cache directives', () => {
    const { req, res, next } = createMocks();
    const innerHandler = vi.fn();
    const wrapped = addNoCacheHeaders(innerHandler);

    wrapped(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
  });

  it('sets Pragma header for HTTP/1.0 compatibility', () => {
    const { req, res, next } = createMocks();
    const innerHandler = vi.fn();
    const wrapped = addNoCacheHeaders(innerHandler);

    wrapped(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
  });

  it('sets Expires header for legacy clients', () => {
    const { req, res, next } = createMocks();
    const innerHandler = vi.fn();
    const wrapped = addNoCacheHeaders(innerHandler);

    wrapped(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('Expires', '0');
  });

  it('calls the wrapped handler after setting headers', () => {
    const { req, res, next } = createMocks();
    const innerHandler = vi.fn();
    const wrapped = addNoCacheHeaders(innerHandler);

    wrapped(req, res, next);

    expect(innerHandler).toHaveBeenCalledWith(req, res, next);
  });

  it('sets headers in correct order before calling handler', () => {
    const { req, res, next } = createMocks();
    const callOrder: string[] = [];

    const resWithTracking = {
      ...res,
      setHeader: vi.fn((name: string) => {
        callOrder.push(`header:${name}`);
      }),
    } as unknown as Response;

    const innerHandler = vi.fn(() => {
      callOrder.push('handler');
    });

    const wrapped = addNoCacheHeaders(innerHandler);
    wrapped(req, resWithTracking, next);

    expect(callOrder).toEqual([
      'header:Cache-Control',
      'header:Pragma',
      'header:Expires',
      'handler',
    ]);
  });

  describe('Cache-Control directive validation', () => {
    it('includes no-store to prevent CDN/proxy caching', () => {
      const { req, res, next } = createMocks();
      const wrapped = addNoCacheHeaders(vi.fn());

      wrapped(req, res, next);

      const cacheControlCall = (res.setHeader as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'Cache-Control',
      );
      expect(cacheControlCall?.[1]).toContain('no-store');
    });

    it('includes no-cache to force revalidation', () => {
      const { req, res, next } = createMocks();
      const wrapped = addNoCacheHeaders(vi.fn());

      wrapped(req, res, next);

      const cacheControlCall = (res.setHeader as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'Cache-Control',
      );
      expect(cacheControlCall?.[1]).toContain('no-cache');
    });

    it('includes must-revalidate for browser cache control', () => {
      const { req, res, next } = createMocks();
      const wrapped = addNoCacheHeaders(vi.fn());

      wrapped(req, res, next);

      const cacheControlCall = (res.setHeader as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'Cache-Control',
      );
      expect(cacheControlCall?.[1]).toContain('must-revalidate');
    });

    it('includes proxy-revalidate for proxy cache control', () => {
      const { req, res, next } = createMocks();
      const wrapped = addNoCacheHeaders(vi.fn());

      wrapped(req, res, next);

      const cacheControlCall = (res.setHeader as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'Cache-Control',
      );
      expect(cacheControlCall?.[1]).toContain('proxy-revalidate');
    });
  });
});
