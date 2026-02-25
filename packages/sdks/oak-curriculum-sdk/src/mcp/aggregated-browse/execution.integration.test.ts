/**
 * Integration tests for browse-curriculum tool execution.
 *
 * Tests that runBrowseTool correctly calls fetchSequenceFacets and
 * formats the facet data into a structured overview.
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { runBrowseTool } from './execution.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { SearchRetrievalService } from '../search-retrieval-types.js';
import type { SearchFacets } from '@oaknational/sdk-codegen/search';
import { createNullGeneratedToolRegistry } from '../test-helpers/null-generated-tool-registry.js';

function createFakeRetrieval(facets?: SearchFacets): SearchRetrievalService {
  const defaultFacets: SearchFacets = {
    sequences: [
      {
        subjectSlug: 'maths',
        sequenceSlug: 'maths-primary',
        keyStage: 'ks2',
        phaseSlug: 'primary',
        phaseTitle: 'Primary',
        years: ['1', '2', '3', '4', '5', '6'],
        units: [
          { unitSlug: 'fractions', unitTitle: 'Fractions' },
          { unitSlug: 'decimals', unitTitle: 'Decimals' },
        ],
        unitCount: 2,
        lessonCount: 15,
        hasKs4Options: false,
      },
    ],
  };

  return {
    searchLessons: vi
      .fn()
      .mockResolvedValue(ok({ scope: 'lessons', total: 0, took: 0, timedOut: false, results: [] })),
    searchUnits: vi
      .fn()
      .mockResolvedValue(ok({ scope: 'units', total: 0, took: 0, timedOut: false, results: [] })),
    searchThreads: vi
      .fn()
      .mockResolvedValue(ok({ scope: 'threads', total: 0, took: 0, timedOut: false, results: [] })),
    searchSequences: vi
      .fn()
      .mockResolvedValue(
        ok({ scope: 'sequences', total: 0, took: 0, timedOut: false, results: [] }),
      ),
    suggest: vi
      .fn()
      .mockResolvedValue(ok({ suggestions: [], cache: { version: '1', ttlSeconds: 300 } })),
    fetchSequenceFacets: vi.fn().mockResolvedValue(ok(facets ?? defaultFacets)),
  };
}

function createDeps(retrieval: SearchRetrievalService): UniversalToolExecutorDependencies {
  return {
    executeMcpTool: () => Promise.reject(new Error('Should not call executeMcpTool')),
    searchRetrieval: retrieval,
    generatedTools: createNullGeneratedToolRegistry(),
  };
}

describe('runBrowseTool', () => {
  it('returns a result when browsing everything (no filters)', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({}, deps);

    expect(result.isError).toBeUndefined();
    expect(result.content).toBeDefined();
    expect(retrieval.fetchSequenceFacets).toHaveBeenCalledOnce();
  });

  it('returns a result when filtering by subject', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({ subject: 'maths' }, deps);

    expect(result.isError).toBeUndefined();
    expect(retrieval.fetchSequenceFacets).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'maths' }),
    );
  });

  it('returns a result when filtering by keyStage', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({ keyStage: 'ks3' }, deps);

    expect(result.isError).toBeUndefined();
    expect(retrieval.fetchSequenceFacets).toHaveBeenCalledWith(
      expect.objectContaining({ keyStage: 'ks3' }),
    );
  });

  it('returns a result when filtering by both subject and keyStage', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({ subject: 'science', keyStage: 'ks2' }, deps);

    expect(result.isError).toBeUndefined();
  });

  it('includes human-readable summary in content', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({}, deps);

    expect(result.content).toHaveLength(2);
    const firstContent = result.content[0];
    expect(firstContent).toHaveProperty('type', 'text');
  });

  it('includes structuredContent with facet data', async () => {
    const retrieval = createFakeRetrieval();
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({}, deps);
    expect(result.structuredContent).toBeDefined();
  });

  it('returns error when fetchSequenceFacets fails', async () => {
    const retrieval = createFakeRetrieval();
    retrieval.fetchSequenceFacets = vi
      .fn()
      .mockResolvedValue(err({ type: 'es_error', message: 'Connection refused' }));
    const deps = createDeps(retrieval);

    const result = await runBrowseTool({}, deps);
    expect(result.isError).toBe(true);
  });
});
