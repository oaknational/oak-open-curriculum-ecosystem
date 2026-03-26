import { describe, it, expect } from 'vitest';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { SEARCH_INPUT_SCHEMA } from './aggregated-search/index.js';
import { listUniversalTools } from './universal-tools/list-tools.js';
import { isUniversalToolName } from './universal-tools/type-guards.js';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import type {
  GeneratedToolRegistry,
  ToolRegistryDescriptor,
  UniversalToolName,
} from './universal-tools/types.js';

const AGGREGATED_TOOL_NAMES_FROM_DEFS = typeSafeKeys(AGGREGATED_TOOL_DEFS);

/** Tools that don't have widget _meta.ui fields (no resourceUri). */
const NON_WIDGET_TOOLS: readonly string[] = ['download-asset'];
const WIDGET_TOOL_NAMES = AGGREGATED_TOOL_NAMES_FROM_DEFS.filter(
  (name) => !NON_WIDGET_TOOLS.includes(name),
);

describe('AGGREGATED_TOOL_DEFS contains expected tools', () => {
  it('contains get-curriculum-model as the sole orientation tool', () => {
    expect(AGGREGATED_TOOL_NAMES_FROM_DEFS).toContain('get-curriculum-model');
  });
});

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

  it('always includes download-asset', () => {
    const tools = listUniversalTools(registry);
    const names = tools.map((tool) => tool.name);
    expect(names).toContain('download-asset');
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
    expect(isUniversalToolName('get-curriculum-model', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-thread-progressions', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('get-prerequisite-graph', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('browse-curriculum', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('explore-topic', registry.isToolName)).toBe(true);
    expect(isUniversalToolName('download-asset', registry.isToolName)).toBe(true);
  });

  it('matches curriculum tool names', () => {
    expect(isUniversalToolName(SAMPLE_MCP_TOOL_NAME, registry.isToolName)).toBe(true);
  });

  it('rejects unknown names', () => {
    expect(isUniversalToolName('unknown-tool', registry.isToolName)).toBe(false);
  });
});

describe('aggregated tool _meta fields (widget tools)', () => {
  it.each(WIDGET_TOOL_NAMES)('%s has _meta.ui.resourceUri pointing to widget', (toolName) => {
    const tools = listUniversalTools(registry);
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.ui?.resourceUri).toBe(WIDGET_URI);
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
  it('fits context budget (<70KB) for LLM tool-calling', async () => {
    const { ontologyData } = await import('./ontology-data.js');
    const ontologySize = JSON.stringify(ontologyData).length;
    expect(ontologySize).toBeLessThan(70000);
  });
});
