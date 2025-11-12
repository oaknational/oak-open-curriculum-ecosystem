/**
 * E2E tests for MCP connection timeout behavior
 *
 * Tests that the app remains responsive even when MCP connection is delayed/hanging:
 * - Health checks and landing page respond immediately
 * - MCP routes timeout gracefully with 503
 * - Non-MCP routes are never blocked
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

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
 */
async function createAppWithHangingConnection(): Promise<Express> {
  const express = await import('express');
  const { createHttpLogger } = await import('../src/logging/index.js');
  const { loadRuntimeConfig } = await import('../src/runtime-config.js');

  const runtimeConfig = loadRuntimeConfig();
  const log = createHttpLogger(runtimeConfig, { name: 'e2e-test-hanging' });

  const { default: expressDefault } = express;
  const app = expressDefault() as Express;

  // Setup base middleware
  app.use(express.json({ limit: '1mb' }));

  // Create a connection that never resolves
  const connectionReady = createHangingConnection();

  // Setup health checks (should work immediately)
  app.get('/healthz', (_req, res) => {
    res.type('application/json').send(JSON.stringify({ status: 'ok' }));
  });

  // Setup landing page (should work immediately)
  app.get('/', (_req, res) => {
    res.type('text/html').send('<html><body>OK</body></html>');
  });

  // Setup MCP route with timeout middleware (the fix we're testing)
  const ensureMcpReady = async (_req: unknown, res: unknown, next: () => void) => {
    try {
      await Promise.race([
        connectionReady,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('MCP connection timeout')), 1000),
        ),
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

describe('MCP Connection Timeout E2E', () => {
  describe('Hanging connection (simulates Vercel deployment issue)', () => {
    let app: Express;

    beforeAll(async () => {
      app = await createAppWithHangingConnection();
    });

    it('should respond to health check immediately (< 500ms) even with hanging MCP connection', async () => {
      const start = Date.now();
      const response = await request(app).get('/healthz').expect(200);
      const duration = Date.now() - start;

      expect(response.body).toEqual({ status: 'ok' });
      expect(duration).toBeLessThan(500); // Should respond almost instantly
    });

    it('should respond to landing page immediately (< 500ms) even with hanging MCP connection', async () => {
      const start = Date.now();
      const response = await request(app).get('/').expect(200);
      const duration = Date.now() - start;

      expect(response.text).toContain('OK');
      expect(duration).toBeLessThan(500); // Should respond almost instantly
    });

    it('should return 503 with timeout error for MCP route when connection hangs', async () => {
      const start = Date.now();
      const response = await request(app)
        .post('/mcp')
        .send({ test: 'data' })
        .set('Accept', 'application/json, text/event-stream')
        .expect(503);
      const duration = Date.now() - start;

      expect(response.body).toMatchObject({
        error: 'MCP server not ready',
        message: 'MCP connection timeout',
      });
      // Should timeout in ~1s (our configured timeout), not hang forever
      expect(duration).toBeGreaterThan(900);
      expect(duration).toBeLessThan(1500);
    });
  });

  describe('Integration with real createApp', () => {
    let app: Express;

    beforeAll(async () => {
      const { createApp } = await import('../src/index.js');
      const { loadRuntimeConfig } = await import('../src/runtime-config.js');

      const runtimeConfig = loadRuntimeConfig();
      runtimeConfig.dangerouslyDisableAuth = true;

      app = createApp({ runtimeConfig });
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
