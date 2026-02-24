/**
 * Integration tests for SDK-backed search tool execution.
 *
 * Tests that runSearchSdkTool correctly dispatches to the appropriate
 * Search SDK retrieval method based on scope, passes through filters,
 * and formats results into MCP CallToolResult.
 *
 * Uses a fake SearchRetrievalService injected via deps.searchRetrieval.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { runSearchSdkTool } from './execution.js';
import type { ToolName } from '@oaknational/curriculum-sdk-generation/mcp-tools';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type {
  SearchRetrievalService,
  LessonsSearchResult,
  UnitsSearchResult,
  ThreadsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from '../search-retrieval-types.js';
import type { SearchSdkArgs } from './types.js';

/**
 * Creates a fake retrieval service with configurable responses.
 */
function createFakeRetrieval(overrides?: Partial<SearchRetrievalService>): SearchRetrievalService {
  const lessonsResult: LessonsSearchResult = {
    scope: 'lessons',
    total: 2,
    took: 42,
    timedOut: false,
    results: [],
  };
  const unitsResult: UnitsSearchResult = {
    scope: 'units',
    total: 1,
    took: 30,
    timedOut: false,
    results: [],
  };
  const threadsResult: ThreadsSearchResult = {
    scope: 'threads',
    total: 1,
    took: 25,
    timedOut: false,
    results: [],
  };
  const sequencesResult: SequencesSearchResult = {
    scope: 'sequences',
    total: 1,
    took: 20,
    timedOut: false,
    results: [],
  };
  const suggestResult: SuggestionResponse = {
    suggestions: [
      {
        label: 'photosynthesis',
        scope: 'lessons',
        url: '/lessons/photosynthesis',
        contexts: {},
      },
    ],
    cache: { version: 'v1', ttlSeconds: 300 },
  };

  return {
    searchLessons: vi.fn().mockResolvedValue(ok(lessonsResult)),
    searchUnits: vi.fn().mockResolvedValue(ok(unitsResult)),
    searchThreads: vi.fn().mockResolvedValue(ok(threadsResult)),
    searchSequences: vi.fn().mockResolvedValue(ok(sequencesResult)),
    suggest: vi.fn().mockResolvedValue(ok(suggestResult)),
    fetchSequenceFacets: vi.fn().mockResolvedValue(ok({ sequences: [] })),
    ...overrides,
  };
}

function createDeps(retrieval: SearchRetrievalService): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: () => Promise.reject(new Error('Should not call executeMcpTool')),
    searchRetrieval: retrieval,
    generatedTools: {
      toolNames: [],
      getToolFromToolName: () => {
        throw new Error('Should not call getToolFromToolName');
      },
      isToolName: (value: unknown): value is ToolName =>
        typeof value === 'string' && value === '__never__',
    },
  };
}

describe('runSearchSdkTool', () => {
  describe('scope dispatch', () => {
    it('returns a result for lessons scope', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'photosynthesis', scope: 'lessons' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      expect(retrieval.searchLessons).toHaveBeenCalledOnce();
    });

    it('returns a result for units scope', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'fractions', scope: 'units' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBeUndefined();
      expect(retrieval.searchUnits).toHaveBeenCalledOnce();
    });

    it('returns a result for threads scope', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'algebra', scope: 'threads' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBeUndefined();
      expect(retrieval.searchThreads).toHaveBeenCalledOnce();
    });

    it('returns a result for sequences scope', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'science', scope: 'sequences' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBeUndefined();
      expect(retrieval.searchSequences).toHaveBeenCalledOnce();
    });

    it('returns a result for suggest scope', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'photo', scope: 'suggest' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBeUndefined();
      expect(retrieval.suggest).toHaveBeenCalledOnce();
    });
  });

  describe('result formatting', () => {
    it('includes human-readable summary in content', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'photosynthesis', scope: 'lessons' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.content).toHaveLength(2);
      const firstContent = result.content[0];
      expect(firstContent).toHaveProperty('type', 'text');
    });

    it('includes structuredContent for model reasoning', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'photosynthesis',
        scope: 'lessons',
        subject: 'science',
        keyStage: 'ks3',
      };

      const result = await runSearchSdkTool(args, deps);
      expect(result.structuredContent).toBeDefined();
    });

    it('includes _meta for widget routing', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'test', scope: 'lessons' };

      const result = await runSearchSdkTool(args, deps);
      expect(result._meta).toBeDefined();
    });
  });

  describe('filter passthrough', () => {
    it('passes common filters to lessons search', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'fractions',
        scope: 'lessons',
        subject: 'maths',
        keyStage: 'ks2',
        size: 10,
        from: 5,
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.searchLessons).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'fractions',
          subject: 'maths',
          keyStage: 'ks2',
          size: 10,
          from: 5,
        }),
      );
    });

    it('passes lesson-specific filters', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'trigonometry',
        scope: 'lessons',
        unitSlug: 'trig-unit',
        tier: 'higher',
        examBoard: 'aqa',
        year: '10',
        threadSlug: 'maths-thread',
        highlight: true,
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.searchLessons).toHaveBeenCalledWith(
        expect.objectContaining({
          unitSlug: 'trig-unit',
          tier: 'higher',
          examBoard: 'aqa',
          year: '10',
          threadSlug: 'maths-thread',
          highlight: true,
        }),
      );
    });

    it('passes unit-specific filters', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'fractions',
        scope: 'units',
        minLessons: 5,
        highlight: true,
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.searchUnits).toHaveBeenCalledWith(
        expect.objectContaining({
          minLessons: 5,
          highlight: true,
        }),
      );
    });

    it('passes sequence-specific filters', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'science',
        scope: 'sequences',
        phaseSlug: 'secondary',
        category: 'science',
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.searchSequences).toHaveBeenCalledWith(
        expect.objectContaining({
          phaseSlug: 'secondary',
          category: 'science',
        }),
      );
    });

    it('passes suggest-specific filters', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'photo',
        scope: 'suggest',
        limit: 10,
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.suggest).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: 'photo',
          limit: 10,
        }),
      );
    });

    it('passes subject and keyStage to suggest call (Snag 1)', async () => {
      const retrieval = createFakeRetrieval();
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = {
        text: 'photo',
        scope: 'suggest',
        subject: 'science',
        keyStage: 'ks3',
      };

      await runSearchSdkTool(args, deps);

      expect(retrieval.suggest).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: 'photo',
          scope: 'lessons',
          subject: 'science',
          keyStage: 'ks3',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('returns error when retrieval returns an error result', async () => {
      const retrieval = createFakeRetrieval({
        searchLessons: vi
          .fn()
          .mockResolvedValue(
            err({ type: 'es_error', message: 'Connection refused', statusCode: 502 }),
          ),
      });
      const deps = createDeps(retrieval);
      const args: SearchSdkArgs = { text: 'test', scope: 'lessons' };

      const result = await runSearchSdkTool(args, deps);

      expect(result.isError).toBe(true);
    });
  });
});
