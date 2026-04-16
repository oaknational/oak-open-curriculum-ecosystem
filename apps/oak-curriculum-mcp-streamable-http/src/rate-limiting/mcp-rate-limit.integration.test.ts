/**
 * Integration test proving MCP route rate limiting returns 429 when the
 * per-IP limit is exceeded. Uses a low-limit factory to avoid timing issues.
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';

import { createApp } from '../application.js';
import { createDefaultRateLimiterFactory } from './rate-limiter-factory.js';
import { createHttpObservabilityOrThrow } from '../observability/http-observability.js';
import { loadRuntimeConfig } from '../runtime-config.js';
import { TEST_UPSTREAM_METADATA } from '../../e2e-tests/helpers/upstream-metadata-fixture.js';

function createTestRuntimeConfig() {
  const result = loadRuntimeConfig({
    processEnv: {
      NODE_ENV: 'test',
      OAK_API_KEY: 'test-api-key',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key',
      ALLOWED_HOSTS: 'localhost,127.0.0.1',
    },
    startDir: process.cwd(),
  });
  return unwrap(result);
}

/** Creates a factory that overrides all profiles to a low limit for fast testing. */
function createLowLimitFactory(limit: number) {
  const realFactory = createDefaultRateLimiterFactory();
  const lowLimitFactory: typeof realFactory = (options) =>
    realFactory({ ...options, windowMs: 60_000, limit });
  return lowLimitFactory;
}

describe('MCP route rate limiting', () => {
  it('returns 429 with correct body and headers after exceeding the per-IP limit', async () => {
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
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
