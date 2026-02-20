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

import { describe, it, expect, vi } from 'vitest';
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

/**
 * Creates a fresh app instance for auth-enabled tests.
 *
 * Each test creates its own app for isolation.
 */
function createAuthEnabledApp(): Express {
  return createApp({
    runtimeConfig: createMockRuntimeConfig({
      env: {
        OAK_API_KEY: 'test-api-key',
        CLERK_PUBLISHABLE_KEY: 'pk_test_123',
        CLERK_SECRET_KEY: 'sk_test_123',
        NODE_ENV: 'test',
        ELASTICSEARCH_URL: 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
      },
    }),
  });
}

describe('Application-Level Method-Aware Auth', () => {
  describe('Discovery methods (auth required per MCP 2025-11-25)', () => {
    it('returns HTTP 401 for tools/list without Bearer token', async () => {
      const response = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(response.status).toBe(401);
    });

    it('returns HTTP 401 for initialize without Bearer token', async () => {
      const response = await request(createAuthEnabledApp())
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

      expect(response.status).toBe(401);
    });

    it('returns HTTP 401 for tools/list with fake Bearer token', async () => {
      const response = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .set('Authorization', 'Bearer fake-token-for-discovery')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('All tools require HTTP auth (noauth = no scope check, not no token)', () => {
    it('returns HTTP 401 for get-changelog without token', async () => {
      const response = await request(createAuthEnabledApp())
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

      expect(response.status).toBe(401);
    });

    it('returns HTTP 401 for get-changelog-latest without token', async () => {
      const response = await request(createAuthEnabledApp())
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

      expect(response.status).toBe(401);
    });

    it('returns HTTP 401 for get-rate-limit without token', async () => {
      const response = await request(createAuthEnabledApp())
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

      expect(response.status).toBe(401);
    });
  });

  describe('Auth-required generated tools', () => {
    /**
     * Per MCP spec and OpenAI Apps docs, protected tools without token
     * return HTTP 401 with WWW-Authenticate header to trigger OAuth discovery.
     * Auth middleware rejects before MCP transport, so fresh app per test is optional.
     */
    it('returns HTTP 401 with WWW-Authenticate for get-key-stages without token', async () => {
      const response = await request(createAuthEnabledApp())
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
      const response = await request(createAuthEnabledApp())
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
      const response = await request(createAuthEnabledApp())
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
      const response = await request(createAuthEnabledApp())
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
    /**
     * Creates a fresh app with auth disabled.
     * Each test creates its own app for isolation.
     */
    function createBypassApp(): Express {
      return createApp({
        runtimeConfig: createMockRuntimeConfig({
          dangerouslyDisableAuth: true,
          env: {
            OAK_API_KEY: 'test-api-key',
            NODE_ENV: 'development',
            ELASTICSEARCH_URL: 'http://fake-es:9200',
            ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
          },
        }),
      });
    }

    it('allows discovery methods without token when flag is true', async () => {
      const response = await request(createBypassApp())
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(response.status).toBe(200);
    });

    it('allows auth-required tool without token when flag is true', async () => {
      const response = await request(createBypassApp())
        .post('/mcp')
        .set('Accept', ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-key-stages',
          },
        });

      // Should be 200 - auth is disabled
      expect(response.status).toBe(200);
    });

    it('bypasses all auth checks when flag is true', async () => {
      const response = await request(createBypassApp())
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
      expect(response.status).toBe(200);
    });
  });
});
