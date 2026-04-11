import request from 'supertest';
import { describe, it, expect } from 'vitest';

import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  readFirstTextContent,
  getStructuredContentData,
} from './helpers/sse.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, message: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(message);
  }

  return value;
}

function extractResultAndContent(responseText: string): {
  readonly result: ReturnType<typeof parseJsonRpcResult>;
  readonly content: readonly unknown[];
} {
  const envelope = parseSseEnvelope(responseText);
  const result = parseJsonRpcResult(envelope);
  const content = getContentArray(result);
  return { result, content };
}

/**
 * Asserts fetch lesson response per OpenAI Apps SDK pattern.
 * Full data is now in structuredContent (model + widget see this).
 */
function assertFetchLessonResponse(responseText: string, lessonId: string): void {
  const { result } = extractResultAndContent(responseText);
  expect(result.isError).not.toBe(true);

  // Full data is in structuredContent per OpenAI Apps SDK
  const structured = requireRecord(
    getStructuredContentData(result),
    'Expected structuredContent to be an object',
  );

  expect(structured.id).toBe(lessonId);
  expect(structured.type).toBe('lesson');
  expect(typeof structured.oakUrl).toBe('string');
  expect(structured.oakUrl).toContain('thenational.academy');
  expect(structured.data).toBeDefined();
  expect(typeof structured.data).toBe('object');
  expect(structured.data).not.toBeNull();
}

describe('Streamable HTTP server (stub mode)', () => {
  it('serialises stubbed fetch results with oakUrl (SDK slug URL)', async () => {
    const { app } = await createStubbedHttpApp();
    const lessonId = 'lesson:four-types-of-simple-sentence';
    const response = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'fetch-success',
        method: 'tools/call',
        params: {
          name: 'fetch',
          arguments: { id: lessonId },
        },
      });

    expect(response.status).toBe(200);
    assertFetchLessonResponse(response.text, lessonId);
  });

  it('reports parameter validation failures from stub executor', async () => {
    const { app } = await createStubbedHttpApp();
    const response = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: 'call-invalid',
        method: 'tools/call',
        params: {
          name: 'fetch',
          arguments: { id: 'unknown:sample' },
        },
      });

    expect(response.status).toBe(200);
    const { result, content } = extractResultAndContent(response.text);
    expect(result.isError).toBe(true);

    const text = readFirstTextContent(content);
    expect(text).toContain('Unsupported id prefix');
  });

  // Auth enforcement tests moved to auth-enforcement.e2e.test.ts
  // Stub mode uses auth bypass for convenience

  it('rejects requests missing text/event-stream in Accept header', async () => {
    const { app } = await createStubbedHttpApp();
    const response = await request(app)
      .post('/mcp')
      .set('Accept', 'application/json')
      .send({ jsonrpc: '2.0', id: 'missing-accept', method: 'tools/list' });

    expect(response.status).toBe(406);
    expect(response.body).toEqual({
      error: 'Accept header must include text/event-stream',
    });
  });
});
