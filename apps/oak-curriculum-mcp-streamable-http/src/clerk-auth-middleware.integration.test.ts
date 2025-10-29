import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from './index.js';

describe('Clerk Auth Middleware Integration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Set minimum required env for app to start
    process.env.OAK_API_KEY = 'test-key';
    // Use real publishable key format (public, not secret - per Clerk docs)
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    // Secret key can be fake for integration tests (not used for validation logic)
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('rejects unauthenticated requests to /mcp with 401', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    // Log error details for debugging
    if (res.status !== 401) {
      console.log('Unexpected status:', res.status);
      console.log('Response body:', res.body);
      console.log('Response text:', res.text);
    }

    expect(res.status).toBe(401);
    expect(res.headers['www-authenticate']).toBeDefined();
    expect(res.headers['www-authenticate']).toContain('Bearer');
  });

  it('allows GET /healthz without auth', async () => {
    const app = createApp();
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('allows GET /.well-known/oauth-protected-resource without auth', async () => {
    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-protected-resource');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resource');
    expect(res.body).toHaveProperty('authorization_servers');
    const body: unknown = res.body;
    expect(Array.isArray((body as { authorization_servers?: unknown }).authorization_servers)).toBe(
      true,
    );
  });
});
