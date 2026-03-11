import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { typeSafeGet } from '@oaknational/type-helpers';

interface McpTextContent {
  readonly type: string;
  readonly text?: string;
}

interface ToolSuccessEnvelope {
  readonly status: number | string;
  readonly data: unknown;
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getOwn(value: Record<string, unknown>, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(value, key)) {
    return undefined;
  }
  return typeSafeGet(value, key);
}

function isToolSuccessEnvelope(value: unknown): value is ToolSuccessEnvelope {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const status = getOwn(value, 'status');
  return (
    (typeof status === 'number' || typeof status === 'string') &&
    getOwn(value, 'data') !== undefined
  );
}

function hasTranscript(value: unknown): value is { readonly transcript: string } {
  if (!isUnknownRecord(value)) {
    return false;
  }
  return typeof getOwn(value, 'transcript') === 'string';
}

function hasNotFoundEnvelope(value: unknown): value is {
  readonly message: string;
  readonly code: string;
  readonly data?: Record<string, unknown>;
} {
  if (!isUnknownRecord(value)) {
    return false;
  }
  return typeof getOwn(value, 'message') === 'string' && typeof getOwn(value, 'code') === 'string';
}

function isCallToolResult(value: unknown): value is CallToolResult {
  if (!isUnknownRecord(value)) {
    return false;
  }
  return Array.isArray(getOwn(value, 'content'));
}

function isMcpTextContentArray(value: unknown): value is readonly McpTextContent[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return false;
    }
    return typeof getOwn(entry, 'type') === 'string';
  });
}

function expectSuccess(result: Awaited<ReturnType<Client['callTool']>>): ToolSuccessEnvelope {
  if (!isCallToolResult(result)) {
    throw new Error('Tool invocation did not return an MCP content payload');
  }
  expect(result.isError).not.toBe(true);
  if (!isMcpTextContentArray(result.content)) {
    throw new Error('Tool response did not include textual content');
  }
  const content = result.content;
  if (content.length === 0) {
    throw new Error('Tool response did not include textual content');
  }
  const [first] = content;
  if (first.type !== 'text' || typeof first.text !== 'string') {
    throw new Error('Tool response did not include textual content');
  }
  const parsed: unknown = JSON.parse(first.text);
  if (!isToolSuccessEnvelope(parsed)) {
    throw new Error('Tool response did not include status metadata');
  }
  return parsed;
}

describe('Multi-status transcript handling (Smoke)', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    const apiKey = process.env.OAK_API_KEY;
    if (!apiKey) {
      throw new Error('OAK_API_KEY is not set');
    }

    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/bin/oak-curriculum-mcp.js'],
      env: {
        ...process.env,
        OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'false',
        OAK_API_KEY: apiKey,
        LOG_LEVEL: 'error',
        ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL ?? 'http://fake-es:9200',
        ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY ?? 'fake-api-key-for-smoke',
      },
    });

    client = new Client({ name: 'multi-status-e2e', version: '1.0.0' }, { capabilities: {} });

    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
    await transport.close();
  });

  it('returns transcripts with status metadata for lessons that include video', async () => {
    const toolResult = await client.callTool({
      name: 'get-lessons-transcript',
      arguments: {
        lesson: 'add-and-subtract-two-numbers-that-bridge-through-10',
      },
    });
    const response = expectSuccess(toolResult);

    expect(response.status).toBe(200);
    expect(hasTranscript(response.data)).toBe(true);
    if (!hasTranscript(response.data)) {
      throw new Error('Expected transcript response shape');
    }
    expect(typeof response.data.transcript).toBe('string');
  });

  it('reports a legitimate 404 transcript response without erroring', async () => {
    const toolResult = await client.callTool({
      name: 'get-lessons-transcript',
      arguments: {
        lesson: 'making-apple-flapjack-bites',
      },
    });
    const response = expectSuccess(toolResult);

    expect(response.status).toBe(404);
    expect(hasNotFoundEnvelope(response.data)).toBe(true);
    if (!hasNotFoundEnvelope(response.data)) {
      throw new Error('Expected not-found response envelope');
    }
    expect(response.data.code).toBe('NOT_FOUND');
    expect(response.data.message).toBe('Transcript not available for this query');
  });
});
