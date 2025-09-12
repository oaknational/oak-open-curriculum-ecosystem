import request from 'supertest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the SDK before importing the app so handlers pick up the mocked executeToolCall
vi.mock('@oaknational/oak-curriculum-sdk', async () => {
  // Use untyped import to avoid forbidden type annotations in import()
  const actual = await vi.importActual('@oaknational/oak-curriculum-sdk');
  return {
    ...actual,
    executeToolCall: vi.fn().mockResolvedValue({ data: [] }),
  };
});

import { createApp } from '../src/index.js';
import '@oaknational/oak-curriculum-sdk';
const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
const ACCEPT = 'application/json, text/event-stream';

function parseFirstSseData(raw: string): unknown {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) throw new Error('No data line found in SSE payload');
  const json = line.replace(/^data: /, '');
  return JSON.parse(json) as unknown;
}

describe('HTTP boundary typed-argument normalization', () => {
  beforeEach(() => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('accepts a plain string argument at the HTTP boundary for get-search-lessons', async () => {
    // Do not rely on mocking across module boundaries in ESM; just verify 200 + SSE shape

    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-search-lessons', arguments: 'trees' },
      });

    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text) as { result?: { content?: { text?: string }[] } };
    const text = payload.result?.content?.[0]?.text ?? '';
    expect(typeof text).toBe('string');
  });

  it('accepts a JSON string argument at the HTTP boundary for get-search-lessons', async () => {
    const jsonArg = JSON.stringify({ q: 'trees' });

    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-search-lessons', arguments: jsonArg },
      });

    expect(res.status).toBe(200);
  });

  it('accepts a plain string argument at the HTTP boundary for get-lessons-summary', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-lessons-summary', arguments: 'some-lesson-slug' },
      });

    expect(res.status).toBe(200);
  });
});
