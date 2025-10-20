import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
const ACCEPT = 'application/json, text/event-stream';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function createStubOverrides(captured: CapturedCall[]): ToolHandlerOverrides {
  return {
    executeMcpTool: (name, args, client) => {
      void client;
      captured.push({ tool: name, args });
      const data = [
        {
          slug: 'ks1',
          title: 'Key Stage 1',
          canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks1',
        },
        {
          slug: 'ks2',
          title: 'Key Stage 2',
          canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks2',
        },
      ];
      const result: ToolExecutionResult = { data };
      return Promise.resolve(result);
    },
  };
}

function parseSseLine(text: string): Record<string, unknown> {
  const line = text
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value.startsWith('data: '));
  if (!line) {
    throw new Error('SSE payload missing data line');
  }
  const parsed = JSON.parse(line.replace(/^data: /, '')) as unknown;
  if (!isRecord(parsed)) {
    throw new Error('SSE payload must be an object');
  }
  return parsed;
}

function extractTextContent(payload: Record<string, unknown>): string {
  const result = payload.result;
  if (!isRecord(result)) {
    throw new Error('SSE result must be an object');
  }
  const contentArrayRaw = result.content;
  if (!Array.isArray(contentArrayRaw) || contentArrayRaw.length === 0) {
    throw new Error('SSE result content must include at least one entry');
  }
  const contentArray: readonly unknown[] = contentArrayRaw;
  const first = contentArray[0];
  if (!isRecord(first) || typeof first.text !== 'string') {
    throw new Error('SSE text content entry missing');
  }
  return first.text;
}

describe('Tool call success formatting', () => {
  it('returns 200 and formats the executor payload into SSE JSON', async () => {
    const captured: CapturedCall[] = [];
    const overrides = createStubOverrides(captured);
    const app = createApp({ toolHandlerOverrides: overrides });
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: { params: {} } },
      });

    expect(res.status).toBe(200);
    expect(res.text).toContain('event: message');
    expect(captured).toEqual([{ tool: 'get-key-stages', args: { params: {} } }]);

    const payloadObject = parseSseLine(res.text);
    const content = extractTextContent(payloadObject);
    const parsedValue: unknown = content ? JSON.parse(content) : {};
    if (!Array.isArray(parsedValue)) {
      throw new Error('Tool payload must be an array');
    }
    expect(parsedValue.length).toBe(2);
    expect(parsedValue[0]).toHaveProperty('canonicalUrl');
  });
});
