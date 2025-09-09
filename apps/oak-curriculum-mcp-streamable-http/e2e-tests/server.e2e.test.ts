import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';

// Ensure Accept header includes text/event-stream for Streamable HTTP transport
const ACCEPT = 'application/json, text/event-stream';

interface JsonRpcEnvelope {
  jsonrpc?: string;
  id?: string | number;
  result?: unknown;
  error?: unknown;
}

function parseFirstSseData(raw: string): JsonRpcEnvelope {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) throw new Error('No data line found in SSE payload');
  const json = line.replace(/^data: /, '');
  const parsed: unknown = JSON.parse(json);
  if (parsed && typeof parsed === 'object') {
    return parsed as JsonRpcEnvelope;
  }
  throw new Error('Invalid SSE JSON');
}

function isToolsResult(value: unknown): value is { tools: unknown[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { tools?: unknown }).tools)
  );
}

describe('Oak Curriculum MCP Streamable HTTP - E2E', () => {
  it('rejects when missing Authorization', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .set('Content-Type', 'application/json')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(401);
  });

  it('lists tools with dev token', async () => {
    process.env.NODE_ENV = 'development';
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

    expect(res.status).toBe(200);
    const body = typeof res.text === 'string' ? res.text : JSON.stringify(res.body ?? {});
    const first = parseFirstSseData(body);
    const tools = isToolsResult(first.result) ? first.result.tools : [];
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });
});
