import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from './index.js';

describe('CORS and OAuth metadata', () => {
  it('serves /.well-known/oauth-protected-resource', async () => {
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res.status).toBe(200);
    const body: unknown = res.body;
    const resource = (body as { resource?: unknown }).resource;
    expect(typeof resource === 'string' && resource.length > 0).toBe(true);
  });
});
