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

import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';

const ACCEPT_HEADER = 'application/json, text/event-stream';

// Mock Clerk middleware to avoid network IO and requirement for valid keys
vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  requireAuth: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  getAuth: () => ({
    isAuthenticated: false,
    toAuth: () => ({}),
  }),
}));
// E2E tests don't block fetch, so no restoration needed

describe('Application-Level Method-Aware Auth', () => {
  let app: Express;

  // Create app once for all tests (like E2E tests do)
  beforeAll(() => {
    app = createApp({
      runtimeConfig: createMockRuntimeConfig({
        // Auth enabled by default in mock config
        env: {
          OAK_API_KEY: 'test-api-key',
          CLERK_PUBLISHABLE_KEY: 'pk_test_123',
          CLERK_SECRET_KEY: 'sk_test_123',
          NODE_ENV: 'test',
        },
      }),
    });
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

    beforeAll(() => {
      bypassApp = createApp({
        runtimeConfig: createMockRuntimeConfig({
          dangerouslyDisableAuth: true,
          env: {
            OAK_API_KEY: 'test-api-key',
            CLERK_PUBLISHABLE_KEY: 'pk_test_123',
            CLERK_SECRET_KEY: 'sk_test_123',
            NODE_ENV: 'development',
          },
        }),
      });
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
