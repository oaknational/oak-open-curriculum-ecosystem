import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './application.js';

describe('OAuth Protected Resource Metadata (Integration)', () => {
  beforeEach(() => {
    // Set minimum required environment variables for createApp
    process.env.OAK_API_KEY = 'test-api-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
  });

  describe('resource URL generation', () => {
    it('returns resource URL identifying the /mcp endpoint as the protected resource', async () => {
      const app = createApp();

      // Make request to the OAuth metadata endpoint
      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      expect(body).toHaveProperty('resource');

      const resource = (body as { resource: unknown }).resource;
      expect(typeof resource).toBe('string');

      // The resource URL should identify the /mcp endpoint as the protected resource
      // Per RFC 9728, the resource field identifies what is actually protected
      expect(resource).toBe('https://example.com/mcp');
    });

    it('resource URL uses http protocol for local development', async () => {
      const app = createApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'localhost:3333');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const resource = (body as { resource: unknown }).resource;

      // Local development should use http and include /mcp
      expect(resource).toBe('https://localhost:3333/mcp');
    });

    it('resource URL matches request host header and includes /mcp path', async () => {
      const app = createApp();

      const testCases = [
        { host: 'example.com', expected: 'https://example.com/mcp' },
        { host: 'api.example.com', expected: 'https://api.example.com/mcp' },
        { host: 'localhost:3333', expected: 'https://localhost:3333/mcp' },
        { host: 'example.com:8080', expected: 'https://example.com:8080/mcp' },
      ];

      for (const { host, expected } of testCases) {
        const res = await request(app)
          .get('/.well-known/oauth-protected-resource')
          .set('Host', host);

        expect(res.status).toBe(200);

        const body: unknown = res.body;
        const resource = (body as { resource: unknown }).resource;

        // Resource URL should match exactly with /mcp path
        expect(resource).toBe(expected);
      }
    });

    it('resource URL identifies the /mcp endpoint, not auxiliary routes', async () => {
      const app = createApp();

      const res = await request(app)
        .get('/.well-known/oauth-protected-resource')
        .set('Host', 'api.example.com');

      expect(res.status).toBe(200);

      const body: unknown = res.body;
      const resource = (body as { resource: unknown }).resource;

      // Per RFC 9728, the resource field identifies what is actually protected
      // The /mcp endpoint is the MCP resource, auxiliary routes (/, /healthz) are not
      expect(resource).toBe('https://api.example.com/mcp');

      // The resource specifically identifies the MCP endpoint
      expect(resource).toMatch(/\/mcp$/);
    });
  });
});
