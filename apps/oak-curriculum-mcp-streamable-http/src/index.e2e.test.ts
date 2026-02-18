import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from './application.js';
import { loadRuntimeConfig } from './runtime-config.js';

/**
 * Isolated test environment without BASE_URL or MCP_CANONICAL_URI.
 * No global `process.env` mutation — see ADR-078.
 */
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  CLERK_PUBLISHABLE_KEY: 'REDACTED',
  CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key',
};

describe('CORS and OAuth metadata', () => {
  it('serves /.well-known/oauth-protected-resource', async () => {
    const runtimeConfig = loadRuntimeConfig(testEnv);
    const app = createApp({ runtimeConfig });
    const res = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res.status).toBe(200);
    const body: unknown = res.body;
    const resource = (body as { resource?: unknown }).resource;
    expect(typeof resource === 'string' && resource.length > 0).toBe(true);
  });
});
