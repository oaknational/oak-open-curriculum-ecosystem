/**
 * Integration test proving MCP route rate limiting returns 429 when the
 * per-IP limit is exceeded. Uses a low-limit factory to avoid timing issues.
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '../application.js';
import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';
import { createFakeHttpObservability } from '../test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from '../../e2e-tests/helpers/upstream-metadata-fixture.js';

function createTestRuntimeConfig() {
  return createMockRuntimeConfig({
    dangerouslyDisableAuth: true,
    env: { ALLOWED_HOSTS: 'localhost,127.0.0.1' },
  });
}

/** Creates a factory that overrides all profiles to a low limit for fast testing. */
function createLowLimitFactory(limit: number) {
  const realFactory = createDefaultRateLimiterFactory({ isVercelRuntime: false });
  const lowLimitFactory: typeof realFactory = (options) =>
    realFactory({ ...options, windowMs: 60_000, limit });
  return lowLimitFactory;
}

describe('MCP route rate limiting', () => {
  it('returns 429 with correct body and headers after exceeding the per-IP limit', async () => {
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createFakeHttpObservability();
    const app = await createApp({
      runtimeConfig,
      observability,
      rateLimiterFactory: createLowLimitFactory(2),
      getWidgetHtml: () => '<html><body>test</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });

    // Full app bootstrap can take longer under concurrent turbo load.
    // Make the timeout explicit so this integration proof is stable in gates.

    // First request — allowed; verify rate limit headers are present
    const res1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 1 });
    expect(res1.status).not.toBe(429);
    expect(res1.headers['ratelimit-policy']).toBeDefined();

    // Second request — allowed
    const res2 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 2 });
    expect(res2.status).not.toBe(429);

    // Third request — rate-limited
    const res3 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 3 });
    expect(res3.status).toBe(429);
    expect(res3.body).toStrictEqual({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Try again later.',
    });
  }, 15_000);
});
