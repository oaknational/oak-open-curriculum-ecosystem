/**
 * Internal SDK infrastructure — not part of the public API.
 */

export { createEsSearchFn } from './es-search.js';

export {
  resolveSearchIndexName,
  resolveZeroHitIndexName,
  createIndexResolver,
  SEARCH_INDEX_TARGETS,
  SEARCH_INDEX_KINDS,
  ZERO_HIT_INDEX_BASE,
  INDEX_META_INDEX,
  INDEX_VERSION_DOC_ID,
} from './index-resolver.js';

export type { SearchIndexTarget, SearchIndexKind, IndexResolverFn } from './index-resolver.js';

export type { EsSearchRequest, EsSearchResponse, EsHit, EsSearchFn } from './types.js';
