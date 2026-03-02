import { describe, it, expect, vi } from 'vitest';
import {
  createStubSearchRetrieval,
  type ToolName,
  type ToolExecutionResult,
  type OakApiPathBasedClient,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { createMcpToolsModule } from './index.js';

const TEST_TOOL_NAME = 'get-key-stages-subject-lessons';

function isCallToolResult(value: unknown): value is CallToolResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'content' in value && Array.isArray(value.content);
}

function expectCallToolResult(value: unknown): CallToolResult {
  if (!isCallToolResult(value)) {
    throw new Error('Expected CallToolResult');
  }
  return value;
}

function parseJsonContent(result: CallToolResult): unknown {
  if (result.content.length < 2) {
    throw new Error('Expected 2-item content array in CallToolResult');
  }
  const jsonEntry = result.content[1];
  if (jsonEntry.type !== 'text' || !('text' in jsonEntry)) {
    throw new Error('Expected TextContent at content[1]');
  }
  const parsed: unknown = JSON.parse(jsonEntry.text);
  return parsed;
}

function createFakeClient(): OakApiPathBasedClient {
  return {} as OakApiPathBasedClient;
}

describe('createMcpToolsModule', () => {
  it('delegates curriculum tools to the MCP executor dependency and returns parsed data', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ status: 200, data: { status: 'ok' } });

    const module = createMcpToolsModule({
      client: createFakeClient(),
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
    });

    const args = {
      params: {
        path: {
          keyStage: 'ks3' as const,
          subject: 'science' as const,
        },
      },
    };

    const output = expectCallToolResult(await module.handleTool(TEST_TOOL_NAME, args));
    const parsed = parseJsonContent(output);

    expect(executeMcpTool).toHaveBeenCalledWith(TEST_TOOL_NAME, args);
    expect(parsed).toEqual({ status: 200, data: { status: 'ok' } });
  });

  it('propagates executor errors as structured MCP results', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ error: new Error('boom') });

    const module = createMcpToolsModule({
      client: createFakeClient(),
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
    });

    const args = {
      params: {
        path: {
          keyStage: 'ks3' as const,
          subject: 'science' as const,
        },
      },
    };

    const output = expectCallToolResult(await module.handleTool(TEST_TOOL_NAME, args));
    const textEntry = output.content.find((entry): entry is TextContent => entry.type === 'text');
    const message = textEntry?.text;

    expect(output.isError).toBe(true);
    expect(message).toBe('boom');
  });
});
