import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  getContentArray,
  readFirstTextContent,
} from './helpers/sse.js';

const ACCEPT = 'application/json, text/event-stream';
const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';

function configureRealApiEnvironment(): () => void {
  const previous = {
    BASE_URL: process.env.BASE_URL,
    MCP_CANONICAL_URI: process.env.MCP_CANONICAL_URI,
    REMOTE_MCP_ALLOW_NO_AUTH: process.env.REMOTE_MCP_ALLOW_NO_AUTH,
    REMOTE_MCP_DEV_TOKEN: process.env.REMOTE_MCP_DEV_TOKEN,
    OAK_API_KEY: process.env.OAK_API_KEY,
  };
  delete process.env.BASE_URL;
  delete process.env.MCP_CANONICAL_URI;
  process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
  process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
  process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'stub-test-key';

  return () => {
    if (typeof previous.BASE_URL === 'string') {
      process.env.BASE_URL = previous.BASE_URL;
    } else {
      delete process.env.BASE_URL;
    }

    if (typeof previous.MCP_CANONICAL_URI === 'string') {
      process.env.MCP_CANONICAL_URI = previous.MCP_CANONICAL_URI;
    } else {
      delete process.env.MCP_CANONICAL_URI;
    }

    if (typeof previous.REMOTE_MCP_ALLOW_NO_AUTH === 'string') {
      process.env.REMOTE_MCP_ALLOW_NO_AUTH = previous.REMOTE_MCP_ALLOW_NO_AUTH;
    } else {
      delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    }
    if (typeof previous.REMOTE_MCP_DEV_TOKEN === 'string') {
      process.env.REMOTE_MCP_DEV_TOKEN = previous.REMOTE_MCP_DEV_TOKEN;
    } else {
      delete process.env.REMOTE_MCP_DEV_TOKEN;
    }
    if (typeof previous.OAK_API_KEY === 'string') {
      process.env.OAK_API_KEY = previous.OAK_API_KEY;
    } else {
      delete process.env.OAK_API_KEY;
    }
  };
}

function assertSuccessfulEnvelope(body: string): void {
  const envelope = parseSseEnvelope(body);
  expect(envelope.error).toBeUndefined();
  const result = parseJsonRpcResult(envelope);
  expect(result.isError).not.toBe(true);
  const contents = getContentArray(result);
  const entry = readFirstTextContent(contents);
  const arrayPayload = JSON.parse(entry) as unknown;
  if (!Array.isArray(arrayPayload)) {
    throw new Error('Tool payload must be an array');
  }
  expect(arrayPayload.length).toBeGreaterThan(0);
}

describe('Tool response envelope formatting', () => {
  it('wraps successful tool executions in SSE JSON', async () => {
    const restoreEnv = configureRealApiEnvironment();
    const overrides: ToolHandlerOverrides = {
      executeMcpTool: (name, args, client) => {
        void name;
        void args;
        void client;
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

    const app = createApp({ toolHandlerOverrides: overrides });
    try {
      const res = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT)
        .set('Host', 'localhost')
        .set('Authorization', `Bearer ${DEV_TOKEN}`)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-key-stages', arguments: { params: {} } },
        });

      expect(res.status).toBe(200);
      assertSuccessfulEnvelope(res.text);
    } finally {
      restoreEnv();
    }
  });
});
