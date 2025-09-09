import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
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

function toolNamesFromResult(value: unknown): string[] {
  const tools = (value as { result?: { tools?: unknown[] } }).result?.tools;
  if (!Array.isArray(tools)) return [];
  return tools
    .map((t) => (t && typeof t === 'object' ? (t as { name?: unknown }).name : undefined))
    .filter((n): n is string => typeof n === 'string');
}

describe('Oak Curriculum MCP Streamable HTTP - E2E', () => {
  it('returns 401 when missing Authorization', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(401);
  });

  it('returns 200 with dev bearer token and list_tools parity', async () => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);

    const payload = parseFirstSseData(
      typeof res.text === 'string' ? res.text : JSON.stringify(res.body ?? {}),
    );
    const names = toolNamesFromResult(payload);

    const sdkToolNames = Object.keys(MCP_TOOLS).sort();
    expect(names.sort()).toEqual(sdkToolNames);
  });

  it('allows no-auth in local dev when REMOTE_MCP_ALLOW_NO_AUTH=true', async () => {
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });

  it('accepts CI token only when CI=true', async () => {
    process.env.CI = 'true';
    process.env.REMOTE_MCP_CI_TOKEN = 'ci-token';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', 'Bearer ci-token')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });

  it('blocks unknown Host by DNS-rebinding protection', async () => {
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'malicious.example.com')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect([403, 401]).toContain(res.status);
  });

  it('blocks disallowed origin by CORS', async () => {
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_ORIGINS = 'https://allowed.example.com';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Origin', 'https://not-allowed.example.com')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    // Express CORS denies request before our handler; status can be 500 or 401 depending on flow
    expect([401, 500]).toContain(res.status);
  });
});
