import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from './application.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { TEST_UPSTREAM_METADATA } from '../e2e-tests/helpers/upstream-metadata-fixture.js';

describe('OAuth Protected Resource Metadata (Integration)', () => {
  const createTestApp = async (
    allowedHosts = 'localhost,127.0.0.1,example.com,api.example.com',
  ) => {
    const result = loadRuntimeConfig({
      processEnv: {
        NODE_ENV: 'test',
        OAK_API_KEY: 'test-api-key',
        CLERK_PUBLISHABLE_KEY: 'pk_test_dGVzdC1pbnN0YW5jZS5jbGVyay5hY2NvdW50cy5kZXYk',
        CLERK_SECRET_KEY: 'sk_test_123',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key',
        ALLOWED_HOSTS: allowedHosts,
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

      expect(res.body).toHaveProperty('resource', 'https://example.com/mcp');
    });

    it('resource URL uses http protocol for local development', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('resource', 'http://localhost:3333/mcp');
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

        expect(res.body).toHaveProperty('resource', expected);
      }
    });

    it('resource URL identifies the /mcp endpoint, not auxiliary routes', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('resource', 'https://api.example.com/mcp');
      expect(res.body).toHaveProperty('resource', expect.stringMatching(/\/mcp$/));
    });
  });

  describe('authorization_servers field (self-origin proxy)', () => {
    it('points to self-origin, not upstream Clerk', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('authorization_servers', ['http://localhost:3333']);
    });

    it('uses https for non-loopback hosts', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('authorization_servers', ['https://api.example.com']);
    });
  });

  describe('path-qualified PRM (RFC 9728 Section 3.1)', () => {
    it('serves PRM at /.well-known/oauth-protected-resource/mcp with self-origin AS', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource/mcp')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('authorization_servers', ['http://localhost:3333']);
      expect(res.body).toHaveProperty('resource', 'http://localhost:3333/mcp');
    });
  });

  describe('scopes_supported field', () => {
    it('returns scopes_supported without openid (Clerk dynamic clients reject it)', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'example.com');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('scopes_supported', expect.arrayContaining(['email']));
      expect(res.body).not.toHaveProperty('scopes_supported', expect.arrayContaining(['openid']));
    });
  });

  describe('AS metadata (/.well-known/oauth-authorization-server)', () => {
    it('returns self-origin endpoint URLs with upstream capabilities', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('issuer', 'http://localhost:3333');
      expect(res.body).toHaveProperty(
        'authorization_endpoint',
        'http://localhost:3333/oauth/authorize',
      );
      expect(res.body).toHaveProperty('token_endpoint', 'http://localhost:3333/oauth/token');
      expect(res.body).toHaveProperty(
        'registration_endpoint',
        'http://localhost:3333/oauth/register',
      );
      expect(res.body).toHaveProperty(
        'response_types_supported',
        TEST_UPSTREAM_METADATA.response_types_supported,
      );
      expect(res.body).toHaveProperty(
        'grant_types_supported',
        TEST_UPSTREAM_METADATA.grant_types_supported,
      );
      expect(res.body).toHaveProperty(
        'code_challenge_methods_supported',
        TEST_UPSTREAM_METADATA.code_challenge_methods_supported,
      );
    });

    it('passes through scopes_supported unchanged from upstream (transparent proxy)', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('scopes_supported', TEST_UPSTREAM_METADATA.scopes_supported);
    });
  });

  describe('host validation for OAuth metadata', () => {
    it('rejects disallowed Host header with 403', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'evil.com');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'forbidden');
    });

    it('rejects disallowed Host on authorization server metadata', async () => {
      const app = await createTestApp();

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'evil.com');

      expect(res.status).toBe(403);
    });

    it('allows wildcard hosts on protected-resource metadata', async () => {
      const app = await createTestApp('localhost,127.0.0.1,*.example.com');

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('resource', 'https://api.example.com/mcp');
    });

    it('allows wildcard hosts on authorization-server metadata', async () => {
      const app = await createTestApp('localhost,127.0.0.1,*.example.com');

      const res = await request(app)
        .get('/.well-known/oauth-authorization-server')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('issuer', 'https://api.example.com');
    });
  });
});
