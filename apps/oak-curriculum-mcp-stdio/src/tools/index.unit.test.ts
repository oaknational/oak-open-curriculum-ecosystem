import { describe, it, expect, vi } from 'vitest';
import { createMcpToolsModule } from './index.js';
import type {
  ToolName,
  ToolExecutionResult,
  OakApiPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';

const TEST_TOOL_NAME = 'get-key-stages-subject-lessons';

describe('createMcpToolsModule', () => {
  it('delegates search tool calls through the MCP executor dependency and returns aggregated data', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockImplementation(async (name) => {
        if (name === ('get-search-lessons' as ToolName)) {
          return Promise.resolve({ data: { lessons: ['lesson-a'] } });
        }
        if (name === ('get-search-transcripts' as ToolName)) {
          return Promise.resolve({ data: { transcripts: ['transcript-a'] } });
        }
        return Promise.resolve({ data: null });
      });

    const module = createMcpToolsModule({
      client: {} as OakApiPathBasedClient,
      executeMcpTool,
    });

    const result = await module.handleTool('search', { query: 'photosynthesis' });

    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-lessons',
      expect.objectContaining({ q: 'photosynthesis' }),
    );
    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-transcripts',
      expect.objectContaining({ q: 'photosynthesis' }),
    );
    expect(result).toEqual({
      q: 'photosynthesis',
      keyStage: undefined,
      subject: undefined,
      unit: undefined,
      lessons: { lessons: ['lesson-a'] },
      transcripts: { transcripts: ['transcript-a'] },
    });
  });

  it('delegates curriculum tools to the MCP executor dependency and returns parsed data', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ data: { status: 'ok' } });

    const module = createMcpToolsModule({
      client: {} as OakApiPathBasedClient,
      executeMcpTool,
    });

    const args = {
      params: {
        path: {
          keyStage: 'ks3' as const,
          subject: 'science' as const,
        },
      },
    };

    const result = await module.handleTool(TEST_TOOL_NAME, args);

    expect(executeMcpTool).toHaveBeenCalledWith(TEST_TOOL_NAME, args);
    expect(result).toEqual({ status: 'ok' });
  });

  it('propagates executor errors as structured MCP results', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ error: new Error('boom') });

    const module = createMcpToolsModule({
      client: {} as OakApiPathBasedClient,
      executeMcpTool,
    });

    const args = {
      params: {
        path: {
          keyStage: 'ks3' as const,
          subject: 'science' as const,
        },
      },
    };

    const result = await module.handleTool(TEST_TOOL_NAME, args);

    expect(result).toEqual({
      content: [{ type: 'text', text: 'boom' }],
      isError: true,
    });
  });
});
