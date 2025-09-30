export { runHybridSearch } from './hybrid-search';
export type { StructuredQuery, HybridSearchResult } from './hybrid-search/types';
import type { StructuredQuery, HybridSearchResult } from './hybrid-search/types';
import { runHybridSearch as runHybridSearchInternal } from './hybrid-search';

export type MultiScopeHybridResult = {
  scope: 'all';
  buckets: Array<{ scope: StructuredQuery['scope']; result: HybridSearchResult }>;
};

export async function runHybridSearchAllScopes(
  query: Omit<StructuredQuery, 'scope'> & { scope?: StructuredQuery['scope'] },
): Promise<MultiScopeHybridResult> {
  const scopes: StructuredQuery['scope'][] = ['lessons', 'units', 'sequences'];
  const buckets: Array<{ scope: StructuredQuery['scope']; result: HybridSearchResult }> = [];

  for (const scope of scopes) {
    const result = await runHybridSearchInternal({ ...query, scope });
    buckets.push({ scope, result });
  }

  return { scope: 'all', buckets };
}
