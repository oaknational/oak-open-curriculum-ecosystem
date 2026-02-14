/**
 * Sequence facet fetching.
 */

import type { estypes } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';
import type {
  SearchSequenceFacetsIndexDoc,
  SearchFacets,
} from '@oaknational/curriculum-sdk/public/search.js';
import { isKeyStage } from '@oaknational/curriculum-sdk';

import type { FacetParams } from '../types/retrieval-params.js';
import type { RetrievalError } from '../types/retrieval-results.js';
import type { EsSearchFn, EsSearchRequest } from '../internal/types.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { extractStatusCode } from '../admin/es-error-guards.js';

type QueryContainer = estypes.QueryDslQueryContainer;

/**
 * Fetch sequence facets from the sequence_facets index.
 *
 * Returns sequences with units, ordered by unit_count descending.
 *
 * @param params - Optional facet params (subject, keyStage filters)
 * @param search - ES search function
 * @param resolveIndex - Index name resolver
 * @returns Result with SearchFacets.sequences, or retrieval error
 *
 * @example
 * ```typescript
 * const result = await sdk.retrieval.fetchSequenceFacets({ subject: 'science' });
 * ```
 */
export async function fetchSequenceFacets(
  params: FacetParams | undefined,
  search: EsSearchFn,
  resolveIndex: IndexResolverFn,
): Promise<Result<SearchFacets, RetrievalError>> {
  try {
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
    const facetResult = toSequenceFacets(res.hits.hits);
    if (!facetResult.ok) {
      return facetResult;
    }
    return ok({ sequences: facetResult.value });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message, statusCode: extractStatusCode(error) });
  }
}

/**
 * Convert a list of ES hits into validated sequence facets.
 *
 * @param hits - ES hits with SearchSequenceFacetsIndexDoc source
 * @returns Result with sequence facets array or validation error
 */
function toSequenceFacets(
  hits: readonly { _source: SearchSequenceFacetsIndexDoc }[],
): Result<SearchFacets['sequences'], RetrievalError> {
  const sequences: SearchFacets['sequences'][number][] = [];
  for (const hit of hits) {
    const result = toSequenceFacet(hit._source);
    if (!result.ok) {
      return result;
    }
    sequences.push(result.value);
  }
  return ok(sequences);
}

/**
 * Convert a single facet document to SearchFacets sequence shape.
 *
 * @param doc - SearchSequenceFacetsIndexDoc
 * @returns Result with validated sequence facet or validation error
 */
function toSequenceFacet(
  doc: SearchSequenceFacetsIndexDoc,
): Result<SearchFacets['sequences'][number], RetrievalError> {
  const keyStageCandidate = doc.key_stages[0];
  if (!keyStageCandidate || !isKeyStage(keyStageCandidate)) {
    return err({
      type: 'validation_error',
      message: `Invalid key stage in sequence facets document: ${String(keyStageCandidate)}`,
    });
  }
  const units = doc.unit_slugs.map((unitSlug: string, index: number) => ({
    unitSlug,
    unitTitle: doc.unit_titles[index] ?? unitSlug,
  }));

  return ok({
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
  });
}
