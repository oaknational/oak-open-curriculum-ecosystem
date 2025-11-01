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
