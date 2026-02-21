import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from './application.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { TEST_UPSTREAM_METADATA } from '../e2e-tests/helpers/upstream-metadata-fixture.js';

describe('OAuth Protected Resource Metadata (Integration)', () => {
  const createTestApp = async () => {
    const result = loadRuntimeConfig({
      processEnv: {
        NODE_ENV: 'test',
        OAK_API_KEY: 'test-api-key',
        CLERK_PUBLISHABLE_KEY: 'pk_test_dGVzdC1pbnN0YW5jZS5jbGVyay5hY2NvdW50cy5kZXYk',
        CLERK_SECRET_KEY: 'sk_test_123',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key',
      },
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(result);
    return await createApp({ runtimeConfig, upstreamMetadata: TEST_UPSTREAM_METADATA });
  };

  describe('resource URL generation', () => {
    it('returns resource URL identifying the /mcp endpoint as the protected resource', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      expect(body).toHaveProperty('resource');

      const resource = (body as { resource: unknown }).resource;
      expect(typeof resource).toBe('string');

      expect(resource).toBe('https://example.com/mcp');
    });

    it('resource URL uses http protocol for local development', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const resource = (body as { resource: unknown }).resource;

      expect(resource).toBe('http://localhost:3333/mcp');
    });

    it('resource URL matches request host header and includes /mcp path', async () => {
      const app = await createTestApp();

      const testCases = [
        { host: 'example.com', expected: 'https://example.com/mcp' },
        { host: 'api.example.com', expected: 'https://api.example.com/mcp' },
        { host: 'localhost:3333', expected: 'http://localhost:3333/mcp' },
        { host: 'example.com:8080', expected: 'https://example.com:8080/mcp' },
      ];

      for (const { host, expected } of testCases) {
        const res = await request(app)
          .get('/.well-known/oauth-protected-resource')
          .set('Host', host);

        expect(res.status).toBe(200);

        const body: unknown = res.body;
        const resource = (body as { resource: unknown }).resource;

        expect(resource).toBe(expected);
      }
    });

    it('resource URL identifies the /mcp endpoint, not auxiliary routes', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const resource = (body as { resource: unknown }).resource;

      expect(resource).toBe('https://api.example.com/mcp');
      expect(resource).toMatch(/\/mcp$/);
    });
  });

  describe('authorization_servers field (self-origin proxy)', () => {
    it('points to self-origin, not upstream Clerk', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const servers = (body as { authorization_servers: unknown }).authorization_servers;

      expect(Array.isArray(servers)).toBe(true);
      expect(servers).toEqual(['http://localhost:3333']);
    });

    it('uses https for non-loopback hosts', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const servers = (body as { authorization_servers: unknown }).authorization_servers;

      expect(servers).toEqual(['https://api.example.com']);
    });
  });

  describe('path-qualified PRM (RFC 9728 Section 3.1)', () => {
    it('serves PRM at /.well-known/oauth-protected-resource/mcp with self-origin AS', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource/mcp')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const servers = (body as { authorization_servers: unknown }).authorization_servers;

      expect(Array.isArray(servers)).toBe(true);
      expect(servers).toEqual(['http://localhost:3333']);

      const resource = (body as { resource: unknown }).resource;
      expect(resource).toBe('http://localhost:3333/mcp');
    });
  });

  describe('scopes_supported field', () => {
    it('returns scopes_supported without openid (Clerk dynamic clients reject it)', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      expect(body).toHaveProperty('scopes_supported');

      const scopesSupported = (body as { scopes_supported: unknown }).scopes_supported;
      expect(Array.isArray(scopesSupported)).toBe(true);
      expect(scopesSupported).toContain('email');
      expect(scopesSupported).not.toContain('openid');
    });
  });

  describe('AS metadata (/.well-known/oauth-authorization-server)', () => {
    it('returns self-origin endpoint URLs with upstream capabilities', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const md = body as {
        issuer: string;
        authorization_endpoint: string;
        token_endpoint: string;
        registration_endpoint: string;
        response_types_supported: string[];
        grant_types_supported: string[];
        code_challenge_methods_supported: string[];
      };

      expect(md.issuer).toBe('http://localhost:3333');
      expect(md.authorization_endpoint).toBe('http://localhost:3333/oauth/authorize');
      expect(md.token_endpoint).toBe('http://localhost:3333/oauth/token');
      expect(md.registration_endpoint).toBe('http://localhost:3333/oauth/register');

      expect(md.response_types_supported).toEqual(TEST_UPSTREAM_METADATA.response_types_supported);
      expect(md.grant_types_supported).toEqual(TEST_UPSTREAM_METADATA.grant_types_supported);
      expect(md.code_challenge_methods_supported).toEqual(
        TEST_UPSTREAM_METADATA.code_challenge_methods_supported,
      );
    });

    it('passes through scopes_supported unchanged from upstream (transparent proxy)', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const md = body as { scopes_supported: readonly string[] };

      expect(md.scopes_supported).toStrictEqual(TEST_UPSTREAM_METADATA.scopes_supported);
    });
  });
});
