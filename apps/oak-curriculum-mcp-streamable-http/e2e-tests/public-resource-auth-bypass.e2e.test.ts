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
 * - Documentation (`docs://oak/*.md`) - static markdown
 *
 * Widget URI was removed from the public list in WS3 Phase 1 (legacy widget
 * framework deletion). Phase 2-3 will re-add it when the fresh React MCP App
 * is scaffolded.
 *
 * ## Security Rationale
 *
 * These resources are safe to serve without auth because:
 * - Documentation is static markdown generated at SDK compile time
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @see ADR-057: Selective Authentication for Public MCP Resources
 */

import { describe, it, expect } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { z } from 'zod';
import { createApp } from '../src/application.js';
import {
  createMockObservability,
  createMockRuntimeConfig,
  createNoOpClerkMiddleware,
} from './helpers/test-config.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Schema for validating SSE data payloads from MCP resource reads.
 *
 * Intentionally loose: we only need to confirm the envelope shape,
 * not the full MCP response, because these tests prove auth bypass
 * behaviour rather than resource content.
 */
const SseResourceDataSchema = z.object({
  result: z
    .object({
      contents: z.array(z.unknown()),
    })
    .optional(),
});

/**
 * Test configuration: Auth ENABLED (production equivalent).
 *
 * This mirrors production configuration to prove the selective auth bypass works.
 * DANGEROUSLY_DISABLE_AUTH is NOT set - auth is enforced.
 */
async function createAuthEnabledApp(): Promise<Express> {
  const runtimeConfig = createMockRuntimeConfig({
    env: {
      OAK_API_KEY: 'test-api-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      NODE_ENV: 'test',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    },
  });
  return await createApp({
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    clerkMiddlewareFactory: createNoOpClerkMiddleware(),
  });
}

describe('Public Resource Authentication Bypass (E2E)', () => {
  describe('Widget Resource URI (Public — static HTML, no user data)', () => {
    it('allows resources/read for widget URI without auth token', async () => {
      const res = await request(await createAuthEnabledApp())
        .post('/mcp')
        .set('Accept', 'application/json, text/event-stream')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: WIDGET_URI },
        });

      expect(res.status).toBe(200);
    });
  });

  describe('Documentation Resources (No Auth Required)', () => {
    it('allows resources/read for getting-started documentation without auth token', async () => {
      const res = await request(await createAuthEnabledApp())
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

      const jsonData = SseResourceDataSchema.parse(JSON.parse(dataLine.substring(6)));
      expect(jsonData.result).toBeDefined();
      expect(jsonData.result?.contents).toBeDefined();
    });

    it('allows resources/read for tools documentation without auth token', async () => {
      const res = await request(await createAuthEnabledApp())
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
      const res = await request(await createAuthEnabledApp())
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
      const res = await request(await createAuthEnabledApp())
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
      const res = await request(await createAuthEnabledApp())
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
      const res = await request(await createAuthEnabledApp())
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
      const res = await request(await createAuthEnabledApp())
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
