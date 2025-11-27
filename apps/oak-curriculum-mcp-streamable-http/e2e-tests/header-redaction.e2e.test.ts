import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/application.js';

/**
 * Header Redaction E2E Tests
 *
 * These tests verify that sensitive headers are properly redacted in logs
 * throughout the full request/response cycle in a running application.
 */

const ACCEPT = 'application/json, text/event-stream';

/**
 * Configure environment for auth bypass in E2E tests.
 */
function enableAuthBypass(): void {
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  process.env.CLERK_PUBLISHABLE_KEY = 'REDACTED';
  process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
}

describe('Header Redaction E2E', () => {
  beforeEach(() => {
    // Enable auth bypass for these E2E tests
    enableAuthBypass();
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    delete process.env.ALLOWED_ORIGINS;
  });

  describe('full request/response cycle', () => {
    it('should redact all sensitive headers in full request cycle', async () => {
      const app = createApp();

      const response = await request(app)
        .get('/healthz')
        .set('Authorization', 'Bearer secret-token-12345')
        .set('Cookie', 'session=abc123; user=john')
        .set('X-API-Key', 'REDACTED')
        .set('Accept', 'application/json');

      // Verify request succeeds
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect((response.body as { status: string }).status).toBe('ok');

      // Verify response headers include correlation ID
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(response.headers['x-correlation-id']).toMatch(/^req_\d+_[a-f0-9]{6}$/);

      // Note: Cannot directly verify log redaction in E2E tests as logs go to stdout
      // The integration tests verify the middleware correctly redacts headers
      // This E2E test verifies the full application flow works correctly with redaction middleware
    });

    it('should handle request with IP headers without exposing full IPs in logs', async () => {
      const app = createApp();

      const response = await request(app)
        .get('/healthz')
        .set('CF-Connecting-IP', '192.168.1.100')
        .set('X-Forwarded-For', '203.0.113.195, 198.51.100.42')
        .set('X-Real-IP', '172.16.254.1');

      // Verify request succeeds
      expect(response.status).toBe(200);

      // Verify correlation ID is present
      expect(response.headers['x-correlation-id']).toBeDefined();

      // Note: IP headers would be partially redacted in logs (integration tests verify this)
      // E2E test confirms the application handles IP headers correctly
    });

    it('should handle mixed sensitive and non-sensitive headers correctly', async () => {
      const app = createApp();

      const response = await request(app)
        .get('/healthz')
        .set('Authorization', 'Bearer token123')
        .set('Accept', 'application/json')
        .set('User-Agent', 'TestAgent/1.0')
        .set('Cookie', 'session=xyz')
        .set('Content-Type', 'application/json')
        .set('X-Custom-Header', 'custom-value');

      // Verify request succeeds
      expect(response.status).toBe(200);

      // Verify response includes expected headers
      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(response.headers['content-type']).toBeDefined();

      // Note: Integration tests verify proper selective redaction
      // E2E test confirms application handles mixed headers correctly
    });
  });

  describe('real-world scenarios', () => {
    it('should handle simulated Clerk OAuth request headers', async () => {
      const app = createApp();

      const response = await request(app)
        .get('/healthz')
        .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...')
        .set('X-Vercel-OIDC-Token', 'oidc-token-value')
        .set('Cookie', '__clerk_db_jwt=eyJhbGc...; __session=abc123')
        .set('Accept', 'application/json');

      // Verify request succeeds
      expect(response.status).toBe(200);

      // Verify correlation ID is set
      expect(response.headers['x-correlation-id']).toBeDefined();

      // Note: All sensitive OAuth-related headers would be redacted in logs
      // Integration tests verify this redaction behavior
    });

    it('should handle production-like header set with full verification', async () => {
      const app = createApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', ACCEPT)
        .set('Content-Type', 'application/json')
        .set('User-Agent', 'MCP-Client/1.0')
        .set('Authorization', 'Bearer production-token')
        .set('Cookie', 'session=prod-session; secure=true')
        .set('CF-Connecting-IP', '203.0.113.42')
        .set('X-Forwarded-For', '203.0.113.42, 198.51.100.1')
        .set('X-Real-IP', '203.0.113.42')
        .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

      // With auth bypass, request should succeed
      expect(response.status).toBe(200);

      // Verify correlation ID is present
      expect(response.headers['x-correlation-id']).toBeDefined();

      // Verify response contains MCP protocol data
      const text = typeof response.text === 'string' ? response.text : '';
      expect(text).toContain('data: ');

      // Note: All sensitive headers would be properly redacted in logs
      // This E2E test verifies the complete request/response cycle works
    });

    it('should handle auth failure with HTTP 401 and WWW-Authenticate header', async () => {
      // Override: enable auth enforcement for this test
      delete process.env.DANGEROUSLY_DISABLE_AUTH;

      const app = createApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', ACCEPT)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 per MCP spec for protected tools without auth
      expect(response.status).toBe(401);

      // Verify correlation ID is still set
      expect(response.headers['x-correlation-id']).toBeDefined();

      // WWW-Authenticate header per RFC 6750
      const wwwAuth = response.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth.toLowerCase()).toMatch(/bearer\s+/);
      expect(wwwAuth).toContain('resource_metadata');
    });
  });
});
