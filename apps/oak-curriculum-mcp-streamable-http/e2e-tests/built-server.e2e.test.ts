/**
 * E2E tests for core server behaviour: healthcheck, root path, MCP endpoint.
 *
 * These tests verify the same behaviours previously tested via subprocess + fetch,
 * now using in-process DI with supertest (no network IO). Deploy-entry contract
 * coverage lives in build-scripts/build-output-contract.unit.test.ts.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import type { Express } from 'express';
import { request } from '../src/test-helpers/loopback-request.js';

import { createStubbedHttpApp } from './helpers/create-stubbed-http-app.js';

describe('Core server behaviour', () => {
  let app: Express;

  beforeAll(async () => {
    const result = await createStubbedHttpApp();
    app = result.app;
  });

  it('responds to healthcheck with status ok', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      mode: 'streamable-http',
    });
  });

  it('serves nothing at the root', async () => {
    // The root answered with a rendered HTML page until 2026-08-20; this host
    // is now the MCP server and nothing else, so no route claims `/`.
    const response = await request(app).get('/');

    expect(response.status).toBe(404);
  });

  it('accepts MCP initialise request on the /mcp endpoint', async () => {
    const response = await request(app)
      .post('/mcp')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/event-stream')
      .send({ jsonrpc: '2.0', method: 'initialize', id: 1 });

    expect(response.status).toBeLessThan(500);
    expect(response.status).toBeLessThan(400);
  });
});
