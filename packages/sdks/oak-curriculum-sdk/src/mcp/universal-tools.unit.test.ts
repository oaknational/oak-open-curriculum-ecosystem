import { describe, it, expect, vi } from 'vitest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk-generation/widget-constants';
import type { ToolName } from '@oaknational/curriculum-sdk-generation/mcp-tools';
import { McpToolError } from './execute-tool-call.js';
import { ok } from '@oaknational/result';
import { SEARCH_INPUT_SCHEMA } from './aggregated-search/index.js';
import { listUniversalTools } from './universal-tools/list-tools.js';
import { isUniversalToolName } from './universal-tools/type-guards.js';
import { createUniversalToolExecutor } from './universal-tools/executor.js';
import type {
  GeneratedToolRegistry,
  ToolRegistryDescriptor,
  UniversalToolName,
} from './universal-tools/types.js';
import { createStubSearchRetrieval } from './search-retrieval-stub.js';

const sampleMcpToolName = 'get-key-stages-subject-lessons' as const satisfies ToolName;

const sampleDescriptor: ToolRegistryDescriptor = {
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
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Lessons',
  },
  securitySchemes: [],
  requiresDomainContext: false,
};

function createFakeRegistry(): GeneratedToolRegistry {
  return {
    toolNames: [sampleMcpToolName],
    getToolFromToolName: () => sampleDescriptor,
    isToolName: (value: unknown): value is ToolName =>
      typeof value === 'string' && value === sampleMcpToolName,
  };
}

type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

function assertIsStructuredContent(value: unknown): asserts value is StructuredContent {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Expected object payload');
  }
}

function parseTextContent(result: CallToolResult): StructuredContent {
  const jsonContent = result.content.length >= 2 ? result.content[1] : result.content[0];
  if (jsonContent.type !== 'text') {
    throw new Error(`Expected text content but received ${jsonContent.type}`);
  }
  const parsed: unknown = JSON.parse(jsonContent.text);
  assertIsStructuredContent(parsed);
  return parsed;
}

const registry = createFakeRegistry();
const SAMPLE_MCP_TOOL_NAME: UniversalToolName = sampleMcpToolName;

describe('listUniversalTools', () => {
  it('includes aggregated helpers', () => {
    const tools = listUniversalTools(registry);
    const names = tools.map((tool) => tool.name);
    expect(names).toContain('search');
    expect(names).toContain('fetch');
  });

  it('includes generated curriculum tools', () => {
    const tools = listUniversalTools(registry);
    const names = tools.map((tool) => tool.name);
    expect(names).toContain(SAMPLE_MCP_TOOL_NAME);
  });

  it('preserves aggregator schema metadata', () => {
    const tools = listUniversalTools(registry);
    const searchTool = tools.find((tool) => tool.name === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.inputSchema).toEqual(SEARCH_INPUT_SCHEMA);
  });
});

describe('isUniversalToolName', () => {
  it('matches aggregated tool names', () => {
    expect(isUniversalToolName('search', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('fetch', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-ontology', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-help', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-thread-progressions', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-prerequisite-graph', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('browse-curriculum', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('explore-topic', registry.isToolName)).toBe(true);
  });

  it('matches curriculum tool names', () => {
    expect(isUniversalToolName(SAMPLE_MCP_TOOL_NAME, registry.isToolName)).toBe(true);
  });

  it('rejects unknown names', () => {
    expect(isUniversalToolName('unknown-tool', registry.isToolName)).toBe(false);
  });
});

describe('createUniversalToolExecutor', () => {
  it('dispatches search to searchRetrieval service', async () => {
    const executeMcpTool = vi.fn();
    const searchRetrieval = {
      ...createStubSearchRetrieval(),
      searchLessons: vi.fn().mockResolvedValue(
        ok({
          scope: 'lessons',
          total: 1,
          took: 5,
          timedOut: false,
          results: [{ title: 'Photosynthesis' }],
        }),
      ),
    };
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval,
      generatedTools: registry,
    });

    const result = await callUniversalTool('search', {
      text: 'photosynthesis',
      scope: 'lessons',
    });

    expect(searchRetrieval.searchLessons).toHaveBeenCalled();
    expect(executeMcpTool).not.toHaveBeenCalled();
    expect(result.isError).toBeUndefined();

    const firstContent = result.content[0];
    expect(firstContent.type).toBe('text');
    if ('text' in firstContent) {
      expect(firstContent.text).toContain('photosynthesis');
    }

    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent).toHaveProperty('scope', 'lessons');
    expect(result.structuredContent).toHaveProperty('total', 1);
    expect(result.structuredContent).toHaveProperty('results');

    expect(result._meta).toBeDefined();
    expect(result._meta).toHaveProperty('query', 'photosynthesis');
  });

  it('aggregates fetch results using the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockImplementation((name: string) => {
      if (name === 'get-lessons-summary') {
        return Promise.resolve({ status: 200, data: { lesson: { id: 'lesson-slug' } } });
      }
      return Promise.resolve({ status: 200, data: null });
    });
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool('fetch', { id: 'lesson:maths-lesson' });

    expect(executeMcpTool).toHaveBeenCalledWith('get-lessons-summary', {
      lesson: 'maths-lesson',
    });
    expect(result.isError).toBeUndefined();

    const firstContent = result.content[0];
    expect(firstContent.type).toBe('text');
    if ('text' in firstContent) {
      expect(firstContent.text).toContain('lesson');
    }

    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent).toHaveProperty('id', 'lesson:maths-lesson');
    expect(result.structuredContent).toHaveProperty('type', 'lesson');
  });

  it('delegates curriculum tools directly to the MCP executor', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ status: 200, data: { status: 'ok' } });
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

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
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {});

    expect(result.isError).toBe(true);
    expect(result.content[0]).toEqual({ type: 'text', text: 'Execution failed' });
  });

  it('returns curriculum ontology with domain model structure', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool('get-ontology', {});

    expect(result.isError).toBeUndefined();

    const firstContent = result.content[0];
    expect(firstContent.type).toBe('text');
    if ('text' in firstContent) {
      expect(firstContent.text).toContain('Curriculum');
    }

    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent).toHaveProperty('version');
    expect(result.structuredContent).toHaveProperty('curriculumStructure');
    expect(result.structuredContent).toHaveProperty('workflows');
  });
});

describe('get-ontology tool descriptor', () => {
  it('appears in listUniversalTools', () => {
    const tools = listUniversalTools(registry);
    const names = tools.map((tool) => tool.name);
    expect(names).toContain('get-ontology');
  });

  it('has readOnlyHint annotation set to true', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.readOnlyHint).toBe(true);
  });

  it('has idempotentHint annotation set to true', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.idempotentHint).toBe(true);
  });

  it('has title annotation', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.annotations?.title).toBe('Get Curriculum Ontology');
  });

  it('has _meta with openai/toolInvocation fields', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?._meta).toBeDefined();
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoking']).toBe(
      'Loading curriculum model…',
    );
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoked']).toBe('Curriculum model loaded');
  });

  it('has description with "Use when" guidance', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.description).toContain('Use this when');
    expect(ontologyTool?.description).toContain('Do NOT use for');
  });

  it('has empty input schema (no parameters)', () => {
    const tools = listUniversalTools(registry);
    const ontologyTool = tools.find((tool) => tool.name === 'get-ontology');
    expect(ontologyTool?.inputSchema).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });
});

describe('aggregated tool _meta fields', () => {
  const aggregatedToolNames = [
    'search',
    'fetch',
    'get-ontology',
    'get-help',
    'browse-curriculum',
    'explore-topic',
    'get-thread-progressions',
    'get-prerequisite-graph',
  ] as const;

  it.each(aggregatedToolNames)('%s has openai/outputTemplate', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/outputTemplate']).toBe(WIDGET_URI);
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoking', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoking']).toBeDefined();
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoked', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoked']).toBeDefined();
  });
});

describe('aggregated tool widgetAccessible and visibility', () => {
  const aggregatedToolNames = [
    'search',
    'fetch',
    'get-ontology',
    'get-help',
    'browse-curriculum',
    'explore-topic',
    'get-thread-progressions',
    'get-prerequisite-graph',
  ] as const;

  it.each(aggregatedToolNames)('%s has openai/widgetAccessible set to true', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/widgetAccessible']).toBe(true);
  });

  it.each(aggregatedToolNames)('%s has openai/visibility set to public', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/visibility']).toBe('public');
  });
});

describe('search and fetch descriptions', () => {
  it('search description includes "Use this when" guidance', () => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === 'search');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });

  it('fetch description includes "Use this when" guidance', () => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === 'fetch');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });
});

describe('ontologyData', () => {
  it('includes synonyms section with subjects and keyStages', async () => {
    const { ontologyData } = await import('./ontology-data.js');
    expect(ontologyData.synonyms).toBeDefined();
    expect(ontologyData.synonyms.subjects).toBeDefined();
    expect(ontologyData.synonyms.keyStages).toBeDefined();
    expect(ontologyData.synonyms.subjects.maths).toContain('mathematics');
    expect(ontologyData.synonyms.keyStages.ks4).toContain('gcse');
  });

  it('fits context budget (<70KB) for LLM tool-calling', async () => {
    const { ontologyData } = await import('./ontology-data.js');
    const ontologySize = JSON.stringify(ontologyData).length;
    expect(ontologySize).toBeLessThan(70000);
  });
});
