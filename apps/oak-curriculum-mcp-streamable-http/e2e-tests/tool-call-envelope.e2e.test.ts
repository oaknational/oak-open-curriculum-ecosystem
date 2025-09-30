import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk';

const ACCEPT = 'application/json, text/event-stream';
const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';

interface ToolTextContent {
  readonly type: 'text';
  readonly text: string;
}

type ToolEnvelope = Record<string, unknown>;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseSseEnvelope(body: string): ToolEnvelope {
  const dataLine = body
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data: '));
  if (!dataLine) {
    throw new Error('No data line found in SSE payload');
  }
  const jsonText = dataLine.slice('data: '.length);
  const parsed = JSON.parse(jsonText) as unknown;
  if (!isRecord(parsed)) {
    throw new Error('SSE data line was not an object');
  }
  return parsed;
}

function isTextContent(entry: unknown): entry is ToolTextContent {
  if (!isRecord(entry)) {
    return false;
  }
  return entry.type === 'text' && typeof entry.text === 'string';
}

function parseJsonPayload(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error('Tool payload was not an object');
  }
  return parsed;
}

function assertSuccessfulEnvelope(envelope: ToolEnvelope): void {
  expect(envelope.error).toBeUndefined();
  const result = envelope.result;
  if (!isRecord(result)) {
    throw new Error('Tool result must be an object');
  }
  expect(result.isError).not.toBe(true);
  const contents = result.content;
  if (!Array.isArray(contents)) {
    throw new Error('Tool result content must be an array');
  }
  const entry = contents.find(isTextContent);
  if (!entry) {
    throw new Error('Tool result missing textual payload');
  }
  const payload = parseJsonPayload(entry.text);
  const dataValue = payload.data;
  if (!Array.isArray(dataValue)) {
    throw new Error('Tool payload data must be an array');
  }
  expect(dataValue.length).toBeGreaterThan(0);
}

describe('Tool response envelope formatting', () => {
  it('wraps successful tool executions in SSE JSON', async () => {
    const restoreEnv = configureRealApiEnvironment();
    const overrides: ToolHandlerOverrides = {
      executeMcpTool: (name, args, client) => {
        void args;
        void client;
        const data = {
          data: [
            { slug: 'ks1', title: 'Key Stage 1' },
            { slug: 'ks2', title: 'Key Stage 2' },
          ],
          tool: name,
        };
        const result: ToolExecutionResult = { data };
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
          params: { name: 'get-key-stages', arguments: {} },
        });

      expect(res.status).toBe(200);
      const envelope = parseSseEnvelope(res.text);
      assertSuccessfulEnvelope(envelope);
    } finally {
      restoreEnv();
    }
  });
});
