/**
 * E2E test proving the per-request transport pattern works.
 *
 * The MCP protocol requires clients to send multiple requests within a session
 * (e.g. initialize, tools/list, tools/call). A server that cannot handle
 * multiple sequential requests to the same application instance is broken.
 *
 * This test sends two sequential POST requests to the same app instance.
 * Before the per-request transport fix, the second request would fail with
 * HTTP 500 because `StreamableHTTPServerTransport` in stateless mode throws
 * after the first request.
 */
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';

describe('Multi-request session against a single app instance', () => {
  it('handles sequential initialize then tools/list on the same app', async () => {
    const { app } = createStubbedHttpApp();

    // First request: initialize
    const initResponse = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'init-1',
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'e2e-test', version: '1.0.0' },
        },
      });

    expect(initResponse.status).toBe(200);
    const initEnvelope = parseSseEnvelope(initResponse.text);
    expect(initEnvelope.result).toBeDefined();

    // Second request: tools/list — this MUST succeed on the same app instance
    const listResponse = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'list-1',
        method: 'tools/list',
      });

    expect(listResponse.status).toBe(200);
    const listEnvelope = parseSseEnvelope(listResponse.text);
    expect(listEnvelope.result).toBeDefined();
  });

  it('handles three sequential requests (initialize, tools/list, tools/call)', async () => {
    const { app } = createStubbedHttpApp();

    // Request 1: initialize
    const initResponse = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'init-1',
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'e2e-test', version: '1.0.0' },
        },
      });

    expect(initResponse.status).toBe(200);

    // Request 2: tools/list
    const listResponse = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'list-1',
        method: 'tools/list',
      });

    expect(listResponse.status).toBe(200);

    // Request 3: tools/call — get-key-stages (stub mode)
    const callResponse = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'call-1',
        method: 'tools/call',
        params: {
          name: 'get-key-stages',
          arguments: {},
        },
      });

    expect(callResponse.status).toBe(200);
    const callEnvelope = parseSseEnvelope(callResponse.text);
    expect(callEnvelope.result).toBeDefined();
  });
});
