import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

type ValidationResult =
  | { readonly ok: true; readonly data: unknown }
  | { readonly ok: false; readonly message: string };

interface McpToolDefinition {
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties: Record<string, unknown>;
  };
  readonly toolZodSchema: z.ZodTypeAny;
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: z.ZodTypeAny;
  readonly description?: string;
  readonly describeToolArgs?: () => string;
  readonly path: string;
  readonly method: string;
  readonly validateOutput: (value: unknown) => ValidationResult;
  readonly inputSchema: McpToolDefinition['toolInputJsonSchema'];
}

const sampleMcpToolName = 'get-key-stages-subject-lessons';

const sampleMcpToolDef: McpToolDefinition = {
  toolInputJsonSchema: {
    type: 'object',
    properties: {
      params: {
        type: 'object',
        properties: {
          path: {
            type: 'object',
            properties: {
              keyStage: { type: 'string' },
              subject: { type: 'string' },
            },
          },
          query: {
            type: 'object',
            properties: {
              unit: { type: 'string' },
              offset: { type: 'number' },
              limit: { type: 'number' },
            },
          },
        },
      },
    },
  },
  toolZodSchema: z.object({
    params: z.object({
      path: z.object({ keyStage: z.string(), subject: z.string() }),
      query: z.object({ unit: z.string(), offset: z.number(), limit: z.number() }),
    }),
  }),
  toolOutputJsonSchema: { type: 'object', properties: { status: { type: 'string' } } },
  zodOutputSchema: z.object({ status: z.string() }),
  description: 'List lessons for a subject',
  describeToolArgs: () => 'Required: keyStage, subject',
  path: '/curriculum/subjects',
  method: 'get',
  validateOutput: (value) => ({ ok: true, data: value }),
  inputSchema: {
    type: 'object',
    properties: {
      params: {
        type: 'object',
        properties: {
          path: {
            type: 'object',
            properties: {
              keyStage: { type: 'string' },
              subject: { type: 'string' },
            },
          },
          query: {
            type: 'object',
            properties: {
              unit: { type: 'string' },
              offset: { type: 'number' },
              limit: { type: 'number' },
            },
          },
        },
      },
    },
  },
};

const mcpTools: Record<string, McpToolDefinition> = {
  [sampleMcpToolName]: sampleMcpToolDef,
};

vi.mock('../types/generated/api-schema/mcp-tools/index.js', () => ({
  toolNames: [sampleMcpToolName] as const,
  getToolFromToolName: (name: string) => mcpTools[name],
  isToolName: (value: unknown) => typeof value === 'string' && value in mcpTools,
}));

const { listUniversalTools, isUniversalToolName, createUniversalToolExecutor } = await import(
  './universal-tools.js'
);

const { getToolFromToolName: generatedGetToolFromToolName } = await import(
  '../types/generated/api-schema/mcp-tools/index.js'
);

const SAMPLE_MCP_TOOL_NAME = sampleMcpToolName;

const generatedDescriptor = generatedGetToolFromToolName(SAMPLE_MCP_TOOL_NAME);

if (!generatedDescriptor) {
  throw new Error('Expected get-key-stages-subject-lessons tool to be generated');
}

describe('listUniversalTools', () => {
  it('includes generated openai tools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name);
    expect(names).toContain('search');
    expect(names).toContain('fetch');
  });

  it('includes generated curriculum tools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name);
    expect(names).toContain(SAMPLE_MCP_TOOL_NAME);
  });

  it('preserves schema metadata from generated definitions', () => {
    const tools = listUniversalTools();
    const searchTool = tools.find((tool) => tool.name === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.inputSchema).toMatchObject({
      type: 'object',
      properties: expect.objectContaining({ query: { type: 'string' } }),
    });
  });
});

describe('isUniversalToolName', () => {
  it('matches search and fetch', () => {
    expect(isUniversalToolName('search')).toBe(true);
    expect(isUniversalToolName('fetch')).toBe(true);
  });

  it('matches curriculum tool names', () => {
    expect(isUniversalToolName(SAMPLE_MCP_TOOL_NAME)).toBe(true);
  });

  it('rejects unknown names', () => {
    expect(isUniversalToolName('unknown-tool')).toBe(false);
  });
});

describe('createUniversalToolExecutor', () => {
  it('aggregates search results using the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockImplementation(async (name: string) => {
      if (name === 'get-search-lessons') {
        return { data: { lessons: ['lesson-a'] } };
      }
      if (name === 'get-search-transcripts') {
        return { data: { transcripts: ['transcript-a'] } };
      }
      return { data: null };
    });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool('search', { query: 'photosynthesis' });

    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-lessons',
      expect.objectContaining({ q: 'photosynthesis' }),
    );
    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-search-transcripts',
      expect.objectContaining({ q: 'photosynthesis' }),
    );
    expect(result.isError).toBeUndefined();
    const payload = JSON.parse(
      result.content[0]?.type === 'text' ? result.content[0].text : 'null',
    );
    expect(payload).toEqual({
      q: 'photosynthesis',
      keyStage: undefined,
      subject: undefined,
      unit: undefined,
      lessons: { lessons: ['lesson-a'] },
      transcripts: { transcripts: ['transcript-a'] },
    });
  });

  it('aggregates fetch results using the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockImplementation(async (name: string) => {
      if (name === 'get-lessons-summary') {
        return { data: { lesson: { id: 'lesson-slug' } } };
      }
      return { data: null };
    });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool('fetch', { id: 'lesson:maths-lesson' });

    expect(executeMcpTool).toHaveBeenCalledWith(
      'get-lessons-summary',
      expect.objectContaining({ lesson: 'maths-lesson' }),
    );
    const payload = JSON.parse(
      result.content[0]?.type === 'text' ? result.content[0].text : 'null',
    );
    expect(payload).toMatchObject({
      id: 'lesson:maths-lesson',
      type: 'lesson',
      canonicalUrl: expect.any(String),
      data: { lesson: { id: 'lesson-slug' } },
    });
  });

  it('delegates to the MCP executor for curriculum tools', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const args = {
      params: {
        path: { keyStage: 'ks3', subject: 'science' },
        query: { unit: 'example-unit', offset: 0, limit: 10 },
      },
    };
    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, args);

    expect(executeMcpTool).toHaveBeenCalledTimes(1);
    expect(executeMcpTool).toHaveBeenCalledWith(SAMPLE_MCP_TOOL_NAME, args);
    expect(result.isError).toBeUndefined();
    expect(result.content[0]).toEqual({ type: 'text', text: JSON.stringify({ status: 'ok' }) });
  });

  it('preserves validator feedback when arguments are missing', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, { subject: 'science' });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.type).toBe('text');
    expect(result.content[0]?.text).toContain('Required: keyStage');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('returns validation error text when arguments are malformed', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, { subject: 123 });

    expect(result.isError).toBe(true);
    const message = result.content[0]?.type === 'text' ? result.content[0].text : '';
    expect(message).toContain('Required: keyStage, subject');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('returns an error result when the MCP executor reports an error', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ error: new Error('failure') });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const args = {
      params: {
        path: { keyStage: 'ks3', subject: 'science' },
        query: { unit: 'example-unit', offset: 0, limit: 10 },
      },
    };
    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, args);

    expect(executeMcpTool).toHaveBeenCalledTimes(1);
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('failure');
  });
});
