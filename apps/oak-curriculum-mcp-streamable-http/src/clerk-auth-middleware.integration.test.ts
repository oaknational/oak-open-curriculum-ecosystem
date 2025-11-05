import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import { createApp } from './index.js';
import { loadRuntimeConfig, type RuntimeConfig } from './runtime-config.js';

function createRuntimeConfig(overrides: Record<string, string> = {}): RuntimeConfig {
  return loadRuntimeConfig({
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ',
    CLERK_SECRET_KEY: 'sk_test_' + 'x'.repeat(40),
    BASE_URL: 'http://localhost:3333',
    MCP_CANONICAL_URI: 'http://localhost:3333/mcp',
    ...overrides,
  } as NodeJS.ProcessEnv);
}

describe('Clerk Auth Middleware Integration', () => {
  let runtimeConfig: RuntimeConfig;

  beforeEach(() => {
    runtimeConfig = createRuntimeConfig();
  });

  it('rejects unauthenticated requests to /mcp with 401', async () => {
    const app = createApp({
      runtimeConfig: createRuntimeConfig({ DANGEROUSLY_DISABLE_AUTH: 'false' }),
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

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
    const app = createApp({ runtimeConfig });
    const res = await request(app).get('/healthz');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('allows GET /.well-known/oauth-protected-resource without auth', async () => {
    const app = createApp({ runtimeConfig });
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
