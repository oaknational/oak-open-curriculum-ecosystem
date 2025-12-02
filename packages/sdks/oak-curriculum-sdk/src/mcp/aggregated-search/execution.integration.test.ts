/**
 * Integration tests for aggregated search tool execution.
 *
 * Tests that the search tool returns optimized results for OpenAI Apps SDK:
 * - `structuredContent`: Minimal data for model reasoning
 * - `_meta`: Full data for widget rendering (hidden from model)
 * - `content`: Human-readable summary
 *
 * @remarks
 * These are integration tests because they test how the execution function
 * integrates with dependencies (executeMcpTool) using simple mocks.
 */

import { describe, it, expect } from 'vitest';
import { runSearchTool } from './execution.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { ToolExecutionResult } from '../execute-tool-call.js';

/**
 * Creates a mock executeMcpTool that returns predefined results.
 * Simple mock injected as argument - no complex logic.
 */
function createMockExecutor(
  lessonsResult: ToolExecutionResult,
  transcriptsResult: ToolExecutionResult,
): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: (name) => {
      if (name === 'get-search-lessons') {
        return Promise.resolve(lessonsResult);
      }
      if (name === 'get-search-transcripts') {
        return Promise.resolve(transcriptsResult);
      }
      return Promise.reject(new Error(`Unexpected tool: ${name}`));
    },
  };
}

describe('runSearchTool optimized result structure', () => {
  describe('structuredContent (model-facing minimal data)', () => {
    it('includes summary with result counts', async () => {
      const lessons = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Photosynthesis Basics' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Light Reactions' },
        { lessonSlug: 'lesson-3', lessonTitle: 'Dark Reactions' },
      ];
      const transcripts = [{ lessonSlug: 'lesson-1', transcript: 'Content...' }];

      const deps = createMockExecutor(
        { status: 200, data: lessons },
        { status: 200, data: transcripts },
      );

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('summary');

      // Verify summary contains the count
      const structured = result.structuredContent;
      if (structured && typeof structured === 'object' && 'summary' in structured) {
        expect(structured.summary).toContain('3');
      }
    });

    it('includes limited preview items (max 5)', async () => {
      const lessons = Array.from({ length: 10 }, (_, i) => ({
        lessonSlug: `lesson-${String(i + 1)}`,
        lessonTitle: `Lesson ${String(i + 1)}`,
      }));

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent;

      // Should have preview of lessons limited to 5
      if (structured && 'lessonPreviews' in structured) {
        expect(Array.isArray(structured.lessonPreviews)).toBe(true);
        expect((structured.lessonPreviews as unknown[]).length).toBeLessThanOrEqual(5);
      }
    });

    it('includes hasMore flag when results exceed 5', async () => {
      const lessons = Array.from({ length: 10 }, (_, i) => ({
        lessonSlug: `lesson-${String(i + 1)}`,
        lessonTitle: `Lesson ${String(i + 1)}`,
      }));

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(expect.objectContaining({ hasMore: true }));
    });

    it('sets hasMore to false when results are 5 or fewer', async () => {
      const lessons = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2' },
      ];

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(expect.objectContaining({ hasMore: false }));
    });
  });

  describe('_meta (widget-only full data)', () => {
    it('includes fullResults with complete lessons data', async () => {
      const lessons = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', fullDetails: 'lots of data...' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', fullDetails: 'more data...' },
      ];
      const transcripts = [{ lessonSlug: 'lesson-1', transcript: 'Full transcript here...' }];

      const deps = createMockExecutor(
        { status: 200, data: lessons },
        { status: 200, data: transcripts },
      );

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result._meta).toBeDefined();
      expect(result._meta).toHaveProperty('fullResults');

      const meta = result._meta;
      if (meta && 'fullResults' in meta) {
        const fullResults = meta.fullResults;
        expect(fullResults).toHaveProperty('lessons');
        expect(fullResults).toHaveProperty('transcripts');
      }
    });

    it('includes query in _meta', async () => {
      const deps = createMockExecutor({ status: 200, data: [] }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result._meta).toBeDefined();
      expect(result._meta).toEqual(expect.objectContaining({ query: 'photosynthesis' }));
    });

    it('includes timestamp in _meta', async () => {
      const deps = createMockExecutor({ status: 200, data: [] }, { status: 200, data: [] });

      const beforeTime = Date.now();
      const result = await runSearchTool({ q: 'test' }, deps);
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

  describe('content (human-readable summary)', () => {
    it('includes human-readable text describing results', async () => {
      const lessons = [{ lessonSlug: 'lesson-1', lessonTitle: 'Photosynthesis' }];

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.content).toHaveLength(1);
      const firstContent = result.content[0];
      expect(firstContent).toHaveProperty('type', 'text');
      if ('text' in firstContent) {
        expect(firstContent.text).toContain('lesson');
      }
    });
  });
});
