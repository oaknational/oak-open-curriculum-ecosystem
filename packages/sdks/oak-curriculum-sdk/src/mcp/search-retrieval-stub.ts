/**
 * Stub SearchRetrievalService for use in stub mode.
 *
 * Returns empty result sets for all methods. No Elasticsearch
 * client is created, no real connection is attempted. Used by
 * both MCP servers when `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`.
 *
 * This is NOT a test fake — test fakes use `vi.fn()` for assertion
 * support. This stub uses plain functions for production stub mode.
 */

import { ok } from '@oaknational/result';
import type { SearchRetrievalService } from './search-retrieval-types.js';

/**
 * Creates a stub SearchRetrievalService for use in stub mode.
 *
 * All methods return `ok()` results with empty data sets. No
 * Elasticsearch client is constructed — no network requests
 * are ever made.
 *
 * @returns A SearchRetrievalService that returns empty results
 *
 * @example
 * ```typescript
 * const searchRetrieval = runtimeConfig.useStubTools
 *   ? createStubSearchRetrieval()
 *   : createSearchRetrieval(runtimeConfig.env, log);
 * ```
 */
export function createStubSearchRetrieval(): SearchRetrievalService {
  return {
    searchLessons: () =>
      Promise.resolve(ok({ scope: 'lessons', total: 0, took: 0, timedOut: false, results: [] })),
    searchUnits: () =>
      Promise.resolve(ok({ scope: 'units', total: 0, took: 0, timedOut: false, results: [] })),
    searchSequences: () =>
      Promise.resolve(ok({ scope: 'sequences', total: 0, took: 0, timedOut: false, results: [] })),
    searchThreads: () =>
      Promise.resolve(ok({ scope: 'threads', total: 0, took: 0, timedOut: false, results: [] })),
    suggest: () =>
      Promise.resolve(ok({ suggestions: [], cache: { version: '1', ttlSeconds: 300 } })),
    fetchSequenceFacets: () => Promise.resolve(ok({ sequences: [] })),
  };
}
