import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
const ACCEPT = 'application/json, text/event-stream';

describe('HTTP boundary argument validation', () => {
  beforeEach(() => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    process.env.BASE_URL = 'http://localhost';
    process.env.MCP_CANONICAL_URI = 'http://localhost/mcp';
  });

  function extractErrorText(body: string): string {
    const line = body
      .split('\n')
      .map((value) => value.trim())
      .find((value) => value.startsWith('data: '));
    if (!line) {
      throw new Error('SSE payload missing data line');
    }
    const envelope = JSON.parse(line.slice('data: '.length)) as {
      readonly error?: { readonly message?: string };
    };
    return envelope.error?.message ?? '';
  }

  it('returns a descriptive validation error for plain string arguments', async () => {
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
    const message = extractErrorText(res.text);
    expect(message).toContain('Expected object, received string');
  });

  it('returns a descriptive validation error for JSON string arguments', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-search-lessons', arguments: JSON.stringify({ q: 'trees' }) },
      });

    expect(res.status).toBe(200);
    const message = extractErrorText(res.text);
    expect(message).toContain('Expected object, received string');
  });

  it('returns a descriptive validation error for path-string arguments', async () => {
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
    const message = extractErrorText(res.text);
    expect(message).toContain('Expected object, received string');
  });

  it('accepts structured arguments that match the tool schema', async () => {
    const overrides: ToolHandlerOverrides = {
      executeMcpTool: () =>
        Promise.resolve({
          data: {
            data: [{ lessonSlug: 'stub-lesson', lessonTitle: 'Stub Lesson' }],
          },
        }),
    };
    const app = createApp({ toolHandlerOverrides: overrides });
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .set('Host', 'localhost')
      .send({
        jsonrpc: '2.0',
        id: 'structured-success',
        method: 'tools/call',
        params: { name: 'get-search-lessons', arguments: { q: 'trees' } },
      });

    expect(res.status).toBe(200);
    const payload = extractErrorText(res.text);
    expect(payload).toBe('');
  });
});
