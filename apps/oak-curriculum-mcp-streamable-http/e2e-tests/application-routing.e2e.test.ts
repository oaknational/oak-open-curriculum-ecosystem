/* eslint-disable max-lines-per-function */
/**
 * Application-Level E2E Tests for Method-Aware Auth Routing
 *
 * These tests verify that method-aware MCP routing works end-to-end at the
 * application level, testing the complete request flow through createApp().
 *
 * Note: Originally planned as integration tests, but due to Clerk middleware
 * requiring network access and proper initialization, these tests work best
 * as E2E tests using the e2e test environment (which doesn't block fetch).
 *
 * Test coverage per Phase 2, Sub-Phase 2.5 requirements:
 * 1. Discovery methods (initialize, tools/list)
 * 2. Public generated tools (get-changelog, get-changelog-latest, get-rate-limit)
 * 3. Auth-required generated tools (get-key-stages, get-programmes)
 * 4. Aggregated tools (search, fetch)
 * 5. DANGEROUSLY_DISABLE_AUTH compatibility
 *
 * Part of Phase 2, Sub-Phase 2.5
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../src/application.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';

const ACCEPT_HEADER = 'application/json, text/event-stream';

// E2E tests don't block fetch, so no restoration needed

describe('Application-Level Method-Aware Auth', () => {
  let app: Express;

  // Create app once for all tests (like E2E tests do)
  beforeAll(() => {
    const testEnv: NodeJS.ProcessEnv = {
      NODE_ENV: 'test',
      CLERK_PUBLISHABLE_KEY: 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ',
      CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
      OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
      // Auth enabled, but discovery/public tools should work without token
    };

    const runtimeConfig = loadRuntimeConfig(testEnv);
    app = createApp({ runtimeConfig });
  });

  describe('Discovery methods (no auth required)', () => {
    it('allows tools/list without Bearer token', async () => {
      const response = await request(app).post('/mcp').set('Accept', ACCEPT_HEADER).send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/list',
      });

      expect(response.status).toBe(200);
    });

    it('allows initialize without Bearer token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0' },
          },
        });

      expect(response.status).toBe(200);
    });

    it('allows tools/list with Bearer token (does not break)', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .set('Authorization', 'Bearer fake-token-for-discovery')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      // Discovery methods should work regardless of token presence
      expect(response.status).toBe(200);
    });
  });

  describe('Public generated tools (no auth required)', () => {
    it('allows tools/call get-changelog without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-changelog',
          },
        });

      // Public tool should not require auth - either 200 (success) or tool-level error (not 401)
      expect(response.status).not.toBe(401);
    });

    it('allows tools/call get-changelog-latest without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-changelog-latest',
          },
        });

      // Public tool should not require auth - either 200 (success) or tool-level error (not 401)
      expect(response.status).not.toBe(401);
    });

    it('allows tools/call get-rate-limit without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-rate-limit',
          },
        });

      // Public tool should not require auth - either 200 (success) or tool-level error (not 401)
      expect(response.status).not.toBe(401);
    });
  });

  describe('Auth-required generated tools', () => {
    /**
     * Per MCP spec and OpenAI Apps docs, protected tools without token
     * return HTTP 401 with WWW-Authenticate header to trigger OAuth discovery.
     */
    it('returns HTTP 401 with WWW-Authenticate for get-key-stages without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-key-stages',
            arguments: {},
          },
        });

      // HTTP 401 per MCP spec and OpenAI Apps docs
      expect(response.status).toBe(401);

      // WWW-Authenticate header per RFC 6750
      const wwwAuth = response.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
      expect(wwwAuth).toContain('resource_metadata=');
    });

    it('returns HTTP 401 with WWW-Authenticate for get-subjects without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-subjects',
            arguments: {},
          },
        });

      // HTTP 401 per MCP spec
      expect(response.status).toBe(401);

      const wwwAuth = response.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });
  });

  describe('Aggregated tools (require auth)', () => {
    it('returns HTTP 401 with WWW-Authenticate for search without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'search',
            arguments: { query: 'test' },
          },
        });

      // HTTP 401 per MCP spec
      expect(response.status).toBe(401);

      const wwwAuth = response.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });

    it('returns HTTP 401 with WWW-Authenticate for fetch without token', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'fetch',
            arguments: { id: 'test-id' },
          },
        });

      // HTTP 401 per MCP spec
      expect(response.status).toBe(401);

      const wwwAuth = response.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });
  });

  describe('DANGEROUSLY_DISABLE_AUTH compatibility', () => {
    let bypassApp: Express;
    let originalEnv: string | undefined;

    beforeAll(() => {
      originalEnv = process.env.DANGEROUSLY_DISABLE_AUTH;

      const testEnv: NodeJS.ProcessEnv = {
        NODE_ENV: 'development',
        OAK_API_KEY: 'test-api-key',
        DANGEROUSLY_DISABLE_AUTH: 'true',
        CLERK_PUBLISHABLE_KEY: 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ',
        CLERK_SECRET_KEY: 'sk_test_dummy_for_testing',
      };

      const runtimeConfig = loadRuntimeConfig(testEnv);
      bypassApp = createApp({ runtimeConfig });
    });

    afterAll(() => {
      if (originalEnv === undefined) {
        delete process.env.DANGEROUSLY_DISABLE_AUTH;
      } else {
        process.env.DANGEROUSLY_DISABLE_AUTH = originalEnv;
      }
    });

    it('allows all methods without token when flag is true', async () => {
      // Test discovery method
      const discoveryResponse = await request(bypassApp)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(discoveryResponse.status).toBe(200);

      // Test auth-required tool
      const protectedToolResponse = await request(bypassApp)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '2',
          method: 'tools/call',
          params: {
            name: 'get-key-stages',
          },
        });

      // Should be 200 - auth is disabled
      expect(protectedToolResponse.status).toBe(200);
    });

    it('bypasses all auth checks when flag is true', async () => {
      // Test aggregated tool that normally requires auth
      const searchResponse = await request(bypassApp)
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'search',
          },
        });

      // Should be 200 - auth is disabled
      expect(searchResponse.status).toBe(200);
    });
  });
});
