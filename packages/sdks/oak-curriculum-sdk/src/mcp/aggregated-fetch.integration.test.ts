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
import { createNullGeneratedToolRegistry } from './test-helpers/null-generated-tool-registry.js';
import { err, ok } from '@oaknational/result';

/**
 * Creates a mock executeMcpTool that returns predefined result for any tool.
 * Simple mock injected as argument - no complex logic.
 */
function createMockExecutor(result: ToolExecutionResult): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: () => Promise.resolve(result),
    searchRetrieval: createStubSearchRetrieval(),
    generatedTools: createNullGeneratedToolRegistry(),
  };
}

describe('runFetchTool result structure per OpenAI Apps SDK', () => {
  describe('structuredContent (model sees this for reasoning)', () => {
    it('includes httpStatus (HTTP code) and status (success indicator) as distinct properties', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: { lessonTitle: 'Test Lesson' } }));

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('httpStatus', 200);
      expect(result.structuredContent).toHaveProperty('status', 'success');
    });

    it('includes FULL data for model reasoning', async () => {
      const lessonData = {
        lessonTitle: 'Photosynthesis Basics',
        learningObjectives: ['Understand light reactions', 'Understand dark reactions'],
        keywords: ['chlorophyll', 'ATP', 'glucose'],
      };
      const deps = createMockExecutor(ok({ status: 200, data: lessonData }));

      const result = await runFetchTool({ id: 'lesson:photosynthesis-basics' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('data', lessonData);
    });

    it('includes id and type in structuredContent', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: { unitTitle: 'Fractions' } }));

      const result = await runFetchTool({ id: 'unit:fractions' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('id', 'unit:fractions');
      expect(result.structuredContent).toHaveProperty('type', 'unit');
    });

    it('includes canonicalUrl in structuredContent', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: { lessonTitle: 'Test' } }));

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('canonicalUrl', expect.any(String));
    });

    it('includes oakContextHint for model context grounding', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: {} }));

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('oakContextHint');
    });
  });

  describe('content (human-readable summary for conversation)', () => {
    it('returns human-readable summary text', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: { lessonTitle: 'Test' } }));

      const result = await runFetchTool({ id: 'lesson:test-lesson' }, deps);

      expect(result.content).toHaveLength(2);
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
      const deps = createMockExecutor(ok({ status: 200, data: {} }));

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result._meta).toBeDefined();
      expect(result._meta).toHaveProperty('toolName', 'fetch');
    });

    it('includes timestamp in _meta', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: {} }));

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

  describe('canonicalUrl for context-dependent types', () => {
    it('includes non-null canonicalUrl for subject fetch', async () => {
      const deps = createMockExecutor(
        ok({
          status: 200,
          data: {
            subjectTitle: 'Maths',
            subjectSlug: 'maths',
            keyStages: [
              { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
              { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
            ],
            sequenceSlugs: [],
            years: [],
          },
        }),
      );

      const result = await runFetchTool({ id: 'subject:maths' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty(
        'canonicalUrl',
        'https://www.thenational.academy/teachers/key-stages/ks1/subjects/maths/programmes',
      );
    });

    it('includes non-null canonicalUrl for unit fetch', async () => {
      const deps = createMockExecutor(
        ok({
          status: 200,
          data: {
            unitTitle: 'Fractions',
            unitSlug: 'fractions',
            subjectSlug: 'maths',
            phaseSlug: 'primary',
          },
        }),
      );

      const result = await runFetchTool({ id: 'unit:fractions' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty(
        'canonicalUrl',
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions',
      );
    });

    it('returns null canonicalUrl gracefully when context is insufficient', async () => {
      const deps = createMockExecutor(
        ok({
          status: 200,
          data: {
            subjectTitle: 'Maths',
            subjectSlug: 'maths',
          },
        }),
      );

      const result = await runFetchTool({ id: 'subject:maths' }, deps);

      expect(result.isError).toBeUndefined();
      expect(result.structuredContent).toHaveProperty('canonicalUrl', null);
    });

    it('returns null canonicalUrl when context derivation throws', async () => {
      const deps = createMockExecutor(
        ok({
          status: 200,
          data: {
            unitTitle: 'Fractions',
            unitSlug: 'fractions',
            subjectSlug: 'maths',
            phaseSlug: 'upper-primary',
          },
        }),
      );

      const result = await runFetchTool({ id: 'unit:fractions' }, deps);

      expect(result.isError).toBeUndefined();
      expect(result.structuredContent).toHaveProperty('canonicalUrl', null);
    });
  });

  describe('parameter mapping for content types', () => {
    it('passes correct flat parameter name for thread: prefix', async () => {
      let capturedToolName: string | undefined;
      let capturedArgs: unknown;
      const deps: UniversalToolExecutorDependencies = {
        executeMcpTool: (toolName, args) => {
          capturedToolName = toolName;
          capturedArgs = args;
          return Promise.resolve(ok({ status: 200, data: { threadTitle: 'Algebra' } }));
        },
        searchRetrieval: createStubSearchRetrieval(),
        generatedTools: createNullGeneratedToolRegistry(),
      };

      await runFetchTool({ id: 'thread:algebra' }, deps);

      expect(capturedToolName).toBe('get-threads-units');
      expect(capturedArgs).toHaveProperty('thread', 'algebra');
      expect(capturedArgs).not.toHaveProperty('threadSlug');
    });
  });

  describe('error handling', () => {
    it('returns error for unsupported id prefix', async () => {
      const deps = createMockExecutor(ok({ status: 200, data: {} }));

      const result = await runFetchTool({ id: 'invalid:test' }, deps);

      expect(result.isError).toBe(true);
    });

    it('returns error when executor fails', async () => {
      const deps: UniversalToolExecutorDependencies = {
        executeMcpTool: () =>
          Promise.resolve(err(new McpToolError('API failure', 'get-lessons-summary'))),
        searchRetrieval: createStubSearchRetrieval(),
        generatedTools: createNullGeneratedToolRegistry(),
      };

      const result = await runFetchTool({ id: 'lesson:test' }, deps);

      expect(result.isError).toBe(true);
    });
  });
});
