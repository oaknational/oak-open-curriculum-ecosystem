/**
 * Integration tests for createUniversalToolExecutor.
 *
 * Tests how the executor dispatches calls to search, fetch, ontology,
 * and generated MCP tools. Uses vi.fn() mocks injected via DI — making
 * these integration tests per the testing strategy.
 */

import { describe, it, expect, vi } from 'vitest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { z } from 'zod';
import { McpToolError } from './execute-tool-call.js';
import { err, ok } from '@oaknational/result';
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
  _meta: { securitySchemes: [] },
  toolMcpFlatInputSchema: z.object({
    params: z.object({
      path: z.object({
        keyStage: z.string(),
        subject: z.string(),
      }),
    }),
  }),
};

function createFakeRegistry(
  descriptor: ToolRegistryDescriptor = sampleDescriptor,
): GeneratedToolRegistry {
  return {
    toolNames: [sampleMcpToolName],
    getToolFromToolName: () => descriptor,
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

function omitProperty<T extends object, K extends keyof T>(object: T, key: K): Omit<T, K> {
  const { [key]: omitted, ...rest } = object;
  void omitted;
  return rest;
}

const registry = createFakeRegistry();
const SAMPLE_MCP_TOOL_NAME: UniversalToolName = sampleMcpToolName;

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
      query: 'photosynthesis',
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
        return Promise.resolve(ok({ status: 200, data: { lesson: { id: 'lesson-slug' } } }));
      }
      return Promise.resolve(ok({ status: 200, data: null }));
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
    const executeMcpTool = vi.fn().mockResolvedValue(ok({ status: 200, data: { status: 'ok' } }));
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

  it('uses the shared title-resolution rule for summaries and widget metadata', async () => {
    const annotations = sampleDescriptor.annotations;

    expect(annotations).toBeDefined();
    if (!annotations) {
      throw new Error('Expected generated tool descriptor to include annotations');
    }

    const annotationsWithoutTitle = omitProperty(annotations, 'title');
    const registryWithTopLevelTitle = createFakeRegistry({
      ...sampleDescriptor,
      title: 'Spec-aligned top-level title',
      annotations: annotationsWithoutTitle,
    });
    const executeMcpTool = vi.fn().mockResolvedValue(ok({ status: 200, data: { status: 'ok' } }));
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registryWithTopLevelTitle,
    });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {});

    expect(result.content[0]).toEqual({
      type: 'text',
      text: 'Spec-aligned top-level title: 200',
    });
    expect(result._meta).toHaveProperty('annotations/title', 'Spec-aligned top-level title');
  });

  it('maps executor errors to CallToolResult', async () => {
    const executeMcpTool = vi
      .fn()
      .mockResolvedValue(err(new McpToolError('Execution failed', SAMPLE_MCP_TOOL_NAME)));
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {});

    expect(result.isError).toBe(true);
    expect(result.content[0]).toEqual({ type: 'text', text: 'Execution failed' });
  });

  /**
   * After WS2, 'get-ontology' and 'get-help' are removed from the
   * UniversalToolName union. The casts below are necessary to test
   * that the runtime executor rejects these values — the type system
   * will correctly prevent passing them without a cast.
   */
  it('rejects get-ontology as unknown tool (replaced by get-curriculum-model)', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool('get-ontology' as UniversalToolName, {});

    expect(result.isError).toBe(true);
  });

  it('rejects get-help as unknown tool (replaced by get-curriculum-model)', async () => {
    const executeMcpTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({
      executeMcpTool,
      searchRetrieval: createStubSearchRetrieval(),
      generatedTools: registry,
    });

    const result = await callUniversalTool('get-help' as UniversalToolName, {});

    expect(result.isError).toBe(true);
  });
});
