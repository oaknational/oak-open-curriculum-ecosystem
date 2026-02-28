import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { unwrap } from '@oaknational/result';
import { createApp } from './application.js';
import { loadRuntimeConfig } from './runtime-config.js';

/**
 * Isolated test environment for E2E application tests.
 * No global `process.env` mutation — see ADR-078.
 */
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key',
};

describe('CORS and OAuth metadata', () => {
  it('serves /.well-known/oauth-protected-resource', async () => {
    const result = loadRuntimeConfig({
      processEnv: testEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(result);
    const app = await createApp({ runtimeConfig });
    const res = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res.status).toBe(200);
    const body: unknown = res.body;
    const resource = (body as { resource?: unknown }).resource;
    expect(typeof resource === 'string' && resource.length > 0).toBe(true);
  });
});
