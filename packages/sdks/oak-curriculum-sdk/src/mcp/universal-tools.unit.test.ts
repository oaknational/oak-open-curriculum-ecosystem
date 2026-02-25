import { describe, it, expect } from 'vitest';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { SEARCH_INPUT_SCHEMA } from './aggregated-search/index.js';
import { listUniversalTools } from './universal-tools/list-tools.js';
import { isUniversalToolName } from './universal-tools/type-guards.js';
import type {
  GeneratedToolRegistry,
  ToolRegistryDescriptor,
  UniversalToolName,
} from './universal-tools/types.js';

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
