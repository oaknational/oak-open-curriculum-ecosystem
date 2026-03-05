import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';

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
  // Disable auth – validation tests isolate Zod enforcement.
  // Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
  const app = await createApp({
    runtimeConfig: createMockRuntimeConfig({ dangerouslyDisableAuth: true }),
  });
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
  it('returns error when arguments fail Zod validation', async () => {
    const { status, text } = await callWithBadArgs();
    expect(status).toBe(200);
    const payload = parseFirstSseData(text) as {
      error?: unknown;
      result?: { isError?: boolean };
    };
    // MCP SDK returns either a JSON-RPC error or a result with isError: true
    const hasJsonRpcError = typeof payload.error !== 'undefined';
    const hasResultError = payload.result?.isError === true;
    expect(hasJsonRpcError || hasResultError).toBe(true);
  });
});
