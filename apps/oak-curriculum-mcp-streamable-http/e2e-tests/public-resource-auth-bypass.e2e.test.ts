/**
 * E2E tests for public resource authentication bypass.
 *
 * Per TDD at system level: These tests SPECIFY the desired behaviour before implementation.
 *
 * ## Problem
 *
 * ChatGPT makes ~60 `resources/read` calls during discovery. Each goes through
 * Clerk authentication (~170ms overhead), causing ~10s total latency.
 *
 * ## Solution
 *
 * Skip authentication for public resources that contain no user data:
 * - Widget HTML (`ui://widget/oak-json-viewer-abc12345.html`) - static shell with hash
 * - Documentation (`docs://oak/*.md`) - static markdown
 *
 * ## Security Rationale
 *
 * These resources are safe to serve without auth because:
 * - Widget HTML is a static shell; user data arrives via `window.openai.toolOutput` at render time
 * - Documentation is static markdown generated at SDK compile time
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @see ADR-057: Selective Authentication for Public MCP Resources
 */

import { describe, it, expect, vi } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

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

/**
 * Test configuration: Auth ENABLED (production equivalent).
 *
 * This mirrors production configuration to prove the selective auth bypass works.
 * DANGEROUSLY_DISABLE_AUTH is NOT set - auth is enforced.
 */
function createAuthEnabledApp(): Express {
  return createApp({
    runtimeConfig: createMockRuntimeConfig({
      // DANGEROUSLY_DISABLE_AUTH is false by default in createMockRuntimeConfig
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

describe('Public Resource Authentication Bypass (E2E)', () => {
  describe('Widget Resource (No Auth Required)', () => {
    it('allows resources/read for widget URI without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: WIDGET_URI },
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('data:');

      const dataLine = res.text.split('\n').find((line) => line.startsWith('data:'));
      if (dataLine === undefined) {
        throw new Error('Expected SSE data line not found in response');
      }

      const jsonData = JSON.parse(dataLine.substring(6)) as { result?: { contents?: unknown[] } };
      expect(jsonData.result).toBeDefined();
      expect(jsonData.result?.contents).toBeDefined();
    });
  });

  describe('Documentation Resources (No Auth Required)', () => {
    it('allows resources/read for getting-started documentation without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/getting-started.md' },
        });

      // Documentation resource should be accessible without authentication
      expect(res.status).toBe(200);
      expect(res.text).toContain('data:');

      const dataLine = res.text.split('\n').find((line) => line.startsWith('data:'));
      if (dataLine === undefined) {
        throw new Error('Expected SSE data line not found in response');
      }

      const jsonData = JSON.parse(dataLine.substring(6)) as { result?: { contents?: unknown[] } };
      expect(jsonData.result).toBeDefined();
      expect(jsonData.result?.contents).toBeDefined();
    });

    it('allows resources/read for tools documentation without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/tools.md' },
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('data:');
    });

    it('allows resources/read for workflows documentation without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/workflows.md' },
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('data:');
    });
  });

  describe('Unknown Resources (Auth Required)', () => {
    it('returns HTTP 401 for unknown resource URI without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'unknown://some/private/resource' },
        });

      // Unknown resources should require authentication
      expect(res.status).toBe(401);

      // WWW-Authenticate header per RFC 6750
      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });

    it('returns HTTP 401 for resources/read without uri param', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: {},
        });

      // Missing uri should fail safe by requiring auth
      expect(res.status).toBe(401);
    });

    it('returns HTTP 401 for resources/read with malformed params', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          // params missing entirely
        });

      // Malformed request should fail safe by requiring auth
      expect(res.status).toBe(401);
    });
  });

  describe('Security: Protected Tools Still Require Auth', () => {
    it('still returns HTTP 401 for tools/call without auth token', async () => {
      const res = await request(createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: {} },
        });

      // Protected tools should still require authentication
      expect(res.status).toBe(401);

      const wwwAuth = res.headers['www-authenticate'];
      expect(wwwAuth).toBeDefined();
      expect(wwwAuth).toContain('Bearer');
    });
  });
});
