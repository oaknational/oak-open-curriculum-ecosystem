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

    // Configure for auth bypass
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true'; // Bypass ENABLED
    process.env.NODE_ENV = 'development'; // Required for bypass
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test-api-key';
    delete process.env.VERCEL; // Required for bypass (not on Vercel)

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
    expect(res.body).toHaveProperty('result');
  });

  it('allows /mcp GET without Authorization when bypass enabled', async () => {
    const res = await request(app)
      .get('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .query({
        method: 'tools/list',
        jsonrpc: '2.0',
        id: '2',
      });

    expect(res.status).toBe(200);
  });

  it('still exposes OAuth discovery endpoints (for testing)', async () => {
    const res1 = await request(app).get('/.well-known/oauth-authorization-server');
    expect(res1.status).toBe(200);

    const res2 = await request(app).get('/.well-known/oauth-protected-resource');
    expect(res2.status).toBe(200);
  });
});

describe('Auth Bypass Safety Checks', () => {
  it('disables bypass on Vercel even if REMOTE_MCP_ALLOW_NO_AUTH=true', async () => {
    const previous = { ...process.env };

    // Configure as if on Vercel with bypass attempted
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
    process.env.NODE_ENV = 'development';
    process.env.VERCEL = '1'; // Simulate Vercel environment
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
    process.env.OAK_API_KEY = 'test-api-key';

    const app = createApp();

    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    // Should reject because VERCEL is set
    expect(res.status).toBe(401);

    // Restore environment
    for (const key of Object.keys(process.env)) {
      Reflect.deleteProperty(process.env, key);
    }
    Object.assign(process.env, previous);
  });

  it('disables bypass in production even if REMOTE_MCP_ALLOW_NO_AUTH=true', async () => {
    const previous = { ...process.env };

    // Configure as production with bypass attempted
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
    process.env.NODE_ENV = 'production'; // NOT development
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
    process.env.OAK_API_KEY = 'test-api-key';
    delete process.env.VERCEL;

    const app = createApp();

    const res = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', id: '1', method: 'initialize', params: {} });

    // Should reject because NODE_ENV is not development
    expect(res.status).toBe(401);

    // Restore environment
    for (const key of Object.keys(process.env)) {
      Reflect.deleteProperty(process.env, key);
    }
    Object.assign(process.env, previous);
  });
});
