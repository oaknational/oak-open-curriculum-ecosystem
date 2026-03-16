import { describe, expect, it } from 'vitest';
import type { SearchSequenceIndexDoc } from '@oaknational/sdk-codegen/search';
import { SEARCH_FIELD_INVENTORY } from '@oaknational/search-contracts';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';
import { searchSequences } from './search-sequences.js';

function emptySequenceResponse(): EsSearchResponse<SearchSequenceIndexDoc> {
  return {
    hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
    took: 1,
    timed_out: false,
  };
}

function createMockSearch(response = emptySequenceResponse()) {
  const calls: EsSearchRequest[] = [];
  const search = (body: EsSearchRequest) => {
    calls.push(body);
    return Promise.resolve(response);
  };
  return { search, calls };
}

function getFirstRequest(calls: readonly EsSearchRequest[]): EsSearchRequest {
  const request = calls[0];
  if (!request) {
    throw new Error('Expected at least one search request');
  }
  return request;
}

function getRrfRetriever(request: EsSearchRequest) {
  const retriever = request.retriever;
  if (!retriever || !('rrf' in retriever) || !retriever.rrf) {
    throw new Error('Expected RRF retriever in sequence search request');
  }
  return retriever.rrf;
}

function getFirstStandardRetriever(request: EsSearchRequest) {
  const retriever = getRrfRetriever(request);
  const firstRetriever = retriever.retrievers?.[0];
  if (!firstRetriever || !('standard' in firstRetriever) || !firstRetriever.standard) {
    throw new Error('Expected standard retriever in sequence search request');
  }
  return firstRetriever.standard;
}

function getFirstFilter(calls: readonly EsSearchRequest[]) {
  const request = getFirstRequest(calls);
  const standardRetriever = getFirstStandardRetriever(request);
  return standardRetriever.filter;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getBoolFilterClauses(filterClause: unknown): readonly unknown[] {
  if (!isRecord(filterClause)) {
    throw new Error('Expected bool.filter clause in sequence request');
  }
  const boolClause = filterClause.bool;
  if (!isRecord(boolClause)) {
    throw new Error('Expected bool.filter clause in sequence request');
  }
  const clauses = boolClause.filter;
  if (!Array.isArray(clauses)) {
    throw new Error('Expected bool.filter clause in sequence request');
  }
  return clauses;
}

function tryReadCategoryClause(clause: unknown): string | undefined {
  if (!isRecord(clause)) {
    return undefined;
  }
  const matchPhrase = clause.match_phrase;
  if (!isRecord(matchPhrase)) {
    return undefined;
  }
  const categoryTitle = matchPhrase.category_titles;
  if (typeof categoryTitle !== 'string') {
    return undefined;
  }
  return categoryTitle;
}

function findCategoryClause(filterClause: unknown): { match_phrase: { category_titles: string } } {
  for (const clause of getBoolFilterClauses(filterClause)) {
    const categoryTitle = tryReadCategoryClause(clause);
    if (categoryTitle !== undefined) {
      return { match_phrase: { category_titles: categoryTitle } };
    }
  }
  throw new Error('Expected category match_phrase clause in sequence request');
}

describe('search field integrity integration contracts', () => {
  it('aligns sequence category filter semantics with shared inventory contracts', async () => {
    const { search, calls } = createMockSearch();
    const resolveIndex = () => 'oak_sequences_test';

    await searchSequences(
      {
        query: 'science',
        subject: 'science',
        phaseSlug: 'secondary',
        keyStage: 'ks4',
        category: 'physics',
      },
      search,
      resolveIndex,
    );

    const categoryInventoryField = SEARCH_FIELD_INVENTORY.find(
      (entry) => entry.indexFamily === 'sequences' && entry.fieldName === 'category_titles',
    );
    const categoryClause = findCategoryClause(getFirstFilter(calls));

    expect(categoryInventoryField).toBeDefined();
    expect(categoryInventoryField?.mappingType).toBe('text');
    expect(categoryClause).toEqual({ match_phrase: { category_titles: 'physics' } });
  });
});
