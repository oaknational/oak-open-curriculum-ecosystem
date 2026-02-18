/**
 * Integration tests for aggregated fetch tool execution.
 *
 * Tests that the fetch tool returns results per OpenAI Apps SDK reference:
 * - `structuredContent`: Model AND widget see this (FULL data for reasoning)
 * - `content`: Model AND widget see this (human-readable summary)
 * - `_meta`: Widget ONLY sees this (additional widget metadata)
 *
 * @see https://developers.openai.com/apps-sdk/reference#tool-results
 *
 * @remarks
 * These are integration tests because they test how the execution function
 * integrates with dependencies (executeMcpTool) using simple mocks.
 */

import { describe, it, expect } from 'vitest';
import { runFetchTool } from './aggregated-fetch.js';
import type { UniversalToolExecutorDependencies } from './universal-tool-shared.js';
import { McpToolError, type ToolExecutionResult } from './execute-tool-call.js';
import { createStubSearchRetrieval } from './search-retrieval-stub.js';

/**
 * Creates a mock executeMcpTool that returns predefined result for any tool.
 * Simple mock injected as argument - no complex logic.
 */
function createMockExecutor(result: ToolExecutionResult): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: () => Promise.resolve(result),
    searchRetrieval: createStubSearchRetrieval(),
  };
}

describe('runFetchTool result structure per OpenAI Apps SDK', () => {
  describe('structuredContent (model sees this for reasoning)', () => {
    it('includes httpStatus (HTTP code) and status (success indicator) as distinct properties', async () => {
      const deps = createMockExecutor({ status: 200, data: { lessonTitle: 'Test Lesson' } });

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { httpStatus?: number; status?: string };
      expect(structured.httpStatus).toBe(200);
      expect(structured.status).toBe('success');
    });

    it('includes FULL data for model reasoning', async () => {
      const lessonData = {
        lessonTitle: 'Photosynthesis Basics',
        learningObjectives: ['Understand light reactions', 'Understand dark reactions'],
        keywords: ['chlorophyll', 'ATP', 'glucose'],
      };
      const deps = createMockExecutor({ status: 200, data: lessonData });

      const result = await runFetchTool({ id: 'lesson:photosynthesis-basics' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { data?: typeof lessonData };
      expect(structured.data).toEqual(lessonData);
    });

    it('includes id and type in structuredContent', async () => {
      const deps = createMockExecutor({ status: 200, data: { unitTitle: 'Fractions' } });

      const result = await runFetchTool({ id: 'unit:fractions' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { id?: string; type?: string };
      expect(structured.id).toBe('unit:fractions');
      expect(structured.type).toBe('unit');
    });

    it('includes canonicalUrl in structuredContent', async () => {
      const deps = createMockExecutor({ status: 200, data: { lessonTitle: 'Test' } });

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { canonicalUrl?: string };
      expect(structured.canonicalUrl).toBeDefined();
      expect(typeof structured.canonicalUrl).toBe('string');
    });

    it('includes oakContextHint for model context grounding', async () => {
      const deps = createMockExecutor({ status: 200, data: {} });

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('oakContextHint');
    });
  });

  describe('content (human-readable summary for conversation)', () => {
    it('returns human-readable summary text', async () => {
      const deps = createMockExecutor({ status: 200, data: { lessonTitle: 'Test' } });

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.content).toHaveLength(1);
      const firstContent = result.content[0];
      expect(firstContent).toHaveProperty('type', 'text');
      if ('text' in firstContent) {
        expect(firstContent.text).toContain('Lesson');
        expect(firstContent.text).toContain('test-lesson');
      }
    });
  });

  describe('_meta (widget-only metadata)', () => {
    it('includes toolName in _meta', async () => {
      const deps = createMockExecutor({ status: 200, data: {} });

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result._meta).toBeDefined();
      expect(result._meta).toHaveProperty('toolName', 'fetch');
    });

    it('includes timestamp in _meta', async () => {
      const deps = createMockExecutor({ status: 200, data: {} });

      const beforeTime = Date.now();
      const result = await runFetchTool({ id: 'lesson:test' }, deps);
      const afterTime = Date.now();

      expect(result._meta).toBeDefined();
      const meta = result._meta;
      if (meta && 'timestamp' in meta) {
        expect(typeof meta.timestamp).toBe('number');
        expect(meta.timestamp).toBeGreaterThanOrEqual(beforeTime);
        expect(meta.timestamp).toBeLessThanOrEqual(afterTime);
      }
    });
  });

  describe('error handling', () => {
    it('returns error for unsupported id prefix', async () => {
      const deps = createMockExecutor({ status: 200, data: {} });

      const result = await runFetchTool({ id: 'invalid:test' }, deps);

      expect(result.isError).toBe(true);
    });

    it('returns error when executor fails', async () => {
      const deps: UniversalToolExecutorDependencies = {
        executeMcpTool: () =>
          Promise.resolve({ error: new McpToolError('API failure', 'get-lessons-summary') }),
        searchRetrieval: createStubSearchRetrieval(),
      };

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result.isError).toBe(true);
    });
  });
});
