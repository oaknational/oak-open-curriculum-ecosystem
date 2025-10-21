import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  readFirstTextContent,
} from './helpers/sse.js';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
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
      const result: ToolExecutionResult = { data };
      return Promise.resolve(result);
    },
  };
}

function configureDevEnvironment(): () => void {
  const previousDevToken = process.env.REMOTE_MCP_DEV_TOKEN;
  const previousBaseUrl = process.env.BASE_URL;
  const previousCanonicalUri = process.env.MCP_CANONICAL_URI;
  process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
  process.env.BASE_URL = 'http://localhost:3333';
  process.env.MCP_CANONICAL_URI = previousCanonicalUri ?? 'http://localhost:3333/mcp';
  return () => {
    if (typeof previousDevToken === 'string') {
      process.env.REMOTE_MCP_DEV_TOKEN = previousDevToken;
    } else {
      Reflect.deleteProperty(process.env, 'REMOTE_MCP_DEV_TOKEN');
    }
    if (typeof previousBaseUrl === 'string') {
      process.env.BASE_URL = previousBaseUrl;
    } else {
      Reflect.deleteProperty(process.env, 'BASE_URL');
    }
    if (typeof previousCanonicalUri === 'string') {
      process.env.MCP_CANONICAL_URI = previousCanonicalUri;
    } else {
      Reflect.deleteProperty(process.env, 'MCP_CANONICAL_URI');
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
    .set('Authorization', `Bearer ${DEV_TOKEN}`)
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
  const content = readFirstTextContent(getContentArray(result));
  const parsedValue: unknown = content ? JSON.parse(content) : {};
  if (!Array.isArray(parsedValue)) {
    throw new Error('Tool payload must be an array');
  }
  expect(parsedValue.length).toBe(2);
  expect(parsedValue[0]).toHaveProperty('canonicalUrl');
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
