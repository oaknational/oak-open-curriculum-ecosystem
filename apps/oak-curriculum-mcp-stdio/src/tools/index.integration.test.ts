import { describe, expect, it, vi } from 'vitest';

import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

import { createMcpToolsModule, type UniversalToolExecutors } from './index.js';
import { createFakeOakPathBasedClient } from '../test-helpers/fakes.js';

const lessonArgs = { params: { path: { lesson: 'english-lesson' } } } as const;

describe('createMcpToolsModule.handleTool (integration)', () => {
  function isCallToolResult(value: unknown): value is CallToolResult {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const candidate = value as { readonly content?: unknown };
    return Array.isArray(candidate.content);
  }

  function expectCallToolResult(value: unknown): CallToolResult {
    if (!isCallToolResult(value)) {
      throw new Error('Expected CallToolResult payload');
    }
    return value;
  }

  function readTextPayload(result: CallToolResult): string {
    const textEntry = result.content.find((entry): entry is TextContent => entry.type === 'text');
    if (!textEntry) {
      throw new Error('Expected textual MCP content');
    }
    return textEntry.text;
  }

  it('presents documented non-200 responses as successful tool outputs', async () => {
    const transcript404 = {
      status: 404,
      data: {
        message: 'Transcript not available for this query',
        code: 'NOT_FOUND',
        data: {
          code: 'NOT_FOUND',
          httpStatus: 404,
          path: 'getLessonTranscript.getLessonTranscript',
          zodError: null,
        },
      },
    } as const satisfies ToolExecutionResult & { readonly status: number };
    const executeMcpToolImplementation: NonNullable<
      UniversalToolExecutors['executeMcpTool']
    > = () => Promise.resolve(transcript404);
    const executeMcpTool = vi.fn(executeMcpToolImplementation);

    const module = createMcpToolsModule({
      client: createFakeOakPathBasedClient(),
      executeMcpTool,
    });

    const output = expectCallToolResult(
      await module.handleTool('get-lessons-transcript', lessonArgs),
    );

    expect(executeMcpTool).toHaveBeenCalledWith('get-lessons-transcript', lessonArgs);
    expect(output.isError).not.toBe(true);
    const decoded: unknown = JSON.parse(readTextPayload(output));
    expect(decoded).toEqual({ status: transcript404.status, data: transcript404.data });
  });

  it('passes through executor errors as MCP error responses', async () => {
    const error = new McpToolError('Execution failed', 'get-lessons-transcript');
    const executeMcpToolImplementation: NonNullable<
      UniversalToolExecutors['executeMcpTool']
    > = () => Promise.resolve({ error } satisfies ToolExecutionResult);
    const executeMcpTool = vi.fn(executeMcpToolImplementation);

    const module = createMcpToolsModule({
      client: createFakeOakPathBasedClient(),
      executeMcpTool,
    });

    const result = expectCallToolResult(
      await module.handleTool('get-lessons-transcript', lessonArgs),
    );

    expect(result.isError).toBe(true);
    expect(readTextPayload(result)).toContain('Execution failed');
  });

  it('formats unknown tool names as errors before hitting the executor', async () => {
    const executeMcpToolImplementation: NonNullable<
      UniversalToolExecutors['executeMcpTool']
    > = () =>
      Promise.resolve({ status: 200, data: {} } satisfies ToolExecutionResult & { status: number });
    const executeMcpTool = vi.fn(executeMcpToolImplementation);

    const module = createMcpToolsModule({
      client: createFakeOakPathBasedClient(),
      executeMcpTool,
    });

    const result = expectCallToolResult(await module.handleTool('not-a-real-tool', {}));

    expect(result.isError).toBe(true);
    expect(readTextPayload(result)).toBe('Error: Unknown tool: not-a-real-tool');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });
});
