import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { estypes } from '@elastic/elasticsearch';
import { esSearch, type EsSearchRequest } from '../elastic-http';
import type { SequenceFacetDocument } from '../indexing/sequence-facets';
import type { SequenceFacet, SearchFacets } from './types';

interface FetchSequenceFacetsParams {
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
    filters.push({ term: { key_stage: params.keyStage } });
  }

  const request: EsSearchRequest = {
    index: 'oak_sequence_facets',
    size: 200,
    query: { bool: { filter: filters } },
    sort: [{ unit_count: { order: 'desc' } }],
  };

  const res = await esSearch<SequenceFacetDocument>(request);
  const sequences = res.hits.hits.map((hit) => toSequenceFacet(hit._source));
  return { sequences };
}

function toSequenceFacet(doc: SequenceFacetDocument): SequenceFacet {
  const units = doc.unit_slugs.map((unitSlug, index) => ({
    unitSlug,
    unitTitle: doc.unit_titles[index] ?? unitSlug,
  }));

  return {
    subjectSlug: doc.subject_slug,
    sequenceSlug: doc.sequence_slug,
    keyStage: doc.key_stage,
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
