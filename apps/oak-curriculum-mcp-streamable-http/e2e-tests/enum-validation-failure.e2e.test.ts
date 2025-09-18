import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

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

function makeInvalidEnumBody() {
  return {
    jsonrpc: '2.0',
    id: '1',
    method: 'tools/call',
    params: {
      name: 'get-key-stages-subject-lessons',
      arguments: { keyStage: 'invalid-stage', subject: 'english' },
    },
  } as const;
}

async function post(body: Record<string, unknown>) {
  process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
  process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
  const app = createApp();
  return request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Authorization', `Bearer ${DEV_TOKEN}`)
    .set('Accept', ACCEPT)
    .send(body);
}

describe('HTTP /mcp enum validation failure', () => {
  it('returns JSON-RPC error when enum value is invalid', async () => {
    const res = await post(makeInvalidEnumBody());
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(
      typeof res.text === 'string' ? res.text : JSON.stringify({}),
    ) as { error?: unknown };
    expect(typeof payload.error !== 'undefined').toBe(true);
  });
});
