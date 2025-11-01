import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import { parseSseEnvelope, parseJsonRpcResult, parseToolSuccessPayload } from './helpers/sse.js';

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

function configureDevEnvironment(): () => void {
  const previousAuth = process.env.DANGEROUSLY_DISABLE_AUTH;
  // Disable auth – this suite validates success envelope formatting.
  // Auth enforcement is exercised in auth-enforcement.e2e.test.ts and smoke-dev-auth.
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  return () => {
    if (typeof previousAuth === 'string') {
      process.env.DANGEROUSLY_DISABLE_AUTH = previousAuth;
    } else {
      Reflect.deleteProperty(process.env, 'DANGEROUSLY_DISABLE_AUTH');
    }
  };
}

async function executeToolCall(): Promise<{
  readonly response: request.Response;
  readonly captured: CapturedCall[];
}> {
  const captured: CapturedCall[] = [];
  const overrides = createStubOverrides(captured);
  const app = createApp({ toolHandlerOverrides: overrides });
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-key-stages', arguments: { params: {} } },
    });
  return { response, captured };
}

function assertSuccessfulResponse(res: request.Response, captured: CapturedCall[]): void {
  expect(res.status).toBe(200);
  expect(res.text).toContain('event: message');
  expect(captured).toEqual([{ tool: 'get-key-stages', args: { params: {} } }]);

  const envelope = parseSseEnvelope(res.text);
  const result = parseJsonRpcResult(envelope);
  expect(result.isError).not.toBe(true);
  const payload = parseToolSuccessPayload(result);
  expect(payload.status).toBe(200);
  if (!Array.isArray(payload.data)) {
    throw new Error('Tool payload must be an array');
  }
  expect(payload.data.length).toBe(2);
  const first = payload.data[0] as { readonly canonicalUrl?: string } | undefined;
  expect(first).toHaveProperty('canonicalUrl');
}

async function exerciseToolCallSuccessScenario(): Promise<void> {
  const restoreEnv = configureDevEnvironment();
  try {
    const { response, captured } = await executeToolCall();
    assertSuccessfulResponse(response, captured);
  } finally {
    restoreEnv();
  }
}

describe('Tool call success formatting', () => {
  it('returns 200 and formats the executor payload into SSE JSON', async () => {
    await exerciseToolCallSuccessScenario();
  });
});
