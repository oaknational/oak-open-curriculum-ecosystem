/**
 * Integration tests for aggregated search tool execution.
 *
 * Tests that the search tool returns results per OpenAI Apps SDK reference:
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
import { runSearchTool } from './execution.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { ToolExecutionResult } from '../execute-tool-call.js';
import { createStubSearchRetrieval } from '../search-retrieval-stub.js';

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
    searchRetrieval: createStubSearchRetrieval(),
  };
}

describe('runSearchTool result structure per OpenAI Apps SDK', () => {
  describe('structuredContent (model sees this for reasoning)', () => {
    it('includes FULL lessons data for model reasoning', async () => {
      const lessons = [
        { lessonSlug: 'lesson-1', lessonTitle: 'Photosynthesis Basics', extra: 'full data...' },
        { lessonSlug: 'lesson-2', lessonTitle: 'Light Reactions', extra: 'more data...' },
        { lessonSlug: 'lesson-3', lessonTitle: 'Dark Reactions', extra: 'even more...' },
      ];

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { lessons?: unknown[] };
      expect(structured.lessons).toHaveLength(3);
    });

    it('includes FULL transcripts data for model reasoning', async () => {
      const transcripts = [
        { lessonSlug: 'lesson-1', transcript: 'Full transcript content here...' },
        { lessonSlug: 'lesson-2', transcript: 'Another full transcript...' },
      ];

      const deps = createMockExecutor(
        { status: 200, data: [] },
        { status: 200, data: transcripts },
      );

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { transcripts?: unknown[] };
      expect(structured.transcripts).toHaveLength(2);
    });

    it('includes ALL items (no artificial limit) for model reasoning', async () => {
      const lessons = Array.from({ length: 100 }, (_, i) => ({
        lessonSlug: `lesson-${String(i + 1)}`,
        lessonTitle: `Lesson ${String(i + 1)}`,
      }));

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result.structuredContent).toBeDefined();
      const structured = result.structuredContent as { lessons?: unknown[] };
      expect(structured.lessons).toHaveLength(100);
    });

    it('includes summary in structuredContent', async () => {
      const lessons = [{ lessonSlug: 'lesson-1', lessonTitle: 'Test Lesson' }];

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('summary');
      const structured = result.structuredContent as { summary?: string };
      expect(structured.summary).toContain('1');
    });

    it('includes oakContextHint for model context grounding', async () => {
      const deps = createMockExecutor({ status: 200, data: [] }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('oakContextHint');
    });
  });

  describe('_meta (widget-only metadata)', () => {
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

    it('includes toolName in _meta', async () => {
      const deps = createMockExecutor({ status: 200, data: [] }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'test' }, deps);

      expect(result._meta).toBeDefined();
      expect(result._meta).toHaveProperty('toolName', 'search');
    });
  });

  describe('content (human-readable summary for conversation)', () => {
    it('returns human-readable summary text', async () => {
      const lessons = [{ lessonSlug: 'lesson-1', lessonTitle: 'Photosynthesis' }];

      const deps = createMockExecutor({ status: 200, data: lessons }, { status: 200, data: [] });

      const result = await runSearchTool({ q: 'photosynthesis' }, deps);

      expect(result.content).toHaveLength(2);
      const firstContent = result.content[0];
      expect(firstContent).toHaveProperty('type', 'text');
      if ('text' in firstContent) {
        // Content is human-readable summary (not JSON)
        expect(firstContent.text).toContain('lesson');
        expect(firstContent.text).toContain('photosynthesis');
      }
    });
  });
});
