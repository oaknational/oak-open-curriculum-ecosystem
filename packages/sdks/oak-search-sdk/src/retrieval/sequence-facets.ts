/**
 * Sequence facet fetching.
 */

import type { estypes } from '@elastic/elasticsearch';
import type {
  SearchSequenceFacetsIndexDoc,
  SearchFacets,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
import { isKeyStage } from '@oaknational/oak-curriculum-sdk';

import type { FacetParams } from '../types/retrieval-params.js';
import type { EsSearchFn, EsSearchRequest } from '../internal/types.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Fetch sequence facets from the sequence_facets index.
 */
export async function fetchSequenceFacets(
  params: FacetParams | undefined,
  search: EsSearchFn,
  resolveIndex: IndexResolverFn,
): Promise<SearchFacets> {
  const filters: QueryContainer[] = [];
  if (params?.subject) {
    filters.push({ term: { subject_slug: params.subject } });
  }
  if (params?.keyStage) {
    filters.push({ term: { key_stages: params.keyStage } });
  }

  const request: EsSearchRequest = {
    index: resolveIndex('sequence_facets'),
    size: 200,
    query: { bool: { filter: filters } },
    sort: [{ unit_count: { order: 'desc' } }],
  };

  const res = await search<SearchSequenceFacetsIndexDoc>(request);
  const sequences = res.hits.hits.map((hit) => toSequenceFacet(hit._source));
  return { sequences };
}

function toSequenceFacet(doc: SearchSequenceFacetsIndexDoc): SearchFacets['sequences'][number] {
  const keyStageCandidate = doc.key_stages[0];
  if (!keyStageCandidate || !isKeyStage(keyStageCandidate)) {
    throw new Error('Invalid key stage in sequence facets document');
  }
  const units = doc.unit_slugs.map((unitSlug: string, index: number) => ({
    unitSlug,
    unitTitle: doc.unit_titles[index] ?? unitSlug,
  }));

  return {
    subjectSlug: doc.subject_slug,
    sequenceSlug: doc.sequence_slug,
    keyStage: keyStageCandidate,
    keyStageTitle: doc.key_stage_title,
    phaseSlug: doc.phase_slug,
    phaseTitle: doc.phase_title,
    years: doc.years,
    units,
    unitCount: doc.unit_count,
    lessonCount: doc.lesson_count,
    hasKs4Options: doc.has_ks4_options,
    sequenceUrl: doc.sequence_canonical_url,
  };
}
