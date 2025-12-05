import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// Smoke tests CAN make network calls - use real API
process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'false';

interface McpTextContent {
  readonly type: string;
  readonly text?: string;
}

interface ToolSuccessEnvelope {
  readonly status: number | string;
  readonly data: unknown;
}

function isToolSuccessEnvelope(value: unknown): value is ToolSuccessEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    Object.prototype.hasOwnProperty.call(candidate, 'status') &&
    Object.prototype.hasOwnProperty.call(candidate, 'data')
  );
}

function hasTranscript(value: unknown): value is { readonly transcript: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.transcript === 'string';
}

function hasNotFoundEnvelope(value: unknown): value is {
  readonly message: string;
  readonly code: string;
  readonly data?: Record<string, unknown>;
} {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.message === 'string' && typeof candidate.code === 'string';
}

function isCallToolResult(value: unknown): value is CallToolResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as { readonly content?: unknown; readonly isError?: unknown };
  return Array.isArray(candidate.content);
}

function expectSuccess(result: Awaited<ReturnType<Client['callTool']>>): ToolSuccessEnvelope {
  if (!isCallToolResult(result)) {
    throw new Error('Tool invocation did not return an MCP content payload');
  }
  expect(result.isError).not.toBe(true);
  const content = result.content as readonly McpTextContent[];
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
        OAK_API_KEY: apiKey,
        LOG_LEVEL: 'error',
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
