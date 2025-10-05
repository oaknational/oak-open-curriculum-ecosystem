'use client';

import type { JSX } from 'react';
import type { MultiScopeBucketView, SearchMeta } from '../hooks/useSearchController';
import {
  renderIdleResults,
  renderLoadingResults,
  renderMultiScopeResults,
  renderSingleScopeResults,
} from './SearchResults.sections';
import { ResultsSkeleton, SummarySkeleton } from './SearchSkeletons';

export function SearchResults({
  mode,
  results,
  meta,
  multiBuckets,
  sectionId,
  loading,
}: {
  mode: 'idle' | 'single' | 'multi';
  results: unknown[];
  meta?: SearchMeta | null;
  multiBuckets: MultiScopeBucketView[] | null;
  sectionId?: string;
  loading: boolean;
}): JSX.Element | null {
  if (loading) {
    return renderLoadingResults(sectionId, <SummarySkeleton />, <ResultsSkeleton />);
  }

  if (mode === 'idle') {
    return renderIdleResults(sectionId);
  }

  if (mode === 'multi' && multiBuckets) {
    return renderMultiScopeResults(sectionId, multiBuckets);
  }

  return renderSingleScopeResults(sectionId, results, meta);
}

export default SearchResults;
