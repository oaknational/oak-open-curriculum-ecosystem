import { describe, it, expect, vi } from 'vitest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { McpToolError } from './execute-tool-call.js';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';
import { SEARCH_INPUT_SCHEMA } from './aggregated-search.js';
import type { UniversalToolName } from './universal-tools.js';
import { generateCanonicalUrlWithContext } from '../types/generated/api-schema/routing/url-helpers.js';

interface McpToolDefinition {
  readonly description?: string;
  readonly inputSchema: GenericToolInputJsonSchema;
}

const { sampleMcpToolName, mcpTools } = vi.hoisted(() => {
  const name = 'get-key-stages-subject-lessons' as const;
  const definition: McpToolDefinition = {
    description: 'List lessons for a subject',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        params: {
          type: 'object',
          additionalProperties: false,
          properties: {
            path: {
              type: 'object',
              additionalProperties: false,
              properties: {
                keyStage: { type: 'string' },
                subject: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  const tools: Record<string, McpToolDefinition> = {
    [name]: definition,
  };

  return {
    sampleMcpToolName: name,
    mcpTools: tools,
  };
});

vi.mock('../types/generated/api-schema/mcp-tools/index.js', () => ({
  toolNames: [sampleMcpToolName] as const,
  getToolFromToolName: (name: string) => mcpTools[name],
  isToolName: (value: unknown) => typeof value === 'string' && value in mcpTools,
}));

function assertIsRecord(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Expected object payload');
  }
}

function parseTextContent(result: CallToolResult): Record<string, unknown> {
  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error(`Expected text content but received ${firstContent.type}`);
  }
  const parsed: unknown = JSON.parse(firstContent.text);
  assertIsRecord(parsed);
  return parsed;
}

const { listUniversalTools, isUniversalToolName, createUniversalToolExecutor } = await import(
  './universal-tools.js'
);

const SAMPLE_MCP_TOOL_NAME: UniversalToolName = sampleMcpToolName;

describe('listUniversalTools', () => {
  it('includes aggregated helpers', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name as string);
    expect(names).toContain('search');
    expect(names).toContain('fetch');
  });

  it('includes generated curriculum tools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name as string);
    expect(names).toContain(SAMPLE_MCP_TOOL_NAME);
  });

  it('preserves aggregator schema metadata', () => {
    const tools = listUniversalTools();
    const searchTool = tools.find((tool) => tool.name === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.inputSchema).toEqual(SEARCH_INPUT_SCHEMA);
  });
});

describe('isUniversalToolName', () => {
  it('matches aggregated tool names', () => {
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
    const executeMcpTool = vi.fn().mockImplementation((name: string) => {
      if (name === 'get-search-lessons') {
        return Promise.resolve({ status: 200, data: { lessons: ['lesson-a'] } });
      }
      if (name === 'get-search-transcripts') {
        return Promise.resolve({ status: 200, data: { transcripts: ['transcript-a'] } });
      }
      return Promise.resolve({ data: null });
    });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool('search', { query: 'photosynthesis' });

    expect(executeMcpTool).toHaveBeenCalledWith('get-search-lessons', {
      params: { query: { q: 'photosynthesis' } },
    });
    expect(executeMcpTool).toHaveBeenCalledWith('get-search-transcripts', {
      params: { query: { q: 'photosynthesis' } },
    });
    expect(result.isError).toBeUndefined();
    const payload = parseTextContent(result);
    expect(payload).toEqual({
      status: 200,
      data: {
        q: 'photosynthesis',
        keyStage: undefined,
        subject: undefined,
        unit: undefined,
        lessonsStatus: 200,
        lessons: { lessons: ['lesson-a'] },
        transcriptsStatus: 200,
        transcripts: { transcripts: ['transcript-a'] },
      },
    });
  });

  it('aggregates fetch results using the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockImplementation((name: string) => {
      if (name === 'get-lessons-summary') {
        return Promise.resolve({ status: 200, data: { lesson: { id: 'lesson-slug' } } });
      }
      return Promise.resolve({ status: 200, data: null });
    });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool('fetch', { id: 'lesson:maths-lesson' });

    expect(executeMcpTool).toHaveBeenCalledWith('get-lessons-summary', {
      params: { path: { lesson: 'maths-lesson' } },
    });
    const payload = parseTextContent(result);
    const expectedCanonicalUrl = generateCanonicalUrlWithContext('lesson', 'lesson:maths-lesson');
    expect(payload).toEqual({
      status: 200,
      data: {
        id: 'lesson:maths-lesson',
        type: 'lesson',
        canonicalUrl: expectedCanonicalUrl,
        data: { lesson: { id: 'lesson-slug' } },
      },
    });
  });

  it('delegates curriculum tools directly to the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ status: 200, data: { status: 'ok' } });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const args = {
      params: {
        path: { keyStage: 'ks3', subject: 'science' },
      },
    };
    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, args);

    expect(executeMcpTool).toHaveBeenCalledWith(SAMPLE_MCP_TOOL_NAME, args);
    const payload = parseTextContent(result);
    expect(payload).toEqual({ status: 200, data: { status: 'ok' } });
  });

  it('maps executor errors to CallToolResult', async () => {
    const executeMcpTool = vi
      .fn()
      .mockResolvedValue({ error: new McpToolError('Execution failed', SAMPLE_MCP_TOOL_NAME) });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {});

    expect(result.isError).toBe(true);
    expect(result.content[0]).toEqual({ type: 'text', text: 'Execution failed' });
  });
});
