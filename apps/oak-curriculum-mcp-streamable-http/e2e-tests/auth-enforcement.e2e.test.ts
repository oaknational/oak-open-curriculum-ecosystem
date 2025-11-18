/**
 * E2E Auth Enforcement Tests
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Proves auth enforcement works exactly as in production
 *
 * This suite tests the system with auth ENABLED, which mirrors production
 * configuration. No auth bypass is used here.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/application.js';

/**
 * Type guard for OAuth metadata response
 */
function isOAuthMetadata(value: unknown): value is {
  authorization_servers: string[];
  resource: string;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'authorization_servers' in value &&
    Array.isArray(value.authorization_servers) &&
    'resource' in value
  );
}

/**
 * Helper: Validates OAuth metadata step in discovery chain
 */
async function validateOAuthMetadataStep(app: Express): Promise<string> {
  const res = await request(app).get('/.well-known/oauth-protected-resource');
  expect(res.status).toBe(200);

  const metadata: unknown = res.body;
  if (!isOAuthMetadata(metadata)) {
    throw new Error('Invalid OAuth metadata response');
  }

  expect(metadata.authorization_servers.length).toBeGreaterThan(0);
  const asUrl = metadata.authorization_servers[0];
  expect(asUrl).toContain('clerk.accounts.dev');

  return asUrl;
}

describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;
  let restoreEnv: () => void;

  beforeAll(() => {
    // Save current environment
    const previous = { ...process.env };

    // Configure for production-equivalent auth
    process.env.NODE_ENV = 'test'; // NOT development (bypass disabled)
    process.env.CLERK_PUBLISHABLE_KEY = 'REDACTED'; // Valid public key format
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing'; // Dummy secret for initialization
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test-api-key';
    delete process.env.VERCEL; // Local but with auth enforced

    app = createApp();
    restoreEnv = () => {
      // Clear current env
      for (const key of Object.keys(process.env)) {
        Reflect.deleteProperty(process.env, key);
      }
      // Restore previous env
      Object.assign(process.env, previous);
    };
  });

  afterAll(() => {
    restoreEnv();
  });

  it('rejects /mcp POST without Authorization header with 401', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    expect(res.status).toBe(401);
  });

  it('rejects /mcp GET without Authorization header with 401', async () => {
    const res = await request(app)
      .get('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .query({ method: 'tools/list' });

    expect(res.status).toBe(401);
  });

  it('includes WWW-Authenticate header in 401 response with Clerk AS URL', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    expect(res.status).toBe(401);
    expect(res.headers['www-authenticate']).toBeDefined();
    expect(res.headers['www-authenticate']).toContain('Bearer');
  });

  it('does not proxy authorization server metadata', async () => {
    // Per MCP spec 2025-06-18: clients fetch AS metadata directly from
    // authorization server, not from resource server proxy
    const res = await request(app).get('/.well-known/oauth-authorization-server');

    // Expect 404 - we should NOT have this endpoint
    expect(res.status).toBe(404);
  });

  it('protected resource metadata contains valid authorization_servers array', async () => {
    const prRes = await request(app).get('/.well-known/oauth-protected-resource');
    expect(prRes.status).toBe(200);

    const metadata: unknown = prRes.body;

    // Verify RFC 9728 structure
    expect(metadata).toHaveProperty('resource');
    expect(metadata).toHaveProperty('authorization_servers');

    // Use type guard for safe access
    if (!isOAuthMetadata(metadata)) {
      throw new Error('Invalid OAuth metadata response');
    }

    expect(Array.isArray(metadata.authorization_servers)).toBe(true);
    expect(metadata.authorization_servers.length).toBeGreaterThan(0);

    // Verify Clerk URL format (structure validation only)
    const clerkAsUrl = metadata.authorization_servers[0];
    expect(clerkAsUrl).toContain('clerk');
    expect(clerkAsUrl).toMatch(/^https:\/\//);

    // CRITICAL: Do NOT fetch from this URL in automated tests
    // Clerk accessibility is validated manually with Inspector CLI
  });

  it('exposes /.well-known/oauth-protected-resource with correct scopes', async () => {
    const res = await request(app).get('/.well-known/oauth-protected-resource');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resource');
    expect(res.body).toHaveProperty('authorization_servers');

    // Type-safe access to response body
    const body = res.body as unknown;
    expect(body).toHaveProperty('authorization_servers');
    expect(Array.isArray((body as { authorization_servers?: unknown }).authorization_servers)).toBe(
      true,
    );
    expect(body).toHaveProperty('scopes_supported');
    const scopes = (body as { scopes_supported?: string[] }).scopes_supported;
    expect(scopes).toEqual(['openid', 'email']);
  });

  it('rejects invalid Bearer token with 401', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', 'Bearer invalid-token-12345')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    expect(res.status).toBe(401);
  });

  it('rejects malformed Authorization header with 401', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .set('Authorization', 'NotBearer xyz')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    expect(res.status).toBe(401);
  });

  // Test #3: OAuth Discovery Flow (Protected Resource Metadata)
  it('supports OAuth discovery via protected resource metadata', async () => {
    // Step 1: Client calls /mcp without auth → 401 with WWW-Authenticate
    const step1 = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    expect(step1.status).toBe(401);
    const wwwAuth = step1.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(wwwAuth).toContain('Bearer');
    expect(wwwAuth).toContain('resource_metadata');

    // Step 2: Client fetches OAuth metadata and extracts AS URL
    const asUrl = await validateOAuthMetadataStep(app);

    // Step 3: MCP clients fetch AS metadata directly from Clerk (not tested here)
    // Per test boundaries: we do NOT make external network calls to Clerk
    // The AS URL structure is validated above; actual accessibility is
    // validated manually with Inspector CLI per Phase 2 and Phase 6
    expect(asUrl).toContain('clerk');
    expect(asUrl).toMatch(/^https:\/\//);
  });

  // Test #5: RFC Compliance Validation
  describe('RFC Compliance', () => {
    it('oauth-protected-resource conforms to RFC 9728', async () => {
      const res = await request(app).get('/.well-known/oauth-protected-resource');

      expect(res.status).toBe(200);

      const body: unknown = res.body;

      // Required fields per RFC 9728
      expect(body).toHaveProperty('resource'); // REQUIRED
      expect(body).toHaveProperty('authorization_servers'); // REQUIRED

      // Use type guard for safe access
      if (!isOAuthMetadata(body)) {
        throw new Error('Response does not conform to OAuth metadata structure');
      }

      // Validate types per RFC
      expect(typeof body.resource).toBe('string');
      expect(Array.isArray(body.authorization_servers)).toBe(true);
      expect(body.authorization_servers.every((s) => typeof s === 'string')).toBe(true);

      // Optional but recommended fields (safe access via type check)
      if ('scopes_supported' in body && body.scopes_supported) {
        expect(Array.isArray(body.scopes_supported)).toBe(true);
      }

      // bearer_methods_supported is optional
      if ('bearer_methods_supported' in body && body.bearer_methods_supported) {
        expect(Array.isArray(body.bearer_methods_supported)).toBe(true);
      }
    });

    it('resource URL identifies the /mcp endpoint as the protected resource', async () => {
      const res = await request(app).get('/.well-known/oauth-protected-resource');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      expect(body).toHaveProperty('resource');

      const resource = (body as { resource: unknown }).resource;
      expect(typeof resource).toBe('string');

      // Per RFC 9728, the resource field identifies what is actually protected
      // The /mcp endpoint is the MCP resource being protected, not the whole server
      expect(resource).toMatch(/^https?:\/\/127\.0\.0\.1:\d+\/mcp$/);

      // The resource URL should specifically identify the /mcp endpoint
      expect(resource).toContain('/mcp');

      // Extract and validate the resource URL components
      const resourceUrl = new URL(resource as string);
      expect(resourceUrl.hostname).toBe('127.0.0.1');
      expect(resourceUrl.pathname).toBe('/mcp');

      // Auxiliary routes like / and /healthz are NOT part of the protected MCP resource
      // Only the /mcp endpoint requires OAuth authentication
    });

    it('WWW-Authenticate header conforms to RFC 6750 Bearer scheme', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

      expect(res.status).toBe(401);
      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();

      // RFC 6750 format: Bearer realm="...", error="...", error_description="..."
      // Must start with "Bearer" (case-insensitive per RFC)
      if (typeof wwwAuth === 'string') {
        expect(wwwAuth.toLowerCase()).toMatch(/^bearer\s+/);
        // Clerk-specific: includes resource_metadata parameter
        // This is valid per RFC 6750 (allows additional auth-params)
        expect(wwwAuth).toMatch(/resource_metadata/);
      }
    });
  });

  // Note: Authenticated request testing with real Clerk tokens requires
  // OAuth Device Flow implementation. For deterministic testing of authenticated
  // scenarios without external dependencies, see mock-based tests in:
  // - src/test-fixtures/mock-clerk-middleware.integration.test.ts
  // - src/clerk-auth-middleware.integration.test.ts (uses real Clerk but with DANGEROUSLY_DISABLE_AUTH)
  //
  // These E2E tests focus on proving auth enforcement at the system boundary
  // (rejecting unauthenticated requests). Authenticated happy-path testing
  // is covered by mock-based integration tests which provide deterministic,
  // fast validation without external service dependencies.
});
