import { describe, it, expect, vi } from 'vitest';
import type {
  ToolName,
  ToolExecutionResult,
  OakApiPathBasedClient,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';
import { createMcpToolsModule } from './index.js';

const TEST_TOOL_NAME = 'get-key-stages-subject-lessons';

function isCallToolResult(value: unknown): value is CallToolResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as { readonly content?: unknown };
  return Array.isArray(candidate.content);
}

function expectCallToolResult(value: unknown): CallToolResult {
  if (!isCallToolResult(value)) {
    throw new Error('Expected CallToolResult');
  }
  return value;
}

function parseJsonContent(result: CallToolResult): unknown {
  const textEntry = result.content.find((entry): entry is TextContent => entry.type === 'text');
  if (!textEntry || typeof textEntry.text !== 'string') {
    throw new Error('Expected textual content in CallToolResult');
  }
  return JSON.parse(textEntry.text) as unknown;
}

describe('createMcpToolsModule', () => {
  it('delegates search tool calls through the MCP executor dependency and returns aggregated data', async () => {
    // Mock data: get-search-lessons and get-search-transcripts return arrays
    // Note: The SDK augments lesson results with canonicalUrl based on lessonSlug
    const mockLessonsFromApi = [
      { lessonTitle: 'Photosynthesis Basics', lessonSlug: 'photosynthesis-basics' },
    ];
    const mockLessonsWithCanonicalUrl = [
      {
        lessonTitle: 'Photosynthesis Basics',
        lessonSlug: 'photosynthesis-basics',
        canonicalUrl: 'https://www.thenational.academy/teachers/lessons/photosynthesis-basics',
      },
    ];
    // Transcripts must have lessonSlug for canonical URL generation
    const mockTranscriptsFromApi = [{ lessonTitle: 'Transcript A', lessonSlug: 'transcript-a' }];
    const mockTranscriptsWithCanonicalUrl = [
      {
        lessonTitle: 'Transcript A',
        lessonSlug: 'transcript-a',
        canonicalUrl: 'https://www.thenational.academy/teachers/lessons/transcript-a',
      },
    ];

    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockImplementation(async (name) => {
        if (name === ('get-search-lessons' as ToolName)) {
          return Promise.resolve({ status: 200, data: mockLessonsFromApi });
        }
        if (name === ('get-search-transcripts' as ToolName)) {
          return Promise.resolve({ status: 200, data: mockTranscriptsFromApi });
        }
        return Promise.resolve({ status: 200, data: null });
      });

    const module = createMcpToolsModule({
      client: {} as OakApiPathBasedClient,
      executeMcpTool,
    });

    const output = expectCallToolResult(
      await module.handleTool('search', { query: 'photosynthesis' }),
    );

    // Verify tool delegation
    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-lessons',
      expect.objectContaining({ q: 'photosynthesis' }),
    );
    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-transcripts',
      expect.objectContaining({ q: 'photosynthesis' }),
    );

    // content has human-readable summary per OpenAI Apps SDK
    const textEntry = output.content.find((entry): entry is TextContent => entry.type === 'text');
    expect(textEntry?.text).toContain('photosynthesis');

    // structuredContent has FULL data for model reasoning per OpenAI Apps SDK
    expect(output.structuredContent).toHaveProperty('summary');
    expect(output.structuredContent).toHaveProperty('status', 'success');
    const structured = output.structuredContent as {
      q?: string;
      lessons?: unknown[];
      transcripts?: unknown[];
    };
    expect(structured.q).toBe('photosynthesis');
    expect(structured.lessons).toEqual(mockLessonsWithCanonicalUrl);
    expect(structured.transcripts).toEqual(mockTranscriptsWithCanonicalUrl);
  });

  it('delegates curriculum tools to the MCP executor dependency and returns parsed data', async () => {
    const executeMcpTool: (name: ToolName, args: unknown) => Promise<ToolExecutionResult> = vi
      .fn()
      .mockResolvedValue({ status: 200, data: { status: 'ok' } });

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

    const output = expectCallToolResult(await module.handleTool(TEST_TOOL_NAME, args));
    const textEntry = output.content.find((entry): entry is TextContent => entry.type === 'text');
    const message = textEntry?.text;

    expect(output.isError).toBe(true);
    expect(message).toBe('boom');
  });
});
