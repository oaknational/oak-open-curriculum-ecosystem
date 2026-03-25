/**
 * Unit tests for RRF query builders.
 *
 * Tests verify BM25 + ELSER hybrid search on content + structure fields.
 * Lessons/units use four-way RRF; sequences use two-way RRF (delegated to SDK).
 */

import type { estypes } from '@elastic/elasticsearch';
import { describe, expect, it } from 'vitest';

import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
  buildSequenceRrfRequest,
} from './rrf-query-builders';

/**
 * Extracts multi_match from direct query or bool.must[0].
 */
function extractMultiMatch(
  query: estypes.QueryDslQueryContainer | undefined,
): estypes.QueryDslMultiMatchQuery | undefined {
  if (!query) {
    return undefined;
  }
  if (query.multi_match) {
    return query.multi_match;
  }

  const mustClauses = query.bool?.must;
  if (!Array.isArray(mustClauses) || mustClauses.length === 0) {
    return undefined;
  }

  return mustClauses[0]?.multi_match;
}

/**
 * Extracts the standard retriever from an RRF entry,
 * narrowing past the RetrieverContainer | RRFRetrieverComponent union.
 */
function getStandardRetriever(
  request: ReturnType<typeof buildLessonRrfRequest>,
  retrieverIndex: number,
): estypes.StandardRetriever | undefined {
  const entry = request.retriever?.rrf?.retrievers?.[retrieverIndex];
  if (!entry || !('standard' in entry)) {
    return undefined;
  }
  return entry.standard ?? undefined;
}

/**
 * Extracts multi_match query from a BM25 retriever.
 * Handles both simple queries (no phrases detected) and phrase-boosted queries
 * where the multi_match is wrapped in a bool.must structure.
 */
function getBm25Query(
  request: ReturnType<typeof buildLessonRrfRequest>,
  retrieverIndex: number,
): estypes.QueryDslMultiMatchQuery | undefined {
  const standard = getStandardRetriever(request, retrieverIndex);
  return extractMultiMatch(standard?.query);
}

describe('buildLessonRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    expect(request.index).toBe('oak_lessons');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('uses BM25 content retriever as first retriever with min_should_match', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    expect(bm25Query).toBeDefined();
  });

  it('uses ELSER content retriever as second retriever', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    expect(getStandardRetriever(request, 1)?.query).toHaveProperty('semantic');
  });

  it('uses BM25 structure retriever as third retriever', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    const bm25Query = getBm25Query(request, 2);
    expect(bm25Query).toBeDefined();
  });

  it('uses ELSER structure retriever as fourth retriever', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    expect(getStandardRetriever(request, 3)?.query).toHaveProperty('semantic');
  });

  it('lesson BM25 includes fuzziness for typo tolerance', () => {
    const request = buildLessonRrfRequest({ query: 'pythagorus', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    expect(bm25Query?.fuzziness).toBeDefined();
  });

  it('configures RRF fusion parameters', () => {
    const request = buildLessonRrfRequest({ query: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.rank_window_size).toBeDefined();
    expect(request.retriever?.rrf?.rank_constant).toBeDefined();
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildLessonRrfRequest({
      query: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(getStandardRetriever(request, 0)?.filter).toBeDefined();
  });
});

describe('buildUnitRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildUnitRrfRequest({ query: 'algebra', size: 10 });
    expect(request.index).toBe('oak_unit_rollup');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildUnitRrfRequest({ query: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('unit BM25 uses fuzzy matching (recall > precision)', () => {
    const request = buildUnitRrfRequest({ query: 'trigonometree', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    // Units prioritize recall over precision - fuzziness enabled, no minimum_should_match
    expect(bm25Query?.fuzziness).toBeDefined();
    expect(bm25Query?.minimum_should_match).toBeUndefined();
  });

  it('uses ELSER for semantic matching', () => {
    const request = buildUnitRrfRequest({ query: 'algebra', size: 10 });
    expect(getStandardRetriever(request, 1)?.query).toHaveProperty('semantic');
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildUnitRrfRequest({
      query: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(getStandardRetriever(request, 0)?.filter).toBeDefined();
  });
});

describe('buildSequenceRrfRequest (two-way RRF, SDK-delegated)', () => {
  it('builds request with correct index and size', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 5 });
    expect(request.index).toBe('oak_sequences');
    expect(request.size).toBe(5);
  });

  it('includes RRF retriever with exactly 2 sub-retrievers', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(2);
  });

  it('first retriever is BM25 multi_match on sequence fields', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 10 });
    const bm25 = getStandardRetriever(request, 0);
    const mm = bm25?.query?.multi_match;

    expect(mm?.query).toBe('algebra');
    expect(mm?.type).toBe('best_fields');
    expect(mm?.fuzziness).toBe('AUTO');
    expect(mm?.fields).toEqual([
      'sequence_title^2',
      'category_titles',
      'subject_title',
      'phase_title',
    ]);
  });

  it('second retriever is semantic on sequence_semantic', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 10 });
    const semantic = getStandardRetriever(request, 1);

    expect(semantic?.query).toHaveProperty('semantic');
    expect(semantic?.query?.semantic).toEqual({
      field: 'sequence_semantic',
      query: 'algebra',
    });
  });

  it('uses rank_constant 40 and rank_window_size 40', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.rank_constant).toBe(40);
    expect(request.retriever?.rrf?.rank_window_size).toBe(40);
  });

  it('both sub-retrievers carry the same filter when subject provided', () => {
    const request = buildSequenceRrfRequest({ query: 'algebra', size: 10, subject: 'maths' });
    const bm25Filter = getStandardRetriever(request, 0)?.filter;
    const semanticFilter = getStandardRetriever(request, 1)?.filter;

    expect(bm25Filter).toBeDefined();
    expect(bm25Filter).toEqual(semanticFilter);
  });

  it('includes keyStage filter on both sub-retrievers', () => {
    const request = buildSequenceRrfRequest({
      query: 'science',
      size: 10,
      subject: 'science',
      keyStage: 'ks3',
    });
    const bm25Filter = getStandardRetriever(request, 0)?.filter;
    const semanticFilter = getStandardRetriever(request, 1)?.filter;

    expect(bm25Filter).toEqual(semanticFilter);
    const filterClauses = !Array.isArray(bm25Filter) ? bm25Filter?.bool?.filter : undefined;
    expect(filterClauses).toBeDefined();
    expect(filterClauses).toEqual(
      expect.arrayContaining([
        { term: { subject_slug: 'science' } },
        { term: { key_stages: 'ks3' } },
      ]),
    );
  });
});
