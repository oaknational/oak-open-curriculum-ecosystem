import { describe, it, expect, afterEach } from 'vitest';
import { toolNames, getToolFromToolName } from '@oaknational/oak-curriculum-sdk';
import type { ToolName } from '@oaknational/oak-curriculum-sdk';

import {
  createStubbedStdioServer,
  type StubbedStdioServer,
} from './test-helpers/create-stubbed-stdio-server.js';

function extractFirstTextContent(result: unknown): string {
  const content = (result as { content?: unknown[] } | undefined)?.content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('MCP result did not include content entries');
  }
  const [first] = content;
  if (!first || typeof first !== 'object' || (first as { type?: string }).type !== 'text') {
    throw new Error('First MCP content entry was not textual');
  }
  const text = (first as { text?: unknown }).text;
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

    const initResult = initResponse.result as
      | { readonly capabilities?: { readonly tools?: { readonly listChanged?: boolean } } }
      | undefined;
    expect(initResult?.capabilities?.tools?.listChanged).toBe(true);

    const listResponse = await server.request({
      jsonrpc: '2.0',
      id: 'list-1',
      method: 'tools/list',
    });

    const listResult = listResponse.result as
      | { readonly tools?: { readonly name: string; readonly description?: string }[] }
      | undefined;
    if (!listResult || !Array.isArray(listResult.tools)) {
      throw new Error('tools/list response did not include a tools array');
    }
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
        arguments: { params: {} },
      },
    });

    const successResult = callResponse.result as
      | { readonly isError?: boolean; readonly content?: unknown[] }
      | undefined;
    if (!successResult || !Array.isArray(successResult.content)) {
      throw new Error('tools/call success response missing structured content');
    }
    expect(successResult.isError).not.toBe(true);
    const payload = JSON.parse(extractFirstTextContent(successResult)) as unknown;
    expect(Array.isArray(payload)).toBe(true);
    const title = (payload as { title?: string }[])[0]?.title;
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
          params: {
            path: { keyStage: 'invalid-stage', subject: 'english' },
          },
        },
      },
    });

    const failureResult = response.result as
      | { readonly isError?: boolean; readonly content?: unknown[] }
      | undefined;
    if (!failureResult) {
      const error = response.error as { readonly message?: string } | undefined;
      const message = error?.message ?? '';
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
        arguments: { params: {} },
      },
    });

    const missingResult = response.result as
      | { readonly isError?: boolean; readonly content?: unknown[] }
      | undefined;
    if (!missingResult || !Array.isArray(missingResult.content)) {
      throw new Error('tools/call missing-stub response missing structured content');
    }

    expect(missingResult.isError).toBe(true);
    const text = extractFirstTextContent(missingResult);
    expect(text).toContain('Stub payload not available for tool: get-key-stages');
  });
});
