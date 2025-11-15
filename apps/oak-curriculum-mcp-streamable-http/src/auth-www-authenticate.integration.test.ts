import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './application.js';
import type { Express } from 'express';

describe('WWW-Authenticate header integration test', () => {
  let app: Express;

  beforeEach(() => {
    // Set required environment variables
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL;
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;

    // Enable auth to test the WWW-Authenticate header
    delete process.env.DANGEROUSLY_DISABLE_AUTH;

    app = createApp();
  });

  it('should return 401 for unauthenticated POST /mcp request', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    expect(response.status).toBe(401);
  });

  it('should include WWW-Authenticate header in 401 response', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    expect(response.status).toBe(401);
    expect(response.headers['www-authenticate']).toBeDefined();
  });

  it('should point to a valid resource_metadata URL in WWW-Authenticate header', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    expect(response.status).toBe(401);
    const wwwAuth = response.headers['www-authenticate'];
    expect(wwwAuth).toMatch(/resource_metadata=/);

    // Extract the URL from the header
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    expect(match).not.toBeNull();
    if (!match) {
      throw new Error('Expected match to be defined');
    }
    const metadataUrl = match[1];

    // Parse the URL to get just the path
    const url = new URL(metadataUrl);
    const metadataPath = url.pathname;

    // The resource metadata URL should exist and return 200
    const metadataResponse = await request(app).get(metadataPath);

    expect(metadataResponse.status).toBe(200);
    expect(metadataResponse.body).toHaveProperty('resource');
  });

  it.skip('should NOT include /mcp suffix in resource_metadata URL', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    expect(response.status).toBe(401);
    const wwwAuth = response.headers['www-authenticate'];

    // Extract the URL from the header
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    expect(match).not.toBeNull();
    if (!match) {
      throw new Error('Expected match to be defined');
    }
    const metadataUrl = match[1];

    // The metadata URL should NOT end with /mcp
    expect(metadataUrl).not.toMatch(/\/mcp$/);

    // It should point to the well-known endpoint
    expect(metadataUrl).toMatch(/\/.well-known\/oauth-protected-resource$/);
  });

  /**
   * These tests are risky, they have the potential to bake in incorrect behaviour, REVIEW
   */
  describe('Clerk bug workaround: OAuth metadata served at both paths', () => {
    it('should serve OAuth metadata at canonical path /.well-known/oauth-protected-resource', async () => {
      const response = await request(app).get('/.well-known/oauth-protected-resource');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resource');
      expect(response.body).toHaveProperty('authorization_servers');
    });

    it.skip('should ALSO serve OAuth metadata at /mcp suffixed path (Clerk bug workaround)', async () => {
      // WORKAROUND: Due to Clerk bug, we serve metadata at both locations
      // This ensures clients can fetch metadata even with the broken URL
      const response = await request(app).get('/.well-known/oauth-protected-resource/mcp');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resource');
      expect(response.body).toHaveProperty('authorization_servers');
    });

    it.skip('should return valid metadata from both paths (with different resource URLs)', async () => {
      const canonicalResponse = await request(app).get('/.well-known/oauth-protected-resource');
      const workaroundResponse = await request(app).get(
        '/.well-known/oauth-protected-resource/mcp',
      );

      expect(canonicalResponse.status).toBe(200);
      expect(workaroundResponse.status).toBe(200);

      // Both should have the same structure and authorization servers
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(workaroundResponse.body.authorization_servers).toEqual(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        canonicalResponse.body.authorization_servers,
      );

      // The resource URL will differ because Clerk derives it from the request path
      // Canonical: /.well-known/oauth-protected-resource → resource: /
      // Workaround: /.well-known/oauth-protected-resource/mcp → resource: /mcp
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(canonicalResponse.body.resource).toMatch(/\/$/);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(workaroundResponse.body.resource).toMatch(/\/mcp$/);
    });
  });
});
