import { describe, it, expect, afterEach } from 'vitest';
import { toolNames, getToolFromToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { ToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { typeSafeGet } from '@oaknational/type-helpers';

import {
  createStubbedStdioServer,
  type StubbedStdioServer,
} from './test-helpers/create-stubbed-stdio-server.js';

interface JsonRpcInitResult {
  readonly capabilities?: { readonly tools?: { readonly listChanged?: boolean } };
}

interface JsonRpcListResult {
  readonly tools?: { readonly name: string; readonly description?: string }[];
}

interface JsonRpcListResultWithTools {
  readonly tools: { readonly name: string; readonly description?: string }[];
}

interface JsonRpcCallResult {
  readonly isError?: boolean;
  readonly content?: unknown[];
}

interface JsonRpcError {
  readonly message?: string;
}

interface SerialisedToolPayload {
  readonly status: number | string;
  readonly data: unknown;
}

function getOwn(value: Record<string, unknown>, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(value, key)) {
    return undefined;
  }
  return typeSafeGet(value, key);
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isJsonRpcInitResult(value: unknown): value is JsonRpcInitResult {
  return isUnknownRecord(value);
}

function isJsonRpcListResult(value: unknown): value is JsonRpcListResult {
  return isUnknownRecord(value) && Array.isArray(getOwn(value, 'tools'));
}

function isJsonRpcCallResult(value: unknown): value is JsonRpcCallResult {
  return isUnknownRecord(value) && Array.isArray(getOwn(value, 'content'));
}

function isJsonRpcError(value: unknown): value is JsonRpcError {
  return isUnknownRecord(value) && typeof getOwn(value, 'message') === 'string';
}

function isSerialisedToolPayload(value: unknown): value is SerialisedToolPayload {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const status = getOwn(value, 'status');
  return (
    (typeof status === 'number' || typeof status === 'string') &&
    getOwn(value, 'data') !== undefined
  );
}

function isTitleRecord(value: unknown): value is { title?: string } {
  if (!isUnknownRecord(value)) {
    return false;
  }
  const title = getOwn(value, 'title');
  return typeof title === 'string' || title === undefined;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function requireToolsListResult(value: unknown): JsonRpcListResultWithTools {
  if (!isJsonRpcListResult(value) || !Array.isArray(value.tools)) {
    throw new Error('tools/list response did not include a tools array');
  }
  return { tools: value.tools };
}

function extractFirstTextContent(result: unknown): string {
  if (!isJsonRpcCallResult(result)) {
    throw new Error('MCP result did not include content entries');
  }
  const content = result.content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('MCP result did not include content entries');
  }
  const [first] = content;
  if (!isUnknownRecord(first) || getOwn(first, 'type') !== 'text') {
    throw new Error('First MCP content entry was not textual');
  }
  const text = getOwn(first, 'text');
  if (typeof text !== 'string') {
    throw new Error('Text content entry did not contain string payload');
  }
  return text;
}

describe('Stdio transport with stub executors', () => {
  let server: StubbedStdioServer | undefined;

  afterEach(async () => {
    if (server) {
      await server.close();
      server = undefined;
    }
  });

  it('supports initialize followed by tools/list', async () => {
    server = await createStubbedStdioServer();

    const initResponse = await server.request({
      jsonrpc: '2.0',
      id: 'init-1',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'stdio-vitest', version: '0.0.1' },
      },
    });

    const initResult = isJsonRpcInitResult(initResponse.result) ? initResponse.result : undefined;
    expect(initResult?.capabilities?.tools?.listChanged).toBe(true);

    const listResponse = await server.request({
      jsonrpc: '2.0',
      id: 'list-1',
      method: 'tools/list',
    });

    const listResult = requireToolsListResult(listResponse.result);
    const names = listResult.tools.map((tool) => tool.name).sort();
    const expected = [...toolNames].sort();
    expect(names).toEqual(expected);

    const sampleTool = listResult.tools.find((tool) => tool.name === 'get-changelog');
    const descriptor = getToolFromToolName('get-changelog');
    expect(sampleTool?.description).toBe(descriptor.description);
  });

  it('executes a curriculum tool and serialises the payload as JSON text content', async () => {
    server = await createStubbedStdioServer();

    const callResponse = await server.request({
      jsonrpc: '2.0',
      id: 'call-success',
      method: 'tools/call',
      params: {
        name: 'get-key-stages',
        arguments: {},
      },
    });

    const successResult = isJsonRpcCallResult(callResponse.result)
      ? callResponse.result
      : undefined;
    if (!successResult || !Array.isArray(successResult.content)) {
      throw new Error('tools/call success response missing structured content');
    }
    expect(successResult.isError).not.toBe(true);
    const payloadJson: unknown = JSON.parse(extractFirstTextContent(successResult));
    if (!isSerialisedToolPayload(payloadJson)) {
      throw new Error('tools/call success response missing serialised payload metadata');
    }
    const payload = payloadJson;
    expect(payload.status).toBe(200);
    if (!isUnknownArray(payload.data)) {
      throw new Error('Stubbed response missing curriculum data array');
    }
    const [firstData] = payload.data;
    if (!isTitleRecord(firstData)) {
      throw new Error('Stubbed response missing title payload');
    }
    const title = firstData.title;
    if (typeof title !== 'string') {
      throw new Error('Stubbed response missing lesson title');
    }
  });

  it('propagates validation errors from the stub executor', async () => {
    server = await createStubbedStdioServer();

    const response = await server.request({
      jsonrpc: '2.0',
      id: 'call-invalid',
      method: 'tools/call',
      params: {
        name: 'get-key-stages-subject-lessons',
        arguments: {
          keyStage: 'invalid-stage',
          subject: 'english',
        },
      },
    });

    const failureResult = isJsonRpcCallResult(response.result) ? response.result : undefined;
    if (!failureResult) {
      const message = isJsonRpcError(response.error) ? (response.error.message ?? '') : '';
      expect(message).toContain('Invalid arguments');
      expect(message).toContain('get-key-stages-subject-lessons');
      return;
    }

    expect(failureResult.isError).toBe(true);
    const text = extractFirstTextContent(failureResult);
    expect(text).toContain('Invalid arguments');
    expect(text).toContain('get-key-stages-subject-lessons');
  });

  it('reports a helpful error when no stub payload is available', async () => {
    const missing: ToolName[] = ['get-key-stages'];
    server = await createStubbedStdioServer({ missingTools: missing });

    const response = await server.request({
      jsonrpc: '2.0',
      id: 'stub-missing',
      method: 'tools/call',
      params: {
        name: 'get-key-stages',
        arguments: {},
      },
    });

    const missingResult = isJsonRpcCallResult(response.result) ? response.result : undefined;
    if (!missingResult || !Array.isArray(missingResult.content)) {
      throw new Error('tools/call missing-stub response missing structured content');
    }

    expect(missingResult.isError).toBe(true);
    const text = extractFirstTextContent(missingResult);
    expect(text).toContain('Stub payload not available for tool: get-key-stages');
  });
});
