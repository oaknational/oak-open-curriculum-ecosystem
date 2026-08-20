/**
 * The discovery-metadata caching policy, end to end (MCP-413).
 *
 * Separate from `auth-routes.integration.test.ts` because the question is
 * different: that file asks what the documents SAY, this one asks who may
 * store them. The distinction is load-bearing here — the directive is applied
 * only where the served origin is configuration rather than a request header,
 * so half these cases deliberately build a DIFFERENT app.
 */

import { describe, it, expect } from 'vitest';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

describe('Discovery metadata caching policy (Integration)', () => {
  const createTestApp = async (
    env: Record<string, string> = { ALLOWED_HOSTS: 'localhost,127.0.0.1,example.com' },
  ) =>
    await createApp({
      staticRoot: await getScratchStaticRoot(),
      runtimeConfig: createMockRuntimeConfig({ env }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      getLandingPageHtml: () =>
        '<!doctype html><html lang="en-GB"><body>test landing page</body></html>',
      upstreamMetadata: TEST_UPSTREAM_METADATA,
    });

  const DISCOVERY_CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=60';

  // Every discovery path the app serves. A directive pinned only to the RFC
  // 9728 §3.1 form would leave a client that constructs the unqualified path
  // hitting the origin on every request.
  const DISCOVERY_PATHS = [
    '/.well-known/oauth-protected-resource',
    '/.well-known/oauth-protected-resource/mcp',
    '/.well-known/oauth-authorization-server',
  ] as const;

  const CANONICAL_HOST = 'mcp.thenational.academy';

  /**
   * The canonical deployment's shape: a configured origin, and an arriving
   * Host that is deliberately NOT in the allow-list — the edge presents the
   * deployment hostname, and a configured origin must not consult it.
   */
  const createCanonicalApp = async () =>
    await createTestApp({ ALLOWED_HOSTS: 'localhost,127.0.0.1', CANONICAL_HOST });

  it.each(DISCOVERY_PATHS)('offers %s to shared caches on the canonical host', async (path) => {
    // ~28 discovery requests arrive on one ChatGPT conversation refresh (the
    // measurement behind ADR-056); storable responses are what keeps that
    // burst off the origin function.
    const app = await createCanonicalApp();

    const res = await request(app).get(path).set('Host', 'origin.example.com');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe(DISCOVERY_CACHE_CONTROL);
  });

  it.each(DISCOVERY_PATHS)(
    'withholds %s from shared caches without a configured origin',
    async (path) => {
      // Without CANONICAL_HOST the document is built from the RAW Host bytes,
      // while a cache normalises the authority it keys on (RFC 3986 §6.2) — so
      // `EXAMPLE.com` and `example.com` are one key and two documents. Sharing
      // that would let one request store a `resource` value that no longer
      // matches the URL clients used, which RFC 9728 §3.3 tells them they MUST
      // NOT use. The gate, not a comment, is what prevents it.
      const app = await createTestApp();

      const res = await request(app).get(path).set('Host', 'example.com');

      expect(res.status).toBe(200);
      expect(res.headers['cache-control']).toBeUndefined();
    },
  );

  it('serves one identical body to every Host once an origin is configured', async () => {
    // The premise the gate above relies on: a configured origin makes the
    // document requester-independent, so two requesters cannot be served
    // documents that disagree.
    const app = await createCanonicalApp();

    const viaEdge = await request(app)
      .get('/.well-known/oauth-protected-resource/mcp')
      .set('Host', 'origin.example.com');
    const viaOtherEdge = await request(app)
      .get('/.well-known/oauth-protected-resource/mcp')
      .set('Host', 'another-origin.example.com');

    expect(viaEdge.body).toHaveProperty('resource', `https://${CANONICAL_HOST}/mcp`);
    expect(viaOtherEdge.body).toEqual(viaEdge.body);
  });

  it.each(DISCOVERY_PATHS)(
    'does not store a client-supplied correlation id on %s',
    async (path) => {
      // The correlation middleware ADOPTS an incoming X-Correlation-ID and
      // echoes it. On a storable response that would persist an attacker-chosen
      // string at the edge and hand it to every later client, while naming a
      // request that appears in no log — a cache hit never reaches the origin.
      const supplied = 'CLIENT-SUPPLIED-do-not-store';
      const app = await createCanonicalApp();

      const res = await request(app)
        .get(path)
        .set('Host', 'origin.example.com')
        .set('X-Correlation-ID', supplied);

      expect(res.headers['cache-control']).toBe(DISCOVERY_CACHE_CONTROL);
      expect(res.headers['x-correlation-id']).toBeUndefined();

      // Control probe: the echo whose absence is asserted above is real, and
      // it stays on an uncached response, where the header is the documented
      // join key between our logs, Sentry and the client's own trace. Without
      // this the assertion would pass just as happily against a server that
      // never echoed at all.
      const uncached = await request(await createTestApp())
        .get(path)
        .set('Host', 'example.com')
        .set('X-Correlation-ID', supplied);

      expect(uncached.headers['cache-control']).toBeUndefined();
      expect(uncached.headers['x-correlation-id']).toBe(supplied);
    },
  );

  it.each(DISCOVERY_PATHS)('emits no Set-Cookie alongside the directive on %s', async (path) => {
    // `public` lets a shared cache store a response to a request bearing
    // Authorization (RFC 9111 §3.5), so a Set-Cookie on these paths would be
    // session-fixation-grade. It is impossible only because Clerk mounts
    // AFTER these routes — an ordering this asserts rather than assumes.
    const app = await createCanonicalApp();

    const res = await request(app)
      .get(path)
      .set('Host', 'origin.example.com')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it.each(DISCOVERY_PATHS)('withholds cacheability from a rejected Host on %s', async (path) => {
    // The directive is set inside the sender the success path reaches, never
    // route-wide, so this holds without depending on middleware order —
    // `createNoCacheErrorMiddleware` is mounted after these routes.
    const app = await createTestApp();

    const res = await request(app).get(path).set('Host', 'evil.com');

    expect(res.status).toBe(403);
    expect(res.headers['cache-control']).toBeUndefined();
  });
});
