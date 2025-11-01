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
import { createApp } from '../src/index.js';

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
 * Type guard for AS metadata response
 */
function isASMetadata(value: unknown): value is {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'issuer' in value &&
    typeof value.issuer === 'string' &&
    'authorization_endpoint' in value &&
    'token_endpoint' in value &&
    'jwks_uri' in value
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

/**
 * Helper: Validates AS metadata step in discovery chain
 */
async function validateASMetadataStep(app: Express, expectedIssuer: string): Promise<void> {
  const res = await request(app).get('/.well-known/oauth-authorization-server');
  expect(res.status).toBe(200);

  const asMetadata: unknown = res.body;
  if (!isASMetadata(asMetadata)) {
    throw new Error('Invalid AS metadata response');
  }

  expect(asMetadata.issuer).toContain('clerk.accounts.dev');
  expect(asMetadata.issuer).toBe(expectedIssuer);
}

describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  let app: Express;
  let restoreEnv: () => void;

  beforeAll(() => {
    // Save current environment
    const previous = { ...process.env };

    // Configure for production-equivalent auth
    process.env.NODE_ENV = 'test'; // NOT development (bypass disabled)
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ'; // Valid public key format
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing'; // Dummy secret for initialization
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test-api-key';
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH; // Auth ENABLED
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

  it('exposes /.well-known/oauth-authorization-server with Clerk metadata', async () => {
    const res = await request(app).get('/.well-known/oauth-authorization-server');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('issuer');
    expect(res.body).toHaveProperty('authorization_endpoint');
    expect(res.body).toHaveProperty('token_endpoint');
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
    expect(scopes).toContain('mcp:invoke');
    expect(scopes).toContain('mcp:read');
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

  // Test #1: CORS WWW-Authenticate Header Exposure (CRITICAL for OAuth Discovery)
  it('exposes WWW-Authenticate header via CORS for OAuth discovery', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Origin', 'http://localhost:3000')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    expect(res.status).toBe(401);

    // CRITICAL: Verify Access-Control-Expose-Headers includes WWW-Authenticate
    // Without this, browser-based MCP clients cannot read the header for OAuth discovery
    const exposedHeaders = res.headers['access-control-expose-headers'];
    expect(exposedHeaders).toBeDefined();
    if (typeof exposedHeaders === 'string') {
      expect(exposedHeaders.toLowerCase()).toContain('www-authenticate');
    }

    // Also verify the WWW-Authenticate header itself is present
    expect(res.headers['www-authenticate']).toBeDefined();
    expect(res.headers['www-authenticate']).toContain('Bearer');
  });

  // Test #2: OPTIONS Preflight Requests (Required for CORS)
  it('allows OPTIONS preflight requests without authentication for CORS', async () => {
    const res = await request(app)
      .options('/mcp')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,authorization,accept');

    // OPTIONS should succeed without auth (CORS preflight)
    expect([200, 204]).toContain(res.status);

    // Verify CORS headers are present
    const allowMethods = res.headers['access-control-allow-methods'];
    expect(allowMethods).toBeDefined();
    if (typeof allowMethods === 'string') {
      expect(allowMethods.toUpperCase()).toContain('POST');
    }

    const allowHeaders = res.headers['access-control-allow-headers'];
    expect(allowHeaders).toBeDefined();
    if (typeof allowHeaders === 'string') {
      expect(allowHeaders.toLowerCase()).toContain('authorization');
    }
  });

  // Test #3: Complete OAuth Discovery Chain (End-to-End Flow)
  it('supports complete OAuth discovery chain as MCP clients would follow', async () => {
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

    // Step 3: Client fetches AS metadata and validates it matches
    await validateASMetadataStep(app, asUrl);
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
