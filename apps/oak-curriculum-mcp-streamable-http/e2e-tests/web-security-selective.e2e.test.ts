import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';

/**
 * E2E tests for selective web security application.
 *
 * Tests that web security (CORS + DNS rebinding protection) is applied
 * ONLY to the landing page (/) and NOT to protocol routes.
 */
describe('Web Security (CORS + DNS Rebinding) - Selective Application', () => {
  describe('Landing page (/) - HAS web security', () => {
    it('applies CORS headers to landing page', async () => {
      const app = createApp();
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
      const app = createApp();
      const res = await request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://totally-different.com');

      // allow_all mode reflects any origin back
      expect(res.headers['access-control-allow-origin']).toBe('http://totally-different.com');
      expect(res.status).toBe(200);
    });

    it('blocks requests with invalid Host header', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', 'evil.com');

      // Should be blocked by DNS rebinding protection
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.error).toContain('host not allowed');
    });

    it('allows requests with valid Host header', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', 'localhost');

      // Should not be blocked (valid host)
      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with localhost:port Host header', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', 'localhost:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with 127.0.0.1:port Host header', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', '127.0.0.1:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1]:port Host header', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', '[::1]:3333');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });

    it('allows requests with IPv6 [::1] Host header (no port)', async () => {
      const app = createApp();
      const res = await request(app).get('/').set('Host', '[::1]');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
    });
  });

  describe('Protocol routes - CORS enabled for browser clients', () => {
    it('/healthz has CORS headers for browser access', async () => {
      const app = createApp();
      const res = await request(app).get('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/healthz HEAD has CORS headers for browser access', async () => {
      const app = createApp();
      const res = await request(app).head('/healthz').set('Origin', 'http://example.com');

      // CORS is applied globally to all routes (protocol routes need it for browser clients)
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/.well-known/oauth-protected-resource has CORS headers for browser access', async () => {
      const app = createApp();
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
      const app = createApp();
      const res = await request(app).get('/').set('Host', 'evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(res.body.error).toContain('host not allowed');
    });

    it('/healthz allows any Host header (no DNS protection)', async () => {
      const app = createApp();
      const res = await request(app).get('/healthz').set('Host', 'evil.com');

      // Should NOT be blocked - no DNS rebinding protection on health checks
      expect(res.status).toBe(200);
    });

    it('/mcp allows any Host header (no DNS protection)', async () => {
      const app = createApp();
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
      const app = createApp();
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'evil.com');

      // Should NOT be blocked - no DNS rebinding protection on OAuth metadata
      expect(res.status).toBe(200);
    });
  });

  describe('CORS behavior - ONLY on landing page', () => {
    it('landing page has CORS with allowed origin', async () => {
      const app = createApp();
      const res = await request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('Origin', 'http://allowed-origin.com');

      // CORS allows all origins when no explicit allow-list
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.status).toBe(200);
    });

    it('/healthz has CORS headers (global CORS policy)', async () => {
      const app = createApp();
      const res = await request(app).get('/healthz').set('Origin', 'http://example.com');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.headers['access-control-expose-headers']).toBeDefined();
    });
  });
});
