/**
 * Integration proof that the application-layer limiter keys on
 * `x-vercel-forwarded-for` when (and only when) the runtime is Vercel.
 *
 * Test 1 (Vercel runtime, isolated buckets): two simulated clients differ
 * only in `x-vercel-forwarded-for`. Each gets an independent bucket, so
 * client B's request succeeds even though client A has exhausted the
 * configured limit.
 *
 * Test 2 (non-Vercel runtime, header ignored): two simulated clients differ
 * only in `x-vercel-forwarded-for`, but the factory is configured for
 * non-Vercel runtime. The header is ignored and both clients share the
 * `req.ip` bucket. This proves the cure does not introduce a header-spoof
 * vector on non-Vercel deployments — see the cluster-A security
 * re-review at .agent/plans/observability/active/pr-87-cluster-a-security-review.md.
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

function createLowLimitFactory(limit: number, isVercelRuntime: boolean) {
  const realFactory = createDefaultRateLimiterFactory({ isVercelRuntime });
  // Override windowMs and limit from any caller-provided options to force a
  // small bucket regardless of profile — the test asserts behaviour at the
  // limit, not the profile values themselves.
  const lowLimitFactory: typeof realFactory = (options) =>
    realFactory({ ...options, windowMs: 60_000, limit });
  return lowLimitFactory;
}

describe('rate limiter keying on x-vercel-forwarded-for under Vercel runtime', () => {
  it('isolates buckets per x-vercel-forwarded-for value across distinct simulated clients', async () => {
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createFakeHttpObservability();
    const app = await createApp({
      runtimeConfig,
      observability,
      rateLimiterFactory: createLowLimitFactory(2, true),
      getWidgetHtml: () => '<html><body>test</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });

    // Note: supertest reuses a single loopback socket across requests, so
    // every request below shares the same `req.ip`. The cure's bucket
    // isolation is therefore proved by varying ONLY the
    // x-vercel-forwarded-for header.

    // Client A — exhaust its bucket (limit = 2).
    const a1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '203.0.113.10')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 1 });
    expect(a1.status).toBeLessThan(300);

    const a2 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '203.0.113.10')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 2 });
    expect(a2.status).toBeLessThan(300);

    const a3 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '203.0.113.10')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 3 });
    expect(a3.status).toBe(429);

    // Client B — distinct x-vercel-forwarded-for, same supertest socket IP.
    // With the cure on Vercel runtime, this is an independent bucket and
    // the request succeeds even though client A is over the limit.
    const b1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '198.51.100.20')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 4 });
    expect(b1.status).toBeLessThan(300);
  }, 15_000);
});

describe('rate limiter keying on req.ip under non-Vercel runtime', () => {
  it('ignores client-supplied x-vercel-forwarded-for and shares one req.ip bucket across clients', async () => {
    const runtimeConfig = createTestRuntimeConfig();
    const observability = createFakeHttpObservability();
    const app = await createApp({
      runtimeConfig,
      observability,
      rateLimiterFactory: createLowLimitFactory(2, false),
      getWidgetHtml: () => '<html><body>test</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });

    // Both "clients" share the supertest socket IP. Client A exhausts the
    // bucket; client B's distinct x-vercel-forwarded-for is ignored on
    // non-Vercel runtime, so client B is also rate-limited.
    const a1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '203.0.113.10')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 1 });
    expect(a1.status).toBeLessThan(300);

    const a2 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '203.0.113.10')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 2 });
    expect(a2.status).toBeLessThan(300);

    const b1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Content-Type', 'application/json')
      .set('x-vercel-forwarded-for', '198.51.100.20')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 3 });
    expect(b1.status).toBe(429);
  }, 15_000);
});
