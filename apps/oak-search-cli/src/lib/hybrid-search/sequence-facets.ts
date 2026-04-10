import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { estypes } from '@elastic/elasticsearch';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/sdk-codegen/search';
import { isKeyStage } from '@oaknational/curriculum-sdk';
import { esSearch, type EsSearchRequest } from '../elastic-http';
import { resolveCurrentSearchIndexName } from '../search-index-target';
import type { SequenceFacet, SearchFacets } from './types';

export interface FetchSequenceFacetsParams {
  subject?: SearchSubjectSlug;
  keyStage?: KeyStage;
}

export async function fetchSequenceFacets(
  params: FetchSequenceFacetsParams,
): Promise<SearchFacets> {
  const filters: estypes.QueryDslQueryContainer[] = [];
  if (params.subject) {
    filters.push({ term: { subject_slug: params.subject } });
  }
  if (params.keyStage) {
    filters.push({ term: { key_stages: params.keyStage } });
  }

  const request: EsSearchRequest = {
    index: resolveCurrentSearchIndexName('sequence_facets'),
    size: 200,
    query: { bool: { filter: filters } },
    sort: [{ unit_count: { order: 'desc' } }],
  };

  const res = await esSearch<SearchSequenceFacetsIndexDoc>(request);
  const sequences = res.hits.hits.map((hit) => toSequenceFacet(hit._source));
  return { sequences };
}

function toSequenceFacet(doc: SearchSequenceFacetsIndexDoc): SequenceFacet {
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
