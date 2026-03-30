import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/** Stub search retrieval for E2E tests that exercise API tools rather than search behaviour. */
export const stubSearchRetrieval: SearchRetrievalService = {
  searchLessons: () => {
    throw new Error('not implemented');
  },
  searchUnits: () => {
    throw new Error('not implemented');
  },
  searchSequences: () => {
    throw new Error('not implemented');
  },
  searchThreads: () => {
    throw new Error('not implemented');
  },
  suggest: () => {
    throw new Error('not implemented');
  },
  fetchSequenceFacets: () => {
    throw new Error('not implemented');
  },
};
