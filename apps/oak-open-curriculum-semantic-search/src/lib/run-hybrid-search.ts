export { runHybridSearch } from './hybrid-search';
export type { StructuredQuery, HybridSearchResult } from './hybrid-search/types';
import type { StructuredQuery, HybridSearchResult } from './hybrid-search/types';
import { runHybridSearch as runHybridSearchInternal } from './hybrid-search';
import { type SearchScope, type SearchScopeWithAll } from '../types/oak';
import { NARROW_SEARCH_SCOPES, MULTI_SCOPE } from './search-scopes';

export type MultiScopeHybridResult = {
  scope: SearchScopeWithAll;
  buckets: Array<{ scope: SearchScope; result: HybridSearchResult }>;
};

export async function runHybridSearchAllScopes(
  query: Omit<StructuredQuery, 'scope'> & { scope?: StructuredQuery['scope'] },
): Promise<MultiScopeHybridResult> {
  const scopes = NARROW_SEARCH_SCOPES;
  const buckets: Array<{ scope: SearchScope; result: HybridSearchResult }> = [];

  for (const scope of scopes) {
    const result = await runHybridSearchInternal({ ...query, scope });
    buckets.push({ scope, result });
  }

  return { scope: MULTI_SCOPE, buckets };
}
