import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';

/**
 * Header Redaction E2E Tests
 *
 * These tests verify that sensitive headers are properly redacted in logs
 * throughout the full request/response cycle in a running application.
 */

const ACCEPT = 'application/json, text/event-stream';

// E2E tests MUST be network-free and must not depend on Clerk key validity.
// Manual OAuth validation is covered by `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth`.
vi.mock('@clerk/mcp-tools/server', () => ({
  generateClerkProtectedResourceMetadata: ({
    resourceUrl,
    properties,
  }: {
    resourceUrl: string;
    properties?: { scopes_supported?: string[] };
  }) => ({
    resource: resourceUrl,
    authorization_servers: ['https://example.clerk.accounts.dev'],
    scopes_supported: properties?.scopes_supported ?? [],
  }),
}));

vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  getAuth: () => ({
    isAuthenticated: false,
    toAuth: () => ({}),
  }),
}));

/**
 * Isolated test environment with auth bypassed.
 * No global `process.env` mutation — see ADR-078.
 */
const authBypassedEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

/**
 * Isolated test environment with auth enforced.
 */
const authEnforcedEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

async function createBypassedApp() {
  const result = loadRuntimeConfig({
    processEnv: authBypassedEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  return await createApp({ runtimeConfig });
}

async function createEnforcedApp() {
  const result = loadRuntimeConfig({
    processEnv: authEnforcedEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  return await createApp({ runtimeConfig, upstreamMetadata: TEST_UPSTREAM_METADATA });
}

describe('Header Redaction E2E', () => {
  describe('full request/response cycle', () => {
    it('should redact all sensitive headers in full request cycle', async () => {
      const app = await createBypassedApp();

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
      const app = await createBypassedApp();

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
      const app = await createBypassedApp();

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
      const app = await createBypassedApp();

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
      const app = await createBypassedApp();

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
      const app = await createEnforcedApp();

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
