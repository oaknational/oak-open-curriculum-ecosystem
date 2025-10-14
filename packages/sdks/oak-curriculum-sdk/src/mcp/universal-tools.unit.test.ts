import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

interface OpenAiToolDefinition {
  readonly inputSchema: { readonly type: 'object'; readonly properties: Record<string, unknown> };
  readonly description?: string;
  readonly zodOutputSchema: z.ZodTypeAny;
}

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

const openAiToolDefs: Record<string, OpenAiToolDefinition> = {
  search: {
    inputSchema: { type: 'object', properties: { query: { type: 'string' } } },
    description: 'Search tool',
    zodOutputSchema: z.object({ result: z.any() }),
  },
  fetch: {
    inputSchema: { type: 'object', properties: { url: { type: 'string' } } },
    description: 'Fetch tool',
    zodOutputSchema: z.object({ status: z.number() }),
  },
};

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

vi.mock(
  '../types/generated/openai-connector/index.js',
  () => ({
    OPENAI_CONNECTOR_TOOL_DEFS: openAiToolDefs,
    OPENAI_CONNECTOR_TOOL_ENTRIES: Object.entries(openAiToolDefs),
    isOpenAiToolName: (value: unknown) => typeof value === 'string' && value in openAiToolDefs,
  }),
  { virtual: true },
);

vi.mock(
  '../types/generated/api-schema/mcp-tools/definitions.js',
  () => ({
    MCP_TOOLS: mcpTools,
  }),
  { virtual: true },
);

vi.mock(
  '../types/generated/api-schema/mcp-tools/types.js',
  () => ({
    TOOL_NAMES: [sampleMcpToolName] as const,
    isToolName: (value: unknown) => typeof value === 'string' && value in mcpTools,
  }),
  { virtual: true },
);

const { listUniversalTools, isUniversalToolName, createUniversalToolExecutor } = await import(
  './universal-tools.js'
);

const { OPENAI_CONNECTOR_TOOL_DEFS } = await import('../types/generated/openai-connector/index.js');
const { MCP_TOOLS } = await import('../types/generated/api-schema/mcp-tools/definitions.js');

const SAMPLE_MCP_TOOL_NAME = sampleMcpToolName;

if (!(SAMPLE_MCP_TOOL_NAME in MCP_TOOLS)) {
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
    expect(searchTool?.inputSchema).toEqual(OPENAI_CONNECTOR_TOOL_DEFS.search.inputSchema);
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
  it('delegates to openai executor for search', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn().mockResolvedValue({ result: 'ok' });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool('search', { query: 'photosynthesis' });

    expect(executeOpenAiTool).toHaveBeenCalledWith('search', { query: 'photosynthesis' });
    expect(result.isError).toBeUndefined();
    expect(result.content[0]).toEqual({ type: 'text', text: JSON.stringify({ result: 'ok' }) });
  });

  it('delegates to mcp executor for curriculum tools', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

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
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, { subject: 'science' });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.type).toBe('text');
    expect(result.content[0]?.text).toContain('Required: keyStage');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('returns validation error text when arguments are malformed', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, { subject: 123 });

    expect(result.isError).toBe(true);
    const message = result.content[0]?.type === 'text' ? result.content[0].text : '';
    expect(message).toContain('Required: keyStage, subject');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('returns an error result when executors throw', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ error: new Error('failure') });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

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
