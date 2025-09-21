import { describe, it, expect, vi } from 'vitest';
import { createMcpToolsModule } from './index.js';
import type {
  AllToolNames,
  OpenAiToolName,
  ToolExecutionResult,
} from '@oaknational/oak-curriculum-sdk';

const TEST_TOOL_NAME = 'get-key-stages-subject-lessons';

describe('createMcpToolsModule', () => {
  it('delegates search tool calls to the OpenAI executor dependency', async () => {
    const executeOpenAiTool: (name: OpenAiToolName, args: unknown) => Promise<unknown> = vi
      .fn()
      .mockResolvedValue({ ok: true });
    const executeMcpTool: (name: AllToolNames, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ data: { ok: true } });

    const module = createMcpToolsModule({
      client: {
        /* not used */
      } as never,
      executeMcpTool,
      executeOpenAiTool,
    });

    const result = await module.handleTool('search', { query: 'photosynthesis' });

    expect(executeOpenAiTool).toHaveBeenCalledWith('search', { query: 'photosynthesis' });
    expect(result).toEqual({ ok: true });
  });

  it('delegates curriculum tools to the MCP executor dependency and returns parsed data', async () => {
    const executeOpenAiTool: (name: OpenAiToolName, args: unknown) => Promise<unknown> = vi.fn();
    const executeMcpTool: (name: AllToolNames, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ data: { status: 'ok' } });

    const module = createMcpToolsModule({
      client: {
        /* not used */
      } as never,
      executeMcpTool,
      executeOpenAiTool,
    });

    const result = await module.handleTool(TEST_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'science',
    });

    expect(executeMcpTool).toHaveBeenCalledWith(TEST_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'science',
    });
    expect(result).toEqual({ status: 'ok' });
  });

  it('propagates executor errors as structured MCP results', async () => {
    const executeMcpTool: (name: AllToolNames, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ error: new Error('boom') });
    const executeOpenAiTool: (name: OpenAiToolName, args: unknown) => Promise<unknown> = vi.fn();

    const module = createMcpToolsModule({
      client: {
        /* not used */
      } as never,
      executeMcpTool,
      executeOpenAiTool,
    });

    const result = await module.handleTool(TEST_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'science',
    });

    expect(result).toEqual({
      content: [{ type: 'text', text: 'boom' }],
      isError: true,
    });
  });
});
