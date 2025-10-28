'use client';

export { default as SearchPageClient } from './SearchPageClient';
export {
  useSearchController,
  type SearchController,
  type SearchMeta,
  type MultiScopeBucketView,
} from './hooks/useSearchController';
export {
  useStructuredFollowUp,
  type StructuredFollowUpHandlers,
} from './hooks/useStructuredFollowUp';
export { default as NaturalSearch } from './natural/NaturalSearch';
export { StructuredSearch, type StructuredSearchAction } from './structured/StructuredSearch';
