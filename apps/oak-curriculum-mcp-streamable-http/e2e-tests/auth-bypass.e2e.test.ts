/**
 * E2E Auth Bypass Tests
 *
 * Configuration: dev + live + noauth (DX feature validation)
 * Purpose: Confirms auth bypass works for local development
 *
 * This suite tests that the auth bypass mechanism works correctly when enabled.
 * This is a developer convenience feature that should ONLY work in development.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/index.js';

describe('Auth Bypass for Development (E2E)', () => {
  let app: Express;
  let restoreEnv: () => void;

  beforeAll(() => {
    // Save current environment
    const previous = { ...process.env };

    // Configure for auth bypass – this suite proves the DX helper works.
    // Auth enforcement is asserted in auth-enforcement.e2e.test.ts and smoke-dev-auth.
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test-api-key';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1'; // Allow localhost for DNS rebinding protection

    app = createApp();
    restoreEnv = () => {
      // Clear current env
      for (const key of Object.keys(process.env)) {
        Reflect.deleteProperty(process.env, key);
      }
      // Restore previous env
      Object.assign(process.env, previous);
    };
  });

  afterAll(() => {
    restoreEnv();
  });

  it('allows /mcp POST without Authorization when bypass enabled', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test-client', version: '1.0.0' },
        },
      });

    expect(res.status).toBe(200);
    // MCP responses are SSE format, check the text contains JSON-RPC response
    expect(res.text).toContain('data:');
    expect(res.text).toContain('"result"');
  });

  // Note: GET endpoint test removed - SSE connections stay open causing timeouts
  // POST test above already proves auth bypass works

  it('does not expose OAuth discovery endpoints when auth disabled', () => {
    const router = (
      app as unknown as {
        _router?: { stack?: { route?: { path?: string } }[] };
      }
    )._router;

    const stack = router?.stack ?? [];
    const hasRoute = (path: string) => stack.some((layer) => (layer.route?.path ?? null) === path);

    expect(hasRoute('/.well-known/oauth-authorization-server')).toBe(false);
    expect(hasRoute('/.well-known/oauth-protected-resource')).toBe(false);
  });
});
