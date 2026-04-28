/**
 * Integration test proving OAuth proxy routes return 429 when the
 * per-IP rate limit is exceeded.
 */
import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

import { createOAuthProxyRoutes } from '../oauth-proxy/oauth-proxy-routes.js';
import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';

const UPSTREAM_BASE = 'https://fake-clerk.example.com';

const stubLogger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  debug: () => undefined,
} as const;

describe('OAuth route rate limiting', () => {
  it('returns 429 with OAuth error shape after exceeding limit on POST /oauth/register', async () => {
    const factory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
    const oauthLimiter = factory({
      windowMs: 60_000,
      limit: 1,
      message: {
        error: 'too_many_requests',
        error_description: 'Rate limit exceeded. Try again later.',
      },
    });

    // Use a fake fetch that returns a valid registration response
    const fakeFetch = () =>
      Promise.resolve(
        new Response(JSON.stringify({ client_id: 'test', client_secret: 'secret' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const app = express();
    app.use(express.json());
    app.use(
      createOAuthProxyRoutes({
        config: {
          upstreamBaseUrl: UPSTREAM_BASE,
          logger: stubLogger,
          fetch: fakeFetch,
          timeoutMs: 2000,
        },
        oauthRateLimiter: oauthLimiter,
      }),
    );

    // First request — allowed
    const res1 = await request(app)
      .post('/oauth/register')
      .set('Content-Type', 'application/json')
      .send({ client_name: 'test-client', redirect_uris: ['http://localhost/callback'] });
    expect(res1.status).not.toBe(429);

    // Second request — rate limited
    const res2 = await request(app)
      .post('/oauth/register')
      .set('Content-Type', 'application/json')
      .send({ client_name: 'test-client', redirect_uris: ['http://localhost/callback'] });
    expect(res2.status).toBe(429);
    expect(res2.body).toStrictEqual({
      error: 'too_many_requests',
      error_description: 'Rate limit exceeded. Try again later.',
    });
  });

  it('rate-limits GET /oauth/authorize (amplification vector)', async () => {
    const factory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
    const oauthLimiter = factory({
      windowMs: 60_000,
      limit: 1,
      message: {
        error: 'too_many_requests',
        error_description: 'Rate limit exceeded. Try again later.',
      },
    });

    const app = express();
    app.use(
      createOAuthProxyRoutes({
        config: {
          upstreamBaseUrl: UPSTREAM_BASE,
          logger: stubLogger,
          timeoutMs: 2000,
        },
        oauthRateLimiter: oauthLimiter,
      }),
    );

    // First request — should redirect (302) or similar
    await request(app).get('/oauth/authorize?response_type=code&client_id=test');

    // Second request — rate limited
    const res2 = await request(app).get('/oauth/authorize?response_type=code&client_id=test');
    expect(res2.status).toBe(429);
  });
});
