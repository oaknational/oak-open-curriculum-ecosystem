/**
 * Unit tests for four-way RRF query builders.
 *
 * Tests verify BM25 + ELSER hybrid search on content + structure fields.
 * Phase 3e: Content-type-aware BM25 configs - lessons use min_should_match, units use fuzzy.
 */

import type { estypes } from '@elastic/elasticsearch';
import { describe, expect, it } from 'vitest';

import { buildLessonRrfRequest, buildUnitRrfRequest } from './rrf-query-builders';

/** Extracts multi_match query from a BM25 retriever. */
function getBm25Query(
  request: ReturnType<typeof buildLessonRrfRequest>,
  retrieverIndex: number,
): estypes.QueryDslMultiMatchQuery | undefined {
  return request.retriever?.rrf?.retrievers?.[retrieverIndex]?.standard?.query?.multi_match;
}

describe('buildLessonRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.index).toBe('oak_lessons');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('uses BM25 content retriever as first retriever with min_should_match', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    expect(bm25Query).toBeDefined();
    expect(bm25Query?.minimum_should_match).toBe('75%');
  });

  it('uses ELSER content retriever as second retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[1]?.standard?.query).toHaveProperty('semantic');
  });

  it('uses BM25 structure retriever as third retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    const bm25Query = getBm25Query(request, 2);
    expect(bm25Query).toBeDefined();
    expect(bm25Query?.minimum_should_match).toBe('75%');
  });

  it('uses ELSER structure retriever as fourth retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[3]?.standard?.query).toHaveProperty('semantic');
  });

  it('lesson BM25 uses min_should_match with default fuzziness', () => {
    const request = buildLessonRrfRequest({ text: 'pythagorus', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    expect(bm25Query?.minimum_should_match).toBe('75%');
    expect(bm25Query?.fuzziness).toBe('AUTO');
  });

  it('sets RRF window_size and rank_constant for four retrievers', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.rank_window_size).toBe(80);
    expect(request.retriever?.rrf?.rank_constant).toBe(60);
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildLessonRrfRequest({
      text: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.filter).toBeDefined();
  });
});

describe('buildUnitRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.index).toBe('oak_unit_rollup');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('unit BM25 uses fuzzy matching (recall > precision)', () => {
    const request = buildUnitRrfRequest({ text: 'trigonometree', size: 10 });
    const bm25Query = getBm25Query(request, 0);
    expect(bm25Query?.fuzziness).toBe('AUTO:3,6');
    expect(bm25Query?.prefix_length).toBe(1);
    expect(bm25Query?.fuzzy_transpositions).toBe(true);
    expect(bm25Query?.minimum_should_match).toBeUndefined();
  });

  it('uses ELSER for semantic matching', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[1]?.standard?.query).toHaveProperty('semantic');
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildUnitRrfRequest({
      text: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.filter).toBeDefined();
  });
});
