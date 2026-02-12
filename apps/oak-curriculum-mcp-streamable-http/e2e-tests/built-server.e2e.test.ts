/**
 * E2E tests for core server behaviour: healthcheck, landing page, MCP endpoint.
 *
 * These tests verify the same behaviours previously tested via subprocess + fetch,
 * now using in-process DI with supertest (no network IO). The "does the built
 * artefact actually boot?" concern is covered by the smoke:dev:stub script.
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { createStubbedHttpApp } from './helpers/create-stubbed-http-app.js';

describe('Core server behaviour', () => {
  const { app } = createStubbedHttpApp();

  it('responds to healthcheck with status ok', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      mode: 'streamable-http',
    });
  });

  it('serves root landing page as HTML', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  it('accepts MCP initialise request on the /mcp endpoint', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 1 });

    // Should not be a server error or client error
    expect(response.status).toBeLessThan(500);
    expect(response.status).toBeLessThan(400);
  });
});
