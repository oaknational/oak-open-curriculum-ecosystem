import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';

const ACCEPT = 'application/json, text/event-stream';

describe('HTTP boundary argument validation', () => {
  beforeEach(() => {
    // Disable auth – this suite inspects HTTP argument validation only.
    // Auth enforcement has dedicated coverage in auth-enforcement.e2e.test.ts and smoke-dev-auth.
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
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
          status: 200,
          data: [
            {
              lessonSlug: 'stub-lesson',
              lessonTitle: 'Stub Lesson',
              similarity: 0.75,
              units: [
                {
                  unitSlug: 'stub-unit',
                  unitTitle: 'Stub Unit',
                  examBoardTitle: null,
                  keyStageSlug: 'ks1',
                  subjectSlug: 'english',
                },
              ],
              canonicalUrl: 'https://www.thenational.academy/teachers/lessons/stub-lesson',
            },
          ],
        }),
    };
    const app = createApp({ toolHandlerOverrides: overrides });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .set('Host', 'localhost')
      .send({
        jsonrpc: '2.0',
        id: 'structured-success',
        method: 'tools/call',
        params: {
          name: 'get-search-lessons',
          arguments: { params: { query: { q: 'trees' } } },
        },
      });

    expect(res.status).toBe(200);
    const payload = extractErrorText(res.text);
    expect(payload).toBe('');
  });
});
