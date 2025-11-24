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

  it('should return 401 for unauthenticated POST /mcp request to protected tool', async () => {
    // Use protected tool (not discovery method) to trigger auth requirement
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/call', params: { name: 'get-key-stages' } });

    expect(response.status).toBe(401);
  });

  it('should include WWW-Authenticate header in 401 response for protected tool', async () => {
    // Use protected tool (not discovery method) to trigger auth requirement
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/call', params: { name: 'get-key-stages' } });

    expect(response.status).toBe(401);
    expect(response.headers['www-authenticate']).toBeDefined();
  });

  it('should point to a valid resource_metadata URL in WWW-Authenticate header', async () => {
    // This test verifies our in-house mcpAuthClerk middleware generates correct
    // resource_metadata URLs in WWW-Authenticate headers (without the /mcp suffix bug)
    // Use protected tool (not discovery method) to trigger auth requirement
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/call', params: { name: 'get-key-stages' } });

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

  it('should NOT include /mcp suffix in resource_metadata URL', async () => {
    // Use a protected tool (not discovery method) to trigger auth requirement
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'tools/call', params: { name: 'get-key-stages' } });

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
});
