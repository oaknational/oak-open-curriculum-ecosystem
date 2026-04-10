import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import {
  createUniversalToolExecutor,
  generatedToolRegistry,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { ok } from '@oaknational/result';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';
import {
  getContentArray,
  parseJsonRpcResult,
  parseSseEnvelope,
  parseToolSuccessPayload,
  readFirstTextContent,
  readJsonRpcOrResultErrorText,
} from './helpers/sse.js';
import { stubSearchRetrieval } from './helpers/stub-search-retrieval.js';

const ACCEPT = 'application/json, text/event-stream';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
}

describe('HTTP boundary argument validation', () => {
  function extractErrorText(body: string): string {
    return readJsonRpcOrResultErrorText(parseSseEnvelope(body));
  }

  function createStructuredSuccessOverrides(captured: CapturedCall[]): ToolHandlerOverrides {
    return {
      createRequestExecutor: (config) =>
        createUniversalToolExecutor({
          executeMcpTool: (name, args) => {
            captured.push({ tool: name, args });
            const result: ToolExecutionResult = ok({
              status: 200 as const,
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
                  oakUrl: 'https://teachers.thenational.academy/lessons/stub-lesson',
                },
              ],
            });
            config.onToolExecution?.(name, result);
            return Promise.resolve(result);
          },
          searchRetrieval: stubSearchRetrieval,
          generatedTools: generatedToolRegistry,
          createAssetDownloadUrl: config.createAssetDownloadUrl,
        }),
    };
  }

  it('returns a descriptive validation error for plain string arguments', async () => {
    const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
    const app = await createApp({
      runtimeConfig,
      observability: createMockObservability(runtimeConfig),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-lessons-quiz', arguments: 'trees' },
      });

    expect(res.status).toBe(200);
    const message = extractErrorText(res.text);
    // Zod v3: "Expected object, received string", Zod v4: "expected record, received string"
    expect(message.toLowerCase()).toContain('received string');
  });

  it('returns a descriptive validation error for JSON string arguments', async () => {
    const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
    const app = await createApp({
      runtimeConfig,
      observability: createMockObservability(runtimeConfig),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-lessons-quiz', arguments: JSON.stringify({ lesson: 'some-lesson' }) },
      });

    expect(res.status).toBe(200);
    const message = extractErrorText(res.text);
    // Zod v3: "Expected object, received string", Zod v4: "expected record, received string"
    expect(message.toLowerCase()).toContain('received string');
  });

  it('returns a descriptive validation error for path-string arguments', async () => {
    const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
    const app = await createApp({
      runtimeConfig,
      observability: createMockObservability(runtimeConfig),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
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
    // Zod v3: "Expected object, received string", Zod v4: "expected record, received string"
    expect(message.toLowerCase()).toContain('received string');
  });

  it('accepts structured arguments that match the tool schema', async () => {
    const captured: CapturedCall[] = [];
    const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
    const app = await createApp({
      toolHandlerOverrides: createStructuredSuccessOverrides(captured),
      runtimeConfig,
      observability: createMockObservability(runtimeConfig),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .set('Host', 'localhost')
      .send({
        jsonrpc: '2.0',
        id: 'structured-success',
        method: 'tools/call',
        params: {
          name: 'get-lessons-quiz',
          arguments: { lesson: 'some-lesson' },
        },
      });

    expect(res.status).toBe(200);
    expect(captured).toEqual([{ tool: 'get-lessons-quiz', args: { lesson: 'some-lesson' } }]);

    const envelope = parseSseEnvelope(res.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);

    const content = getContentArray(result);
    expect(content).toHaveLength(2);
    expect(readFirstTextContent(content)).toContain('Get Lessons Quiz');

    const payload = parseToolSuccessPayload(result);
    expect(payload.status).toBe(200);
    if (!Array.isArray(payload.data)) {
      throw new Error('Tool payload data must be an array');
    }
    expect(payload.data).toHaveLength(1);
    expect(payload.data[0]).toHaveProperty('oakUrl');
  });
});
