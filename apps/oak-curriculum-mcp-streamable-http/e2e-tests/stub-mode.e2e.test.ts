import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  readFirstTextContent,
  getFullResultsFromMeta,
} from './helpers/sse.js';
import {
  listUniversalTools,
  createStubToolExecutionAdapter,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

const ToolEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  inputSchema: z.unknown(),
});

type JsonRpcToolRosterEntry = z.infer<typeof ToolEntrySchema>;

const ToolRosterSchema = ToolEntrySchema.array();

function assertToolRoster(responseText: string, expected: readonly JsonRpcToolRosterEntry[]): void {
  const envelope = parseSseEnvelope(responseText);
  const result = parseJsonRpcResult(envelope);
  const tools = ToolRosterSchema.parse(result.tools);
  const actualByName = new Map(tools.map((tool) => [tool.name, tool]));

  expect(tools.length).toBe(expected.length);
  for (const entry of expected) {
    const actual = actualByName.get(entry.name);
    expect(actual, `Missing tool ${entry.name}`).toBeDefined();
    if (!actual) {
      continue;
    }
    expect(actual.name).toBe(entry.name);
    expect(actual.description).toBe(entry.description ?? entry.name);
    expect(actual.inputSchema).toBeDefined();
    expect(typeof actual.inputSchema).toBe('object');
  }
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

async function assertFetchLessonResponse(
  responseText: string,
  lessonId: string,
  lessonSlug: string,
): Promise<void> {
  const { result } = extractResultAndContent(responseText);
  expect(result.isError).not.toBe(true);

  // Full data is now in _meta.fullResults (optimized response format)
  const fullResults = getFullResultsFromMeta(result) as {
    readonly canonicalUrl?: string;
    readonly data?: unknown;
    readonly id?: string;
    readonly type?: string;
  };

  expect(fullResults.id).toBe(lessonId);
  expect(fullResults.type).toBe('lesson');
  expect(typeof fullResults.canonicalUrl).toBe('string');
  expect(fullResults.canonicalUrl).toContain('thenational.academy');

  const executor = createStubToolExecutionAdapter();
  const stubResult = await executor('get-lessons-summary', {
    lesson: lessonSlug,
  });
  if (!('data' in stubResult)) {
    throw new Error('Stub executor did not return data');
  }
  expect(stubResult.data).toBeDefined();
  expect(fullResults.data).toEqual(stubResult.data);
}

describe('Streamable HTTP server (stub mode)', () => {
  it('returns the full roster from listUniversalTools()', async () => {
    const { app } = createStubbedHttpApp();
    const response = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({ jsonrpc: '2.0', id: 'list-1', method: 'tools/list' });

    expect(response.status).toBe(200);
    assertToolRoster(response.text, listUniversalTools());
  });

  it('serialises stubbed fetch results with canonicalUrl', async () => {
    const { app } = createStubbedHttpApp();
    const lessonId = 'lesson:four-types-of-simple-sentence';
    const lessonSlug = 'four-types-of-simple-sentence';
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
    await assertFetchLessonResponse(response.text, lessonId, lessonSlug);
  });

  it('reports parameter validation failures from stub executor', async () => {
    const { app } = createStubbedHttpApp();
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
    const { app } = createStubbedHttpApp();
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
