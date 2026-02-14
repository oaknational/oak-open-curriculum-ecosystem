/**
 * E2E Auth Enforcement Tests
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Proves auth enforcement works exactly as in production
 *
 * This suite tests the system with auth ENABLED, which mirrors production
 * configuration. No auth bypass is used here.
 *
 * ## Auth Model (Per MCP Spec + OpenAI Apps Docs)
 *
 * The specs define TWO complementary auth mechanisms:
 *
 * 1. **HTTP 401 + WWW-Authenticate** (Transport-level)
 *    - For unauthenticated requests (no token, invalid token)
 *    - Triggers OAuth discovery flow
 *    - Returned BEFORE request reaches MCP SDK
 *
 * 2. **HTTP 200 + _meta["mcp/www_authenticate"]** (Tool-level)
 *    - For authenticated requests missing required scope
 *    - Used for per-tool scope refinements
 *    - Returned FROM tool handlers after auth passes
 *
 * Both are needed. HTTP 401 initiates OAuth, _meta handles scope issues.
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
 * @see https://platform.openai.com/docs/guides/apps-authentication
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';

// Mock Clerk metadata generator to avoid depending on Clerk key formats/encoding.
// These tests prove our server's OAuth discovery behaviour and RFC 9728 shape,
// not Clerk's internal metadata derivation logic.
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

// Mock Clerk middleware to avoid network IO and requirement for valid keys
vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  requireAuth: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  getAuth: () => ({
    isAuthenticated: false,
    toAuth: () => ({}),
  }),
}));

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

  beforeAll(() => {
    // Create isolated env with auth ENABLED (production equivalent)
    app = createApp({
      runtimeConfig: createMockRuntimeConfig({
        // Auth enabled by default in mock config
        useStubTools: true,
        env: {
          OAK_API_KEY: 'test-api-key',
          CLERK_PUBLISHABLE_KEY: 'pk_test_123',
          CLERK_SECRET_KEY: 'sk_test_123',
          NODE_ENV: 'test',
          LOG_LEVEL: 'debug',
        },
      }),
    });
  });

  describe('Discovery Methods (No Auth Required)', () => {
    it('allows initialize without Authorization header', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0.0' },
          },
        });

      // Discovery methods should work without authentication
      expect(res.status).toBe(200);
      // MCP uses SSE, response will be in text format
      expect(res.text).toBeDefined();
      expect(res.text.length).toBeGreaterThan(0);
    });

    it('allows tools/list via POST without Authorization header', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

      // Discovery methods should work without authentication
      expect(res.status).toBe(200);
      // MCP uses SSE, response will be in text format
      expect(res.text).toBeDefined();
      expect(res.text.length).toBeGreaterThan(0);
    });
  });

  describe('Protected Tools Without Token (HTTP 401 Required)', () => {
    /**
     * Per MCP Spec: "Invalid or expired tokens MUST receive a HTTP 401 response"
     * Per OpenAI Apps: "If verification fails, respond with 401 Unauthorized"
     *
     * HTTP 401 triggers OAuth discovery flow in the client.
     */
    it('returns HTTP 401 with WWW-Authenticate for protected tools without auth', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 per MCP spec and OpenAI Apps docs
      if (res.status === 500) {
        console.error('Server returned 500:', res.text);
      }
      expect(res.status).toBe(401);

      // WWW-Authenticate header per RFC 6750
      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('resource_metadata=');
    });

    it('returns HTTP 401 for invalid Bearer token', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .set('Authorization', 'Bearer invalid-token-12345')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 for invalid token per MCP spec
      expect(res.status).toBe(401);

      // WWW-Authenticate header with error
      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('error=');
    });

    it('returns HTTP 401 for malformed Authorization header', async () => {
      const res = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .set('Authorization', 'NotBearer xyz')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 for malformed header per MCP spec
      expect(res.status).toBe(401);

      // WWW-Authenticate header with error
      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });
  });

  describe('OAuth Discovery Flow', () => {
    it('supports OAuth discovery via protected resource metadata', async () => {
      // Step 1: Client calls protected tool without auth → HTTP 401 + WWW-Authenticate
      const step1 = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 triggers OAuth discovery
      expect(step1.status).toBe(401);

      // Extract resource_metadata URL from WWW-Authenticate header
      const wwwAuth = step1.headers['www-authenticate'];
      expect(wwwAuth).toContain('resource_metadata=');

      // Step 2: Client fetches OAuth metadata and extracts AS URL
      const asUrl = await validateOAuthMetadataStep(app);

      // Step 3: MCP clients fetch AS metadata directly from Clerk (not tested here)
      // Per test boundaries: we do NOT make external network calls to Clerk
      expect(asUrl).toContain('clerk');
      expect(asUrl).toMatch(/^https:\/\//);
    });

    it('does not proxy authorization server metadata', async () => {
      // Per MCP spec 2025-06-18: clients fetch AS metadata directly from
      // authorization server, not from resource server proxy
      const res = await request(app).get('/.well-known/oauth-authorization-server');

      // Expect 404 - we should NOT have this endpoint
      expect(res.status).toBe(404);
    });
  });

  describe('OAuth Metadata Endpoints', () => {
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
      expect(
        Array.isArray((body as { authorization_servers?: unknown }).authorization_servers),
      ).toBe(true);
      expect(body).toHaveProperty('scopes_supported');
      const scopes = (body as { scopes_supported?: string[] }).scopes_supported;
      // Test BEHAVIOR (presence of required scopes) not IMPLEMENTATION (order)
      expect(scopes).toEqual(expect.arrayContaining(['openid', 'email']));
      expect(scopes).toHaveLength(2);
    });
  });
});

// Test #5: RFC Compliance Validation
describe('Auth Enforcement - RFC Compliance', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp({
      runtimeConfig: createMockRuntimeConfig({
        useStubTools: true,
        env: {
          OAK_API_KEY: 'test-api-key',
          CLERK_PUBLISHABLE_KEY: 'pk_test_123',
          CLERK_SECRET_KEY: 'sk_test_123',
          NODE_ENV: 'test',
        },
      }),
    });
  });

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
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // HTTP 401 per MCP spec
      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();

      // RFC 6750 format: Bearer realm="...", error="...", error_description="..."
      // Must start with "Bearer" (case-insensitive per RFC)
      expect(wwwAuth.toLowerCase()).toMatch(/^bearer\s+/);

      // Includes resource_metadata parameter (per MCP spec)
      expect(wwwAuth).toMatch(/resource_metadata/);
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

describe('Public Tools (noauth)', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp({
      runtimeConfig: createMockRuntimeConfig({
        useStubTools: true,
        env: {
          OAK_API_KEY: 'test-api-key',
          CLERK_PUBLISHABLE_KEY: 'pk_test_123',
          CLERK_SECRET_KEY: 'sk_test_123',
          NODE_ENV: 'test',
        },
      }),
    });
  });

  it('allows get-changelog without auth (noauth tool)', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-changelog', arguments: {} },
      });

    // Public tools should work without auth - HTTP 200
    expect(res.status).toBe(200);

    // Should contain tool result, not auth error
    const sseData = res.text.split('\n').find((line) => line.startsWith('data: '));
    expect(sseData).toBeDefined();
    if (!sseData) {
      throw new Error('Expected SSE data not found');
    }

    const jsonData = JSON.parse(sseData.substring(6)) as {
      result?: {
        isError?: boolean;
        content?: unknown[];
      };
    };

    // Should be successful tool result
    expect(jsonData.result).toBeDefined();
    expect(jsonData.result?.isError).toBeFalsy();
  });

  it('allows get-rate-limit without auth (noauth tool)', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-rate-limit', arguments: {} },
      });

    // Public tools should work without auth - HTTP 200
    expect(res.status).toBe(200);
  });
});
