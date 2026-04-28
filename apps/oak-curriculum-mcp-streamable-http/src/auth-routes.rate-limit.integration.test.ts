/**
 * Integration test proving the four `/.well-known/*` OAuth metadata
 * endpoints return 429 when the per-IP `metadataRateLimiter` is exceeded.
 *
 * Closes CodeQL `js/missing-rate-limiting` alert #5
 * (`auth-routes.ts:78`, `/.well-known/oauth-protected-resource/mcp`).
 *
 * Architecture context: a separate `METADATA_RATE_LIMIT` profile is used
 * (not `OAUTH_RATE_LIMIT`) because protocol-discovery traffic and OAuth
 * flow traffic are semantically distinct categories. CDN cache-miss
 * bursts from many clients sharing a Vercel PoP IP would 429 metadata
 * discovery if it shared the OAuth flow's strict 30-req/15-min bucket.
 *
 * @see architecture-reviewer-betty MAJOR-A absorption in
 *   `.agent/plans/observability/current/pr-87-quality-finding-resolution.plan.md`.
 */
import { describe, it, expect } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';

import { registerPublicOAuthMetadataEndpoints } from './auth-routes.js';
import { createDefaultRateLimiterFactory } from './rate-limiting/rate-limiter-factory.js';
import { createFakeLogger } from './test-helpers/logger-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from '../e2e-tests/helpers/upstream-metadata-fixture.js';

function buildApp(metadataRateLimiterLimit: number, useStubTools: boolean): Express {
  const factory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
  const metadataRateLimiter = factory({
    windowMs: 60_000,
    limit: metadataRateLimiterLimit,
    message: {
      error: 'too_many_requests',
      error_description: 'Rate limit exceeded. Try again later.',
    },
  });

  const runtimeConfig = { ...createMockRuntimeConfig(), useStubTools };

  const app = express();
  registerPublicOAuthMetadataEndpoints(
    app,
    runtimeConfig,
    TEST_UPSTREAM_METADATA,
    createFakeLogger(),
    ['localhost', '127.0.0.1'],
    metadataRateLimiter,
  );
  return app;
}

describe('OAuth metadata route rate limiting (CodeQL #5)', () => {
  it('returns 429 with OAuth error shape after exceeding limit on /.well-known/oauth-protected-resource', async () => {
    const app = buildApp(1, false);

    const res1 = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res1.status).not.toBe(429);

    const res2 = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res2.status).toBe(429);
    expect(res2.body).toStrictEqual({
      error: 'too_many_requests',
      error_description: 'Rate limit exceeded. Try again later.',
    });
  });

  it('returns 429 on /.well-known/oauth-protected-resource/mcp (RFC 9728 path-qualified PRM)', async () => {
    const app = buildApp(1, false);

    const res1 = await request(app).get('/.well-known/oauth-protected-resource/mcp');
    expect(res1.status).not.toBe(429);

    const res2 = await request(app).get('/.well-known/oauth-protected-resource/mcp');
    expect(res2.status).toBe(429);
  });

  it('returns 429 on /.well-known/oauth-authorization-server (AS metadata)', async () => {
    const app = buildApp(1, false);

    const res1 = await request(app).get('/.well-known/oauth-authorization-server');
    expect(res1.status).not.toBe(429);

    const res2 = await request(app).get('/.well-known/oauth-authorization-server');
    expect(res2.status).toBe(429);
  });

  it('returns 429 on /.well-known/mcp-stub-mode with OAuth error body when stub tools enabled', async () => {
    const app = buildApp(1, true);

    const res1 = await request(app).get('/.well-known/mcp-stub-mode');
    expect(res1.status).not.toBe(429);

    const res2 = await request(app).get('/.well-known/mcp-stub-mode');
    expect(res2.status).toBe(429);
    expect(res2.body).toStrictEqual({
      error: 'too_many_requests',
      error_description: 'Rate limit exceeded. Try again later.',
    });
  });

  it('does not register /.well-known/mcp-stub-mode when stub tools disabled', async () => {
    const app = buildApp(1, false);
    const res = await request(app).get('/.well-known/mcp-stub-mode');
    expect(res.status).toBe(404);
  });
});
