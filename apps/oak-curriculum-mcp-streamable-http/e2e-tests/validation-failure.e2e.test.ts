import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

const ACCEPT = 'application/json, text/event-stream';

function parseFirstSseData(raw: string): unknown {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) {
    throw new Error('No data line found in SSE payload');
  }
  const json = line.replace(/^data: /, '');
  return JSON.parse(json) as unknown;
}

async function callWithBadArgs(): Promise<{ status: number; text: string }> {
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true'; // Disable auth for E2E testing
  process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
  process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
  const app = createApp();
  const body = {
    jsonrpc: '2.0',
    id: '1',
    method: 'tools/call',
    params: { name: 'get-key-stages-subject-lessons', arguments: { keyStage: 123, subject: true } },
  } as const;
  const res = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send(body);
  return { status: res.status, text: typeof res.text === 'string' ? res.text : JSON.stringify({}) };
}

describe('HTTP /mcp validation failure', () => {
  it('returns JSON-RPC error when arguments fail Zod validation', async () => {
    const { status, text } = await callWithBadArgs();
    expect(status).toBe(200);
    const payload = parseFirstSseData(text) as { error?: unknown };
    expect(typeof payload.error !== 'undefined').toBe(true);
  });
});
