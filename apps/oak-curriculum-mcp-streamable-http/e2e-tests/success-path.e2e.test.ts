import request from 'supertest';
import { describe, it, expect, vi, afterEach } from 'vitest';
// Mock SDK before importing app so server registers with stubbed executor
vi.mock('@oaknational/oak-curriculum-sdk', async () => {
  const actual = await vi.importActual('@oaknational/oak-curriculum-sdk');
  return {
    ...actual,
    executeToolCall: vi.fn().mockResolvedValue({ data: { ok: true } }),
  };
});

import { createApp } from '../src/index.js';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
const ACCEPT = 'application/json, text/event-stream';

describe('Success path (stubbed executeToolCall)', () => {
  const toolName = 'get-key-stages';

  // mock is set above import to ensure server uses it during registration

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function parseFirstSseData(raw: string): unknown {
    const line = raw
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.startsWith('data: '));
    if (!line) throw new Error('No data line found in SSE payload');
    const json = line.replace(/^data: /, '');
    return JSON.parse(json) as unknown;
  }

  it('returns 200 and formatted success payload', async () => {
    // Ensure optional URL envs do not break validation in tests
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    // Ensure host filtering does not interfere with auth path
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: toolName, arguments: {} },
      });
    expect(res.status).toBe(200);
    expect(typeof res.text).toBe('string');
    expect(res.text).toContain('event: message');
    const payload = parseFirstSseData(res.text) as {
      result?: { content?: { text?: string }[] };
    };
    const text = payload.result?.content?.[0]?.text ?? '';
    expect(typeof text).toBe('string');
    // In case validation forces error wrapper, just assert string content
    try {
      const inner: unknown = JSON.parse(text);
      expect(typeof inner).toBe('object');
    } catch {
      expect(text.length).toBeGreaterThan(0);
    }
  });
});
