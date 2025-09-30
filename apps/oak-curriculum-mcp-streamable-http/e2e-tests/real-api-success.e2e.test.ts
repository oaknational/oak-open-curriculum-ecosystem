import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

const ACCEPT = 'application/json, text/event-stream';

const haveApiKey = Boolean(process.env.OAK_API_KEY);
if (!haveApiKey) {
  throw new Error('OAK_API_KEY is not set');
}

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
  };
  delete process.env.BASE_URL;
  delete process.env.MCP_CANONICAL_URI;
  process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';

  return () => {
    restoreEnvVariable('BASE_URL', previous.BASE_URL);
    restoreEnvVariable('MCP_CANONICAL_URI', previous.MCP_CANONICAL_URI);
    restoreEnvVariable('REMOTE_MCP_ALLOW_NO_AUTH', previous.REMOTE_MCP_ALLOW_NO_AUTH);
  };
}

function restoreEnvVariable(key: keyof NodeJS.ProcessEnv, value: string | undefined): void {
  if (typeof value === 'string') {
    process.env[key] = value;
  } else {
    switch (key) {
      case 'BASE_URL':
        delete process.env.BASE_URL;
        break;
      case 'MCP_CANONICAL_URI':
        delete process.env.MCP_CANONICAL_URI;
        break;
      case 'REMOTE_MCP_ALLOW_NO_AUTH':
        delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
        break;
      default:
        break;
    }
  }
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
  if (entry.type !== 'text') {
    return false;
  }
  return typeof entry.text === 'string';
}

function parseJsonPayload(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as unknown;
  if (!isRecord(parsed)) {
    throw new Error('Tool payload was not an object');
  }
  return parsed;
}

function extractDataArray(payload: Record<string, unknown>): readonly unknown[] {
  const dataValue = payload.data;
  if (!Array.isArray(dataValue)) {
    throw new Error('Tool payload data must be an array');
  }
  return dataValue;
}

async function callKeyStagesTool(app: ReturnType<typeof createApp>) {
  return request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-key-stages', arguments: {} },
    });
}

function assertSuccessfulEnvelope(envelope: ToolEnvelope): void {
  expect(envelope.error).toBeUndefined();
  const resultValue = envelope.result;
  if (!isRecord(resultValue)) {
    throw new Error('Tool call did not include a result object');
  }
  if (resultValue.isError === true) {
    throw new Error('Tool call reported an error');
  }
  const contentValue = resultValue.content;
  if (!Array.isArray(contentValue)) {
    throw new Error('Tool result did not include content entries');
  }
  const textEntry = contentValue.find(isTextContent);
  if (!textEntry) {
    throw new Error('Tool result was missing textual content');
  }
  const payload = parseJsonPayload(textEntry.text);
  const dataArray = extractDataArray(payload);
  expect(dataArray.length).toBeGreaterThan(0);
}

describe('Real API success path (requires OAK_API_KEY)', () => {
  it('returns 200 and a valid SSE-wrapped JSON-RPC payload from tools/call', async () => {
    const restoreEnvironment = configureRealApiEnvironment();
    const app = createApp();
    try {
      const response = await callKeyStagesTool(app);
      expect(response.status).toBe(200);
      const envelope = parseSseEnvelope(response.text);
      assertSuccessfulEnvelope(envelope);
    } finally {
      restoreEnvironment();
    }
  });
});
