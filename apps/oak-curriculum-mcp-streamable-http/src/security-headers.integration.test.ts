import { request } from './test-helpers/loopback-request.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import type { Express } from 'express';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';
import { ROUTED_ASSET_BASE } from './app/static-asset-paths.js';

/**
 * Integration tests for HTTP security headers.
 *
 * Verifies that helmet middleware correctly applies security headers
 * to various endpoint types without breaking MCP client functionality.
 */
describe('Security Headers (Integration)', () => {
  let app: Express;

  beforeEach(async () => {
    const runtimeConfig = createMockRuntimeConfig({
      dangerouslyDisableAuth: true,
      env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
    });
    const observability = createFakeHttpObservability();
    app = await createApp({
      staticRoot: await getScratchStaticRoot(),
      runtimeConfig,
      observability,
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
  });

  /**
   * The served asset surface is the vehicle, not a document.
   *
   * @remarks
   * These cases were written against `GET /`, which served an HTML page
   * until 2026-08-20; the app now serves no HTML at all. Their subject was
   * never the page — it is helmet's emitted header, which
   * `bootstrap-security.ts` mounts app-wide — so they moved to the
   * browser-fetched surface that remains. The asset URL is the truest
   * available vehicle: it is what a browser still retrieves from this
   * origin, and it is what `font-src` and `img-src` actually govern.
   */
  describe('Served asset surface — browser-fetched response', () => {
    it('has Content-Security-Policy header', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('CSP includes restrictive default-src', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("default-src 'self'");
    });

    it('CSP allows inline styles, which only Cloudflare challenge pages need', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("'unsafe-inline'");
    });

    it('CSP permits the fonts the served page actually requests', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Asserted on the emitted header, not the directive object: font-src is
      // set, so it overrides default-src instead of inheriting it. A host-only
      // value here blocks /oak-ds/fonts/*.ttf outright, and a consumer of
      // these assets falls back to system faces with only a console
      // violation to show for it.
      expect(csp).toContain("font-src 'self'");
    });

    it('CSP names no third-party host', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const csp = res.headers['content-security-policy'] ?? '';

      // Categorical, not an enumeration of known hosts: in a CSP source
      // list, keywords are quoted ('self') and path sources start with '/',
      // so any other token is a host expression (bare hostname or
      // scheme://host) — exactly what this policy must not carry.
      const hostSources = csp
        .split(';')
        .flatMap((directive) => directive.trim().split(/\s+/).slice(1))
        .filter((source) => source !== '' && !source.startsWith("'") && !source.startsWith('/'));

      expect(hostSources).toStrictEqual([]);
    });

    it('CSP allows same-origin and inline scripts for Cloudflare', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Cloudflare injects inline scripts for bot detection that load from /cdn-cgi/
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    });

    it('has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('has X-Frame-Options header', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      // helmet sets SAMEORIGIN by default
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has Strict-Transport-Security header', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      const hsts = res.headers['strict-transport-security'];

      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=');
    });

    it('has X-DNS-Prefetch-Control: off', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['x-dns-prefetch-control']).toBe('off');
    });

    it('has X-Permitted-Cross-Domain-Policies: none', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    });

    it('has Referrer-Policy header', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['referrer-policy']).toBeDefined();
    });

    it('has Cross-Origin-Opener-Policy: same-origin-allow-popups', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
    });

    it('has Cross-Origin-Resource-Policy: cross-origin (for MCP clients)', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('still serves the asset, so these header assertions are not vacuous', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/css');
    });

    it('exposes the runtime app version in the response header', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');

      // `mountAppVersionHeader` sets this app-wide, so any served response
      // carries it. There is no HTML metadata twin any more — the page that
      // used to carry a matching `<meta name="app-version">` is gone.
      expect(res.headers['x-app-version']).toBe('0.0.0-test');
    });
  });

  describe('/healthz - JSON endpoint', () => {
    it('has security headers (harmless for JSON)', async () => {
      const res = await request(app).get('/healthz');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has CSP header (harmless for JSON)', async () => {
      const res = await request(app).get('/healthz');

      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('still returns 200 and valid JSON', async () => {
      const res = await request(app).get('/healthz');

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('/.well-known/oauth-protected-resource - OAuth metadata', () => {
    // Note: OAuth metadata endpoint is only registered when auth is ENABLED.
    // When DANGEROUSLY_DISABLE_AUTH=true, this endpoint returns 404.
    // These tests verify security headers are present even on 404 responses.

    it('has security headers (even on 404 when auth disabled)', async () => {
      const res = await request(app).get('/.well-known/oauth-protected-resource');

      // Security headers should be present regardless of route existence
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('returns 404 when auth is disabled (endpoint not registered)', async () => {
      const res = await request(app).get('/.well-known/oauth-protected-resource');

      // When DANGEROUSLY_DISABLE_AUTH=true, OAuth metadata endpoint is not registered
      expect(res.status).toBe(404);
    });
  });

  describe('/mcp - MCP protocol endpoint', () => {
    it('has security headers', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('Cross-Origin-Resource-Policy allows cross-origin (for ChatGPT, Claude, etc.)', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('MCP tools/list request still works with security headers', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      // Should not be 4xx/5xx error
      expect(res.status).toBeLessThan(400);
    });

    it('MCP initialize request still works with security headers', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0.0' },
          },
        });

      // Should not be 4xx/5xx error
      expect(res.status).toBeLessThan(400);
    });
  });

  /**
   * Consistency across response KINDS: an asset body and a JSON body must
   * carry the same headers, because the middleware is mounted app-wide and
   * not per-route. The two `GET /` rows this block used to hold were exact
   * duplicates of their `/healthz` twins once the page's vehicle moved to
   * the asset surface, so they are collapsed rather than transcribed.
   */
  describe('Security header consistency across response kinds', () => {
    it('the asset surface has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('/healthz has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('the asset surface has Cross-Origin-Resource-Policy: cross-origin', async () => {
      const res = await request(app)
        .get(`${ROUTED_ASSET_BASE}/oak-ds/styles.css`)
        .set('Host', 'localhost');
      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('/healthz has Cross-Origin-Resource-Policy: cross-origin', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });
  });
});
