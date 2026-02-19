import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { unwrap } from '@oaknational/result';
import { createApp } from './application.js';
import { loadRuntimeConfig } from './runtime-config.js';
import type { Express } from 'express';

/**
 * Integration tests for HTTP security headers.
 *
 * Verifies that helmet middleware correctly applies security headers
 * to various endpoint types without breaking MCP client functionality.
 */
describe('Security Headers (Integration)', () => {
  let app: Express;

  beforeEach(() => {
    const testEnv: NodeJS.ProcessEnv = {
      NODE_ENV: 'test',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
      OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key',
    };
    const result = loadRuntimeConfig({
      processEnv: testEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(result);
    app = createApp({ runtimeConfig });
  });

  describe('Landing page (/) - HTML endpoint', () => {
    it('has Content-Security-Policy header', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('CSP includes restrictive default-src', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("default-src 'self'");
    });

    it('CSP allows inline styles for landing page', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain("'unsafe-inline'");
    });

    it('CSP allows Google Fonts', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      expect(csp).toContain('fonts.googleapis.com');
      expect(csp).toContain('fonts.gstatic.com');
    });

    it('CSP allows same-origin and inline scripts for Cloudflare', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      const csp = res.headers['content-security-policy'];

      // Cloudflare injects inline scripts for bot detection that load from /cdn-cgi/
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    });

    it('has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('has X-Frame-Options header', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      // helmet sets SAMEORIGIN by default
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('has Strict-Transport-Security header', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      const hsts = res.headers['strict-transport-security'];

      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=');
    });

    it('has X-DNS-Prefetch-Control: off', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-dns-prefetch-control']).toBe('off');
    });

    it('has X-Permitted-Cross-Domain-Policies: none', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    });

    it('has Referrer-Policy header', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['referrer-policy']).toBeDefined();
    });

    it('has Cross-Origin-Opener-Policy: same-origin-allow-popups', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
    });

    it('has Cross-Origin-Resource-Policy: cross-origin (for MCP clients)', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('still returns 200 and HTML content', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/html');
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

  describe('Security header consistency', () => {
    it('landing page has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('/healthz has X-Content-Type-Options: nosniff', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('landing page has Cross-Origin-Resource-Policy: cross-origin', async () => {
      const res = await request(app).get('/').set('Host', 'localhost');
      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('/healthz has Cross-Origin-Resource-Policy: cross-origin', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });
  });
});
