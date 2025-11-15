import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './application.js';
import type { Express } from 'express';

/**
 * This test verifies that our workaround ACTUALLY fixes the Clerk bug
 * in our production application code (not mocks, not minimal reproductions)
 */
describe('Clerk workaround effectiveness in production app', () => {
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
    delete process.env.DANGEROUSLY_DISABLE_AUTH;

    // Create the REAL application with ALL middleware including our workaround
    app = createApp();
  });

  it('POST /mcp returns corrected WWW-Authenticate header', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    console.log('POST /mcp Response Status:', response.status);
    console.log('POST /mcp WWW-Authenticate:', response.headers['www-authenticate']);

    expect(response.status).toBe(401);

    const wwwAuth = response.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(typeof wwwAuth).toBe('string');

    // The header MUST NOT contain /mcp suffix
    expect(wwwAuth).not.toContain('/.well-known/oauth-protected-resource/mcp');

    // The header MUST contain the correct endpoint
    expect(wwwAuth).toContain('/.well-known/oauth-protected-resource');

    // Extract and verify the metadata URL
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    if (!match) {
      throw new Error('No resource_metadata found in header');
    }
    const metadataUrl = match[1];

    // Verify it doesn't end with /mcp
    expect(metadataUrl).not.toMatch(/\/mcp$/);
  });

  it('GET /mcp returns corrected WWW-Authenticate header', async () => {
    const response = await request(app)
      .get('/mcp')
      .set('Accept', 'application/json, text/event-stream');

    console.log('GET /mcp Response Status:', response.status);
    console.log('GET /mcp WWW-Authenticate:', response.headers['www-authenticate']);

    expect(response.status).toBe(401);

    const wwwAuth = response.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(typeof wwwAuth).toBe('string');

    // The header MUST NOT contain /mcp suffix
    expect(wwwAuth).not.toContain('/.well-known/oauth-protected-resource/mcp');

    // The header MUST contain the correct endpoint
    expect(wwwAuth).toContain('/.well-known/oauth-protected-resource');

    // Extract and verify the metadata URL
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    if (!match) {
      throw new Error('No resource_metadata found in header');
    }
    const metadataUrl = match[1];

    // Verify it doesn't end with /mcp
    expect(metadataUrl).not.toMatch(/\/mcp$/);
  });

  it('metadata URL from header is actually accessible', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    const wwwAuth = response.headers['www-authenticate'];
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    if (!match) {
      throw new Error('No resource_metadata found in header');
    }
    const metadataUrl = match[1];

    console.log('Testing accessibility of metadata URL:', metadataUrl);

    // Parse the URL to get the path
    const url = new URL(metadataUrl);
    const metadataPath = url.pathname;

    // The metadata endpoint should return 200
    const metadataResponse = await request(app).get(metadataPath);

    console.log('Metadata endpoint status:', metadataResponse.status);
    console.log('Metadata endpoint body:', metadataResponse.body);

    expect(metadataResponse.status).toBe(200);
    expect(metadataResponse.body).toHaveProperty('resource');
  });

  it('broken URL path should return 200 when workaround is in place', async () => {
    // First get the working metadata URL
    const authResponse = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/list' });

    const wwwAuth = authResponse.headers['www-authenticate'];
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    if (!match) {
      throw new Error('No resource_metadata found in header');
    }
    const correctUrl = match[1];
    const url = new URL(correctUrl);

    // Construct the BROKEN URL that Clerk would generate
    const brokenPath = url.pathname + '/mcp';

    console.log('Testing broken URL:', brokenPath);

    // The broken URL should return 404
    const brokenResponse = await request(app).get(brokenPath);

    expect(brokenResponse.status).toBe(200);
  });
});
