import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../src/application.js';
import type { RuntimeConfig } from '../src/runtime-config.js';

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
    LOG_LEVEL: 'error',
    NODE_ENV: 'test',
  },
  dangerouslyDisableAuth: false,
  useStubTools: false,
  version: '0.0.0-test',
  vercelHostnames: [],
};

function createTestApp() {
  return createApp({ runtimeConfig: mockRuntimeConfig });
}

/**
 * E2E tests for selective web security application.
 *
 * Tests that web security (CORS + DNS rebinding protection) is applied
 * ONLY to the landing page (/) and NOT to protocol routes.
 */
describe('Web Security (CORS + DNS Rebinding) - Selective Application', () => {
  describe('Landing page (/) - HAS web security', () => {
    it('applies CORS headers to landing page', async () => {
      const app = createTestApp();
      const res = await request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://example.com');

      // Should have CORS headers (web security applied)
      expect(res.headers['access-control-allow-origin']).toBe('http://example.com');
      expect(res.headers.vary).toContain('Origin');
      expect(res.status).toBe(200);
    });

    it('applies CORS headers with different origin (allow_all mode)', async () => {
      const app = createTestApp();
      const res = await request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://totally-different.com');

      // allow_all mode reflects any origin back
      expect(res.headers['access-control-allow-origin']).toBe('http://totally-different.com');
      expect(res.status).toBe(200);
    });

    it('blocks requests with invalid Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'evil.com');

      // Should be blocked by DNS rebinding protection
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');

      expect(res.body.error).toContain('host not allowed');
    });

    it('allows requests with valid Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      // Should not be blocked (valid host)
      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with localhost:port Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with 127.0.0.1:port Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', '127.0.0.1:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1]:port Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', '[::1]:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1] Host header (no port)', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', '[::1]');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });
  });

  describe('Protocol routes - CORS enabled for browser clients', () => {
    it('/healthz has CORS headers for browser access', async () => {
      const app = createTestApp();
      const res = await request(app).get('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/healthz HEAD has CORS headers for browser access', async () => {
      const app = createTestApp();
      const res = await request(app).head('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/.well-known/oauth-protected-resource has CORS headers for browser access', async () => {
      const app = createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });
  });

  describe('DNS rebinding protection - ONLY on landing page', () => {
    it('landing page blocks evil.com Host header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');

      expect(res.body.error).toContain('host not allowed');
    });

    it('/healthz allows any Host header (no DNS protection)', async () => {
      const app = createTestApp();
      const res = await request(app).get('/healthz').set('Host', 'evil.com');

      // Should NOT be blocked - no DNS rebinding protection on health checks
      expect(res.status).toBe(200);
    });

    it('/mcp allows any Host header (no DNS protection)', async () => {
      const app = createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'evil.com')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      // Should NOT be blocked - protocol routes need to work from any host
      // Auth will handle security (401), but not DNS rebinding (403)
      expect(res.status).not.toBe(403);
    });

    it('OAuth metadata allows any Host header (no DNS protection)', async () => {
      const app = createTestApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'evil.com');

      // Should NOT be blocked - no DNS rebinding protection on OAuth metadata
      expect(res.status).toBe(200);
    });
  });

  describe('CORS behavior - ONLY on landing page', () => {
    it('landing page has CORS with allowed origin', async () => {
      const app = createTestApp();
      const res = await request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://allowed-origin.com');

      // CORS allows all origins when no explicit allow-list
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/healthz has CORS headers (global CORS policy)', async () => {
      const app = createTestApp();
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
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('CSP allows Google Fonts for landing page styling', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain('fonts.googleapis.com');
      expect(csp).toContain('fonts.gstatic.com');
    });

    it('CSP allows data: URIs for images (e.g. logo)', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("img-src 'self' data:");
    });

    it('CSP allows data: URIs for connections (needed for some widget behaviors)', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("connect-src 'self' data:");
    });

    it('CSP allows same-origin and inline scripts for Cloudflare', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Cloudflare injects inline scripts for bot detection that load from /cdn-cgi/
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    });

    it('has X-Content-Type-Options: nosniff', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('has X-Frame-Options: SAMEORIGIN', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has Strict-Transport-Security header', async () => {
      const app = createTestApp();
      const res = await request(app).get('/').set('Host', 'localhost');
      const hsts = res.headers['strict-transport-security'];

      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=');
    });
  });

  describe('/healthz - JSON response', () => {
    it('has security headers (harmless for JSON)', async () => {
      const app = createTestApp();
      const res = await request(app).get('/healthz');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('still returns valid JSON', async () => {
      const app = createTestApp();
      const res = await request(app).get('/healthz');

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('/mcp - MCP protocol endpoint', () => {
    it('has Cross-Origin-Resource-Policy: cross-origin (for MCP clients)', async () => {
      const app = createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('MCP requests still work with security headers', async () => {
      const app = createTestApp();
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .set('Content-Type', 'application/json')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

      // Should not be a 4xx/5xx error from security headers
      expect(res.status).toBeLessThan(400);
    });
  });
});
