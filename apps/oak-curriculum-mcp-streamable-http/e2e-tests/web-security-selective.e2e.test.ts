import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../src/application.js';
import type { RuntimeConfig } from '../src/runtime-config.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';

// Mock Clerk middleware to avoid network IO and requirement for valid keys
vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
}));

const mockRuntimeConfig: RuntimeConfig = {
  env: {
    OAK_API_KEY: 'mock-oak-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
    CLERK_SECRET_KEY: 'sk_test_mock',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    LOG_LEVEL: 'error',
    NODE_ENV: 'test',
  },
  dangerouslyDisableAuth: false,
  useStubTools: false,
  version: '0.0.0-test',
  vercelHostnames: [],
};

async function createTestApp() {
  return await createApp({
    runtimeConfig: mockRuntimeConfig,
    upstreamMetadata: TEST_UPSTREAM_METADATA,
  });
}

/**
 * E2E tests for selective web security application.
 *
 * CORS is applied globally for browser compatibility.
 * DNS rebinding protection is selective by route.
 */
describe('Web Security (CORS + DNS Rebinding) - Selective Application', () => {
  describe('Landing page (/) - HAS web security', () => {
    it('applies CORS headers to landing page', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/')
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
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://totally-different.com');

      expect(res.headers['access-control-allow-origin']).toBe('http://totally-different.com');
      expect(res.status).toBe(200);
    });

    it('blocks requests with invalid Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'evil.com');

      // Should be blocked by DNS rebinding protection
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');

      expect(res.body.error).toContain('host not allowed');
    });

    it('blocks malformed Host header with userinfo-like syntax', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost:3333@evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('blocks malformed bracketed Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', '[::1]evil');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('allows requests with valid Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      // Should not be blocked (valid host)
      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with localhost:port Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with 127.0.0.1:port Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', '127.0.0.1:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1]:port Host header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', '[::1]:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1] Host header (no port)', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', '[::1]');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
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
    it('landing page reflects any origin (permissive CORS)', async () => {
      const app = await createTestApp();
      const res = await request(app)
        .get('/')
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
  describe('Landing page (/) - HTML response', () => {
    it('has Content-Security-Policy header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('CSP allows Google Fonts for landing page styling', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain('fonts.googleapis.com');
      expect(csp).toContain('fonts.gstatic.com');
    });

    it('CSP allows images from same origin', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Images can be loaded from same origin (logo is inline SVG)
      expect(csp).toContain("img-src 'self'");
    });

    it('CSP allows connections to same origin', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Connections allowed to same origin (no data: URIs needed)
      expect(csp).toContain("connect-src 'self'");
    });

    it('CSP allows same-origin and inline scripts for Cloudflare', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Cloudflare injects inline scripts for bot detection that load from /cdn-cgi/
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    });

    it('has X-Content-Type-Options: nosniff', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('has X-Frame-Options: SAMEORIGIN', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has Strict-Transport-Security header', async () => {
      const app = await createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const hsts = res.headers['strict-transport-security'];

      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=');
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
