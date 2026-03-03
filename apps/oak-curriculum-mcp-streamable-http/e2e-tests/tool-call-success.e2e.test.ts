import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import type { ToolExecutionResult } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  readFirstTextContent,
  parseToolSuccessPayload,
} from './helpers/sse.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
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
      const result: ToolExecutionResult = { status: 200, data };
      return Promise.resolve(result);
    },
  };
}

async function executeToolCall(): Promise<{
  readonly response: request.Response;
  readonly captured: CapturedCall[];
}> {
  const captured: CapturedCall[] = [];
  const overrides = createStubOverrides(captured);
  const app = await createApp({
    toolHandlerOverrides: overrides,
    runtimeConfig: createMockRuntimeConfig({ dangerouslyDisableAuth: true }),
  });
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-key-stages', arguments: {} },
    });
  return { response, captured };
}

function assertSuccessfulResponse(res: request.Response, captured: CapturedCall[]): void {
  expect(res.status).toBe(200);
  expect(res.text).toContain('event: message');
  expect(captured).toEqual([{ tool: 'get-key-stages', args: {} }]);

  const envelope = parseSseEnvelope(res.text);
  const result = parseJsonRpcResult(envelope);
  expect(result.isError).not.toBe(true);

  const content = getContentArray(result);
  expect(content).toHaveLength(2);

  const summaryText = readFirstTextContent(content);
  expect(typeof summaryText).toBe('string');

  const payload = parseToolSuccessPayload(result);
  expect(payload.status).toBe(200);
  if (!Array.isArray(payload.data)) {
    throw new Error('Tool payload data must be an array');
  }
  expect(payload.data).toHaveLength(2);
  expect(payload.data[0]).toHaveProperty('canonicalUrl');
}

async function exerciseToolCallSuccessScenario(): Promise<void> {
  const { response, captured } = await executeToolCall();
  assertSuccessfulResponse(response, captured);
}

describe('Tool call success formatting', () => {
  it('returns 200 and formats the executor payload into SSE JSON', async () => {
    await exerciseToolCallSuccessScenario();
  });
});
