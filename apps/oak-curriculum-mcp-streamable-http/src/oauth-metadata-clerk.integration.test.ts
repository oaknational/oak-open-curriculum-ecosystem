import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from './index.js';

/**
 * Validates that authorization servers array contains Clerk URL
 */
function assertAuthServersPointToClerk(body: unknown): void {
  expect(body).toHaveProperty('authorization_servers');
  if (body && typeof body === 'object' && 'authorization_servers' in body) {
    const authServers = body.authorization_servers;
    expect(Array.isArray(authServers)).toBe(true);
    if (Array.isArray(authServers) && authServers.length > 0) {
      const firstServer = String(authServers[0]);
      expect(firstServer).toContain('clerk.accounts.dev');
    } else {
      throw new Error('Expected at least one authorization server');
    }
  }
}

/**
 * Validates that resource URL is a valid HTTP(S) URL
 */
function assertResourceIsValidUrl(body: unknown): void {
  expect(body).toHaveProperty('resource');
  if (body && typeof body === 'object' && 'resource' in body) {
    expect(typeof body.resource).toBe('string');
    const resource = String(body.resource);
    expect(resource).toMatch(/^https?:\/\//);
  }
}

/**
 * Validates that scopes include required MCP scopes
 */
function assertScopesIncludeMcpScopes(body: unknown): void {
  expect(body).toHaveProperty('scopes_supported');
  if (body && typeof body === 'object' && 'scopes_supported' in body) {
    const scopes = body.scopes_supported;
    expect(Array.isArray(scopes)).toBe(true);
    if (Array.isArray(scopes)) {
      const scopeStrings = scopes.map((s) => String(s));
      expect(scopeStrings).toContain('mcp:invoke');
      expect(scopeStrings).toContain('mcp:read');
    }
  }
}

describe('Clerk OAuth Metadata Endpoints', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Set minimum required env for app to start
    process.env.OAK_API_KEY = 'test-key';
    // Use real publishable key format (public, not secret - per Clerk docs)
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    // Secret key can be dummy for integration tests
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
    // Ensure auth bypass is disabled for these tests
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('serves protected resource metadata pointing to Clerk', async () => {
    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-protected-resource');

    expect(res.status).toBe(200);
    const body: unknown = res.body;

    assertResourceIsValidUrl(body);
    assertAuthServersPointToClerk(body);
    assertScopesIncludeMcpScopes(body);
  });

  it('registers authorization server metadata endpoint (route exists)', async () => {
    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-authorization-server');

    // Note: This endpoint makes a network call to Clerk to fetch AS metadata.
    // Integration tests block network calls (test.setup.ts), so we expect 500.
    // The actual functionality is tested in E2E tests (auth-enforcement.e2e.test.ts)
    // which allow network calls.
    //
    // This test just verifies the route is registered (not 404).
    expect(res.status).not.toBe(404); // Route exists
    // Expect 500 due to blocked network call (this is correct behavior for integration tests)
    if (res.text.includes('Network calls are blocked in tests')) {
      expect(res.status).toBe(500); // Expected when network calls are blocked
    }
  });
});

// Test #7: BASE_URL Propagation Tests
// These are in a separate describe block because they need different env setup
describe('Clerk OAuth Metadata Endpoints - BASE_URL Propagation', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('accepts BASE_URL and MCP_CANONICAL_URI env vars without error', async () => {
    // Set minimum required env
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    // Set specific BASE_URL and MCP_CANONICAL_URI
    process.env.BASE_URL = 'https://test-server.example.com';
    process.env.MCP_CANONICAL_URI = 'https://test-server.example.com/mcp';
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    process.env.NODE_ENV = 'test';

    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-protected-resource');

    expect(res.status).toBe(200);

    // Note: @clerk/mcp-tools protectedResourceHandlerClerk derives resource URL from
    // the incoming request (req.protocol, req.get('host'), req.originalUrl), not from
    // BASE_URL/MCP_CANONICAL_URI env vars.
    //
    // In integration tests with supertest, the URL will be http://127.0.0.1:<random-port>/
    // In real deployment, it will be derived from actual request (which matches env vars in production)
    //
    // This test just verifies that HAVING these env vars doesn't break the app
    expect(res.body).toHaveProperty('resource');
    const body: unknown = res.body;
    if (body && typeof body === 'object' && 'resource' in body) {
      expect(typeof body.resource).toBe('string');
      expect(String(body.resource)).toMatch(/^https?:\/\//);
    }

    // Authorization servers should always point to Clerk
    assertAuthServersPointToClerk(body);
  });

  it('works when BASE_URL and MCP_CANONICAL_URI are not set (derives from request)', async () => {
    // Set minimum required env
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    // Explicitly delete optional URL env vars
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    process.env.NODE_ENV = 'test';

    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-protected-resource');

    expect(res.status).toBe(200);

    // Server should derive URLs from the incoming request
    // The exact URL will be dynamic (supertest assigns random port)
    // We just verify the response is valid
    expect(res.body).toHaveProperty('resource');
    const body: unknown = res.body;
    if (body && typeof body === 'object' && 'resource' in body) {
      expect(typeof body.resource).toBe('string');
      // Should be a valid URL (http://127.0.0.1:<random-port>/ format)
      expect(String(body.resource)).toMatch(/^https?:\/\//);
    }

    // Authorization servers should still point to Clerk regardless of BASE_URL
    assertAuthServersPointToClerk(body);
  });
});
