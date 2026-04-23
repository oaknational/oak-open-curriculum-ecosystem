/**
 * Sequence facet fetching.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import type { SearchSequenceFacetsIndexDoc, SearchFacets } from '@oaknational/sdk-codegen/search';
import { isKeyStage } from '@oaknational/sdk-codegen';

import type { FacetParams } from '../types/retrieval-params.js';
import type { RetrievalError } from '../types/retrieval-results.js';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';
import type { IndexResolverFn } from '../internal/index-resolver.js';
import { toRetrievalError } from './retrieval-error.js';

type QueryContainer = estypes.QueryDslQueryContainer;

function buildFacetFilters(params: FacetParams | undefined): QueryContainer[] {
  const filters: QueryContainer[] = [];
  if (params?.subject) {
    filters.push({ term: { subject_slug: params.subject } });
  }
  if (params?.keyStage) {
    filters.push({ term: { key_stages: params.keyStage } });
  }
  return filters;
}

function buildFacetRequest(
  params: FacetParams | undefined,
  resolveIndex: IndexResolverFn,
): EsSearchRequest {
  return {
    index: resolveIndex('sequence_facets'),
    size: 200,
    query: { bool: { filter: buildFacetFilters(params) } },
    sort: [{ unit_count: { order: 'desc' } }],
  };
}

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
  search: (body: EsSearchRequest) => Promise<EsSearchResponse<SearchSequenceFacetsIndexDoc>>,
  resolveIndex: IndexResolverFn,
  logger?: Logger,
): Promise<Result<SearchFacets, RetrievalError>> {
  logger?.debug('Fetching sequence facets', {
    subject: params?.subject,
    keyStage: params?.keyStage,
  });
  try {
    const res = await search(buildFacetRequest(params, resolveIndex));
    const facetResult = toSequenceFacets(res.hits.hits);
    if (!facetResult.ok) {
      return facetResult;
    }
    return ok({ sequences: facetResult.value });
  } catch (error: unknown) {
    return err(toRetrievalError(error));
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
  if (!Array.isArray(doc.key_stages) || doc.key_stages.length === 0) {
    return err({
      type: 'validation_error',
      message: 'Invalid key stage array in sequence facets document',
    });
  }
  if (!Array.isArray(doc.unit_slugs) || !Array.isArray(doc.unit_titles)) {
    return err({
      type: 'validation_error',
      message: 'Invalid unit arrays in sequence facets document',
    });
  }
  const keyStageCandidate = doc.key_stages[0];
  if (!keyStageCandidate || !isKeyStage(keyStageCandidate)) {
    return err({
      type: 'validation_error',
      message: `Invalid key stage in sequence facets document: ${String(keyStageCandidate)}`,
    });
  }
  if (doc.unit_titles.length !== doc.unit_slugs.length) {
    return err({
      type: 'validation_error',
      message:
        `Invalid sequence facets document: unit_titles length (${doc.unit_titles.length}) ` +
        `does not match unit_slugs length (${doc.unit_slugs.length})`,
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
