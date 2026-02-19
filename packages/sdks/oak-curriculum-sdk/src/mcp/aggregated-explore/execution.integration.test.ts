/**
 * Integration tests for explore-topic compound tool execution.
 *
 * Tests that runExploreTool correctly dispatches parallel searches to
 * lessons, units, and threads, merges results into a topic map, and
 * handles partial failures gracefully.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { runExploreTool } from './execution.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { SearchRetrievalService } from '../search-retrieval-types.js';

function createFakeRetrieval(overrides?: Partial<SearchRetrievalService>): SearchRetrievalService {
  return {
    searchLessons: vi.fn().mockResolvedValue(
      ok({
        scope: 'lessons',
        total: 12,
        took: 42,
        timedOut: false,
        results: [],
      }),
    ),
    searchUnits: vi.fn().mockResolvedValue(
      ok({
        scope: 'units',
        total: 3,
        took: 30,
        timedOut: false,
        results: [],
      }),
    ),
    searchThreads: vi.fn().mockResolvedValue(
      ok({
        scope: 'threads',
        total: 2,
        took: 25,
        timedOut: false,
        results: [],
      }),
    ),
    searchSequences: vi.fn().mockResolvedValue(
      ok({
        scope: 'sequences',
        total: 0,
        took: 0,
        timedOut: false,
        results: [],
      }),
    ),
    suggest: vi.fn().mockResolvedValue(
      ok({
        suggestions: [],
        cache: { version: '1', ttlSeconds: 300 },
      }),
    ),
    fetchSequenceFacets: vi.fn().mockResolvedValue(ok({ sequences: [] })),
    ...overrides,
  };
}

function createDeps(retrieval: SearchRetrievalService): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: () => Promise.reject(new Error('Should not call executeMcpTool')),
    searchRetrieval: retrieval,
  };
}

describe('runExploreTool', () => {
  describe('basic operation', () => {
    it('returns a result for a simple topic', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'volcanos' }, deps);

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });

    it('returns a result with subject filter', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'fractions', subject: 'maths' }, deps);
      expect(result.isError).toBeUndefined();
    });

    it('returns a result with both filters', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool(
        { text: 'photosynthesis', subject: 'science', keyStage: 'ks3' },
        deps,
      );
      expect(result.isError).toBeUndefined();
    });
  });

  describe('result structure', () => {
    it('includes human-readable summary', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'volcanos' }, deps);

      expect(result.content).toHaveLength(2);
      const firstContent = result.content[0];
      expect(firstContent).toHaveProperty('type', 'text');
    });

    it('includes structuredContent with topic map', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'volcanos' }, deps);
      expect(result.structuredContent).toBeDefined();
    });

    it('includes _meta for widget routing', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'volcanos' }, deps);
      expect(result._meta).toBeDefined();
    });
  });

  describe('parallel dispatch', () => {
    it('searches lessons, units, and threads for the topic', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      await runExploreTool({ text: 'electricity' }, deps);

      expect(retrieval.searchLessons).toHaveBeenCalledOnce();
      expect(retrieval.searchUnits).toHaveBeenCalledOnce();
      expect(retrieval.searchThreads).toHaveBeenCalledOnce();
    });

    it('applies subject filter to all three scopes', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      await runExploreTool({ text: 'electricity', subject: 'science' }, deps);

      expect(retrieval.searchLessons).toHaveBeenCalledWith(
        expect.objectContaining({ subject: 'science' }),
      );
      expect(retrieval.searchUnits).toHaveBeenCalledWith(
        expect.objectContaining({ subject: 'science' }),
      );
      expect(retrieval.searchThreads).toHaveBeenCalledWith(
        expect.objectContaining({ subject: 'science' }),
      );
    });

    it('applies keyStage filter to all three scopes', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);

      await runExploreTool({ text: 'electricity', keyStage: 'ks3' }, deps);

      expect(retrieval.searchLessons).toHaveBeenCalledWith(
        expect.objectContaining({ keyStage: 'ks3' }),
      );
      expect(retrieval.searchUnits).toHaveBeenCalledWith(
        expect.objectContaining({ keyStage: 'ks3' }),
      );
      expect(retrieval.searchThreads).toHaveBeenCalledWith(
        expect.objectContaining({ keyStage: 'ks3' }),
      );
    });
  });

  describe('error handling', () => {
    it('handles partial failure (one scope errors)', async () => {
      const retrieval = createFakeRetrieval({
        searchUnits: vi
          .fn()
          .mockResolvedValue(err({ type: 'timeout', message: 'Query timed out' })),
      });
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'volcanos' }, deps);

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });

    it('returns error when all scopes fail', async () => {
      const retrieval = createFakeRetrieval({
        searchLessons: vi.fn().mockResolvedValue(err({ type: 'es_error', message: 'fail' })),
        searchUnits: vi.fn().mockResolvedValue(err({ type: 'es_error', message: 'fail' })),
        searchThreads: vi.fn().mockResolvedValue(err({ type: 'es_error', message: 'fail' })),
      });
      const deps = createDeps(retrieval);

      const result = await runExploreTool({ text: 'test' }, deps);
      expect(result.isError).toBe(true);
    });
  });
});
