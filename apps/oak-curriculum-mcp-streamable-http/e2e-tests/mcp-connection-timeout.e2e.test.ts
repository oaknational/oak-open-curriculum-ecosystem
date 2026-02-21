/**
 * E2E tests for MCP connection timeout behavior
 *
 * Tests that the app remains responsive even when MCP connection is delayed/hanging:
 * - Health checks and landing page respond immediately
 * - MCP routes timeout gracefully with 503
 * - Non-MCP routes are never blocked
 *
 * CRITICAL: This test validates the fix for the Vercel deployment issue where
 * connections hung for MINUTES without responding. We test:
 * 1. Infinite hang (connection never completes) - health checks still work
 * 2. Realistic delay (2s) - MCP routes work after connection completes
 * 3. Timeout behavior - MCP routes return 503 after 5s if connection doesn't complete
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createMockRuntimeConfig } from './helpers/test-config.js';
import type { McpServerFactory } from '../src/mcp-request-context.js';
import { createFakeSearchRetrieval } from '../src/test-helpers/fakes.js';

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
 * Create a never-resolving Promise to simulate a hanging MCP connection
 */
function createHangingConnection(): Promise<void> {
  return new Promise(() => {
    /* never resolves */
  });
}

/**
 * Create an app with a hanging MCP connection to test timeout behavior
 * This simulates the EXACT production scenario where connections hung for MINUTES
 */
async function createAppWithHangingConnection(): Promise<Express> {
  const express = await import('express');
  const { createHttpLogger } = await import('../src/logging/index.js');
  // Use mock config instead of loading from env
  const runtimeConfig = createMockRuntimeConfig();
  const log = createHttpLogger(runtimeConfig, { name: 'e2e-test-hanging' });

  const { default: expressDefault } = express;
  const app = expressDefault() as Express;

  // Setup base middleware
  app.use(express.json({ limit: '1mb' }));

  // Create a connection that never resolves (simulates multi-minute hang)
  const connectionReady = createHangingConnection();

  // Setup health checks (should work immediately)
  app.get('/healthz', (_req, res) => {
    res
      .type('application/json')
      .send(JSON.stringify({ status: 'ok', mode: 'streamable-http', auth: 'required-for-post' }));
  });

  // Setup landing page (should work immediately)
  app.get('/', (_req, res) => {
    res.type('text/html').send('<html><body>Oak Curriculum MCP Server</body></html>');
  });

  // Setup MCP route with 5-second timeout (matches production config)
  const ensureMcpReady = async (_req: unknown, res: unknown, next: () => void) => {
    try {
      await Promise.race([
        connectionReady,
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('MCP connection timeout'));
          }, 5000); // CRITICAL: 5-second timeout, NOT infinite
        }),
      ]);
      next();
    } catch (error) {
      log.error('MCP connection failed', { error });
      (res as { status: (code: number) => { json: (data: unknown) => void } }).status(503).json({
        error: 'MCP server not ready',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Simplified MCP endpoint (just for testing)
  app.post('/mcp', ensureMcpReady as never, (_req, res) => {
    (res as { json: (data: unknown) => void }).json({ success: true });
  });

  return app;
}

/**
 * Setup MCP middleware with timeout and per-request factory.
 *
 * The readiness middleware ensures MCP routes return 503 until shared
 * dependencies (e.g. Elasticsearch client) are ready. Once ready,
 * each request gets a fresh McpServer + transport via the factory.
 */
function setupMcpMiddlewareWithTimeout(
  app: Express,
  connectionReady: Promise<void>,
  mcpFactory: McpServerFactory,
  log: unknown,
): void {
  const ensureMcpReady = async (_req: unknown, res: unknown, next: () => void) => {
    try {
      await Promise.race([
        connectionReady,
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('MCP connection timeout'));
          }, 5000);
        }),
      ]);
      next();
    } catch (error) {
      (
        log as {
          error: (msg: string, context: { error: unknown }) => void;
        }
      ).error('MCP connection failed', { error });
      (res as { status: (code: number) => { json: (data: unknown) => void } }).status(503).json({
        error: 'MCP server not ready',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Setup MCP handler with per-request factory
  void import('../src/handlers.js').then(({ createMcpHandler }) => {
    app.post('/mcp', ensureMcpReady as never, createMcpHandler(mcpFactory, log as never) as never);
  });
}

/**
 * Create an app with a delayed factory readiness signal.
 *
 * Simulates a scenario where shared dependencies (e.g. Elasticsearch client)
 * take time to initialise. The factory itself creates a fresh McpServer +
 * transport per request, but the readiness middleware gates requests until
 * shared setup completes.
 */
async function createAppWithDelayedConnection(delayMs: number): Promise<{
  app: Express;
  ready: Promise<void>;
  connectionCompleted: () => boolean;
}> {
  const express = await import('express');
  const { createHttpLogger } = await import('../src/logging/index.js');
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StreamableHTTPServerTransport } =
    await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
  const { registerHandlers } = await import('../src/handlers.js');

  const runtimeConfig = createMockRuntimeConfig();
  const log = createHttpLogger(runtimeConfig, { name: 'e2e-test-delayed' });

  const { default: expressDefault } = express;
  const app = expressDefault() as Express;

  app.use(express.json({ limit: '1mb' }));

  // Per-request factory: creates a fresh McpServer + transport per request
  const mcpFactory: McpServerFactory = () => {
    const server = new McpServer({ name: 'test-server', version: '1.0.0' });
    registerHandlers(server, {
      runtimeConfig,
      logger: log,
      searchRetrieval: createFakeSearchRetrieval(),
    });
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    return { server, transport };
  };

  // Simulate delayed readiness (e.g. slow ES client creation)
  let completed = false;
  const connectionReady = new Promise<void>((resolve) => {
    setTimeout(() => {
      completed = true;
      resolve();
    }, delayMs);
  });

  // Setup health checks
  app.get('/healthz', (_req, res) => {
    res
      .type('application/json')
      .send(JSON.stringify({ status: 'ok', mode: 'streamable-http', auth: 'required-for-post' }));
  });

  app.get('/', (_req, res) => {
    res.type('text/html').send('<html><body>Oak Curriculum MCP Server</body></html>');
  });

  // Setup MCP route with timeout middleware and per-request factory
  setupMcpMiddlewareWithTimeout(app, connectionReady, mcpFactory, log);

  return {
    app,
    ready: connectionReady,
    connectionCompleted: () => completed,
  };
}

describe('MCP Connection Timeout E2E', () => {
  describe('CRITICAL: Infinite hang (simulates multi-minute production hang)', () => {
    let app: Express;

    beforeAll(async () => {
      app = await createAppWithHangingConnection();
    });

    it('CRITICAL: Health check responds immediately even with infinite MCP connection hang', async () => {
      const start = Date.now();
      const response = await request(app).get('/healthz').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toEqual({
        status: 'ok',
        mode: 'streamable-http',
        auth: 'required-for-post',
      });
      expect(duration).toBeLessThan(500); // Should respond almost instantly, NOT wait for connection
    });

    it('CRITICAL: Landing page responds immediately even with infinite MCP connection hang', async () => {
      const start = Date.now();
      const response = await request(app).get('/').expect(200);
      const duration = Date.now() - start;

      expect(response.text).toContain('Oak Curriculum MCP Server');
      expect(duration).toBeLessThan(500); // Should respond almost instantly, NOT wait for connection
    });

    it('CRITICAL: MCP route times out after 5s, does NOT hang for minutes', async () => {
      const start = Date.now();
      const response = await request(app)
        .post('/mcp')
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
        .set('Accept', 'application/json, text/event-stream')
        .expect(503);
      const duration = Date.now() - start;

      expect(response.body).toMatchObject({
        error: 'MCP server not ready',
        message: 'MCP connection timeout',
      });
      // CRITICAL: Should timeout in ~5 seconds, NOT hang for minutes like production did
      expect(duration).toBeGreaterThan(4800); // At least 4.8s
      expect(duration).toBeLessThan(6000); // No more than 6s
    });
  });

  describe('Realistic network delay (2 second connection time)', () => {
    let app: Express;
    let connectionCompleted: () => boolean;
    let ready: Promise<void>;

    beforeAll(async () => {
      const result = await createAppWithDelayedConnection(2000);
      app = result.app;
      ready = result.ready;
      connectionCompleted = result.connectionCompleted;
    });

    it('Health check responds immediately during 2s connection delay', async () => {
      const start = Date.now();
      const response = await request(app).get('/healthz').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toEqual({
        status: 'ok',
        mode: 'streamable-http',
        auth: 'required-for-post',
      });
      expect(duration).toBeLessThan(500); // Should be instant, not wait for 2s connection
    });

    it('MCP route works correctly after connection completes', async () => {
      // Wait for connection to complete
      await ready;
      expect(connectionCompleted()).toBe(true);

      // Now MCP route should work - it returns SSE format
      const response = await request(app)
        .post('/mcp')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0' },
          },
        })
        .set('Accept', 'application/json, text/event-stream')
        .expect(200);

      // Response is in SSE format, so parse it
      const sseData = response.text
        .split('\n')
        .find((line) => line.startsWith('data: '))
        ?.replace('data: ', '');

      expect(sseData).toBeDefined();
      if (!sseData) {
        throw new Error('SSE data not found');
      }
      const parsed: unknown = JSON.parse(sseData);
      const parsedData = parsed as { result?: { protocolVersion?: string } };
      expect(parsedData).toHaveProperty('result');
      expect(parsedData.result).toHaveProperty('protocolVersion');
    });
  });

  describe('Integration with real createApp', () => {
    let app: Express;

    beforeAll(async () => {
      const { createApp } = await import('../src/application.js');

      const { TEST_UPSTREAM_METADATA } = await import('./helpers/upstream-metadata-fixture.js');
      app = await createApp({
        runtimeConfig: createMockRuntimeConfig(),
        upstreamMetadata: TEST_UPSTREAM_METADATA,
      });
    });

    it('should respond to health check immediately with real app', async () => {
      const start = Date.now();
      const response = await request(app).get('/healthz').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toMatchObject({
        status: 'ok',
        mode: 'streamable-http',
      });
      expect(duration).toBeLessThan(500);
    });

    it('should respond to landing page immediately with real app', async () => {
      const start = Date.now();
      const response = await request(app).get('/').expect(200);
      const duration = Date.now() - start;

      expect(response.text).toContain('Oak Curriculum MCP');
      expect(duration).toBeLessThan(500);
    });
  });
});
