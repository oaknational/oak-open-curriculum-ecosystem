/**
 * Integration test proving the asset download route returns 429 when the
 * per-IP rate limit is exceeded.
 */
import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

import { mountAssetDownloadProxy } from '../asset-download/asset-download-route.js';
import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';
import { createFakeLogger } from '../test-helpers/logger-fakes.js';

describe('asset download route rate limiting', () => {
  it('returns 429 after exceeding the per-IP limit', async () => {
    const factory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
    const assetLimiter = factory({
      windowMs: 60_000,
      limit: 1,
      message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again later.' },
    });

    const app = express();
    mountAssetDownloadProxy(
      app,
      'http://localhost:3333',
      'test-api-key-that-is-long-enough-for-hmac-derivation',
      createFakeLogger(),
      'https://open-api.thenational.academy/api/v0',
      undefined,
      assetLimiter,
    );

    // First request — fails signature validation (400) but is NOT rate-limited
    const res1 = await request(app).get(
      '/assets/download/test-lesson/slide-deck?sig=abc&exp=9999999999',
    );
    expect(res1.status).not.toBe(429);

    // Second request — rate limited before reaching the handler
    const res2 = await request(app).get(
      '/assets/download/test-lesson/slide-deck?sig=abc&exp=9999999999',
    );
    expect(res2.status).toBe(429);
    expect(res2.body).toStrictEqual({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Try again later.',
    });
  });
});
