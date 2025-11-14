import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { mcpAuthClerk } from '@clerk/mcp-tools/express';

/**
 * This test proves that @clerk/mcp-tools actually generates the broken URL
 * WITHOUT our workaround middleware
 */
describe('Clerk bug reproduction (no workaround)', () => {
  let app: Express;

  beforeEach(() => {
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.NODE_ENV = 'development';

    // Create a minimal Express app with ONLY Clerk middleware (no workaround)
    app = express();
    app.use(express.json());
    app.use(clerkMiddleware());

    // Protected route using mcpAuthClerk
    app.post('/mcp', mcpAuthClerk, (_req, res) => {
      res.json({ result: 'success' });
    });
  });

  it('proves @clerk/mcp-tools generates broken URL with /mcp suffix', async () => {
    const response = await request(app).post('/mcp').send({ jsonrpc: '2.0', method: 'tools/list' });

    expect(response.status).toBe(401);

    const wwwAuth = response.headers['www-authenticate'];
    console.log('Raw WWW-Authenticate header from Clerk:', wwwAuth);

    // Extract the metadata URL
    const match = /resource_metadata=([^\s]+)/.exec(wwwAuth);
    expect(match).not.toBeNull();

    if (!match) {
      throw new Error('Expected match to be defined');
    }

    const metadataUrl = match[1];
    console.log('Metadata URL from Clerk:', metadataUrl);

    // THIS IS THE BUG: Clerk includes /mcp in the metadata URL
    expect(metadataUrl).toMatch(/\/mcp$/);
    expect(metadataUrl).toContain('/.well-known/oauth-protected-resource/mcp');
  });
});
