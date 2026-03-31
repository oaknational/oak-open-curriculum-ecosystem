import { vi } from 'vitest';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

export function createFakeSearchRetrieval(): SearchRetrievalService {
  return {
    searchLessons: vi.fn<SearchRetrievalService['searchLessons']>(),
    searchUnits: vi.fn<SearchRetrievalService['searchUnits']>(),
    searchSequences: vi.fn<SearchRetrievalService['searchSequences']>(),
    searchThreads: vi.fn<SearchRetrievalService['searchThreads']>(),
    suggest: vi.fn<SearchRetrievalService['suggest']>(),
    fetchSequenceFacets: vi.fn<SearchRetrievalService['fetchSequenceFacets']>(),
  };
}
