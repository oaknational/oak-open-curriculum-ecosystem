/**
 * Bool-prefix query helpers for the suggest pipeline.
 *
 * Handles `search_as_you_type` bool_prefix queries and
 * result merging/deduplication with completion results.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import type { SearchSuggestionItem } from '@oaknational/sdk-codegen/search';

import type { SuggestParams } from '../types/retrieval-params.js';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';

export type IndexKind = 'lessons' | 'units' | 'sequences';

/**
 * The specific `_source` shape returned by bool-prefix title queries.
 *
 * Each scope returns exactly one title field. All three are optional
 * because only the scope-relevant field is present in any given hit.
 */
export interface TitleSourceDoc {
  readonly lesson_title?: string;
  readonly unit_title?: string;
  readonly sequence_title?: string;
}

/**
 * Non-generic search function for bool-prefix title queries.
 *
 * Narrower than `EsSearchFn` (Interface Segregation) — the bool-prefix
 * leg only ever searches for title fields. The generic `EsSearchFn` is
 * assignable to this type via instantiation.
 */
export type BoolPrefixSearchFn = (
  body: EsSearchRequest,
) => Promise<EsSearchResponse<TitleSourceDoc>>;

/**
 * Per-scope `search_as_you_type` sub-fields for `bool_prefix` queries.
 * Values derived from ES index mappings.
 */
const BOOL_PREFIX_FIELDS = {
  lessons: ['lesson_title.sa', 'lesson_title.sa._2gram', 'lesson_title.sa._3gram'],
  units: ['unit_title.sa', 'unit_title.sa._2gram', 'unit_title.sa._3gram'],
  sequences: ['sequence_title.sa', 'sequence_title.sa._2gram', 'sequence_title.sa._3gram'],
} as const satisfies Record<string, readonly string[]>;

const TITLE_FIELD = {
  lessons: 'lesson_title',
  units: 'unit_title',
  sequences: 'sequence_title',
} as const;

/**
 * Run a `bool_prefix` query on `search_as_you_type` sub-fields.
 *
 * Builds a `bool` query with a `must` multi_match (type: bool_prefix)
 * and optional `filter` clauses for subject/keyStage/phaseSlug.
 */
export async function runBoolPrefix(
  prefix: string,
  size: number,
  params: SuggestParams,
  index: string,
  scopeKind: IndexKind,
  docSearch: BoolPrefixSearchFn,
  logger?: Logger,
): Promise<readonly SearchSuggestionItem[]> {
  logger?.debug('Running bool-prefix suggestion query', {
    scopeKind,
    size,
    index,
  });
  const fields = [...BOOL_PREFIX_FIELDS[scopeKind]];
  const filters = buildBoolPrefixFilters(params, scopeKind);
  const query: estypes.QueryDslQueryContainer = {
    bool: {
      must: [{ multi_match: { query: prefix, type: 'bool_prefix', fields } }],
      ...(filters.length > 0 ? { filter: filters } : {}),
    },
  };
  const titleField = TITLE_FIELD[scopeKind];
  const res = await docSearch({ index, size, query, _source: [titleField] });
  return res.hits.hits
    .map((hit) => ({
      label: hit._source[titleField] ?? '',
      scope: params.scope,
      url: '',
      contexts: {},
    }))
    .filter((item): item is SearchSuggestionItem => item.label.length > 0);
}

function buildBoolPrefixFilters(
  params: SuggestParams,
  scopeKind: IndexKind,
): estypes.QueryDslQueryContainer[] {
  const filters: estypes.QueryDslQueryContainer[] = [];
  if (params.subject) {
    filters.push({ term: { subject_slug: params.subject } });
  }
  if (scopeKind === 'sequences') {
    if (params.phaseSlug) {
      filters.push({ term: { phase_slug: params.phaseSlug } });
    }
  } else if (params.keyStage) {
    filters.push({ term: { key_stage: params.keyStage } });
  }
  return filters;
}

/** Merge completion and bool_prefix results, deduplicating by label. */
export function mergeAndDedup(
  completion: readonly SearchSuggestionItem[],
  boolPrefix: readonly SearchSuggestionItem[],
  limit: number,
): readonly SearchSuggestionItem[] {
  const seen = new Set(completion.map((item) => item.label));
  const merged: SearchSuggestionItem[] = [...completion];
  for (const item of boolPrefix) {
    if (merged.length >= limit) {
      break;
    }
    if (!seen.has(item.label)) {
      seen.add(item.label);
      merged.push(item);
    }
  }
  return merged;
}
