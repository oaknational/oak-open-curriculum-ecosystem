/**
 * E2E Auth Bypass Tests
 *
 * Configuration: dev + live + noauth (DX feature validation)
 * Purpose: Confirms auth bypass works for local development
 *
 * This suite tests that the auth bypass mechanism works correctly when enabled.
 * This is a developer convenience feature that should ONLY work in development.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { createApp } from '../src/application.js';
import { createHttpObservabilityOrThrow } from '../src/observability/http-observability.js';
describe('Auth Bypass for Development (E2E)', () => {
  let app: Express;

  beforeAll(async () => {
    // Create isolated env with auth DISABLED (DX helper validation)
    const testEnv: NodeJS.ProcessEnv = {
      NODE_ENV: 'test',
      // Configure for auth bypass – this suite proves the DX helper works.
      // Auth enforcement is asserted in auth-enforcement.e2e.test.ts and smoke-dev-auth.
      DANGEROUSLY_DISABLE_AUTH: 'true',
      OAK_API_KEY: process.env.OAK_API_KEY ?? 'test-api-key',
      ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    };

    const result = loadRuntimeConfig({
      processEnv: testEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(result);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    app = await createApp({
      runtimeConfig,
      observability,
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
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

  it('does not expose OAuth discovery endpoints when auth disabled', async () => {
    const authServer = await request(app).get('/.well-known/oauth-authorization-server');
    expect(authServer.status).toBe(404);

    const protectedResource = await request(app).get('/.well-known/oauth-protected-resource');
    expect(protectedResource.status).toBe(404);
  });
});
