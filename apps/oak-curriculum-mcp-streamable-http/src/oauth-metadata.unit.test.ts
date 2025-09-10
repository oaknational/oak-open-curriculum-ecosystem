import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import type express from 'express';
import { createApp } from './index.js';

describe('OAuth Protected Resource metadata', () => {
  let app: express.Express;

  beforeEach(() => {
    delete process.env.OAK_API_KEY;
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    app = createApp();
  });

  it('responds without requiring OAK_API_KEY', async () => {
    const res = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
    interface Metadata {
      resource: string;
      authorization_servers: string[];
      bearer_methods_supported: string[];
      scopes_supported: string[];
    }
    const body = res.body as Partial<Metadata>;
    expect(body).toHaveProperty('resource', 'http://localhost/mcp');
    expect(Array.isArray(body.authorization_servers)).toBe(true);
  });
});
