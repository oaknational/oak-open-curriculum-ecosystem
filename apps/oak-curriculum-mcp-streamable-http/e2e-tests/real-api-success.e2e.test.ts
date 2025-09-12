import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

const ACCEPT = 'application/json, text/event-stream';

const runReal = Boolean(process.env.OAK_API_KEY) && process.env.E2E_REAL_API === 'true';
const maybeIt = runReal ? it : it.skip;

describe('Real API success path (requires OAK_API_KEY)', () => {
  maybeIt('returns 200 and a valid SSE-wrapped JSON-RPC payload from tools/call', async () => {
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    const prevNoAuth = process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true'; // allow no-auth locally for this test
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: {} },
      });
    expect(res.status).toBe(200);
    const dataLine = res.text
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.startsWith('data: '));
    if (!dataLine) throw new Error('No data line found in SSE payload');
    const json = JSON.parse(dataLine.replace(/^data: /, '')) as unknown;
    expect(typeof json).toBe('object');
    // restore env to avoid leaking into subsequent tests
    if (typeof prevNoAuth === 'string') process.env.REMOTE_MCP_ALLOW_NO_AUTH = prevNoAuth;
    else delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
  });
});
