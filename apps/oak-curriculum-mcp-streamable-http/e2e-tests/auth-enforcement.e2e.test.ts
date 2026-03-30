/**
 * E2E Auth Enforcement Tests
 *
 * Configuration: dev + live + auth (production-equivalent)
 * Purpose: Proves auth enforcement works exactly as in production
 *
 * This suite tests the system with auth ENABLED, which mirrors production
 * configuration. No auth bypass is used here.
 *
 * ## Auth Model (Per MCP 2025-11-25 Spec + OpenAI Apps Docs)
 *
 * The specs define TWO complementary auth mechanisms:
 *
 * 1. **HTTP 401 + WWW-Authenticate** (Transport-level)
 *    - For unauthenticated requests (no token, invalid token)
 *    - Triggers OAuth discovery flow
 *    - Returned BEFORE request reaches MCP SDK
 *    - "Authorization MUST be included in every HTTP request"
 *    - Applies to ALL MCP methods including discovery and noauth tools
 *
 * 2. **HTTP 200 + _meta["mcp/www_authenticate"]** (Tool-level)
 *    - For authenticated requests missing required scope
 *    - Used for per-tool scope refinements
 *    - Returned FROM tool handlers after auth passes
 *
 * Both are needed. HTTP 401 initiates OAuth, _meta handles scope issues.
 *
 * ## Proxy OAuth AS
 *
 * Our server acts as a proxy OAuth AS so that the resource server and
 * authorization server share the same origin. This works around a
 * confirmed Cursor bug (forum #151331) where `resource_metadata` URL
 * is lost when RS and AS are on different origins. PRM and AS metadata
 * endpoints return self-origin URLs; proxy routes forward to Clerk.
 *
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 * @see https://modelcontextprotocol.io/extensions/apps/overview
 */

import { describe, it, expect } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { createMockRuntimeConfig, createNoOpClerkMiddleware } from './helpers/test-config.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';

/**
 * Type guard for OAuth Protected Resource metadata response.
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

interface AuthServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint: string;
}

function isAuthServerMetadata(value: unknown): value is AuthServerMetadata {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'issuer' in value &&
    'authorization_endpoint' in value &&
    'token_endpoint' in value &&
    'registration_endpoint' in value
  );
}

/**
 * Helper: Validates PRM returns self-origin in authorization_servers
 */
async function validatePrmSelfOrigin(app: Express): Promise<string> {
  const res = await request(app).get('/.well-known/oauth-protected-resource');
  expect(res.status).toBe(200);

  const metadata: unknown = res.body;
  if (!isOAuthMetadata(metadata)) {
    throw new Error('Invalid OAuth metadata response');
  }

  expect(metadata.authorization_servers.length).toBeGreaterThan(0);
  const asUrl = metadata.authorization_servers[0];

  expect(asUrl).toMatch(/^https?:\/\/127\.0\.0\.1:\d+$/);

  return asUrl;
}

/**
 * Creates a fresh auth-enabled app instance with injected upstream metadata.
 */
async function createAuthApp(): Promise<Express> {
  return await createApp({
    runtimeConfig: createMockRuntimeConfig({
      useStubTools: true,
      env: {
        OAK_API_KEY: 'test-api-key',
        CLERK_PUBLISHABLE_KEY: 'pk_test_123',
        CLERK_SECRET_KEY: 'sk_test_123',
        NODE_ENV: 'test',
        LOG_LEVEL: 'debug',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
      },
    }),
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: createNoOpClerkMiddleware(),
  });
}

describe('Auth Enforcement (E2E - Production Equivalent)', () => {
  describe('Discovery Methods (Auth Required per MCP 2025-11-25)', () => {
    it('returns HTTP 401 for initialize without Authorization header', async () => {
      const res = await request(await createAuthApp())
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

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('resource_metadata=');
    });

    it('returns HTTP 401 for tools/list via POST without Authorization header', async () => {
      const res = await request(await createAuthApp())
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('resource_metadata=');
    });
  });

  describe('Protected Tools Without Token (HTTP 401 Required)', () => {
    it('returns HTTP 401 with WWW-Authenticate for protected tools without auth', async () => {
      const res = await request(await createAuthApp())
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('resource_metadata=');
    });

    it('returns HTTP 401 for invalid Bearer token', async () => {
      const res = await request(await createAuthApp())
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

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('error=');
    });

    it('returns HTTP 401 for malformed Authorization header', async () => {
      const res = await request(await createAuthApp())
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

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });
  });

  describe('OAuth Discovery Flow (Proxy — Self-Origin)', () => {
    it('PRM authorization_servers points to self-origin, not Clerk', async () => {
      const oauthApp = await createAuthApp();

      const step1 = await request(oauthApp)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      expect(step1.status).toBe(401);
      expect(step1.headers['www-authenticate']).toContain('resource_metadata=');

      const asUrl = await validatePrmSelfOrigin(oauthApp);

      expect(asUrl).not.toContain('clerk');
      expect(asUrl).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
    });

    it('AS metadata endpoints point to self-origin, not Clerk', async () => {
      const app = await createAuthApp();
      const res = await request(app).get('/.well-known/oauth-authorization-server');

      expect(res.status).toBe(200);

      const metadata: unknown = res.body;

      if (!isAuthServerMetadata(metadata)) {
        throw new Error('Invalid authorization server metadata response');
      }

      expect(metadata.issuer).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
      expect(metadata.authorization_endpoint).toMatch(
        /^http:\/\/127\.0\.0\.1:\d+\/oauth\/authorize$/,
      );
      expect(metadata.token_endpoint).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/oauth\/token$/);
      expect(metadata.registration_endpoint).toMatch(
        /^http:\/\/127\.0\.0\.1:\d+\/oauth\/register$/,
      );

      expect(metadata.issuer).not.toContain('clerk');
      expect(metadata.authorization_endpoint).not.toContain('clerk');
      expect(metadata.token_endpoint).not.toContain('clerk');
    });

    it('AS metadata preserves upstream capability fields', async () => {
      const app = await createAuthApp();
      const res = await request(app).get('/.well-known/oauth-authorization-server');

      expect(res.status).toBe(200);

      const body = res.body as Record<string, unknown>;

      expect(body.response_types_supported).toEqual(['code']);
      expect(body.grant_types_supported).toEqual(['authorization_code', 'refresh_token']);
      expect(body.code_challenge_methods_supported).toEqual(['S256']);
      expect(body.token_endpoint_auth_methods_supported).toEqual([
        'client_secret_basic',
        'none',
        'client_secret_post',
      ]);
    });
  });

  describe('OAuth Proxy Endpoints Exist', () => {
    it('GET /oauth/authorize returns a redirect', async () => {
      const app = await createAuthApp();
      const res = await request(app).get('/oauth/authorize?response_type=code&client_id=test');

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('test-instance.clerk.accounts.dev');
    });
  });

  describe('OAuth Metadata Endpoints', () => {
    it('protected resource metadata contains valid authorization_servers array', async () => {
      const prRes = await request(await createAuthApp()).get(
        '/.well-known/oauth-protected-resource',
      );
      expect(prRes.status).toBe(200);

      const metadata: unknown = prRes.body;

      expect(metadata).toHaveProperty('resource');
      expect(metadata).toHaveProperty('authorization_servers');

      if (!isOAuthMetadata(metadata)) {
        throw new Error('Invalid OAuth metadata response');
      }

      expect(Array.isArray(metadata.authorization_servers)).toBe(true);
      expect(metadata.authorization_servers.length).toBeGreaterThan(0);

      const asUrl = metadata.authorization_servers[0];
      expect(asUrl).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
      expect(asUrl).not.toContain('clerk');
    });

    it('serves path-qualified PRM at /.well-known/oauth-protected-resource/mcp (RFC 9728 Section 3.1)', async () => {
      const res = await request(await createAuthApp()).get(
        '/.well-known/oauth-protected-resource/mcp',
      );
      expect(res.status).toBe(200);

      const metadata: unknown = res.body;

      if (!isOAuthMetadata(metadata)) {
        throw new Error('Invalid OAuth metadata at path-qualified PRM URL');
      }

      expect(metadata.authorization_servers.length).toBeGreaterThan(0);
      const asUrl = metadata.authorization_servers[0];
      expect(asUrl).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
      expect(asUrl).not.toContain('clerk');
    });

    it('exposes /.well-known/oauth-protected-resource with correct scopes', async () => {
      const res = await request(await createAuthApp()).get('/.well-known/oauth-protected-resource');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resource');
      expect(res.body).toHaveProperty('authorization_servers');
      expect(res.body).toHaveProperty('scopes_supported');

      const body: unknown = res.body;
      if (!isOAuthMetadata(body)) {
        throw new Error('Invalid OAuth metadata response');
      }

      const scopes = (body as { scopes_supported?: string[] }).scopes_supported;
      expect(scopes).toEqual(expect.arrayContaining(['email']));
      expect(scopes).not.toContain('openid');
      expect(scopes).toHaveLength(1);
    });
  });
});

describe('Auth Enforcement - RFC Compliance', () => {
  describe('RFC Compliance', () => {
    it('oauth-protected-resource conforms to RFC 9728', async () => {
      const res = await request(await createAuthApp()).get('/.well-known/oauth-protected-resource');

      expect(res.status).toBe(200);

      const body: unknown = res.body;

      expect(body).toHaveProperty('resource');
      expect(body).toHaveProperty('authorization_servers');

      if (!isOAuthMetadata(body)) {
        throw new Error('Response does not conform to OAuth metadata structure');
      }

      expect(typeof body.resource).toBe('string');
      expect(Array.isArray(body.authorization_servers)).toBe(true);
      expect(body.authorization_servers.every((s) => typeof s === 'string')).toBe(true);

      if ('scopes_supported' in body && body.scopes_supported) {
        expect(Array.isArray(body.scopes_supported)).toBe(true);
      }

      if ('bearer_methods_supported' in body && body.bearer_methods_supported) {
        expect(Array.isArray(body.bearer_methods_supported)).toBe(true);
      }
    });

    it('resource URL identifies the /mcp endpoint as the protected resource', async () => {
      const res = await request(await createAuthApp()).get('/.well-known/oauth-protected-resource');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      expect(body).toHaveProperty('resource');

      const resource = (body as { resource: unknown }).resource;
      expect(typeof resource).toBe('string');

      expect(resource).toMatch(/^https?:\/\/127\.0\.0\.1:\d+\/mcp$/);
      expect(resource).toContain('/mcp');

      const resourceUrl = new URL(resource as string);
      expect(resourceUrl.hostname).toBe('127.0.0.1');
      expect(resourceUrl.pathname).toBe('/mcp');
    });

    it('WWW-Authenticate header conforms to RFC 6750 Bearer scheme', async () => {
      const res = await request(await createAuthApp())
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();

      expect(wwwAuth.toLowerCase()).toMatch(/^bearer\s+/);
      expect(wwwAuth).toMatch(/resource_metadata/);
    });
  });
});

describe('All Tools Require HTTP Auth (noauth = no scope check, not no token)', () => {
  it('returns HTTP 401 for get-changelog without auth', async () => {
    const res = await request(await createAuthApp())
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-changelog', arguments: {} },
      });

    expect(res.status).toBe(401);

    const wwwAuth = res.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(wwwAuth).toContain('Bearer');
    expect(wwwAuth).toContain('resource_metadata=');
  });

  it('returns HTTP 401 for get-rate-limit without auth', async () => {
    const res = await request(await createAuthApp())
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-rate-limit', arguments: {} },
      });

    expect(res.status).toBe(401);

    const wwwAuth = res.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(wwwAuth).toContain('Bearer');
  });
});
