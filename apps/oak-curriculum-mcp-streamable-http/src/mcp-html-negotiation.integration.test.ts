import http from 'node:http';
import { once } from 'node:events';
import { request } from './test-helpers/loopback-request.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import type { Express } from 'express';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

const BROWSER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

/**
 * Integration tests for the MCP endpoint's content-negotiation triple
 * (MCP-122 layer-a proof): browser-shaped GETs on /mcp receive the
 * landing page; protocol-shaped requests are untouched. Auth-mode
 * protocol contracts (401 + WWW-Authenticate) are covered by the
 * auth-routes integration suite; this suite runs the unauthenticated
 * registration mode, which also proves the single-insertion-point
 * claim covers it.
 */
describe('MCP endpoint HTML negotiation (integration)', () => {
  let app: Express;

  // Named so the serving assertion below can demand EXACT equality: the
  // route's contract is "serves the injected baked string, never renders",
  // and only byte-equality with the fake falsifies a fallback render.
  const FAKE_LANDING_PAGE_HTML =
    '<!doctype html><html lang="en-GB"><body>test landing page</body></html>';

  beforeEach(async () => {
    const runtimeConfig = createMockRuntimeConfig({
      dangerouslyDisableAuth: true,
      env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
    });
    const observability = createFakeHttpObservability();
    app = await createApp({
      staticRoot: await getScratchStaticRoot(),
      runtimeConfig,
      observability,
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      getLandingPageHtml: () => FAKE_LANDING_PAGE_HTML,
    });
  });

  it('I1/I12: browser-shaped GET /mcp serves the injected baked page verbatim', async () => {
    const res = await request(app).get('/mcp').set('Host', 'localhost').accept(BROWSER_ACCEPT);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    // Exact equality, not toContain: a regression to per-request rendering
    // would also produce a doctype — only the fake's bytes prove the route
    // serves the injected artefact string and never renders.
    expect(res.text).toBe(FAKE_LANDING_PAGE_HTML);
  });

  it('I2: the HTML leg carries security and cache headers', async () => {
    const res = await request(app).get('/mcp').set('Host', 'localhost').accept(BROWSER_ACCEPT);
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['vary']).toMatch(/Accept/);
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('I3: the HTML leg refuses an invalid Host exactly like the root landing page', async () => {
    const mcpRes = await request(app)
      .get('/mcp')
      .set('Host', 'evil.invalid')
      .accept(BROWSER_ACCEPT);
    const rootRes = await request(app).get('/').set('Host', 'evil.invalid');
    expect(mcpRes.status).toBe(rootRes.status);
    expect(mcpRes.status).toBeGreaterThanOrEqual(400);
  });

  /**
   * The SSE leg responds with an open stream that never ends, so these
   * cases read only the response head over a raw ephemeral connection
   * and destroy the stream instead of awaiting a body that will not
   * terminate (supertest cannot express this without leaking an
   * aborted-socket error).
   */
  const headOfStream = async (accept: string): Promise<{ status: number; contentType: string }> => {
    // Explicit v4 loopback bind + awaited listening (MCP-403): a host-less
    // listen(0) binds `::` while the dial below goes to the v4 loopback,
    // which under ambient foreign v4 listeners can reach the wrong server.
    const server = app.listen(0, '127.0.0.1');
    try {
      await once(server, 'listening');
      const address = server.address();
      if (address === null || typeof address !== 'object') {
        throw new Error('ephemeral server did not report a port');
      }
      return await new Promise((resolve, reject) => {
        const pending = http.get(
          {
            host: '127.0.0.1',
            port: address.port,
            path: '/mcp',
            headers: { Host: 'localhost', Accept: accept },
          },
          (res) => {
            resolve({
              status: res.statusCode ?? 0,
              contentType: String(res.headers['content-type'] ?? ''),
            });
            res.destroy();
          },
        );
        pending.on('error', (error) => {
          reject(error);
        });
      });
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  };

  it('I5: GET /mcp with text/event-stream reaches the SSE leg, never HTML', async () => {
    const head = await headOfStream('text/event-stream');
    expect(head.contentType).toMatch(/text\/event-stream/);
    expect(head.contentType).not.toMatch(/text\/html/);
  });

  it('I8: the root landing page still serves at /', async () => {
    const res = await request(app).get('/').set('Host', 'localhost');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });

  it('I10: GET /mcp with both html and event-stream tokens takes the protocol leg', async () => {
    const head = await headOfStream('text/html, text/event-stream');
    expect(head.contentType).toMatch(/text\/event-stream/);
    expect(head.contentType).not.toMatch(/text\/html/);
  });

  it('U5 downstream: GET /mcp with */* alone stays a 406 protocol refusal', async () => {
    const res = await request(app).get('/mcp').set('Host', 'localhost').set('Accept', '*/*');
    expect(res.status).toBe(406);
  });

  it('POST /mcp with a browser Accept stays a 406 protocol refusal', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', 'text/html')
      .send({});
    expect(res.status).toBe(406);
  });

  it('HEAD /mcp with a browser Accept returns HTML headers and no body', async () => {
    const res = await request(app).head('/mcp').set('Host', 'localhost').accept(BROWSER_ACCEPT);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text ?? '').toBe('');
  });
});
