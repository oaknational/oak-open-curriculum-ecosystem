/**
 * E2E tests for core server behaviour: healthcheck, landing page, MCP endpoint.
 *
 * These tests verify the same behaviours previously tested via subprocess + fetch,
 * now using in-process DI with supertest (no network IO). Plain-Node import
 * coverage for the compiled artefact lives in built-artifact-import.e2e.test.ts.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import type { Express } from 'express';
import request from 'supertest';

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

    expect(response.status).toBeLessThan(500);
    expect(response.status).toBeLessThan(400);
  });
});
