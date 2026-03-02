/**
 * Unit document mapper — derives `SearchUnitsIndexDoc` from rollup hits.
 *
 * Separated from retriever builders to keep query construction and
 * result shaping in distinct modules with independent change reasons.
 */

import type { SearchUnitRollupDoc, SearchUnitsIndexDoc } from '@oaknational/sdk-codegen/search';

import type { EsHit } from '../internal/types.js';

/**
 * Derive a `SearchUnitsIndexDoc` from a unit rollup Elasticsearch hit.
 *
 * The rollup document contains all fields needed for the units index
 * document. This function maps them explicitly rather than spreading,
 * ensuring the output shape matches `SearchUnitsIndexDoc` exactly.
 *
 * @param hit - Elasticsearch hit containing a `SearchUnitRollupDoc` source
 * @returns A `SearchUnitsIndexDoc` with all required fields
 */
export function deriveUnitDoc(hit: EsHit<SearchUnitRollupDoc>): SearchUnitsIndexDoc {
  const s = hit._source;
  return {
    unit_id: s.unit_id,
    unit_slug: s.unit_slug,
    unit_title: s.unit_title,
    subject_slug: s.subject_slug,
    subject_parent: s.subject_parent,
    key_stage: s.key_stage,
    years: s.years,
    lesson_ids: s.lesson_ids,
    lesson_count: s.lesson_count,
    unit_topics: s.unit_topics,
    unit_url: s.unit_url,
    subject_programmes_url: s.subject_programmes_url,
    sequence_ids: s.sequence_ids,
    thread_slugs: s.thread_slugs,
    thread_titles: s.thread_titles,
    thread_orders: s.thread_orders,
    title_suggest: s.title_suggest,
    doc_type: s.doc_type,
  };
}
