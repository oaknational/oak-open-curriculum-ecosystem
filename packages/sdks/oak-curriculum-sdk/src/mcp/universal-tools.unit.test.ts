import { describe, it, expect, vi } from 'vitest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { McpToolError } from './execute-tool-call.js';
import type { GenericToolInputJsonSchema } from './zod-input-schema.js';
import { SEARCH_INPUT_SCHEMA } from './aggregated-search/index.js';
import type { UniversalToolName } from './universal-tools/index.js';
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
  './universal-tools/index.js'
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
    expect(isUniversalToolName('get-ontology')).toBe(true);
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
      q: 'photosynthesis',
    });
    expect(executeMcpTool).toHaveBeenCalledWith('get-search-transcripts', {
      q: 'photosynthesis',
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
      lesson: 'maths-lesson',
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

  it('returns curriculum ontology with domain model structure', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool });

    const result = await callUniversalTool('get-ontology', {});

    expect(result.isError).toBeUndefined();
    const payload = parseTextContent(result);
    expect(payload).toHaveProperty('version');
    expect(payload).toHaveProperty('curriculumStructure');
    expect(payload).toHaveProperty('toolUsageGuidance');
  });
});

describe('get-ontology tool descriptor', () => {
  it('appears in listUniversalTools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name as string);
    expect(names).toContain('get-ontology');
  });

  it('has readOnlyHint annotation set to true', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.readOnlyHint).toBe(true);
  });

  it('has idempotentHint annotation set to true', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.idempotentHint).toBe(true);
  });

  it('has title annotation', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.title).toBe('Get Curriculum Ontology');
  });

  it('has _meta with openai/toolInvocation fields', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?._meta).toBeDefined();
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoking']).toBe(
      'Loading curriculum model…',
    );
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoked']).toBe('Curriculum model loaded');
  });

  it('has description with "Use when" guidance', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.description).toContain('Use this when');
    expect(ontologyTool?.description).toContain('Do NOT use for');
  });

  it('has empty input schema (no parameters)', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.inputSchema).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });
});

/**
 * Tests for OpenAI Apps SDK _meta fields on all aggregated tools.
 *
 * These tests verify that all aggregated tools (search, fetch, get-ontology, get-help) have
 * the required _meta fields for ChatGPT widget integration:
 * - openai/outputTemplate: URI of widget to render output
 * - openai/toolInvocation/invoking: Status text during execution
 * - openai/toolInvocation/invoked: Status text after completion
 */
describe('aggregated tool _meta fields', () => {
  const aggregatedToolNames = ['search', 'fetch', 'get-ontology', 'get-help'] as const;

  it.each(aggregatedToolNames)('%s has openai/outputTemplate', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/outputTemplate']).toBe('ui://widget/oak-json-viewer.html');
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoking', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoking']).toBeDefined();
    expect(typeof tool?._meta?.['openai/toolInvocation/invoking']).toBe('string');
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoked', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoked']).toBeDefined();
    expect(typeof tool?._meta?.['openai/toolInvocation/invoked']).toBe('string');
  });
});

/**
 * Tests for OpenAI Apps SDK _meta fields enabling widget interactivity.
 *
 * Phase 2 adds widgetAccessible and visibility fields to enable:
 * - Widget-initiated tool calls via window.openai.callTool()
 * - Tool visibility control (public vs private)
 */
describe('aggregated tool widgetAccessible and visibility', () => {
  const aggregatedToolNames = ['search', 'fetch', 'get-ontology', 'get-help'] as const;

  it.each(aggregatedToolNames)('%s has openai/widgetAccessible set to true', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/widgetAccessible']).toBe(true);
  });

  it.each(aggregatedToolNames)('%s has openai/visibility set to public', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/visibility']).toBe('public');
  });
});

/**
 * Tests for description quality on search and fetch tools.
 *
 * Per OpenAI Apps SDK metadata optimization guidance, tool descriptions should
 * include "Use this when" and "Do NOT use" patterns to help ChatGPT select
 * the correct tool for user requests.
 */
describe('search and fetch descriptions', () => {
  it('search description includes "Use this when" guidance', () => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === 'search');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });

  it('fetch description includes "Use this when" guidance', () => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === 'fetch');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });
});

/**
 * Tests for ontologyData structure.
 *
 * The ontology data includes static curriculum domain information that
 * helps LLMs understand the Oak curriculum structure.
 */
describe('ontologyData', () => {
  it('includes synonyms section with subjects and keyStages', async () => {
    const { ontologyData } = await import('./ontology-data.js');
    expect(ontologyData.synonyms).toBeDefined();
    expect(ontologyData.synonyms.subjects).toBeDefined();
    expect(ontologyData.synonyms.keyStages).toBeDefined();
    expect(ontologyData.synonyms.subjects.maths).toContain('mathematics');
    expect(ontologyData.synonyms.keyStages.ks4).toContain('gcse');
  });
});
