import { request } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import type { RuntimeConfig } from '../src/runtime-config.js';
import { createFakeHttpObservability } from '../src/test-helpers/observability-fakes.js';
import { TEST_UPSTREAM_METADATA } from '../src/test-helpers/upstream-metadata-fixture.js';
import {
  createNoOpClerkMiddleware,
  createUnauthenticatedMcpAuthClerkDeps,
} from './helpers/test-config.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';
import { OAK_DS_MARKER, ROUTED_ASSET_BASE } from '../src/app/static-asset-paths.js';

const mockRuntimeConfig: RuntimeConfig = {
  env: {
    OAK_API_KEY: 'mock-oak-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
    CLERK_SECRET_KEY: 'sk_test_mock',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
    SENTRY_MODE: 'off',
    LOG_LEVEL: 'error',
    NODE_ENV: 'test',
  },
  dangerouslyDisableAuth: false,
  useStubTools: false,
  version: '0.0.0-test',
  versionSource: 'APP_VERSION_OVERRIDE',
  vercelHostnames: [],
};

async function createTestApp() {
  const observability = createFakeHttpObservability();
  return await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig: mockRuntimeConfig,
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: createNoOpClerkMiddleware(),
    mcpAuthClerkDeps: createUnauthenticatedMcpAuthClerkDeps(),
  });
}

/** The browser-fetched asset the CORS and helmet cases below ride. */
const SERVED_ASSET = `${ROUTED_ASSET_BASE}/${OAK_DS_MARKER}`;

/**
 * E2E tests for selective web security application.
 *
 * CORS is applied globally for browser compatibility.
 *
 * @remarks
 * The CORS and helmet cases used `GET /` as their vehicle while it served an
 * HTML page. Since 2026-08-20 this host serves no HTML, so they ride the
 * served asset instead — still a browser-fetched, non-JSON response from this
 * origin, which is what the policies they assert actually govern.
 *
 * The eight Host-header cases that sat alongside them are gone from this
 * file. They exercised `dnsRebindingProtection`, whose only two mounts were
 * the HTML surfaces; with those gone the guard is mounted on no app route
 * (MCP-650), so no request through `createTestApp` can reach it. Their
 * subject moved intact to `src/security-config.integration.test.ts`, which
 * mounts the guard on its own app. The Host rejections that remain in this
 * file, under "DNS rebinding protection - selective by route", are a
 * DIFFERENT mechanism — the auth layer's `deriveSelfOrigin` — and are
 * untouched.
 */
describe('Web Security (CORS + DNS Rebinding) - Selective Application', () => {
  describe('Served asset surface - HAS web security', () => {
    it('applies CORS headers to a browser-fetched asset', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get(SERVED_ASSET)
        .set('Host', 'localhost')
        .set('Origin', 'http://example.com');

      // Should have CORS headers (web security applied)
      expect(res.headers['access-control-allow-origin']).toBe('http://example.com');
      expect(res.headers.vary).toContain('Origin');
      expect(res.status).toBe(200);
    });

    it('allows any cross-origin request (permissive CORS for OAuth-protected MCP)', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get(SERVED_ASSET)
        .set('Host', 'localhost')
        .set('Origin', 'http://totally-different.com');

      expect(res.headers['access-control-allow-origin']).toBe('http://totally-different.com');
      expect(res.status).toBe(200);
    });
  });

  describe('Protocol routes - CORS enabled for browser clients', () => {
    it('/healthz has CORS headers for browser access', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/healthz HEAD has CORS headers for browser access', async () => {
      const app = await createTestApp();
      const res = await request(app).head('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/.well-known/oauth-protected-resource has CORS headers for browser access', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });
  });

  describe('DNS rebinding protection - selective by route', () => {
    it('/healthz allows any Host header (no DNS protection)', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/healthz').set('Host', 'evil.com');

      // Should NOT be blocked - no DNS rebinding protection on health checks
      expect(res.status).toBe(200);
    });

    it('/mcp rejects disallowed Host header in auth challenge generation', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'evil.com')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.status).toBe(403);
    });

    it('/mcp rejects malformed Host header in auth challenge generation', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'example.com:443@evil.com')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.status).toBe(403);
    });

    it('OAuth protected resource metadata rejects disallowed Host header', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'forbidden');
    });

    it('OAuth authorization server metadata rejects disallowed Host header', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'forbidden');
    });

    it('OAuth metadata rejects malformed Host with userinfo-like syntax', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'example.com:443@evil.com');

      expect(res.status).toBe(403);
    });

    it('OAuth metadata rejects malformed bracketed Host value', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', '[::1]evil');

      expect(res.status).toBe(403);
    });

    it('OAuth authorization-server metadata rejects malformed Host value', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'example.com:443@evil.com');

      expect(res.status).toBe(403);
    });
  });

  describe('CORS behaviour - permissive for all origins', () => {
    it('the asset surface reflects any origin (permissive CORS)', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get(SERVED_ASSET)
        .set('Host', 'localhost')
        .set('Origin', 'http://any-origin.com');

      expect(res.headers['access-control-allow-origin']).toBe('http://any-origin.com');
      expect(res.status).toBe(200);
    });

    it('/healthz has CORS headers (global CORS policy)', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/healthz').set('Origin', 'http://example.com');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.headers['access-control-expose-headers']).toBeDefined();
    });
  });
});

/**
 * E2E tests for HTTP security headers (helmet middleware).
 *
 * Verifies that security headers are applied to all responses.
 */
describe('Security Headers (Helmet) - Applied Globally', () => {
  describe('Served asset surface - non-JSON response', () => {
    it('has Content-Security-Policy header', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');

      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('CSP permits the app to serve its own fonts', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // The design system is served from this origin, so the policy must
      // permit same-origin fonts. font-src overrides default-src wherever it
      // is set, which is why this cannot be left to inheritance.
      expect(csp).toContain("font-src 'self'");
      expect(csp).not.toContain('fonts.gstatic.com');
    });

    it('CSP allows images from same origin', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Images are loaded from this origin only — the served brand artwork.
      expect(csp).toContain("img-src 'self'");
    });

    it('CSP allows connections to same origin', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Connections allowed to same origin (no data: URIs needed)
      expect(csp).toContain("connect-src 'self'");
    });

    it('CSP allows same-origin and inline scripts for Cloudflare', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Cloudflare injects inline scripts for bot detection that load from /cdn-cgi/
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    });

    it('has X-Content-Type-Options: nosniff', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('has X-Frame-Options: SAMEORIGIN', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');

      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has Strict-Transport-Security header', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');
      const hsts = res.headers['strict-transport-security'];

      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=');
    });

    it('does not disclose framework identity via X-Powered-By', async () => {
      const app = await createTestApp();
      const res = await request(app).get(SERVED_ASSET).set('Host', 'localhost');

      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('/healthz - JSON response', () => {
    it('has security headers (harmless for JSON)', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/healthz');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('still returns valid JSON', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/healthz');

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('/mcp - MCP protocol endpoint', () => {
    it('has Cross-Origin-Resource-Policy: cross-origin (for MCP clients)', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('MCP requests reach auth layer through security headers', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      // 401 confirms security headers did not block the request --
      // it reached the auth layer, which correctly requires a token
      expect(res.status).toBe(401);
    });
  });
});
