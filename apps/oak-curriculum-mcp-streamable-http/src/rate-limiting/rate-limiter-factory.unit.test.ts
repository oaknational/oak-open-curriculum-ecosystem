import type { Request } from 'express';
import { ipKeyGenerator } from 'express-rate-limit';
import { describe, it, expect } from 'vitest';

import {
  createDefaultRateLimiterFactory,
  vercelAwareKeyGenerator,
} from './rate-limiter-factory.js';

describe('createDefaultRateLimiterFactory', () => {
  it('returns a factory that produces middleware functions', () => {
    const factory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
    const middleware = factory({
      windowMs: 60_000,
      limit: 10,
      message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
    });

    expect(typeof middleware).toBe('function');
  });

  it('accepts an explicit Vercel-runtime configuration', () => {
    const factory = createDefaultRateLimiterFactory({ isVercelRuntime: true });
    const middleware = factory({
      windowMs: 60_000,
      limit: 10,
      message: { error: 'Too Many Requests', message: 'Rate limit exceeded.' },
    });

    expect(typeof middleware).toBe('function');
  });
});

function buildRequest(
  partial: Partial<Pick<Request, 'headers' | 'ip'>>,
): Pick<Request, 'headers' | 'ip'> {
  return {
    headers: partial.headers ?? {},
    ip: partial.ip ?? undefined,
  };
}

describe('vercelAwareKeyGenerator on Vercel runtime', () => {
  const vercelOptions = { isVercelRuntime: true } as const;

  it('returns ipKeyGenerator output when x-vercel-forwarded-for has a single IPv4 entry', () => {
    const req = buildRequest({
      headers: { 'x-vercel-forwarded-for': '203.0.113.5' },
      ip: '127.0.0.1',
    });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('203.0.113.5', 56));
  });

  it('takes the first comma-split entry of x-vercel-forwarded-for and trims surrounding whitespace', () => {
    const req = buildRequest({
      headers: { 'x-vercel-forwarded-for': ' 198.51.100.42 , 10.0.0.1 ' },
      ip: '127.0.0.1',
    });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('198.51.100.42', 56));
  });

  it('falls back to req.ip when x-vercel-forwarded-for is absent', () => {
    const req = buildRequest({ headers: {}, ip: '192.0.2.99' });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('192.0.2.99', 56));
  });

  it('returns the empty-IP key when both header and req.ip are absent', () => {
    const req = buildRequest({ headers: {}, ip: undefined });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('', 56));
  });

  it('reads the first entry when x-vercel-forwarded-for is surfaced as a string array', () => {
    const req = buildRequest({
      headers: { 'x-vercel-forwarded-for': ['172.16.254.1', '10.0.0.1'] },
      ip: '127.0.0.1',
    });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('172.16.254.1', 56));
  });

  it('never consults x-forwarded-for when x-vercel-forwarded-for is absent', () => {
    const req = buildRequest({
      headers: { 'x-forwarded-for': '9.9.9.9' },
      ip: '192.0.2.99',
    });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(ipKeyGenerator('192.0.2.99', 56));
    expect(vercelAwareKeyGenerator(req, vercelOptions)).not.toBe(ipKeyGenerator('9.9.9.9', 56));
  });

  it('subnets IPv6 addresses to the /56 mask via ipKeyGenerator', () => {
    const req = buildRequest({
      headers: { 'x-vercel-forwarded-for': '2001:db8:abcd:0012:0000:0000:0000:0001' },
      ip: '127.0.0.1',
    });

    expect(vercelAwareKeyGenerator(req, vercelOptions)).toBe(
      ipKeyGenerator('2001:db8:abcd:0012:0000:0000:0000:0001', 56),
    );
  });
});

describe('vercelAwareKeyGenerator on non-Vercel runtime', () => {
  const nonVercelOptions = { isVercelRuntime: false } as const;

  it('ignores client-supplied x-vercel-forwarded-for and uses req.ip instead', () => {
    // Critical security invariant: a non-Vercel deployment must never
    // trust x-vercel-forwarded-for from a client because any client
    // could spoof it. Identified during PR-87 Phase 2.0.5
    // security re-review (2026-04-28).
    const req = buildRequest({
      headers: { 'x-vercel-forwarded-for': '9.9.9.9' },
      ip: '127.0.0.1',
    });

    expect(vercelAwareKeyGenerator(req, nonVercelOptions)).toBe(ipKeyGenerator('127.0.0.1', 56));
    expect(vercelAwareKeyGenerator(req, nonVercelOptions)).not.toBe(ipKeyGenerator('9.9.9.9', 56));
  });

  it('falls back to req.ip when no headers are present', () => {
    const req = buildRequest({ headers: {}, ip: '203.0.113.99' });

    expect(vercelAwareKeyGenerator(req, nonVercelOptions)).toBe(ipKeyGenerator('203.0.113.99', 56));
  });
});
