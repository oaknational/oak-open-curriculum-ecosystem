import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';

const ACCEPT = 'application/json, text/event-stream';

describe('CORS/Hosts positive path', () => {
  it('allows allowed host and origin', async () => {
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
    // Disable auth – this assertion isolates host/CORS handling.
    // Auth enforcement is exercised in auth-enforcement.e2e.test.ts and smoke-dev-auth.
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Origin', 'http://localhost:3000')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
    // Positive CORS: Access-Control-Allow-Origin echoes the origin
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('allows wildcard host pattern for dynamic Vercel preview URLs', async () => {
    process.env.ALLOWED_HOSTS = 'poc-oak-open-curriculum-*.vercel.thenational.academy,localhost';
    process.env.ALLOWED_ORIGINS = 'https://curriculum-mcp-alpha.oaknational.dev';
    // Disable auth – this assertion isolates host/CORS handling.
    // Auth enforcement is exercised in auth-enforcement.e2e.test.ts and smoke-dev-auth.
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'poc-oak-open-curriculum-8qwhtqr6o.vercel.thenational.academy')
      .set('Origin', 'https://curriculum-mcp-alpha.oaknational.dev')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });
});
